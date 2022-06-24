const path = require('path');
const express = require('express');
const { query } = require('express');
const requestIp = require('request-ip');
const moment = require('moment');
const fetch = require('node-fetch');
require('dotenv').config();
const { URLSearchParams } = require('url');

// Add the parameters




const app = express();

app.use('',express.static(path.join(__dirname, 'public')));
app.use('',express.static(path.join(__dirname, 'assets')));

app.get('/', (request, response) => {
	return response.sendFile('index.html', { root: '.' });
});

app.get('/auth/discord', async (request, response) => {
	const code = request.query.code;
	 // Make our POST body
	 console.log(code);
	 const params = new URLSearchParams();
params.append('client_id', process.env.DISCORD_ID);
params.append('client_secret', process.env.DISCORD_SECRET);
params.append('grant_type', 'authorization_code');
params.append('code', code);
params.append('redirect_uri', 'http://localhost:53134/auth/discord');

	
    // POST that to Discord
    var site = await fetch("https://discord.com/api/oauth2/token", {
        method: 'POST',
        body: params,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    });

    // And parse the response
    var response1 = await site.json();
    var accessToken = response1['access_token'];
	console.log(response1);
	var discordme = await fetch("https://discord.com/api/oauth2/@me", {
        method: 'GET',
        
        headers: {'Authorization': `Bearer ${accessToken}`},
    });
	response1 = await discordme.json();
	console.log(response1);
	const username = response1.user.username;
	const discordid = response1.user.id;
	const discrim = response1.user.discriminator;

	const clientIp = requestIp.getClientIp(request);
	const created = moment().format('YYYY-MM-DD/hh:mm:ss')
	console.log(clientIp);
	console.log(created)
	return response.sendFile('dashboard.html', { root: '.' })
  });

const port = '53134';
app.listen(port, () => console.log(`App listening at http://localhost:${port}`));