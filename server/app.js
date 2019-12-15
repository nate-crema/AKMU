//module load
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const getIP = require('ipware')().get_ip;
const axios = require('axios');
const async = require('async');
const cheerio = require('cheerio');
// const Iconv = require('iconv').Iconv;
// const iconv = new Iconv('xml', 'utf-8');

const app = express();

//server open

const port = 80;
const ip_local = "localhost";
const ip_outward = "1.242.22.109";
const ip = ip_local;

const server = app.listen(port, ip, function() {
    console.log(`
        | Sullivan Project Server |
    
        Started server in port: ` + port + `
        Server Link: http://` + ip + `: ` + port + `
    `);
});



var date = new Date().getDate();

if (date < 10) {
    date = '0' + date;
}

var month = new Date().getMonth()+1;
if (month < 10) {
    month = '0' + month;
}

var hour = new Date().getHours();
if (hour < 10) {
    hour = '0' + hour;
}

var minute = new Date().getMinutes();
if (minute < 10) {
    minute = '0' + minute;
}

var second = new Date().getSeconds();
if (second < 10) {
    second = '0' + second;
}



const time = ''+new Date().getFullYear()+month+date + '-' + hour+minute+second;






//webpage route setting
app.set('views', path.join(__dirname, "../"));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.static(path.join(__dirname, "../")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());


//session setting
app.use(session({
    key: 'rsetyjregsw',
    secret: '!&^srjdthigrfeebsirgjhgfr765432*#$%^',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 60 * 60 * 24000
    }
}));

//router setting

var router = require('./router')(app, fs, path, getIP, axios, async, time, cheerio);

