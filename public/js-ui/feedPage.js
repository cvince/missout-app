'use strict';

FeedPage.prototype = new ContentPage();

function FeedPage() {
	ContentPage.call(this);
	this.element.setAttribute("class", "feedPage");
	this.displayContentItems();
}

FeedPage.prototype.getContentItems = function() {
	// the request for the content to display the contents of the navigation drawer
	//ajax.makeRequest('/public/views/feedPage.html', this);
}

FeedPage.prototype.displayContentItems = function(innerHTML) {
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
							{'tag':'ul',
							'class':'post-wrap line',
							'children': [ ]
							}]
					}]
				};
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
			} while (tempTo300.length <= 300 && wordArray.length > 0)
			wordsTo300.push(tempTo300);
		} while (wordArray.length > 0)
		console.log('******************************');
		console.log(wordsTo300.length);
		console.log(wordsTo300);

		for(var rep = 0;rep < wordsTo300.length;rep ++){
			template.children[1].children[0].children.push({
				tag: 'li',
				html: '${body' + rep + '}'
			});
			elem['body' + rep] = wordsTo300[rep];
		}
		console.log(template.children[1].children[0]);
		console.log(elem);
		console.log(json2html.transform(elem, template));
		feed.innerHTML = feed.innerHTML + json2html.transform(elem, template);
	})
  // if (elem.body.length > 0) {
  // 	var pageTemp = {'tag':'li','html':''};
  // 	var bodyArray = elem.body.split(' ');
  // 	console.log(bodyArray);
  // 	var numPages = elem.body.length / 300;
  // 	numPages = Math.floor(numPages);
  // 	console.log(numPages);
  // 	for (var i = 0; i <= numPages; i++) {
  // 		pageTemp.html = '${body'+i+'}';
  // 		template.children[1].children[0].children.push(pageTemp);
  // 		var thisPage = '';
  // 		while (bodyArray && thisPage.length < 300) {
  // 			thisPage += ' ' + bodyArray.shift();
  // 		}
  // 		elem['body'+i] = thisPage;
  // 		console.log(elem);
  // 	};
  // 	console.log(JSON.stringify(template));
  // }
  //feed.innerHTML = feed.innerHTML + json2html.transform(elem, template);
  //});
});
};
	/*

	<article class="missedConnection line">
    <h2 class="title line">Sabotage Massage Rap Bandit At Large</h2>
    <section id="post-1" class="post line">
      <ul class="post-wrap line">
        <li>
          <p>
          <!-- text -->
          </p>
        </li>
      </ul>
    </section>
    <nav id="pagination-1" class="line">
      <ul>
        <li class="on"></li>

      </ul>
    </nav>
    <footer class="gesturebar line">
      <div class="vote">
        <button class="upVote" title="up vote"></button>
        <button class"downVote" title="down vote"></button>
      </div>
      <button class="comment" title="comment"></button>
    </footer>
  </article><!-- /article -->


*/



FeedPage.prototype.updateUtilityBar = function() {
	utilityBar.showDrawerButton();
}

FeedPage.prototype.bottomButtonClicked = function() {
	catalog = new Catalog();
	appCanvas.pushContent(catalog);
}

FeedPage.prototype.postPageButtonClicked = function() {
	navigationDrawer.close();
	postPage = new PostPage();
	appCanvas.pushContent(postPage);
}
