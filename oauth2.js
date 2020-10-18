
const API = 'https://discord.com/api';
const API_ME = API+'/users/@me';
const getConnectionsUrl = (username) => {return `${API}/users/@${username}/connections`};

const oauth2 = {
	client_id: config.client_id,
	client_secret: config.client_secret,
	grant_type: config.grant_type,
	code: config.code,
	redirect_uri: config.redirect_uri,
	scope: config.scope
};
let info = {};

const express = require('express');
const router = express.Router();
const path = require('path');
const app = express();
const PORT = 50451;

app.get('/', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/api/discord/callback', (req, res) => {
  
  let data = `client_id=${oauth2.client_id}&client_secret=${oauth2.client_secret}&grant_type=authorization_code&code=${oauth2.code}&redirect_uri=${config.redirect_uri}&scope=${oauth2.scope}`;
	let headers = {
		'Content-Type': 'application/x-www-form-urlencoded',
	}
	axios.post("https://discord.com/api/oauth2/token", data, {
		headers: headers
	}).then(response => {
		console.log(response);
		info = response.data;
	}).catch(error => {
		console.error("[oauth2.js]", error);
	});
  
	res.status(200).sendFile(path.join(__dirname, 'index.html'));
});

router.get('/login', (req, res) => {
  res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${config.client_id}&scope=${config.scope}&response_type=code&redirect_uri=${config.redirect_uri}`);
});
module.exports = router;

app.listen(PORT, () => {
	console.info('Running on port:', PORT);
});

/*
axios.get('https://discord.com/api/users/@me/connections', {
		headers: {authorization: `Bearer ${config.access_token}`}
	})
	.then(response => {
		console.log(response);
	})
	.catch(error => {
		console.error("[oauth2.js]", error);
	});
*/