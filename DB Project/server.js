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

const connection=mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'library'
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

// login page
app.get('/', function(req, res) {
  res.render('pages/login');
});

// login page
app.get('/relogin', function(req, res) {
	res.render('pages/relogin');
});

//readers table page
app.get('/readers', function(req, res) {
	/* GET all safe foods */
	connection.query('SELECT * from readers', function (error, rows, fields) {
		if (error) {
			throw error;
		} else {
			res.render('pages/readers', {
				title: 'Readers Data Table',
				data: rows
			})
		}
	});
  });



//delete reader
app.post('/deleteReader', function(request,response){
	let index=request.body.id;
	connection.query('Delete from readers WHERE Id= ?', [index], function (error, rows, fields) {
		response.redirect('/readers');

	});
});

//add reader "page"
app.get('/addReader', function(req, res) {
	connection.query('Select Id from readers',function(error,result, fields){
		let max_index=result[result.length-1];
		res.render('pages/addReader',{
			index:max_index.Id+1
		});
	});
});

//insert the provided reader
app.post('/insertReader',function(request,response){
	let id=request.body.id;
	let name=request.body.name;
	let surname=request.body.surname;
	let birthday=request.body.birthday;
	if(id && name && surname && birthday){
		connection.query('INSERT INTO readers (Id, Name, Surname, Birthday) VALUES (?,?,?,?)',[id,name,surname,birthday], function(error, result,fields){
			response.redirect('/addReader');
		});
		connection.end;
	}
	else
	{
		response.send('Please make sure to fill all fields');
		response.end();
	}

});

//authors table
app.get('/authors', function(req, res) {
	/* GET all safe foods */
	connection.query('SELECT * from authors', function (error, rows, fields) {
		if (error) {
			throw error;
		} else {
			res.render('pages/authors', {
				title: 'Authors Data Table',
				data: rows
			})
		}
	});
  });



//delete author
app.post('/deleteAuthor', function(request,response){
	let index=request.body.id;
	connection.query('Delete from authors WHERE Id= ?', [index], function (error, rows, fields) {
		response.redirect('/authors');

	});
});

//add author"page"
app.get('/addAuthor', function(req, res) {
	connection.query('Select Id from authors',function(error,result, fields){
		let max_index=result[result.length-1];
		res.render('pages/addAuthor',{
			index:max_index.Id+1
		});
	});
});

//insert the provided author
app.post('/insertAuthor',function(request,response){
	let id=request.body.id;
	let name=request.body.name;
	let surname=request.body.surname;
	let birthday=request.body.birthday;
	if(id && name && surname && birthday){
		connection.query('INSERT INTO authors (Id, Name, Surname, Birthday) VALUES (?,?,?,?)',[id,name,surname,birthday], function(error, result,fields){
			response.redirect('/addAuthor');
		});
		connection.end;
	}
	else
	{
		response.send('Please make sure to fill all fields');
		response.end();
	}

});

//books table
app.get('/books', function(req, res) {
	/* GET all safe foods */
	connection.query('SELECT * from books', function (error, rows, fields) {
		if (error) {
			throw error;
		} else {
			res.render('pages/books', {
				title: 'Books Data Table',
				data: rows
			})
		}
	});
  });

//delete book
app.post('/deleteBook', function(request,response){
	let index=request.body.id;
	connection.query('Delete from books WHERE Id= ?', [index], function (error, rows, fields) {
		response.redirect('/books');

	});
});

//add book "page"
app.get('/addBook', function(req, res) {
	connection.query('Select Id from books',function(error,result, fields){
			if(result.length>0){
				let max_index=result[result.length-1];
		
			res.render('pages/addBook',{
				index:max_index.Id+1
			});
			}
			else{
				res.render('pages/addBook',{
					index:1
				});
			}
	});
});

//insert the provided author
app.post('/insertBook',function(request,response){
	let id=request.body.id;
	let title=request.body.title;
	let author_id=request.body.author_id;
	let year=request.body.year;
	if(id && title && author_id && year){
		connection.query('INSERT INTO books (Id, Title, Author_Id, Year) VALUES (?,?,?,?)',[id,title,author_id,year], function(error, result,fields){
			response.redirect('/addBook');
		});
		connection.end;
	}
	else
	{
		response.send('Please make sure to fill all fields');
		response.end();
	}

});

//login system
app.post('/auth', function(request, response) {
	let username = request.body.user;
	let password = request.body.password;
	if (username && password) {
		authconnection.query('SELECT * FROM login WHERE UserName = ? AND Password = ?', [username, password], function(error, results, fields) {
			if (error) throw error;
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/home');
			} else {
				response.redirect('/relogin');
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