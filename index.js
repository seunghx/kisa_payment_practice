var express = require('express')
var app = express();
var request = require('request');
var path = require('path');
var mysql = require('mysql');
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'q1w2e3r4',
  database : 'kisapay'
}); 

app.use(express.urlencoded());
app.use(express.json());

app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs'); 

app.use(express.static('public'));
 
app.get('/index', function(req, res){
    res.render('home');
})
connection.connect();
 
app.post('/join', function(req, res){
    var name = req.body.name;
    var password = req.body.password;
    var id = req.body.id;
    var accessToken = req.body.accessToken;
    var refreshToken = req.body.refreshToken;
    var useseqnum = req.body.useseqnum;
    var sql = "INSERT INTO user (userid, userpassword, username, accessToken, refreshToken, useseqnum) VALUES (?,?,?,?,?,?)"
    connection.query(sql,[id, password, name, accessToken, refreshToken, useseqnum ], function (error, results, fields) {
        if (error) throw error;
        else {
            res.json(1)
        }
      });    
})

app.get('/user',function(req, res){
    var accessToken = "927abc9b-b9d6-4e77-a651-fd10ee83e134";
    var requestURL = "https://testapi.open-platform.or.kr/user/me?user_seq_no=1100034736";
    var option = {
        method : "GET",
        url : requestURL,
        headers : {
            "Authorization" : "Bearer " + accessToken
        }
    }
    request(option, function(err, response, body){
        res.send(body);
    })
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
    request(option, function(err, response, body){
        if(err) throw err;
        else {
            console.log(body);
            var accessRequestResult = JSON.parse(body);
            res.render('resultChild', {data : accessRequestResult});
        }
    })
    console.log(auth_code);
})

app.get('/signup', function(req, res){
    res.render('signup');
})

app.listen(3000)
