/* SERVER.JS */

// Prequisites
var express    = require('express');
var app        = express();
var mongoose   = require('mongoose');
var fs         = require('fs');
var extend     = require('util')._extend;
var bodyParser = require('body-parser');
var config     = require(__dirname + '/app/config/config.js');
var port       = process.env.PORT || 8091;
var models     = [];

// Use Bodyparse
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// CORS Handler
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type, beetl-bearer");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");

    next();
});

// Connect MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/local');

// Load Models
fs.readdirSync(__dirname + '/app/models').forEach(function(filename) {
    if (~filename.indexOf('.js')) {
        models[filename.replace(/\.js$/g, '')] = require(__dirname + '/app/models/' + filename);
    }
});

/**
 * The function will check if the user behind given token
 * is valid and token session has not expired
 * @param  {[object]} req
 * @param  {Function} fn
 * @return {[bool]}
 */
var authenticateRequest = function(req, fn) {

    var beetlBearer = req.header('beetl-bearer');

    // Processing
    mongoose.model('user').find({ bearer: beetlBearer }, function(err, data) {

        // DEBUG MODE
        //return fn(true);

        // Error handling
        if(!data || data.length === 0) {
            return fn(false);
        }   
        
        if(err) {
            return fn(false);
        }

        // Bearer tstamp comparison --> 15 Minutes
        if(data[0].bearertstamp < (Date.now() - 3600000)) {
            return fn(false);
        }

        // Refresh token
        mongoose.model('user').findOneAndUpdate({_id:data[0].id}, { bearertstamp : Date.now() }, function(err, res) {});

        // Authenticated user
        fn(true);
    });
}

// ROUTE BY CONFIG
config.routeTable.forEach(function(route) {

    // GET ROUTES
    if(route.methods.indexOf('GET') > -1) {

        // TODO: Add callback functionality / based on model

        app.get('/' + route.name, function(req, res) {

            authenticateRequest(req, function(isAuthenticated) {
                if(!isAuthenticated) {
                    return res.send(401);
                }

                mongoose.model(route.name).find(function(err, data) {
                    res.send(data);
                });
            });        
        });

        app.get('/' + route.name + '/:id', function(req, res) {

            authenticateRequest(req, function(isAuthenticated) {
                if(!isAuthenticated) {
                    return res.send(401);
                }
                mongoose.model(route.name).findById(req.params.id, function(err, data) {
                    if (err) {
                        res.send(err);
                    }
                    res.json(data);
                });
            });
        });

        app.get('/' + route.name + '/:column/:id', function(req, res) {

            authenticateRequest(req, function(isAuthenticated) {
                if(!isAuthenticated) {
                    return res.send(401);
                }

                var query = {};
                query[req.params.column] = req.params.id;

                mongoose.model(route.name).find(query, function(err, data) {
                    if (err) {
                        res.send(err);
                    }
                    res.json(data);
                });
            });
        });
    }

    // POST ROUTES
    if(route.methods.indexOf('POST') > -1) {

        app.post('/' + route.name, function(req, res) {

            authenticateRequest(req, function(isAuthenticated) {
                if(!isAuthenticated) {
                    return res.send(401);
                }

                var staticModel = mongoose.model(route.name);

                // SET CallBack
                if(route.setCallback && route.setCallback.length) {
                    route.setCallback.forEach(function(objCallback){
                        if(req.body[objCallback.field]) {
                            req.body[objCallback.field] = staticModel[objCallback.method](req.body[objCallback.field]);
                        }
                    });
                }
                
                // Instantiate model
                var newEntity = new models[route.name]();
                newEntity     = extend(newEntity, req.body);

                // Save to database
                newEntity.save(function(err) {
                    if (err) {
                        throw err;
                    }
                    res.json({ id: newEntity._id });
                });
            });
        });
    }

    // PUT ROUTES
    if(route.methods.indexOf('PUT') > -1) {

        app.put('/' + route.name + '/:id', function(req, res) {

            authenticateRequest(req, function(isAuthenticated) {
                if(!isAuthenticated) {
                    return res.send(401);
                }

                var staticModel = mongoose.model(route.name);

                staticModel.find({ _id: req.params.id }, function(err, data) {
                    if (err) {
                        res.send(err);
                    }

                    //UPDATE CallBack
                    if(route.updateCallback && route.updateCallback.length) {
                        route.updateCallback.forEach(function(objCallback){
                            if(req.body[objCallback.field]) {
                                req.body[objCallback.field] = staticModel[objCallback.method](req.body[objCallback.field]);
                            }
                        });
                    }

                    // Extend given data with changes
                    data[0] = extend(data[0], req.body);

                    // Update in Database
                    data[0].save(function(err) {
                        if (err) {
                            throw err;
                        }
                        res.json({ id: data[0]._id });
                    });
                });
            });
        });
    }

    // DELETE ROUTES
    if(route.methods.indexOf('DELETE') > -1) {

        // TODO: Add callback functionality / based on model

        app.delete('/' + route.name + '/:id', function (req, res) {

            authenticateRequest(req, function(isAuthenticated) {
                if(!isAuthenticated) {
                    return res.send(401);
                }
                mongoose.model(route.name).findById(req.params.id, function (err, data) {
                    data.remove(function (err) {
                        if (!err) {
                            return res.send('Entity removed');
                        } else {
                            console.log(err);
                        }
                    });
                });
            });
        });
    }
});

// Authentication
app.post('/auth', function(req, res) {

    // Prequisites
    var username = req.body.username;
    var password = req.body.password;
    var bearer   = undefined;

    if(username && username) {

        // Load static model
        var staticModel = mongoose.model('user');

        // Salt password for comparison
        password = staticModel.saltPassword(password);

        // Process
        staticModel.find({ username: username }, function(err, data) {
            if (err) {
                return res.send(err);
            }

            // Password comparison
            if(!data || data.length === 0 || data[0].password !== password) {
                return res.send(401);
            }

            // Create bearer
            var beetlBearer = staticModel.createBearer();

            // Save bearer and session timestamp to database
            staticModel.findOneAndUpdate({_id:data[0].id}, { bearer : beetlBearer, bearertstamp : Date.now() }, function (err, response) {
                if (!err) {

                    payload = {
                        'id'          : data[0]._id,
                        'username'    : data[0].username,
                        'isAdmin'     : data[0].isAdmin,
                        'beetlBearer' : beetlBearer 
                    };

                    return res.send(payload);
                } else {
                    console.log(err);
                }
            });
        });
    }
});

// Server StartUp
app.listen(port);
console.log('BEETL API LISTENING ON PORT ' + port);