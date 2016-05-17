var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var fh = require('fh-mbaas-api');

function inventoryRoute() {
    var inventory = new express.Router();
    inventory.use(cors());
    inventory.use(bodyParser());

    // POST REST endpoint - note we use 'body-parser' middleware above to parse the request body in this route.
    // This can also be added in application.js
    // See: https://github.com/senchalabs/connect#middleware for a list of Express 4 middleware
    inventory.post('/', function(req, res) {
        console.log(new Date(), 'In inventory route POST / body=', req.body);
        var title = req.body && req.body.title ? req.body.title : 'Title Unknown';

        var options = {
            "act": "create",
            "type": 'Books',
            "fields": {
                title: req.body.title,
                genre: req.body.genre,
                author: req.body.author,
                description: req.body.description,
                count: req.body.count,
                created: new Date().getTime()
            }
        };
        fh.db(options, function(err, data) {
            if (err) {
                console.log(err.stack);
                console.log(new Date() + ' - Failed to create data via fh.db - ', err);
                return res.json({
                    msg: 'Save failed: ' + JSON.stringify(err)
                });
            }
            return res.json({
                msg: 'Inventory record created for ' + title
            });
        });

    });

    inventory.get('/genre', function(req, res) {
        console.log(new Date(), 'In inventory route GET /genre query', req.query);
        var genres = [{
            name: 'General Fiction'
        }, {
            name: 'Suspense'
        }, {
            name: 'Romance'
        }, {
            name: 'Military'
        }, {
            name: 'Mystery'
        }, {
            name: 'Children'
        }];

        return res.json({
            genres: genres
        });
    });

    inventory.get('/list', function(req, res) {
        var options = {
            "act": "list",
            "type": "Books"
        };
        fh.db(options, function(err, data) {
            if (err) {
                console.log(err.stack);
                console.log(new Date() + ' - Failed to create data via fh.db - ', err);
                return res.json({
                    msg: 'List failed: ' + JSON.stringify(err)
                });
            }
            return res.json({
                books: data
            });
        });
    });

    inventory.get('/barcode', function(req, res) {
        fh.service({
            "guid": "xtv7k3znsiwjdgfbgtzqv25h",
            "path": "/barcode/read",
            "method": "POST",
            "headers": {
                "Content-Type": "application/json"
            },
            "params": {
                "barcode": req.query.barcode
            }
        }, function(err, body, response) {
            console.log('statuscode: ', response && response.statusCode);
            if (err) {
                // An error occurred during the call to the service. log some debugging information
                console.log('service call failed - err : ', err);
                return res.json({msg: 'Barcode lookup failed: ' + JSON.stringify(err)});
            } else {
                console.log('Got response from service - status body : ', response.statusCode, body);
                if (response.statusCode == "200")
                  return res.json({products: body});
                else {
                  return res.json({msg: body});
                }
            }
        });
    });

    return inventory;
}

module.exports = inventoryRoute;
