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
			'class':'missedConnection line post',
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
          'tag':'div',
          'class':'comments line',
          'html':
            '<form class="comment-box" method="post" action="api/v1/comments/${_id}">'+
              '<label>Submit a comment</label>'+
              '<textarea class="comment-out" name="body"></textarea>'+
              '<button data-id=${_id} class="submit-comment" type="submit" value="send-comment">Submit A Comment</button>'+
            '</form>'
          ,
          'children' : [
          {
            'tag' : 'ul',
            'children' : [
            {
              'tag' : 'li',
              'html' : '${comments}'
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
							]},
						{
							'tag':'button',
							'id' : 'comment-${_id}',
							'class':'comment',
							'title':'comment',
							'html':''
						}
					]}
			]
		};
	}

  function commentMicroTemplate () {
    return {
      'tag':'div',
      'id':'${_id}',
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
    }
  }



	var data = [
		{ _id: 400, title: 'My Post', body: 'The redhead: damn'}
	];

	//var html = json2html.transform(data, template);
	var feed = document.getElementById('feed');
	//feed.innerHTML = html;

	document.addEventListener('feedJSON', function (e) {
    feed.innerHTML = '';
		var feedData = e.detail;

		feedData.forEach(function (elem) {
      console.log(elem.comments);
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
}
