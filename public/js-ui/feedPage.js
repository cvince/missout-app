'use strict';
/*global json2html*/
/*global Swipe*/
/*global UI*/
/*global App*/
/*global getID*/
/*global getClass*/

UI.FeedPage= function(elem){
	var element = elem;
	document.addEventListener('reloadFeed', function(e){displayContentItems(e);});

	var displayContentItems = function(e) {
		var tempHTML = '';
		//var feedData = e.detail;
		var feedData = App.postman.show();
		feedData.forEach(function (elem) {
			//console.log(elem.comments);
			elem.pages = [];
			var wordArray = [];
			var wordsTo300 = [];
			wordArray = elem.body.split(' ');
			do{
				var tempTo300 = '';
				do {
					tempTo300 += wordArray.shift() + ' ';
				} while (tempTo300.length <= 300 && wordArray.length > 0);
				wordsTo300.push(tempTo300);
			} while (wordArray.length > 0);

			for(var rep = 0;rep < wordsTo300.length;rep ++){
				elem.pages.push({body: wordsTo300[rep]});
			}
			tempHTML += json2html.transform(elem, mainTemplate);
		});
		element.innerHTML = tempHTML;
		buildSlider();
		commentHandlers();
		fakeBuildNavDrawer(feedData);
		var feedMode = new CustomEvent('feedMode', {});
		document.dispatchEvent(feedMode);
	};

	var buildSlider = function(){
		var sliders = document.querySelectorAll('[id^=post-]');
		for(var i=0;i<sliders.length;i++) {
			window.mySwipe = Swipe(sliders[i], {
				startSlide: 0,
				//auto: 3000,
				continuous: false,
				disableScroll: false,
				stopPropagation: true,
				callback: function(pos, elem) {
					var _id = elem.parentElement.parentElement.id.replace('post-', '');
					var bullets = document.querySelector('[id^=pagination-' + _id +']').getElementsByTagName('li');
					var j = bullets.length;
					while (j--) {
						bullets[j].className = ' ';
					}
					bullets[pos].className = 'on';
				},
				transitionEnd: function(index, element) {}
			});
		}
	};

	var commentHandlers = function(){
		function switchButtonClasses(id){
			var tempComments = getID('comments-' + id);
			if(tempComments.className === 'comments line'){
				tempComments.className = 'comments line active';
			} else {
				tempComments.className = 'comments line';
			}
		}
		element.addEventListener('click', function(e){
			switchButtonClasses(e.target.dataset.id);
		});
	};

	var fakeBuildNavDrawer = function(template){
		var numAlerts, numTracked, rep;
		var alerts = [];
		var tracked = [];
		var templateLength = template.length;
		numAlerts = ((Math.random() * 3) << 0) + 2;
		numTracked = ((Math.random() * 3) << 0) + 2;
		for(rep = 0;rep < numAlerts;rep ++){
			alerts.push(template[(Math.random() * templateLength) <<0]);
		}
		for(rep = 0;rep < numTracked;rep ++){
			tracked.push(template[(Math.random() * templateLength) <<0]);
		}

		var refillNavDrawer = new CustomEvent('refillNavDrawer', {detail: {alerts: alerts, tracked: tracked}});
		document.dispatchEvent(refillNavDrawer);
	};

	var mainTemplate = {
		'tag':'article',
		'class':'missedConnection line post',
		'html':'<div class="line post-meta"><span class="tempname">from: ${tempname}</span></div>',
		'children' : [
			{
				'tag':'h2',
				'html':'${title}',
				'class':'title line'
			},
			{
				'tag':'section',
				'id':'post-${_id}',
				'children': [
					{
						'tag':'ul',
						'class':'post-wrap line',
						'children' : function(){
							return(json2html.transform(this.pages, pageMicroTemplate));
						}
					}
				],
			},
			{
				'tag':'nav',
				'id':'pagination-${_id}',
				'class':'line',
				'children' : [
					{
						'tag' : 'ul',
						'children' : function(){
							var out = [];
							for(var rep=0;rep<this.pages.length;rep++){
								out.push(rep === 0 ? {class: 'on'} : {});
							}
							return(json2html.transform(out, bulletMicroTemplate));
						}
					}
				]
			},
			{
				'tag' : 'div',
				id: 'comments-${_id}',
				'class' :'comments line',
				'html' :
					'<form class="comment-box" method="post" action="api/v1/comments/${_id}">'+
						'<label>Submit a comment</label>'+
						'<textarea class="comment-out" name="body"></textarea>'+
						'<button data-id=${_id} class="submit-comment" type="submit" value="send-comment">Submit A Comment</button>'+'</form>',
				'children' : [
					{
						'tag' : 'ul',
						'children' : [
							{
								'tag' : 'li',
								'children' : function(){
									return(json2html.transform(this.comments, commentMicroTemplate));
								}
							}
						]
					}
				]
			},
			{
				'tag':'footer',
				'class':'gesturebar line',
				'children': [
					{
						'tag':'div',
						'class':'vote',
						'children': [
							{
								'tag':'button',
								'class':'upVote',
								'title':'up vote',
								'html':''
							},
							{
								'tag':'button',
								'class': 'downvote',
								'title':'down vote',
								'html':''
							}
						]
					},
					{
						'tag':'button',
						'class':'viewComment',
						'data-id': '${_id}',
						'title':'comment',
						'html':''
					}
				]
			}
		]
	};

	var commentMicroTemplate = {
		'tag':'div',
		'data-id':'${_id}',
		'children': [
			{
				'tag':'h5',
				'html':'${tempname}'
			},
			{
				'tag':'p',
				'html':'${body}'
			}
		]
	};

	var pageMicroTemplate = {
		tag: 'li',
		html: '${body}'
	};

	var bulletMicroTemplate = {
		tag: 'li',
		class: '${class}'
	};
};