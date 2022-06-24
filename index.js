const path = require('path');
const express = require('express');
const { query } = require('express');
const requestIp = require('request-ip');
const moment = require('moment');

require('dotenv').config();




const app = express();

app.use('',express.static(path.join(__dirname, 'public')));
app.use('',express.static(path.join(__dirname, 'assets')));

app.get('/', (request, response) => {
	return response.sendFile('index.html', { root: '.' });
});

app.get('/auth/discord', async (request, response) => {
	const origurl = request.query.code;
	 // Make our POST body
	 var body = {
        'client_id': DISCORD_ID,
        'client_secret': DISCORD_SECRET,
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': 'https://example.com/redirect',
    };

    // POST that to Discord
    var site = await fetch("https://discord.com/api/oauth2/token", {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    });

    // And parse the response
    var response = await site.json();
    var accessToken = response['access_token'];
	
	var discordme = await fetch("https://discord.com/api/oauth2/@me", {
        method: 'GET',
        
        headers: {'Bearer': accessToken},
    });
	response = await discordme.json();
	const username = response.user.username;
	const discordid = response.user.id;
	const discrim = response.user.discriminator;

	const clientIp = requestIp.getClientIp(request);
	const created = moment().format('YYYY-MM-DD/hh:mm:ss')
	console.log(clientIp);
	console.log(created)
	return response.sendFile('dashboard.html', { root: '.' })
  });

const port = '53134';
app.listen(port, () => console.log(`App listening at http://localhost:${port}`));