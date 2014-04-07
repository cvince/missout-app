'use strict';
/*global json2html*/

PostPage.prototype = new ContentPage();

function PostPage(){
	ContentPage.call(this);
	this.element.setAttributes('class', 'feedPage');
	this.displayContentItems();
}


PostPage.prototype.displayContentItems = function() { // removed `innerHTML` parameter
	// postPage content response from the above ajax.makeRequest();
	//this.element.innerHTML = innerHTML;
	function generateMainTemplate(){
		console.log('generateMainTemplate');
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
							'tag':'p',
							'html':'${body}'
						}
					],
				},
				{
					'tag' : 'div',
					'class' :'comments line',
					'html' :
						'<form class="comment-box" method="post" action="api/v1/comments/${_id}">'+
							'<label>Submit a comment</label>'+
							'<textarea class="comment-out" name="body"></textarea>'+
							'<button data-id=${_id} class="submit-comment" type="submit" value="send-comment">Submit A Comment</button>' + '</form>',
					'children' : [
						{
							'tag' : 'ul',
							'children' : [
								{
									'tag' : 'li',
									'children' : function(){
										return(json2html.transform(this.comments, commentMicroTemplate()));
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
							'id' : 'comment-${_id}',
							'class':'comment',
							'title':'comment',
							'html':''
						}
					]
				}
			]
		};
	}
	function commentMicroTemplate () {
		return {
			'tag':'div',
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
	}

	document.addEventListener('postExpanded', function (e) {
			var fullPost = document.getElementById('fullPost');
			var feedData = e.detail;
			var template = generateMainTemplate();
			fullPost.innerHTML = '';
			feedData.forEach(function (elem) {
				fullPost.innerHTML = fullPost.innerHTML + json2html.transform(elem, template);
			});
		});
};
