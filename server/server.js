let express = require('express');
let session = require('express-session');
let parser = require('body-parser');
let crypto = require('crypto');
let bcrypt = require('bcrypt');
let path = require('path');
let http = require('http');
let https = require('https');
let fs = require('fs');

let Mongo = require('mongodb').MongoClient;
let ObjectID = require('mongodb').ObjectID;


// App configs
let app = express();
let dbURL = "mongodb://localhost:27017";
let SECRET = require('./res/SECRET.js');

let middleWare = session({
    secret : SECRET.cookie_secret,
    saveUninitialized : true,
    resave: false,
    cookie : {
        path: '/',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7 , //One week cookie lifetime
        secure: true
    }
});

app.use(express.static('static'));
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../server/views'));
app.use(parser.urlencoded({extended: true}));
app.use(middleWare);

// server and router (http to https) declaration and configuration
let server = https.createServer({
    key: fs.readFileSync('./server/cert.key'),
    cert: fs.readFileSync('./server/cert.crt'),
    passphrase: SECRET.server_passphrase
}, app).listen(443);

http.createServer((req, res)=>{
    res.writeHead(301, {"Location": "https://" + req.headers['host'] + req.url});
    res.end();
}).listen(80);

// noinspection JSIgnoredPromiseFromCall
Mongo.connect(dbURL, {useUnifiedTopology: true}, (err, db)=>{
    if(err) {
        console.log("****** ERROR ******\n");
        throw err;
    }else {
        console.log( "------  CONNECTED ------\n");

        app.get('/', (req, res) => {
            res.render('index.ejs');
        });

        app.get('/*', (req, res)=>{
            res.render('error.ejs')
        })
    }
});