var express = require('express');
var app = express();
var path = require('path');

app.get('/login', function(req,res) {
	res.sendFile(path.join(__dirname + '/public/login.html'));
});

app.get('/signup', function(req,res) {
	res.sendFile(path.join(__dirname + '/public/signup.html'));
});

app.get('/events', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/ucfevents.json'));
});

app.get('/table', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/table.html'));
});

app.get('/logout', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/logout.html'));
});

app.get('/createEvent', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/createEvent.html'));
});

app.get('/createRSO', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/createRSO.html'));
});

app.use(express.static(__dirname + '/public'));

portNumber = 3000;

app.listen(portNumber);

console.log("Listening on " + portNumber);