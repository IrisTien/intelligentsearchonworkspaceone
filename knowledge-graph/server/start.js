const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const https = require('https');
const loadUtil = require('./load-util');
const app = express();

const neo4j = require('neo4j-driver').v1;

const uri = "bolt://10.117.43.215:7687";//"bolt://10.4.140.37:7687"
const user = "neo4j";
const password = "test";
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
const session = driver.session();

//console.log(session);



const directoryPath = __dirname + '/app';
const handler = express.static(directoryPath);
console.log("server starting hosting for: " + directoryPath);
// This serves static files from the specified directory
app.use(express.static(__dirname + '/app'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
   extended: true
}));

app.get(['/', '/index.html'], (req, res) => {
   console.log("redirect /");
   res.sendFile(__dirname + 'app/index.html');
});

app.get('/api/all', (req, res) => {
   console.log("displayAll");
   res.sendStatus(200);
});

app.get('/api/query', (req, res) => {
   let queryWholeSeg = req.url.split("?");
   let query = queryWholeSeg[1];
   console.log('Querying new result:', query);
   if (!query) {
      console.log('no Querying:', query);
      res.sendStatus(500);
      return;
   }
   let querySeg = query.split("=");
   if (querySeg.length < 2) {
      console.log('no = in Querying:', query);
      res.sendStatus(500);
      return;
   }
   let key = querySeg[0];
   let value = decodeURIComponent(query.slice(query.indexOf("=")+1));
   if (key === "match") {
      console.log('Do the search match:', value);
      loadUtil.requestByMatch(value, session).then((result)=>{
         console.log("ok")
         //res.json(result);
         res.writeHead(200, {"Content-Type": "application/text"});
          var json = JSON.stringify(result);
          res.end(json);
      }).catch((e)=>{
         console.error(e);
         res.sendStatus(403);
      });
      //value
   } else {
      console.log('Do the blur search:', value);
      //TODO: push to parse server and do the query in response.
      //
      res.sendStatus(200);
   }
});



/*
const server = https.createServer({
    cert: fs.readFileSync('./certification/certificate.pem'),
    key: fs.readFileSync('./certification/key.pem')
  }, app);//*/
/*
  server.addListener("request", handler);
  server.listen(8443);
//*/
///*
const server1 = app.listen(8080, '0.0.0.0', () => { //10.4.142.238
   const host = server1.address().address;
   const port = server1.address().port;

   console.log(server1.address())
   console.log('App listening at http://%s:%s', host, port);
});
//*/