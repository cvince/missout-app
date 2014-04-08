'use strict';
/*global json2html*/
/*global UI*/
/*global App*/
/*global getID*/
/*global getClass*/

UI.PostPage = function(elem) {
	var element = elem;
	document.addEventListener('postExpanded', function(e){
		displayContentItems(e.detail);
	});

	var displayContentItems = function(data) {
			element.innerHTML = json2html.transform(data, mainTemplate);
			commentHandler();
			var postMode = new CustomEvent('postMode', {});
			document.dispatchEvent(postMode);
		};

	var commentHandler = function(){
		function switchButtonClasses(id){
			var tempComments = getID('singlePostComments-' + id);
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
				'id':'singlePost-${_id}',
				'children': [
					{
						'tag':'p',
						'html':'${body}'
					}
				],
			},
			{
				'tag' : 'div',
				id: 'singlePostComments-${_id}',
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
};