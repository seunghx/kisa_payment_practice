var express = require('express')
var app = express();
var request = require('request');
var path = require('path');
var mysql = require('mysql');
app.use(express.urlencoded());
app.use(express.json());

app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs'); 

app.use(express.static('public'));
 
app.get('/index', function(req, res){
    res.render('home');
})

app.get('/signup', function(req, res){
    res.render('signup');
})

app.listen(3000)
