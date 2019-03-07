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

app.get('/authResult', function(req, res){
    var auth_code = req.query.code
    var getTokenUrl = "https://testapi.open-platform.or.kr/oauth/2.0/token";
    var option = {
        method : "POST",
        url :getTokenUrl,
        headers : {
            "Content-Type" : "application/x-www-form-urlencoded; charset=UTF-8"
        },
        form : {
            code : auth_code,
            client_id : "l7xx5f2432095adb49f9a8d05adf9dc09f9b",
            client_secret : "d1480b0ce9484dd38b436f48ba1cfb42",
            redirect_uri : "http://localhost:3000/authResult",
            grant_type : "authorization_code"
        }
    };
    request(option, function(err, res, body){
        if(err) throw err;
        else {
            console.log(body);
        }
    })
    console.log(auth_code);
})

app.get('/signup', function(req, res){
    res.render('signup');
})

app.listen(3000)
