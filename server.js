const express = require("express");
const google = require("googleapis");
const cs = google.customsearch("v1");
const url = require("url");

const app = express();
const port = process.env.PORT || 8080;
const API_KEY = "AIzaSyCHKkB84IXjwRYR8ak2Enqcup4seaF-r9Q";
const engineID = "013863650583121476830:8jwymltr9vy";
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var mongoURL ="mongodb://ahammadunny3:Namboorimadham@ds121345.mlab.com:21345/ahammadunny" ;

app.use(express.static('public'));
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/public/index.html');
});



MongoClient.connect(mongoURL, function(err, db) {
    if(err) { console.log( "error: unable to connect to the database")
   //  coll = db.collection('searchterms');
 //  collection.find({}, {_id:0, searchVal: 1, searchDate:1, __v: 0}).sort({searchDate: -1}).toArray(function (err, items){
    }   else {
      console.log('MongoDB connection established');
    var  coll = db.collection('history');
      
      app.get('/latest', function(req, res) {
  coll.find({}, {_id: 0, __v:0, keyword:0}).sort({time: -1}).limit(15).toArray(function (err, items) {
    // collection.find({},  {
     // db.close();
      if(err) throw err;
     // return res.json(db);
      res.end(JSON.stringify(items));
   } );
      });
      
      
/*
let latest = [];

app.get("/latest", (req, res) => {
  let show = [];
  let endLength = (latest.length-10 < 0) ? 0 : latest.length-10;
  for(let i = latest.length-1; i > endLength-1; i--){
    show.push(latest[i]);
  }
  res.json(show);
})
*/
      
/*
MongoClient.connect(mongoURL, function(err, db) {
    if(err) { console.log( "error: unable to connect to the database")
   //  coll = db.collection('searchterms');
 //  collection.find({}, {_id:0, searchVal: 1, searchDate:1, __v: 0}).sort({searchDate: -1}).toArray(function (err, items){
    }   else {
      console.log('MongoDB connection established');
    var  coll = db.collection('history');
*/
app.get("/:q", (req, res) => {
  let latest = []
  let q = req.params.q || "";
  let offset = req.query.offset || 0;

  latest.push({
    searchterm: q,
    time: new Date()
  });
  coll.insert(latest);
  
  cs.cse.list({
    auth: API_KEY,
    cx: engineID,
    q: q,
    searchType: "image",
    start: ++offset
  }, function (err, response)  {
    if(err) console.log(err);
  //  result = result.items;
    //response= response.items;

    var filtered = [];
    
    response.items.forEach(function(filter) {
        filtered.push({
          url: filter.link,
         // snippet: filter.snippet,
         // thumbnail: filter.image.thumbnailLink,
        //  context: filter.image.contextLink
        });
      });
    
    /*
    for(let i = 0; i < result.length; i++){
      var text = result[i].link;
      //var text2= text.link()
   let   _filter = {
       // url: result[i].link,
        url: text
        //snippet: result[i].snippet,
       // context: result[i].image.contextLink
      }
      filtered.push(_filter);
    }
    */
    res.json(filtered);

//    callback(filtered);
  })
  
  


 // getResults(q, offset, (result) => {
 //   res.json(result);
 // });
});
}
});

app.listen(port, ()=> console.log(`Listing on port ${port}`));
/*
//function getResults(q, offset, callback){
  cs.cse.list({
    auth: API_KEY,
    cx: engineID,
    q: q,
    searchType: "image",
    start: ++offset
  }, (err, result) => {
    if(err) console.log(err);
    result = result.items;

    let filtered = [];
    for(let i = 0; i < result.length; i++){
      _filter = {
        url: result[i].link,
        snippet: result[i].snippet,
        context: result[i].image.contextLink
      }
      filtered.push(_filter);
    }

    callback(filtered);
  });
//}
*/