const path = require('path');
const express = require('express');
const util = require('util');
const { query } = require('express');
const requestIp = require('request-ip');
const moment = require('moment');
const fetch = require('node-fetch');
require('dotenv').config();
const { URLSearchParams } = require('url');
var cookieParser = require('cookie-parser');
const req = require('express/lib/request');
const mysql = require('mysql');
var bodyParser = require('body-parser');
const jsdom = require("jsdom");
const multer  = require('multer')
const uploadCapes = multer({ dest: 'capes/',filefilter: function fileFilter (req, file, cb) {

    // The function should call `cb` with a boolean
    // to indicate if the file should be accepted
    const dimensions = sizeOf(file.buffer);
    try{switch(dimensions.width){
        case 64:
            case 128:
                case 32:
                    case 2048:
                        cb(null, true);
                        break;
                        default:
                        cb(null,false);
    }
}catch{
    cb(new Error('I don\'t have a clue!'))
  
}
  
    // You can always pass an error if something goes wrong:
    
  } })
const minecraftPlayer = require("minecraft-player");
const sizeOf = require('image-size');
// Add the parameters
var session = require('express-session')
var app = express()
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'alliisdabest',
    resave: false,
    saveUninitialized: true,
    cookie: {}
}))

const con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "1Er5t73j",
    database: "phoenix"
});

con.connect();
const dbquery = util.promisify(con.query).bind(con);
app.use(cookieParser());
app.use(bodyParser.json())
app.use('', express.static(path.join(__dirname, 'public')));
app.use('', express.static(path.join(__dirname, 'assets')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/pages', function(req, res, next) {
    if (req.session.loggedin) {
        //check that mc username link exists for user if accessing capes/cosmetics
        const accesstoken = req.cookies["auth"];
    fetch("https://discord.com/api/oauth2/@me", {
        method: 'GET',

        headers: { 'Authorization': `Bearer ${accesstoken}` },
    }).then(res=>res.json()).then(response1=>
{
     const discordid = response1.user.id;
     try{
        var query = "SELECT  minecraft, capes, cosmetics from discordauth where userid=?";
    
            con.query(query,[discordid], function(err, result) {
                if (err) throw err;
                console.log(result[0]);
                if(result[0].minecraft)
                next();
                else
                res.sendFile('dashboard/pages/settings.html', { root: '.' });
            });
        }catch(err){res.send(err);}  
    }); 
    } else {
        // require the user to log in
        res.redirect("/");
    }
}, express.static(path.join(__dirname, 'dashboard/pages')));

app.get('/', (request, response) => {
    return response.sendFile('index.html', { root: '.' });
});
app.get("/auth/discord", (req, res) => {
    if (req.cookies["auth"]) {
        updateSecureLogs(req.cookies["auth"], req);
        req.session.loggedin = true;
        res.redirect('/dashboard');
    } else res.redirect("https://discord.com/api/oauth2/authorize?client_id=967947489460236329&redirect_uri=http%3A%2F%2Flocalhost%3A53134%2Fauth%2Fdiscord%2Fcallback&response_type=code&scope=identify")
});
app.get('/dashboard', (req, res) => {
    if (req.session.loggedin) {
        res.sendFile('dashboard.html', { root: 'dashboard/pages' });
    } else
        res.sendFile('index.html', { root: '.' });
});
app.post("/save", function(req,res)
{
    const accessToken = req.cookies["auth"];
    
    UpdateUser(req.body.username, req.body.disablecapes, req.body.disablecosmetics, accessToken);

});
app.get("/settings", async function(req,res){
    const accesstoken = req.cookies["auth"];
    var discordme = await fetch("https://discord.com/api/oauth2/@me", {
        method: 'GET',

        headers: { 'Authorization': `Bearer ${accesstoken}` },
    });

    response1 = await discordme.json();
    console.log(response1);
    const username = response1.user.username;
    const discordid = response1.user.id;
    //minecraft varchar(255), capes boolean, cosmetics boolean
    try{
    var query = "SELECT  minecraft, capes, cosmetics from discordauth where userid=?";

        con.query(query,[discordid], function(err, result) {
            if (err) throw err;
            res.send(JSON,stringify(result[0]));
        });
    }catch(err){res.send(err);}   
});

app.get("/minecraftimg/:username", async function(req,res){
    try{
    const username = req.params.username;
    const playerss = await fetch(`https://minecraftuuid.com/?search=${username}`)
    .then(response => response.text())
  .then(text => {
    const parser = new jsdom.JSDOM(text);
    //const htmlDocument = parser.parseFromString(text, "text/html");
    const section = parser.window.document.querySelector("#Player-Images img");
    
    //const  player =await minecraftPlayer(username);
    res.send(section.src);
  });
    }catch(err){res.send("error: "+err.message);}
})
app.get("/me", async function(req, res) {
    const accesstoken = req.cookies["auth"];
    var discordme = await fetch("https://discord.com/api/oauth2/@me", {
        method: 'GET',

        headers: { 'Authorization': `Bearer ${accesstoken}` },
    });

    response1 = await discordme.json();
    console.log(response1);
    const username = response1.user.username;
    const discordid = response1.user.id;
    const discrim = response1.user.discriminator;
    try{
        var query = "SELECT  minecraft, capes, cosmetics from discordauth where userid=?";
    
            con.query(query,[discordid], function(err, result) {
                if (err) throw err;
                res.send(JSON.stringify({ username: username, discrim: discrim, me: result[0] }));
                
            });
        }catch(err){res.send(err);}   
   
})
app.get('/auth/discord/callback', async function(request, response, next) {
    try {
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
        var discordme = await fetch("https://discord.com/api/oauth2/@me", {
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
        response.cookie('auth', accessToken); //Sets name = express
        request.session.loggedin = true;
        // send in mysql stuff
        await updateSecureLogs(accessToken, request)
            //        response.sendFile('dashboard.html', { root: '.' });
        response.redirect('/dashboard');



    } catch (err) {
        console.log(err.message);
        response.sendFile('index.html', { root: '.' });
    }
});
let FindUserByID = async(userid) => {
    return new Promise((resolve, reject) => {
        var query = "select * from discordauth where userid=?";

        con.query(query, [userid], function(err, result) {

            if (err) return reject(err);
            return resolve(result[0]);
        });
    })
}
let CreateUser = async(userid, username) => {
    return new Promise((resolve, reject) => {
        var query = "CREATE TABLE IF NOT EXISTS discordauth (username VARCHAR(255),userid varchar(255), minecraft varchar(255), capes boolean, cosmetics boolean)";

        con.query(query, function(err, result) {
            if (err) throw err;
            var sql = "INSERT INTO discordauth (username, userid) VALUES (?,?)";
            con.query(sql, [username, userid], function(err, result) {
                if (err) return reject(err);
                return resolve(result);

            });
        });

    })
}
let UpdateUser = async (username, disableCapes, disableCosmetics,accessToken)=>{
    //ensure columns exist
    var chksql = "SELECT COUNT(*) as count FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'discordauth' AND  COLUMN_NAME = 'capes'";
    let colExists = await dbquery(chksql);
        console.log(colExists[0].count);
        if(!colExists[0].count)
{
     chksql = "alter table discordauth  add column capes boolean, add column cosmetics boolean";
     const createsql = await dbquery(chksql)
}
    var discordme = await fetch("https://discord.com/api/oauth2/@me", {
        method: 'GET',

        headers: { 'Authorization': `Bearer ${accessToken}` },
    });
    response1 = await discordme.json();
    const discordid = response1.user.id;
    var sql = `update discordauth set username=?, capes=?, cosmetics=? where userid=?`;
    con.query(sql,[username, !disableCapes, !disableCosmetics,discordid], function(err, result) {
        if (err) throw err;
        console.log("1 record inserted");
    });
}

let updateSecureLogs = async function(accesstoken, req) {


    console.log("Connected!");

    let query = "CREATE TABLE IF NOT EXISTS securelogs (userid VARCHAR(255),ipaddy varchar(255), dateloggedin datetime)";
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
    //verify user exists if not create it
    const TheUser = await FindUserByID(discordid) || null;
    if (!TheUser) {
        await CreateUser(discordid, username);
    }
    var sql = `INSERT INTO securelogs (userid, ipaddy, dateloggedin) VALUES ('${discordid}', '${req.connection.remoteAddress}', '${new Date().toISOString().slice(0, 19).replace('T', ' ')}')`;
    con.query(sql, function(err, result) {
        if (err) throw err;
        console.log("1 record inserted");
    });

};

app.use('/cosmetics', express.static('cosmetics'))


app.get('/users/:username.cfg', async (req, res) => {
  const { username } = req.params

  let cosmetics;

  if (!cachedUsersCosmetics.has(username))  {
    const maybeUser = usersStore.find(u => u.username === username);

    if (maybeUser === undefined)
      return res.sendStatus(404);

  ({ cosmetics } = maybeUser);
 cachedUsersCosmetics.set(maybeUser.username, cosmetics)
  } else {
    cosmetics = cachedUsersCosmetics.get(username);
  }

  res.json({
    items: cosmetics.map(cos =>
      ({
        type: cos,
        model: `cosmetics/${cos}/model.cfg`,
        texture: `cosmetics/${cos}/texture.png`,
         active: 'true',
      })
    )
  })
})

app.use('/capes', express.static('capes'));
app.post('/capes', uploadCapes.single('fileupload'), function (req, res, next) {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
   
  })
app.get('/capes/:username.png', async (req, res) => {
    const { username } = req.params;
  
    const maybeUser = usersStore.find(u => u.username === username);

    if (maybeUser === undefined)
      return res.sendStatus(404);
 
    res.json({
        items: capes.map(cos => {
            return {
                type: cos,
                texture: `capes/${maybeUser.username}/texture.png`,
                active: 'true',
            }
        }),
    });
});
const port = '53134';
app.listen(port, () => console.log(`App listening at http://localhost:${port}`));