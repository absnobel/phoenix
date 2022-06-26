const path = require('path');
const express = require('express');
const { query } = require('express');
const requestIp = require('request-ip');
const moment = require('moment');
const fetch = require('node-fetch');
require('dotenv').config();
const { URLSearchParams } = require('url');
var cookieParser = require('cookie-parser');
const req = require('express/lib/request');
const mysql = require('mysql');
// Add the parameters

const con = mysql.createConnection({
    host: "localhost",
    user: "yourusername",
    password: "yourpassword",
    database: "mydb"
});

function asyncWrapper(fn) {
    return (req, res, next) => {
        return Promise.resolve(fn(req))
            .then((result) => res.send(result))
            .catch((err) => next(err))
    }
}

const app = express();
app.use(cookieParser());
app.use('', express.static(path.join(__dirname, 'public')));
app.use('', express.static(path.join(__dirname, 'assets')));

app.get('/', (request, response) => {
    return response.sendFile('index.html', { root: '.' });
});
app.get("/auth/discord", (req, res) => {
    return req.cookies["auth"] ? updateSecureLogs(req.cookies["auth"], req) && res.sendFile('dashboard.html', { root: '.' }) : res.redirect("https://discord.com/api/oauth2/authorize?client_id=967947489460236329&redirect_uri=http%3A%2F%2Flocalhost%3A53134%2Fauth%2Fdiscord%2Fcallback&response_type=code&scope=identify")
});
app.get('/auth/discord/callback', asyncWrapper(async function(request, response) {

    const code = request.query.code;
    // Make our POST body
    console.log(code);
    const params = new URLSearchParams();
    params.append('client_id', process.env.DISCORD_ID);
    params.append('client_secret', process.env.DISCORD_SECRET);
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', 'http://localhost:53134/auth/discord/callback');


    // POST that to Discord
    var site = await fetch("https://discord.com/api/oauth2/token", {
        method: 'POST',
        body: params,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    // And parse the response
    var response1 = await site.json();
    var accessToken = response1['access_token'];
    var discordme1 = await fetch("https://discord.com/api/oauth2/@me", {
        method: 'GET',

        headers: { 'Authorization': `Bearer ${accessToken}` },
    });

    response1 = await discordme.json();
    console.log(response1);
    const username = response1.user.username;
    const discordid = response1.user.id;
    const discrim = response1.user.discriminator;

    const clientIp = requestIp.getClientIp(request);
    const created = moment().format('YYYY-MM-DD/hh:mm:ss')
    console.log(clientIp);
    console.log(created);
    response.cookie('auth', accessToken).send('cookie set'); //Sets name = express
    // send in mysql stuff
    updateSecureLogs(accessToken, request)
    try {



        return response.sendFile('dashboard.html', { root: '.' })
    } catch (err) {
        return response.sendFile('index.html', { root: '.' })
    }
}));
let updateSecureLogs = function(accesstoken, req) {
    con.connect(async function(err) {
        if (err) throw err;
        console.log("Connected!");
        var query = "CREATE TABLE IF NOT EXISTS discordauth (username VARCHAR(255),userid varchar(255), minecraft varchar(255))";

        con.query(query, function(err, result) {
            if (err) throw err;
            console.log("1 record inserted");
        });
        query = "CREATE TABLE IF NOT EXISTS securelogs (userid VARCHAR(255),ipaddy varchar(255), dateloggedin datetime)";
        con.query(query, function(err, result) {
            if (err) throw err;
            console.log("1 record inserted");
        });




        var discordme = await fetch("https://discord.com/api/oauth2/@me", {
            method: 'GET',

            headers: { 'Authorization': `Bearer ${accesstoken}` },
        });
        response1 = await discordme.json();
        const discordid = response1.user.id;
        const username = response1.user.username;

        const discrim = response1.user.discriminator;
        var sql = "INSERT INTO discordauth (username, userid) VALUES ('" + username + "','" + discordid + "')";
        con.query(sql, function(err, result) {
            if (err) throw err;
            console.log("1 record inserted");
        });
        var sql = `INSERT INTO securelogs (userid, ipaddy, dateloggedin) VALUES ('${discordid}', '${req.connection.remoteAddress}', '${new Date().toISOString().slice(0, 19).replace('T', ' ')}')`;
        con.query(sql, function(err, result) {
            if (err) throw err;
            console.log("1 record inserted");
        });
    });
}
const port = '53134';
app.listen(port, () => console.log(`App listening at http://localhost:${port}`));