var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var routes = require('./routes/index');
var users = require('./routes/users');
var socket_io = require('socket.io');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

app.use("/", routes);
app.use(express.static(path.join(__dirname, 'public')));
/// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message : err.message,
			error : err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message : err.message,
		error : {}
	});
});

mongo.MongoClient.connect("mongodb://localhost:27017/class", function(err, db) {
	if (err) {
		console, log(err);
		return;
	}
	console.log("connected to mongo");
	chats = db.collection("blogs");

});
io.on('connection', function(socket) {
	console.log("client connected");
	chats.find().toArray(function(err, messages) {
		if (err) {
			console.log("no messages in database");
			return;
		}
		console.log(messages);
		socket.emit("message", messages);
	});

	socket.on("sent", function(data) {
		console.log(data.msg);
		chats.insert(data, function(err) {
			if (err) {
				console.log(err);
			} else {
				console.log("inserted");
			}
		});
		io.emit("sent", [data]);
	});
});
server.listen(8080);

