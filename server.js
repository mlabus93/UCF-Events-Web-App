var express = require('express');
var cors = require('cors');
var session = require('express-session');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var path = require('path');
var mysql = require('mysql');

var app = express();

app.set('view engine', 'ejs');

app.use(cors({credentials: true, origin: true}));
app.use(session({secret: 'ssshhhhh'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var pool = mysql.createPool({
	connectionLimit: 100,
	host: 'localhost',
	user: 'root',
	database: 'UnivEvents',
	debug: false,
	dateStrings: true,
	timeStrings: true
});

var sess;

var eventId;

app.get('/', function(req, res) {
	sess = req.session;
	if (sess.email) {
		res.render('table', {currentUser: sess.email, access: sess.access, univ: sess.univ});
	}
	else {
		res.render('index');
	}
});

app.post('/logon', function(req, res) {
	validateUser(req.body.email, req.body.pass, function(err, user) {
		if (user) {
			sess = req.session;
			sess.userId = user.student_no;
			sess.email = user.email;
			sess.pass = user.password;
			sess.access = user.acct_type;
			sess.univ = user.uni_id;
			console.log(sess.email);
			console.log(sess.pass);
			console.log(sess.access);
			console.log(sess.univ);
			res.end('done');
		}
		else {
			res.end('fail');
		}
	});
});

app.post('/registration', function(req, res) {
	addUser(req, res);
})

app.get('/login', function(req, res) {
	sess = req.session;
	console.log(sess.email);
	if (sess.email) {
		res.redirect('/');
	}
	else {
		res.render('login');
	}
});

app.get('/signup', function(req, res) {
	sess = req.session;
	console.log(sess.email);
	if (sess.email) {
		res.redirect('/');
	}
	else {
		res.render('signup');
	}
});

app.get('/home', function(req, res) {
	sess = req.session;
	if (sess.email) {
		res.render('table', {currentUser: sess.email, access: sess.access, univ: sess.univ});
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

app.get('/accessLevelDenied', function(req, res) {
	sess = req.sess;
	if (sess.email) {
		res.render('accessLevelDenied', {currentUser: sess.email, access: sess.access, univ: sess.univ});
	}
});

app.get('/createEvent', function(req, res) {
	sess = req.session;
	if (sess.access === 'admin' || sess.access === 'superadmin') {
		res.render('createEvent', {currentUser: sess.email, access: sess.access, univ: sess.univ});
	}
	else if (sess.access === 'student') {
		res.render('accessLevelDenied', {currentUser: sess.email, access: sess.access, univ: sess.univ});
	}
	else {
		res.render('accessDenied');
	}
});

app.post('/eventCreation', function(req, res) {
	sess = req.session;
	createEvent(sess, req, res);
});

app.get('/createRSO', function(req, res) {
	sess = req.session;
	if (sess.email) {
		res.render('createRSO', {currentUser: sess.email, access: sess.access, univ: sess.univ});
	}
	else {
		res.render('accessDenied');
	}
});

app.post('/rsoCreation', function(req, res) {
	sess = req.session;
	createRSO(sess, req, res);
});

app.get('/rso', function(req, res) {
	sess = req.session;
	if (sess.email) {
		res.render('RSOList', {currentUser: sess.email, access: sess.access, univ: sess.univ});
	}
	else {
		res.render('accessDenied');
	}
});

app.get('/currentRSO', function(req, res) {
	sess = req.session;
	if (sess.email) {
		getCurrentRSOs(sess, req, res);
	}
	else {
		res.render('accessDenied');
	}
});

app.post('/joinRSO', function(req, res) {
	sess = req.session;
	joinRSOs(sess, req, res);
});

app.post('/removeRSOs', function(req, res) {
	sess = req.session;
	removeRSOs(sess, req, res);
});

app.get('/comments', function(req, res) {
	sess = req.session;
	eventId = req.query.id;
	var eventName = req.query.name;
	var currentLatitude = req.query.lat;
	var currentLongitude = req.query.lng;
	var location = req.query.loc;
	if (!eventId) {
		res.render('accessDenied');
	}
	if (sess.email) {
		res.render('comments', {
			currentUser: sess.email,
			access: sess.access,
			univ: sess.univ,
			eventName: eventName,
			currentLatitude: currentLatitude,
			currentLongitude: currentLongitude,
			location: location
		});
	}
	else {
		res.render('accessDenied');
	}
});

app.post('/postComment', function(req, res) {
	sess = req.session;
	postComment(eventId, sess, req, res);
});

app.post('/joinEvent', function(req, res) {
	sess = req.session;
	joinEvent(eventId, sess, req, res);
});

app.post('/removeEvent', function(req, res) {
	sess = req.session;
	removeEvent(eventId, sess, req, res);
});

app.get('/currentEvent', function(req, res) {
	if (eventId) {
		getCurrentEvent(eventId, sess, req, res);
	}
	else {
		res.render('accessDenied');
	}
});

app.get('/publicEvents', function(req, res) {
	sess = req.session;
	if (sess.email) {
		getPublicEvents(sess, req, res);
	}
	else {
		res.render('accessDenied');
	}
});

app.get('/privateEvents', function(req, res) {
	sess = req.session;
	if (sess.email) {
		getPrivateEvents(sess, req, res);
	}
	else {
		res.render('accessDenied');
	}
});

app.get('/rsoEvents', function(req, res) {
	sess = req.session;
	if (sess.email) {
		getRSOEvents(sess, req, res);
	}
	else {
		res.render('accessDenied');
	}
});

app.get('/joinedEvents', function(req, res) {
	sess = req.session;
	if (sess.email) {
		getJoinedEvents(sess, req, res);
	}
	else {
		res.render('accessDenied');
	}
});

app.get('/universityList', function(req, res) {
		getUniversities(req, res);
});

app.get('/rsoList', function(req, res) {
	sess = req.session;
	if (sess.email) {
		getRSOList(sess, req, res);
	}
	else {
		res.render('accessDenied');
	}
});


function validateUser(email, pass, fn) {
	pool.getConnection(function(err, connection) {
		if (err) {
			console.log("Error: " + err);
			res.json({"code": 100, "status": "Error in connection database"});
			if (connection) {
				connection.release();
			}
			return;
		}

		console.log("Connected as: " + connection.threadId);

		var queryString = 'SELECT * FROM user WHERE email = ' + connection.escape(email) + ' AND password = ' + connection.escape(pass);

		connection.query(queryString, function(err, rows) {
			connection.release();
			if (!err) {
				if (rows.length < 1) {
					return fn(new Error('cannot find user'));
				}
				var user = rows[0];
				return fn(null, user);
			}
		});

		connection.on('error', function(err) {
			console.log(err);
			res.json({"code" : 100, "status" : "Error in connection database"});
			return fn(new Error('database failed'));
		});
	});
}

function addUser(req, res) {
	pool.getConnection(function(err, connection) {
		if (err) {
			console.log("Error: " + err);
			res.json({"code": 100, "status": "Error in connection database"});
			if (connection) {
				connection.release();
			}
			return;
		}

		console.log("Connected as: " + connection.threadId);
		console.log('before query');


		var queryString = "INSERT INTO user(email, password, acct_type, uni_id) VALUES(" + connection.escape(req.body.email) + 
			", " + connection.escape(req.body.pass) + ", 'student', " + connection.escape(req.body.univ) + ")";

		connection.query(queryString, function(err, rows) {
			connection.release();
			if (!err) {
				console.log('query executes');
				res.end('done');
				return;
			}
			console.log('query error');
			res.end('fail');
		});

		connection.on('error', function(err) {
			console.log(err);
			res.json({"code" : 100, "status" : "Error in connection database"});
			return fn(new Error('database failed'));
		});
	});
}

function createRSO(sess, req, res) {
	pool.getConnection(function(err, connection) {
		if (err) {
			console.log("Error: " + err);
			res.json({"code": 100, "status": "Error in connection database"});
			if (connection) {
				connection.release();
			}
			return;
		}

		console.log("Connected as: " + connection.threadId);
		console.log('before query');

		var queryChangeAcctType = "UPDATE user u SET u.acct_type ='admin' WHERE `student_no`= " + sess.userId + "; ";

		var queryUsertoAdmin =	"INSERT INTO `admin`(admin_id) VALUES('" + sess.userId + "'); ";

		var queryRSOAdd =	"INSERT INTO `rso`(rso_name, admin_id) " +
							"VALUES(" + connection.escape(req.body.rsoName) + ", " + sess.userId + "); ";

		var queryAdminJoinRSO = "INSERT INTO `joins`(student_no, rso_id) VALUES(" + sess.userId + ", " +
								"(SELECT rs.rso_id FROM rso rs WHERE rs.rso_name = " + connection.escape(req.body.rsoName) + "))";

		var queryuser2JoinRSO =	"INSERT INTO `joins`(student_no, rso_id) VALUES((" +
								"SELECT u.student_no FROM user u WHERE u.email = " + connection.escape(req.body.email2) + "), (" +
								"SELECT r.rso_id FROM rso r WHERE r.rso_name = " + connection.escape(req.body.rsoName) + ")); ";

		var queryuser3JoinRSO =	"INSERT INTO `joins`(student_no, rso_id) VALUES((" +
								"SELECT u.student_no FROM user u WHERE u.email = " + connection.escape(req.body.email3) + "), (" +
								"SELECT r.rso_id FROM rso r WHERE r.rso_name = " + connection.escape(req.body.rsoName) + ')); ';

		var queryuser4JoinRSO =	"INSERT INTO `joins`(student_no, rso_id) VALUES((" +
								"SELECT u.student_no FROM user u WHERE u.email = " + connection.escape(req.body.email4) + "), (" +
								"SELECT r.rso_id FROM rso r WHERE r.rso_name = " + connection.escape(req.body.rsoName) + ')); ';

		var queryuser5JoinRSO =	"INSERT INTO `joins`(student_no, rso_id) VALUES((" +
								"SELECT u.student_no FROM user u WHERE u.email = " + connection.escape(req.body.email5) + "), (" +
								"SELECT r.rso_id FROM rso r WHERE r.rso_name = " + connection.escape(req.body.rsoName) + '));';

		var queryArray = [
			queryChangeAcctType,
			queryUsertoAdmin,
			queryRSOAdd,
			queryAdminJoinRSO,
			queryuser2JoinRSO,
			queryuser3JoinRSO,
			queryuser4JoinRSO,
			queryuser5JoinRSO
		];


		var errorCount = 0;
		var duplicateError = 0;

		for (var i=0; i<queryArray.length; i++) {
			connection.query(queryArray[i], function(err, rows) {

				if (!err) {
					console.log("query: " + i + " executed");
				}
				else if (err.code === 'ER_DUP_ENTRY') {
					duplicateError = 1;
				}
				else {
					errorCount++;
					console.log(err);
					console.log('query error');
				}
			});
		}

		connection.on('error', function(err) {
			console.log(err);
			res.json({"code" : 100, "status" : "Error in connection database"});
			return fn(new Error('database failed'));
		});
		if (errorCount > 0) {
			res.end('fail');
		}
		else if (duplicateError === 1) {
			res.end('duplicate');
		}
		else {
			sess.access = 'admin';
			res.end('done');
		}
	});
}

function joinRSOs(sess, req, res) {
	pool.getConnection(function(err, connection) {
		if (err) {
			console.log("Error: " + err);
			res.json({"code": 100, "status": "Error in connection database"});
			if (connection) {
				connection.release();
			}
			return;
		}

		console.log("Connected as: " + connection.threadId);
		console.log('before query');

		var rsos = req.body.selectedRSOs;

		var queryString = "INSERT INTO joins(student_no, rso_id) " +
		"VALUES";

		for (var i=0; i<rsos.length; i++) {
			if (i < rsos.length-1) {
				queryString += "(" + sess.userId + ", " + rsos[i].rso_id + "), ";
			}
			else {
				queryString += "(" + sess.userId + ", " + rsos[i].rso_id + ")";
			}
		}

		console.log(queryString);

		connection.query(queryString, function(err, rows) {
			connection.release();
			if (!err) {
				console.log('query executes');
				res.end('done');
				return;
			}
			if (err.code === 'ER_DUP_ENTRY') {
				res.end('duplicate');
			}
			console.log('query error');
			res.end('fail');
		});

		connection.on('error', function(err) {
			console.log(err);
			res.json({"code" : 100, "status" : "Error in connection database"});
			return fn(new Error('database failed'));
		});
	});
}

function removeRSOs(sess, req, res) {
	pool.getConnection(function(err, connection) {
		if (err) {
			console.log("Error: " + err);
			res.json({"code": 100, "status": "Error in connection database"});
			if (connection) {
				connection.release();
			}
			return;
		}

		console.log("Connected as: " + connection.threadId);
		console.log('before query');

		var rsos = req.body.selectedRSOs;

		var errorCount = 0;

		for (var i=0; i<rsos.length; i++) {
			var queryString =	"DELETE FROM joins WHERE student_no = " + connection.escape(sess.userId) +
								" AND rso_id = " + rsos[i].rso_id;

			connection.query(queryString, function(err, rows) {

				if (!err) {
					// do nothing
				}
				else {
					errorCount++;
					console.log(err);
					console.log('query error');
				}
			});
		}
		connection.on('error', function(err) {
			console.log(err);
			res.json({"code" : 100, "status" : "Error in connection database"});
			return fn(new Error('database failed'));
		});
		if (errorCount > 0) {
			res.end('fail');
		}
		else {
			res.end('done');
		}
	});
}

function getPublicEvents(sess, req, res) {
	pool.getConnection(function(err, connection) {
		if (err) {
			console.log("Error: " + err);
			res.json({"code": 100, "status": "Error in connection database"});
			if (connection) {
				connection.release();
			}
			return;
		}

		console.log("Connected as: " + connection.threadId);

		var queryString =	"SELECT	e.event_id, e.event_name, e.description, e.starttime, e.category, e.loc_name, e.latitude, e.longitude, e.latitude, " +
							"e.weekly_event, us.email, un.uni_name, r.rso_name " +
							"FROM event e " + 
							"INNER JOIN user us ON e.admin_id = us.student_no " + 
							"INNER JOIN university un ON us.uni_id = un.uni_id " +
							"LEFT JOIN rso r ON e.rso_id = r.rso_id " +
							"WHERE e.type = 'Public'";

		connection.query(queryString, function(err, rows) {
			connection.release();
			if (!err) {
				res.json(rows);
			}
		});

		connection.on('error', function(err) {
			console.log(err);
			res.json({"code" : 100, "status" : "Error in connection database"});
		});
	});
}

function getPrivateEvents(sess, req, res) {
	pool.getConnection(function(err, connection) {
		if (err) {
			console.log("Error: " + err);
			res.json({"code": 100, "status": "Error in connection database"});
			if (connection) {
				connection.release();
			}
			return;
		}

		console.log("Connected as: " + connection.threadId);

		var queryString =	"SELECT	e.event_id, e.event_name, e.description, e.starttime, e.category, e.loc_name, e.latitude, e.longitude, " +
							"e.weekly_event, us.email, un.uni_name, r.rso_name " +
							"FROM event e " + 
							"INNER JOIN user us ON e.admin_id = us.student_no " + 
							"INNER JOIN university un ON us.uni_id = un.uni_id " +
							"LEFT JOIN rso r ON e.rso_id = r.rso_id " +
							"WHERE e.type = 'Private' AND us.uni_id = " + connection.escape(sess.univ);

		if (sess.access === 'superadmin') {
			queryString =	"SELECT	e.event_id, e.event_name, e.description, e.starttime, e.category, e.loc_name, e.latitude, e.longitude, " +
							"e.weekly_event, us.email, un.uni_name, r.rso_name " +
							"FROM event e " + 
							"INNER JOIN user us ON e.admin_id = us.student_no " + 
							"INNER JOIN university un ON us.uni_id = un.uni_id " +
							"LEFT JOIN rso r ON e.rso_id = r.rso_id " +
							"WHERE e.type = 'Private'";
		}

		connection.query(queryString, function(err, rows) {
			connection.release();
			if (!err) {
				res.json(rows);
			}
		});

		connection.on('error', function(err) {
			console.log(err);
			res.json({"code" : 100, "status" : "Error in connection database"});
		});
	});
}

function getRSOEvents(sess, req, res) {
	pool.getConnection(function(err, connection) {
		if (err) {
			console.log("Error: " + err);
			res.json({"code": 100, "status": "Error in connection database"});
			if (connection) {
				connection.release();
			}
			return;
		}

		console.log("Connected as: " + connection.threadId);


		var queryString =	"SELECT	e.event_id, e.event_name, e.description, e.starttime, e.category, e.loc_name, e.latitude, " + 
							"e.longitude, e.weekly_event, us.email, un.uni_name, r.rso_name " +
							"FROM event e " +
							"INNER JOIN user us ON e.admin_id = us.student_no " +
							"INNER JOIN university un ON us.uni_id = un.uni_id " +
							"INNER JOIN rso r ON e.rso_id = r.rso_id " +
							"WHERE e.rso_id IN (SELECT j.rso_id " +
												"FROM joins j " +
												"WHERE j.student_no = " + connection.escape(sess.userId) + ")";

		if (sess.access === 'superadmin') {
			queryString =	"SELECT	e.event_id, e.event_name, e.description, e.starttime, e.category, e.loc_name, e.latitude, " + 
							"e.longitude, e.weekly_event, us.email, un.uni_name, r.rso_name " +
							"FROM event e " +
							"INNER JOIN user us ON e.admin_id = us.student_no " +
							"INNER JOIN university un ON us.uni_id = un.uni_id " +
							"INNER JOIN rso r ON e.rso_id = r.rso_id ";
		}

		connection.query(queryString, function(err, rows) {
			connection.release();
			if (!err) {
				res.json(rows);
			}
		});

		connection.on('error', function(err) {
			console.log(err);
			res.json({"code" : 100, "status" : "Error in connection database"});
		});
	});
}

function getJoinedEvents(sess, req, res) {
	pool.getConnection(function(err, connection) {
		if (err) {
			console.log("Error: " + err);
			res.json({"code": 100, "status": "Error in connection database"});
			if (connection) {
				connection.release();
			}
			return;
		}

		console.log("Connected as: " + connection.threadId);

		var queryString =	"SELECT g.student_no, g.event_id, e.event_name, e.description, e.starttime, e.category, " +
	   						"e.loc_name, un.uni_name, us.email, e.weekly_event, r.rso_name, e.latitude, e.longitude " +
							"FROM goes_to g " +
							"INNER JOIN event e ON g.event_id = e.event_id " +
							"INNER JOIN user us ON e.admin_id = us.student_no " +
							"INNER JOIN university un ON us.uni_id = un.uni_id " +
							"LEFT JOIN rso r ON e.rso_id = r.rso_id " +
							"WHERE g.student_no = " + connection.escape(sess.userId);

		connection.query(queryString, function(err, rows) {
			connection.release();
			if (!err) {
				res.json(rows);
			}
			else {
				console.log('Get Joined Events error. Query did not run');
			}
		});

		connection.on('error', function(err) {
			console.log(err);
			res.json({"code" : 100, "status" : "Error in connection database"});
		});
	});
}

function getUniversities(req, res) {
	pool.getConnection(function(err, connection) {
		if (err) {
			console.log("Error: " + err);
			res.json({"code": 100, "status": "Error in connection database"});
			if (connection) {
				connection.release();
			}
			return;
		}

		console.log("Connected as: " + connection.threadId);

		var queryString = 'SELECT * FROM university';

		connection.query(queryString, function(err, rows) {
			connection.release();
			if (!err) {
				if (rows.length < 1) {
					res.json({"uni_name": "None available"});
				}
				else {
					res.json(rows);
				}
			}
		});

		connection.on('error', function(err) {
			console.log(err);
			res.json({"code" : 100, "status" : "Error in connection database"});
			return fn(new Error('database failed'));
		});
	});
}

function getRSOList(sess, req, res) {
	pool.getConnection(function(err, connection) {
		if (err) {
			console.log("Error: " + err);
			res.json({"code": 100, "status": "Error in connection database"});
			if (connection) {
				connection.release();
			}
			return;
		}

		console.log("Connected as: " + connection.threadId);

		var queryString =	'SELECT	r.rso_id, r.rso_name, us.email, un.uni_name ' +
							'FROM rso r ' +
							'INNER JOIN user us ON r.admin_id = us.student_no ' +
							'INNER JOIN university un ON us.uni_id = un.uni_id ' +
							'WHERE un.uni_id = ' + connection.escape(sess.univ) + ' ' +
							'ORDER BY r.rso_id ASC';

		if (sess.access === 'superadmin') {
			queryString =	'SELECT	r.rso_id, r.rso_name, us.email, un.uni_name ' +
							'FROM rso r ' +
							'INNER JOIN user us ON r.admin_id = us.student_no ' +
							'INNER JOIN university un ON us.uni_id = un.uni_id ' +
							'ORDER BY r.rso_id ASC';
		}
		connection.query(queryString, function(err, rows) {
			connection.release();
			if (!err) {
				if (rows.length < 1) {
					res.json([]);
				}
				else {
					res.json(rows);
				}
			}
		});

		connection.on('error', function(err) {
			console.log(err);
			res.json({"code" : 100, "status" : "Error in connection database"});
			return fn(new Error('database failed'));
		});
	});
}

function getCurrentRSOs(sess, req, res) {
	pool.getConnection(function(err, connection) {
		if (err) {
			console.log("Error: " + err);
			res.json({"code": 100, "status": "Error in connection database"});
			if (connection) {
				connection.release();
			}
			return;
		}

		console.log("Connected as: " + connection.threadId);

		var queryString =	'SELECT	j.rso_id, r.rso_name, us.email, un.uni_name ' +
							'FROM joins j ' +
							'INNER JOIN rso r ON j.rso_id = r.rso_id ' +
							'INNER JOIN user us ON r.admin_id = us.student_no ' +
							'INNER JOIN university un ON us.uni_id = un.uni_id ' +
							'WHERE j.student_no = ' + connection.escape(sess.userId) + ' ';

		connection.query(queryString, function(err, rows) {
			connection.release();
			if (!err) {
				if (rows.length < 1) {
					res.json([]);
				}
				else {
					res.json(rows);
				}
			}
		});

		connection.on('error', function(err) {
			console.log(err);
			res.json({"code" : 100, "status" : "Error in connection database"});
			return fn(new Error('database failed'));
		});
	});
}

function createEvent(sess, req, res) {
	pool.getConnection(function(err, connection) {
		if (err) {
			console.log("Error: " + err);
			res.json({"code": 100, "status": "Error in connection database"});
			if (connection) {
				connection.release();
			}
			return;
		}

		console.log("Connected as: " + connection.threadId);
		console.log('before query');
		console.log(sess.userId);

		var queryString =	"INSERT INTO event(event_name, description, starttime, type, category, loc_name, latitude, longitude, admin_id, weekly_event, rso_id) " +
							"VALUES(" + connection.escape(req.body.eventName) + ", " + connection.escape(req.body.desc) + ", " + connection.escape(req.body.startTime) + 
								", " + connection.escape(req.body.eventType) + ", " + connection.escape(req.body.category) + ", " + 
								connection.escape(req.body.loc) + ", " + connection.escape(req.body.latitude) + ", " + connection.escape(req.body.longitude) + 
								", " + connection.escape(sess.userId) + ", " + connection.escape(req.body.radio) + ", " + connection.escape(req.body.rso) + ");";

		if (req.body.rso === 'null') {
			queryString =	"INSERT INTO event(event_name, description, starttime, type, category, loc_name, latitude, longitude, admin_id, weekly_event) " +
							"VALUES(" + connection.escape(req.body.eventName) + ", " + connection.escape(req.body.desc) + ", " + connection.escape(req.body.startTime) + 
								", " + connection.escape(req.body.eventType) + ", " + connection.escape(req.body.category) + ", " + 
								connection.escape(req.body.loc) + ", " + connection.escape(req.body.latitude) + ", " + connection.escape(req.body.longitude) + 
								", " + connection.escape(sess.userId) + ", " + connection.escape(req.body.radio) + ");";
		}

		connection.query(queryString, function(err, rows) {
			connection.release();
			if (!err) {
				console.log('query executes');
				res.end('done');
				return;
			}
			console.log('query error');
			res.end('fail');
		});

		connection.on('error', function(err) {
			console.log(err);
			res.json({"code" : 100, "status" : "Error in connection database"});
			return fn(new Error('database failed'));
		});
	});
}

function getCurrentEvent(eventId, sess, req, res) {
		pool.getConnection(function(err, connection) {
		if (err) {
			console.log("Error: " + err);
			res.json({"code": 100, "status": "Error in connection database"});
			if (connection) {
				connection.release();
			}
			return;
		}

		console.log("Connected as: " + connection.threadId);
		console.log('before query');

		var queryString =	"SELECT	c.comment_id, c.comment, DATE_FORMAT(c.date, '%m/%d/%y %T') AS niceDate, us.email " +
							"FROM comment c " +
							"INNER JOIN user us ON c.student_no = us.student_no " +
							"WHERE c.event_id = " + connection.escape(eventId);

		connection.query(queryString, function(err, rows) {
			connection.release();
			if (!err) {
				console.log('worked');
				res.json(rows);
			}
			else {
				console.log(err);
			}
		});

		connection.on('error', function(err) {
			console.log(err);
			res.json({"code" : 100, "status" : "Error in connection database"});
		});
	});
}

function postComment(eventId, sess, req, res) {
		pool.getConnection(function(err, connection) {
		if (err) {
			console.log("Error: " + err);
			res.json({"code": 100, "status": "Error in connection database"});
			if (connection) {
				connection.release();
			}
			return;
		}
		console.log("Event id: " + eventId);
		console.log("Connected as: " + connection.threadId);
		var queryString =	"INSERT INTO comment(comment, date, student_no, event_id)" +
							"VALUES(" + connection.escape(req.body.comment) + ", NOW(), " +
							"(SELECT us.student_no FROM user us WHERE us.email = " + connection.escape(sess.email) + "), " +
							connection.escape(eventId) + ")";

		connection.query(queryString, function(err, rows) {
			connection.release();
			if (!err) {
				res.end('done');
			}
			else {
				console.log(err);
				res.end('fail');
			}
		});

		connection.on('error', function(err) {
			console.log(err);
			res.json({"code" : 100, "status" : "Error in connection database"});
		});
	});
}

function joinEvent(eventId, sess, req, res) {
	pool.getConnection(function(err, connection) {
		if (err) {
			console.log("Error: " + err);
			res.json({"code": 100, "status": "Error in connection database"});
			if (connection) {
				connection.release();
			}
			return;
		}
		console.log("Event id:" + eventId);
		console.log("Connected as: " + connection.threadId);

		var queryString =	"INSERT INTO goes_to(student_no, event_id) " +
							"VALUES((SELECT us.student_no FROM user us WHERE us.email = " + connection.escape(sess.email) +
							"), " + eventId + ")";

		console.log(queryString);

		connection.query(queryString, function(err, rows) {
			if (!err) {
				res.end('done');
				return;
			}
			else {
				if (err.code === 'ER_DUP_ENTRY') {
					res.end('duplicate');
				}
				console.log(err);
				res.end('fail');
			}
		});

		connection.on('error', function(err) {
			console.log(err);
			res.json({"code" : 100, "status" : "Error in connection database"});
		});
	});
}

function removeEvent(eventId, sess, req, res) {
pool.getConnection(function(err, connection) {
		if (err) {
			console.log("Error: " + err);
			res.json({"code": 100, "status": "Error in connection database"});
			if (connection) {
				connection.release();
			}
			return;
		}
		console.log("Event id:" + eventId);
		console.log("Connected as: " + connection.threadId);

		var queryString =	"DELETE FROM goes_to " +
							"WHERE student_no = " + connection.escape(sess.userId) + ' AND event_id = ' + eventId;

		console.log(queryString);

		connection.query(queryString, function(err, rows) {
			if (!err) {
				res.end('done');
			}
			else {
				console.log(err);
				res.end('fail');
			}
		});

		connection.on('error', function(err) {
			console.log(err);
			res.json({"code" : 100, "status" : "Error in connection database"});
		});
	});
}


app.use(express.static(__dirname + '/public'));

// Handle 404
app.use(function(req, res) {
	res.status(400);
	res.render('404');
});

app.use(function(req, res) {
	res.status(500);
	res.render('500');
});
  


portNumber = 3000;

app.listen(portNumber);

console.log("Listening on " + portNumber);