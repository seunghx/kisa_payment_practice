var express = require('express')
var app = express();
var request = require('request');
var path = require('path');
var mysql      = require('mysql');
var connectionPool = mysql.createPool({
  connectionLimit : 5,
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

//199003328057724253012100 계좌번호

app.post('/login', function(req, res){
    var id = req.body.id;
    var password = req.body.password;
    connectionPool.getConnection(function(err, conn){
        conn.query("SELECT * FROM kisapay.user WHERE userid = ?",[id], function(err, result){
            if(err){
                throw err;
            }
            else {
                var userData = result;
                console.log("login");
                res.json(userData);
                conn.release();

            }
        })
    })
})

app.get("/login", function(req, res){
    res.render('login');
})



app.get("/home", function(req, res){
    res.render('home');
})

app.post('/user',function(req, res){
    var accessToken = req.body.accessToken;
    var user_seq_no = req.body.userseqno
    var requestURL = "https://testapi.open-platform.or.kr/user/me?user_seq_no=" + user_seq_no;
    var option = {
        method : "GET",
        url : requestURL,
        headers : {
            "Authorization" : "Bearer " + accessToken
        }
    }
    request(option, function(err, response, body){
        obj = JSON.parse(body);
        res.json(obj);
    })
})

app.get('/amount', function(err, res){
    res.render('amount');
})

app.post('/balance',function(req, res){
    var accessToken = req.body.accessToken;
    var finusenum = req.body.finusenum;
    var requestURL = "https://testapi.open-platform.or.kr/v1.0/account/balance?fintech_use_num="+finusenum+"&tran_dtime=20190307101010";
    var option = {
        method : "GET",
        url : requestURL,
        headers : {
            "Authorization" : "Bearer " + accessToken
        }
    }
    request(option, function(err, response, body){
        var data = JSON.parse(body);
        res.json(data);
    })
})

app.get('/list',function(req, res){
    var accessToken = "927abc9b-b9d6-4e77-a651-fd10ee83e134";
    var requestURL = "https://testapi.open-platform.or.kr/v1.0/account/transaction_list";
    var qs = 
    "?fintech_use_num=199003328057724253012100" +
    "&inquiry_type=A"+
    "&from_date=20160101"+
    "&to_date=20160101"+
    "&sort_order=A"+
    "&page_index=00001"+
    "&tran_dtime=20190307101010"

    var option = {
        method : "GET",
        url : requestURL+qs,
        headers : {
            "Authorization" : "Bearer " + accessToken
        }
    }
    request(option, function(err, response, body){
        var data = JSON.parse(body);
        res.json(data);
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
