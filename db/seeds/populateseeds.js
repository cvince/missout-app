'use strict';

var events = require('events');
var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');

var eventEmitter = new events.EventEmitter();
var numScrapes = 0, returnedScrapes = 0;

var cities = [
  {name: 'seattle',
  url: 'seattle',
  lon:-122.3331,
  lat: 47.6097,
  scrapes: []},
  {name: 'bellingham',
  url: 'bellingham',
  lat: 48.7502,
  lon: -122.4750,
  scrapes: []}
];

var scrapeList = [];

function randomRoot(min, max) {
  var rndRoot = Math.pow(Math.random(), 2) * (max - min) + min;
  //console.log(rndRoot);
  return rndRoot;
}

function pageScrape(city){
  var url = 'http://' + city.url + '.craigslist.org/mis/';
  request(url, function(err, resp, body){
    if(err) console.log('error: ' + err);
    var urlList = [];
    var $ = cheerio.load(body);
    $('.content > .row > .pl > a').each(function(){
      urlList.push({
        url: 'http://' + city.url + '.craigslist.org' + this.attr('href'),
        city: city.name,
        title: this.text().trim(),
        lat: city.lat + randomRoot(-0.1, 0.1),
        lon: city.lon + randomRoot(-0.1, 0.1)
      });
      //console.dir(this.text());
    });
    projectScrape(urlList);
  });
}

function projectScrape(urlList){
  //console.log('******************projectScrape************************');
  //console.log(urlList);
  urlList.forEach(function(frag){
    numScrapes ++;
    request(frag.url, function(err, resp, body){
      if(err) console.log('error: ' + err);
      var project$ = cheerio.load(body);

      var bodyText = project$('#postingbody').text();
      var tempscrape = {
        city: frag.city,
        title: frag.title,
        body: bodyText,
        lat: frag.lat,
        lon: frag.lon,
        url: frag.url
      };
      scrapeList.push(tempscrape);
      eventEmitter.emit('scrapeReturn');
      //console.dir(tempscrape);
    });
  });
}

for(var rep = 0;rep < cities.length; rep++){
  pageScrape(cities[rep]);
}

eventEmitter.on('scrapeReturn', scrapeReturn);

function scrapeReturn(){
  returnedScrapes ++;
  console.log(returnedScrapes);
  if (returnedScrapes >= numScrapes){
    console.log(numScrapes);
    console.log('scraping done');
    console.log(scrapeList.length);
    listEdit();
  }
}

function listEdit(){
  for(var rep = 0;rep < cities.length;rep ++){
    for(var rep2 = 0;rep2 < scrapeList.length;rep2 ++){
      if(scrapeList[rep2].city === cities[rep].name){
        cities[rep].scrapes.push(scrapeList[rep2]);
      }
    }
  }
  convertList();
}

function displayList(){
  for(var rep = 0;rep < cities.length;rep ++){
    for(var rep2 = 0;rep2 < cities[rep].scrapes.length;rep2 ++){
      cities[rep].author = nameGenerator();
      //console.log(cities[rep].scrapes[rep2]);
    }
  }
}

function convertList(){
  var objectList = [];
  for(var rep = 0;rep < cities.length;rep ++){
    for(var rep2 = 0;rep2 < cities[rep].scrapes.length;rep2 ++){
      var tempScrape = cities[rep].scrapes[rep2];
      objectList.push({
        body: tempScrape.body,
        title: tempScrape.title,
        tempname: nameGenerator(),
        loc:{
          type: 'Point',
          coordinates: [tempScrape.lat, tempScrape.lon]
        }
      });
    }
  }
  console.log(objectList);
  writeList(objectList);
}

function writeList(objectList){
  fs.writeFileSync(__dirname + '/test.json', JSON.stringify(objectList));
}

function nameGenerator(){
  function arraySelector(array){
    var rndIndex = (Math.random() * array.length) << 0;
    return array[rndIndex];
  }
  var first = ['battery', 'anchor', 'thermos', 'tent', 'spoon', 'nut', 'fork'];
  var second = ['peanut', 'horse', 'aardvark', 'echidna', 'kiwi', 'carrot', 'cabbage'];
  var third = ['runner', 'peeper', 'rider', 'washer', 'eater', 'flyer', 'hider'];
  var tempName = arraySelector(first) + ' ' + arraySelector(second) + ' ' + arraySelector(third);
  console.log(tempName);
  return tempName;
}

// for(var rep=0;rep<20;rep++){
//   nameGenerator();
// }