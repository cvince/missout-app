ScrollView.prototype.isMouseDown = false;
ScrollView.prototype.originalOffset = {"x":0, "y":0};
ScrollView.prototype.positionDict = new Array();
ScrollView.prototype.inc = 0;
ScrollView.prototype.speed = 0;
ScrollView.prototype.intervalID;
ScrollView.prototype.contentView;
ScrollView.prototype.scrolling = false;
ScrollView.prototype.paging = false;
ScrollView.prototype.pageWidth = 0;
ScrollView.prototype.scrollingDirection = "horizontal";
ScrollView.prototype.normalStyle;
ScrollView.prototype.animatingStyle;
ScrollView.prototype.size; //this should actually be the size of the content panel I think...
ScrollView.prototype.multiselectScroll = false;
ScrollView.prototype.edgeThreshold = 0;
ScrollView.prototype.scrollDeadZone = 25;
ScrollView.prototype.multiselectScrollPostDeadZone = 140;
ScrollView.prototype.bounceScroll = true;
ScrollView.prototype.checkmarkContainer;
ScrollView.prototype.enabled = true;
ScrollView.prototype.dropsScrollThrough = true;
ScrollView.prototype.didScroll = false;

function ScrollView()
{
	this.didScroll = false;
}

ScrollView.prototype.initScrollView = function()
{
	addElementToDict(this.element, this);
	
	// this.element.addEventListener('MSPointerDown', function (e) { e.preventManipulation(); onMouseDown(this, e); }, false);
	// this.element.addEventListener('MSPointerUp', function (e) { onMouseUp(this, e); }, false);
	// this.element.addEventListener('mousemove', function (e) { onMouseMove(this, e); }, false);
	
	this.element.addEventListener( 'touchstart' , function touchStart( e ) { onMouseDown(this, e); } , true );
	this.element.addEventListener( 'touchmove', function touchMove ( e ) { onMouseMove(this, e)  }, true);
	this.element.addEventListener( 'touchend', function touchEnd ( e ) { onMouseUp(this, e)  }, true);

	// this.element.onmouseout = function()
	// {
	// 	onMouseOut(this);
	// }
}

ScrollView.prototype.scrollViewAlreadyRegistered = function(s)
{
	for (var i = 0; i < scrollViewRegister.length; i++)
	{
		if (scrollViewRegister[i] == s)
		{
			return true;
		}
	}
	return false;
}

ScrollView.prototype.onMouseDown = function(e)
{
	this.didScroll = false;
	if (this.enabled)
	{
	    this.isMouseDown = true;
        this.originalPoint = { "x": e.changedTouches[0].pageX, "y": e.changedTouches[0].pageY };
		this.originalOffset = {"x":this.contentView.x, "y":this.contentView.y};
		this.positionDict = new Array();
		this.inc = 0;
		listeningForScrolling = true;
		scrolling = false;
		this.scrolling = false;
		setTimeout(scrollTimer, 250);
		this.contentView.element.setAttribute("class", this.normalStyle);
		scrollView = this;

		if (!this.scrollViewAlreadyRegistered(this))
		{	
			scrollViewRegister[scrollViewRegister.length] = this;
		}
	}
}

function scrollTimer()
{
	if (!scrolling)
	{
		for (var item in scrollViewRegister)
		{
			if (scrollViewRegister[item].scrollViewNotActive(scrollViewRegister[item]))
			{
				scrollViewRegister[item].isMouseDown = false;
			}
		}
	}
}

ScrollView.prototype.onMouseMove = function(e)
{
	if (this.isMouseDown)
	{	
	    var point;
	    
        point = { "x": e.changedTouches[0].pageX, "y": e.changedTouches[0].pageY };
		
		// log.innerHTML = point.x + " " + point.y;        
		
		var axis;
		if (this.scrollingDirection == "horizontal")
		{
			axis = "x";
		}
		else
		{
			axis = "y";
		}
		
		change = (point[axis] - this.originalPoint[axis]);
		if (Math.abs(change) > this.scrollDeadZone || this.scrolling)
		{
			this.didScroll = true;
			this.scrolling = true;
			if (listeningForScrolling)
			{
				scrolling = true;
				listeningForScrolling = false;
				for (var item in elements)
				{
					if (elements[item] instanceof Button)
					{
						elements[item].onMouseOut();
						elements[item].isMouseDown = false;
					}
				}
				for (var item in scrollViewRegister)
				{
					if (scrollViewRegister[item] != this)
					{
						if (this.scrollViewNotActive(scrollViewRegister[item]))
						{
							scrollViewRegister[item].isMouseDown = false;
						}
					}
					else
					{
						if (this.scrollViewNotActive(this))
						{
							activeScrollViews[activeScrollViews.length] = this;
						}
					}
				}
			}
			if (this.scrollingDirection == "horizontal")
			{
				var value = this.originalOffset[axis] + (point[axis] - this.originalPoint[axis]);
				if (value > -this.edgeThreshold) //moving panel to the right
				{
					var t;
					if (this.multiselectScroll)
					{
						t = this.multiselectScrollPostDeadZone - this.edgeThreshold;
					}
					else
					{
						t = -this.edgeThreshold;
					}
					if (value > t)
					{
						if (this.dropsScrollThrough || AppBarInstance.msBehavior)
						{
							for (var k = 0; k < scrollViewRegister.length; k++)
							{
								var scrollV = scrollViewRegister[k];
								if (scrollV != this && this.scrollViewNotActive(scrollV) && scrollV.scrollingDirection == this.scrollingDirection)
								{
									scrollV.onMouseDown();
									scrolling = true;
									scrollV.scrolling = true;
									break;
								}
							}
						}
					}
					if (this.multiselectScroll)
					{
						value = -this.edgeThreshold;
					}
					else
					{
						if (this.bounceScroll)
						{
							value = -this.edgeThreshold + (value + this.edgeThreshold) / 2;
						}
						else
						{
							value = -this.edgeThreshold;
						}
					}
				}
				if (value < -this.contentView.size.width + this.size.width + this.edgeThreshold) //moving panel to the left
				{
					var testValue = -this.contentView.size.width + this.size.width + this.edgeThreshold;
					if (this.multiselectScroll)
					{
						testValue = -this.contentView.size.width + this.size.width + this.edgeThreshold - this.multiselectScrollPostDeadZone;
					}
					if (value < testValue)
					{
						if (this.dropsScrollThrough || AppBarInstance.msBehavior)
						{
							for (var k = 0; k < scrollViewRegister.length; k++)
							{
								var scrollV = scrollViewRegister[k];
								if (scrollV != this && this.scrollViewNotActive(scrollV) && scrollV.scrollingDirection == this.scrollingDirection)
								{
									scrollV.onMouseDown();
									activeScrollViews[activeScrollViews.length] = scrollV;
									break;
								}
							}
						}
					}
					
					if (this.multiselectScroll)
					{
						value = -this.contentView.size.width + this.size.width + this.edgeThreshold;
					}
					else
					{
						if (this.bounceScroll)
						{
							value = -this.contentView.size.width + this.size.width + this.edgeThreshold + (value - (-this.contentView.size.width + this.size.width + this.edgeThreshold)) / 2;
						}
						else
						{
							value = -this.contentView.size.width + this.size.width + this.edgeThreshold;
						}
					}

				}
				
				if (this.multiselectScroll)
				{
					this.checkmarkContainer.setAttribute("class", "checkmarkContainer");
					this.checkmarkContainer.childNodes[0].setAttribute("class", "checkmarkImage");
					if (value < 0) //show checkmark on the right
					{
						this.checkmarkContainer.style.width =  -value - 10 + "px";
						this.checkmarkContainer.style.left = this.contentView.size.width - 40 + value + "px";	
						this.checkmarkContainer.childNodes[0].style.left = -30 - value + "px";
					}
					else
					{
						this.checkmarkContainer.style.width = value - 10 + "px";
						this.checkmarkContainer.style.left = 40 + "px";
						this.checkmarkContainer.childNodes[0].style.left = "0px";
					}
				}
				
				this.contentView.setLeft(value);
			}
			else
			{
				var value = this.originalOffset[axis] + (point[axis] - this.originalPoint[axis]);
				if (value > this.edgeThreshold)
				{
					if (this.bounceScroll)
					{
						value = this.edgeThreshold + (value - this.edgeThreshold) / 2;
					}
					else
					{
						value = this.edgeThreshold;
					}
				}
				if (value < -this.contentView.size.height + this.size.height + this.edgeThreshold)
				{
					if (this.bounceScroll)
					{
						value = -this.contentView.size.height + this.size.height + this.edgeThreshold + (value - (-this.contentView.size.height + this.size.height + this.edgeThreshold)) / 2;
					}
					else
					{
						value = -this.contentView.size.height + this.size.height + this.edgeThreshold;
					}
				}
 				this.contentView.setTop(value);
			}
			this.positionDict[this.inc] = {"point":point[axis], "time":new Date().getTime()};
			this.inc = ((this.inc + 1) % 10);			
		}
	}
}

ScrollView.prototype.scrollViewNotActive = function(s)
{
	for (var i = 0; i < activeScrollViews.length; i++)
	{
		if (activeScrollViews[i] == s)
		{
			return false;
		}
	}	
	return true;
}

ScrollView.prototype.onMouseUp = function(e)
{
	if (this.isMouseDown & this.scrolling)
	{
		if (this.didScroll)
		{
			e.stopPropagation();
		}
	    var point;
        point = { "x": e.changedTouches[0].clientX, "y": e.changedTouches[0].clientY };
		
		var axis;
		if (this.scrollingDirection == "horizontal")
		{
			axis = "x";
		}
		else
		{
			axis = "y";
		}
	
		var diff = 0;
		var dur = 0;
		for (var i = this.positionDict.length - 1; i > 0; i--)
		{
			var pointB = (i - (this.positionDict.length - 1 - this.inc) + this.positionDict.length) % this.positionDict.length;
			var pointA = (i - (this.positionDict.length - this.inc) + this.positionDict.length) % this.positionDict.length;
			var dataPointB = this.positionDict[pointB];
			var dataPointA = this.positionDict[pointA];
		
			if (diff == 0)
			{	
				diff = dataPointB.point - dataPointA.point;
				dur = dataPointB.time - dataPointA.time;
			}
			else
			{
				var temp = dataPointB.point - dataPointA.point;
				if ((temp > 0 && diff > 0) || (temp < 0 && diff < 0)) //make sure the difference is still going in the same direction
				{
					diff += temp;
					dur += dataPointB.time - dataPointA.time;
				}
				else
				{
					break;
				}
			}
		}
		this.speed = Math.round(diff/dur * 170);
		if (this.paging)
		{
			this.contentView.element.setAttribute("class", "pivotPanelSnapTo");
			if (Math.abs(point[axis] - this.originalPoint[axis]) > this.size.width / 2.7 || Math.abs(this.speed) > 400)
			{
				if (point[axis] - this.originalPoint[axis] < 0)
				{
					if (this.originalOffset[axis]-this.size.width < -this.contentView.size.width + this.size.width)
					{
						this.contentView.setLeft(-this.contentView.size.width + this.size.width);
					}

					else
					{
						this.contentView.setLeft(this.originalOffset[axis]-this.size.width);
					}
				}
				else
				{
					if (this.originalOffset[axis] + this.size.width > 0)
					{
						this.contentView.setLeft(0);
					}
					else
					{
						this.contentView.setLeft(this.originalOffset[axis]+this.size.width);
					}
				}
			}
			else
			{
				this.contentView.setLeft(this.originalOffset[axis]);
			}
		}
		else
		{
			this.originalOffset[axis] = (this.originalOffset[axis] + (point[axis] - this.originalPoint[axis]));
			this.contentView.element.setAttribute("class", this.animatingStyle);
			if (!isNaN(this.speed + this.originalOffset[axis]))
			{	
				if (this.scrollingDirection == "horizontal")
				{
					var value = this.speed + this.originalOffset[axis];
					if (value > 0)
					{
						value = 0;
					}
					if (value < -this.contentView.size.width + this.size.width)
					{
						value = -this.contentView.size.width + this.size.width;
					}
				
					if (this.multiselectScroll)
					{
						this.checkmarkContainer.setAttribute("class", "checkmarkContainerAnimated");
						this.checkmarkContainer.childNodes[0].setAttribute("class", "checkmarkImageAnimated");
						if (this.contentView.x < 0) //show checkmark on the right
						{					
							if (this.contentView.x == -30)		
							{
								this.checkmarkContainer.style.width = -value - 10 + "px";
								this.checkmarkContainer.style.left = this.contentView.size.width - 30 + value + "px";	
							}
							else
							{
								this.checkmarkContainer.style.width =  -value - 10 + "px";
								this.checkmarkContainer.style.left = this.contentView.size.width - 40 + value + "px";	
								this.checkmarkContainer.childNodes[0].style.left = -30 - value + "px";
							}
						}
						else
						{
							if (this.contentView.x == 30)
							{
								this.checkmarkContainer.style.width = value - 10 + "px";
								this.checkmarkContainer.style.left = 10 + "px";
								this.checkmarkContainer.childNodes[0].style.left = "0px";
							}
							else
							{
								this.checkmarkContainer.style.width = 0 + "px";
								this.checkmarkContainer.style.left = 30 + "px";
								this.checkmarkContainer.childNodes[0].style.left = "10px";
							}
						}
					}
					this.contentView.setLeft(value);
				}
				else
				{
					var value = this.speed + this.originalOffset[axis];

					if (value > 0)
					{
						value = 0;
					}
					if (value < -this.contentView.size.height + this.size.height)
					{

						value = -this.contentView.size.height + this.size.height;
					}	

					this.contentView.setTop(value);
				}			
			}
		}
	}
	this.isMouseDown = false;
}