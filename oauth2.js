
const API = 'https://discord.com/api';
const API_ME = API+'/users/@me';
const getConnectionsUrl = (username) => {return `${API}/users/@${username}/connections`};

const express = require('express'), path = require('path'), health = require('express-ping'), 
	request = require('request'), cors = require('cors'), cookieParser = require('cookie-parser'), 
	bodyParser = require('body-parser'), router = express.Router(), axios = require('axios');;

module.exports = {
start(app){
	const oauth2 = {
		client_id: (process.env.PORT ? '767053379700129813' : '767448946728632371'),
		client_secret: (process.env.CLIENT_SECRET || require("./ignore/config.json").client_secret),
		redirect_uri: (process.env.PORT ? 'https://zellobot.herokuapp.com' : 'http://localhost:8080'),
		scope: "identify connections"
	};
	let info = {};

	app.use('/', router);

	app.get('/api/discord/callback', (req, res) => {
		const params = req.query;
		console.log(params);
		if(req.data) {
			return;
		}
		else{
			res.redirect(global.URL + '/api/discord/oauth_callback?code='+String(params.code));
		}
		//req.originalUrl
		//res.status(200).sendFile(path.join(__dirname, 'index.html'));
	});

	router.get('/api/discord/oauth_callback', (req, res) => {
		const params = req.query;
		let data = `client_id=${oauth2.client_id}&client_secret=${oauth2.client_secret}&grant_type=authorization_code&code=${params.code}&redirect_uri=${oauth2.redirect_uri}/api/discord/callback&scope=${oauth2.scope}`;
		let headers = {
			'Content-Type': 'application/x-www-form-urlencoded',
		}
		axios.post("https://discord.com/api/oauth2/token", data, {
			headers: headers
		}).then(response => {
			console.log(response.data);
			info = response.data;
			
			res.cookie('discord_token', info.access_token, {
				httpOnly: true,
				maxAge: (new Date(Date.now()+info.expires_in))
			});
			res.cookie('discord_refresh_token', info.refresh_token, {
				httpOnly: true
			});	
			res.cookie('JWT', true, {});
			
			module.exports.getUserId(req, res, info.access_token)
				.then(data=>res.redirect(global.URL + '/?id=' + data.id))
				.catch(error=>res.redirect(global.URL + '/?error='+error));
		}).catch(error => {
			console.error("[oauth2.js]", error);
		});
	});

	router.get('/api/discord', (req, res) => {
		console.log(req.cookies);
		if(!req.cookies || !req.cookies.discord_token || req.cookies.discord_token.maxAge < Date.now()){
			if(req.cookies && req.cookies.discord_refresh_token) refreshToken(req, res, req.cookies.discord_refresh_token);
			else {
				res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${oauth2.client_id}&scope=${oauth2.scope}&response_type=code&redirect_uri=${oauth2.redirect_uri}/api/discord/callback`);
			}
		}
		res.status(200).redirect('/lol-bets');
	});
	
	refreshToken = async(req, res, access_token) => {
		let data = `client_id=${oauth2.client_id}&client_secret=${oauth2.client_secret}&grant_type=refresh_token&refresh_token=${access_token}`;
		let headers = {
			'Content-Type': 'application/x-www-form-urlencoded',
		}
		axios.post("https://discord.com/api/oauth2/token", data, {
			headers: headers
		}).then(response => {
			console.log(response.data);
			info = response.data;
			res.cookie('discord_token', info.access_token, {
				httpOnly: true,
				maxAge: (new Date(Date.now()+info.expires_in))
			});
			res.cookie('discord_refresh_token', info.refresh_token, {
				httpOnly: true
			});
			res.cookie('JWT', true, {});
		}).catch(error => {
			console.error("[oauth2.js]", error);
			res.redirect(req.originalUrl);
		});
	}
},

	getUserId(req, res, access_token){
		return new Promise((resolve, reject)=>{
			axios.get('https://discord.com/api/users/@me', {
				headers: {'authorization': `Bearer ${access_token}`}
			})
			.then(response => {
				console.log(response.data);
				resolve(response.data);
			})
			.catch(error => {
				console.error("[oauth2.js]", error);
				reject(error);
			});
		});
	}

}
	