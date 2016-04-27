var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');

var app = express();

// Enable CORS for all requests
app.use(cors());

// allow serving of static files from the public directory
app.use(express.static(__dirname + '/public'));

// parse query string (GET) and body (for POST)
app.use(bodyParser());

// GET REST endpoint - query params may or may not be populated
app.get('/hello', function(req, res) {
  console.log(new Date(), 'In hello route GET / req.query=', req.query);
  var world = req.query && req.query.hello ? req.query.hello : 'World';

  // see http://expressjs.com/4x/api.html#res.json
  res.json({msg: 'Hello ' + world});
});

// Start server
var port = 8001;
var host = '0.0.0.0';
app.listen(port, host, function() {
  console.log("Hello REST API started at: " + new Date() + " on port: " + port);
});
