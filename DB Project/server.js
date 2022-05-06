const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');

var app = express();

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

const authconnection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'login'
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file
app.use(express.static(__dirname + '/public'));

app.use(express.static('views')); 

// index page
app.get('/home', function(req, res) {
  res.render('pages/index');
});

// about page
app.get('/about', function(req, res) {
  res.render('pages/about');
});

// login page
app.get('/', function(req, res) {
  res.render('pages/login');
});

app.post('/auth', function(request, response) {
	// Capture the input fields
	let username = request.body.user;
	let password = request.body.password;
	// Ensure the input fields exists and are not empty
	if (username && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		authconnection.query('SELECT * FROM login WHERE UserName = ? AND Password = ?', [username, password], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				request.session.loggedin = true;
				request.session.username = username;
				// Redirect to home page
				response.redirect('/home');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.listen(8080);
console.log('Server is listening on port 8080');