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
		idClickHandlers();
		fakeBuildNavDrawer(feedData);
		var feedMode = new CustomEvent('feedMode', {});
		document.dispatchEvent(feedMode);
	};

	var buildSlider = function(){
		function sliderCallback(pos, elem){
			var _id = elem.parentElement.parentElement.id.replace('post-', '');
			var bullets = document.querySelector('[id^=pagination-' + _id +']').getElementsByTagName('li');
			var j = bullets.length;
			while (j--) {
				bullets[j].className = ' ';
			}
			bullets[pos].className = 'on';
		}

		var sliders = document.querySelectorAll('[id^=post-]');
		for(var i=0;i<sliders.length;i++) {
			window.mySwipe = Swipe(sliders[i], {
				startSlide: 0,
				//auto: 3000,
				continuous: false,
				disableScroll: false,
				stopPropagation: true,
				callback: sliderCallback,
				transitionEnd: function(index, element) {}
			});
		}
	};

	var hasAClass = function(elem, cls){
		return (' ' + elem.className + ' ').indexOf(' ' + cls + ' ') > -1;
	};

	var idClickHandlers = function(){
		element.addEventListener('click', function(e){
			var id = e.target.dataset.id;
			if(!id){ return; }
			if(hasAClass(e.target, 'commenthandler')) { commentHandler(id); }
			if(hasAClass(e.target, 'updownhandler')) { upDownVoteHandler(e.target, id); }
			if(hasAClass(e.target, 'bullethandler')) { bulletHandler(id); }
		});
	};

	var commentHandler = function(id){
		var tempComments = getID('comments-' + id);
		if(tempComments.className === 'comments line'){
			tempComments.className = 'comments line active';
		} else {
			tempComments.className = 'comments line';
		}
	};

	var upDownVoteHandler = function(elem, id){
		var vote;
		var upvote = getID('upVote-' + id);
		var downvote = getID('downVote-' + id);
		if(elem.id === upvote.id) {vote = 'up';}
			else {vote = 'down';}
		if(vote === 'up'){
			if(downvote.checked){
				downvote.checked = false;
			}
		}
		if(vote === 'down'){
			if(upvote.checked){
				upvote.checked = false;
			}
		}
		//alert('up down');
	};

	var bulletHandler = function(id){
		//alert('bullet');
	};

	var fakeBuildNavDrawer = function(template){
    var tempFeed = template.slice(0);
		var numAlerts, numTracked, rep;
		var alerts = [];
		var tracked = [];
		var templateLength = template.length;
		numAlerts = 3;
		numTracked = 3;
		for(rep = 0;rep < numAlerts;rep ++){
			alerts.push(tempFeed.pop());
		}
		for(rep = 0;rep < numTracked;rep ++){
			tracked.push(tempFeed.shift());
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
				children:[
					{tag: 'span',
					'html':'${title}',
					'data-id': '${_id}',
					'class':'title line commenthandler'}
				]
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
								out.push(rep === 0 ? {_id: this._id, class: 'on'} : {_id: this._id});
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
						'<textarea placeholder="Write a message..." class="comment-out" name="body"></textarea>'+
						'<button data-id=${_id} class="submit-comment" type="submit" value="send-comment" onclick="App.postman.comment(this.parentElement.children[1].value, this.dataset.id)">Submit</button>'+'</form>',
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
								'tag':'input',
								'type':'checkbox',
								'id':'downVote-${_id}',
								'data-id': '${_id}',
								'name':'voteUpDown',
								'value':'disliked',
								'class':'downvote updownhandler',
								'title':'down vote',
								'html':'<label for="downVote-${_id}"></label>'
							},
							{
								'tag':'input',
								'type':'checkbox',
								'id':'upVote-${_id}',
								'data-id': '${_id}',
								'name':'voteUpDown',
								'value':'liked',
								'class':'upvote updownhandler',
								'title':'up vote',
								'html':'<label for="upVote-${_id}"></label>'
							}
						]
					},
					{
						'tag':'button',
						'class':'viewComment commenthandler',
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
				'html':'${tempname} says:'
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
		'data-id':'${_id}',
		class: '${class} bullethandler'
	};
};
