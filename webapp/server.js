var express = require('express');
var cors = require('cors');
var session = require('express-session');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var path = require('path');

var app = express();

app.set('view engine', 'ejs');

app.use(cors({credentials: true, origin: true}));
app.use(session({secret: 'ssshhhhh'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(function(req, res, next) {
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	next();
});

var sess;

app.get('/', function(req, res) {
	sess = req.session;

	if (sess.email) {
		res.render('table', {currentUser: sess.email});
	}
	else {
		res.render('index');
	}
});

app.post('/logon', function(req, res) {
	sess = req.session;
	sess.email = req.body.email;
	res.end('done');
});

app.get('/login', function(req, res) {
	req.session.destroy(function(err) {
		if (err) {
			console.log(err);
		}
		else {
			res.render('login');
		}
	});
});

app.get('/signup', function(req, res) {
	res.render('signup');
});

app.get('/events', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/ucfevents.json'));
});

app.get('/table', function(req, res) {
	sess = req.session;
	if (sess.email) {
		res.render('table', {currentUser: sess.email});
	}
	else {
		res.render('accessDenied');
	}
});

app.get('/logout', function(req, res) {

	req.session.destroy(function(err) {
		if (err) {
			console.log(err);
		}
		else {
			res.render('logout');
		}
	});
	
});

app.get('/createEvent', function(req, res) {
	sess = req.session;
	if (sess.email) {
		res.render('createEvent', {currentUser: sess.email});
	}
	else {
		res.render('accessDenied');
	}
});

app.get('/createRSO', function(req, res) {
	sess = req.session;
	if (sess.email) {
		res.render('createRSO', {currentUser: sess.email});
	}
	else {
		res.render('accessDenied');
	}
});

app.get('/RSOlist', function(req, res) {
	sess = req.session;
	if (sess.email) {
		res.render('RSOList', {currentUser: sess.email});
	}
	else {
		res.render('accessDenied');
	}
});

app.get('/comments', function(req, res) {
	sess = req.session;
	if (sess.email) {
		res.render('comments');
	}
	else {
		res.render('accessDenied');
	}
});

app.use(express.static(__dirname + '/public'));

portNumber = 3000;

app.listen(portNumber);

console.log("Listening on " + portNumber);