'use strict';

FeedPage.prototype = new ContentPage();

function FeedPage() {
	ContentPage.call(this);
	this.element.setAttribute('class', 'feedPage');
	this.displayContentItems();
}

FeedPage.prototype.getContentItems = function() {
	// the request for the content to display the contents of the navigation drawer
	//ajax.makeRequest('/public/views/feedPage.html', this);
};

FeedPage.prototype.displayContentItems = function() { //removed innerHTML from parameter
	//the data response from the above request
	//this.element.innerHTML = innerHTML;
	function generateTemplate(){
		return {
			'tag':'article',
			'class':'missedConnection line',
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
						'children': [ ]
					}
					],
				},
				{
					'tag':'nav',
					'id':'pagination-${_id}',
					'class':'line',
					'children':[
    				{
    					'tag':'ul',
    					'children': [ ]
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
      	]},
    		{
    			'tag':'button',
    			'class':'comment',
    			'title':'comment',
    			'html':''
    		}
  		]}
			]
		};
	}

	var data = [
		{ _id: 400, title: 'My Post', body: 'The redhead: damn'}
	];

	//var html = json2html.transform(data, template);
	var feed = document.getElementById('feed');
	//feed.innerHTML = html;

	document.addEventListener('feedJSON', function (e) {
		var feedData = e.detail;
		console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
		console.log('feedData');
		console.log(feedData);
		feedData.forEach(function (elem) {
			var wordArray = [];
			var wordsTo300 = [];
			var template = generateTemplate();
			wordArray = elem.body.split(' ');
			do{
				var tempTo300 = '';
				do {
					tempTo300 += wordArray.shift() + ' ';
				} while (tempTo300.length <= 300 && wordArray.length > 0);
				wordsTo300.push(tempTo300);
			} while (wordArray.length > 0);
			console.log('******************************');
			console.log(wordsTo300.length);
			console.log(wordsTo300);

			for(var rep = 0;rep < wordsTo300.length;rep ++){
				template.children[1].children[0].children.push({
					tag: 'li',
					html: '${body' + rep + '}'
				});
				template.children[2].children[0].children.push({
					tag: 'li',
					html: ''
				});
				elem['body' + rep] = wordsTo300[rep];
			}
			console.log(template.children[1].children[0]);
			console.log(elem);
			console.log(json2html.transform(elem, template));
			feed.innerHTML = feed.innerHTML + json2html.transform(elem, template);
		});
		buildSlider();
	});
};

FeedPage.prototype.updateUtilityBar = function() {
	utilityBar.showDrawerButton();
};

FeedPage.prototype.bottomButtonClicked = function() {
	catalog = new Catalog();
	appCanvas.pushContent(catalog);
};

FeedPage.prototype.postPageButtonClicked = function() {
	navigationDrawer.close();
	postPage = new PostPage();
	appCanvas.pushContent(postPage);
};


var buildSlider = function(){
	var sliders = document.querySelectorAll('[id^=post-]');
	var bullets = document.querySelector('[id^=pagination-]').getElementsByTagName('li');
	for(var i=0;i<sliders.length;i++) {
		window.mySwipe = Swipe(sliders[i], {
			startSlide: 0,
			//auto: 3000,
			continuous: false,
			disableScroll: false,
			stopPropagation: true,
			callback: function(pos) {

				var j = bullets.length;
				while (j--) {
					bullets[j].className = ' ';
				}
				bullets[pos].className = 'on';

			},
			transitionEnd: function(index, element) {}
		});
	}
}
