const express = require('express'), path = require('path'), health = require('express-ping'), 
	request = require('request'), cors = require('cors'), cookieParser = require('cookie-parser'), 
	bodyParser = require('body-parser');

const database = require('./database');
const oauth2 = require('./oauth2');

module.exports = {
start(app){
	const config = global.isLocal ? require("./ignore/config.json") : null;
	const API_URL = global.isLocal ? 'http://localhost:8000' : 'https://api200.herokuapp.com';

	const RITO_KEY = process.env.RITO_KEY || config.RITO_KEY;
	const ALLOW_ORIGIN = isLocal ? [`http://localhost:8080`, `http://localhost:3000`] : 'https://zellobot.herokuapp.com';
	
	errorMessage = (msg) => { return JSON.stringify({"error": `${msg}`}) };

	// usages
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: true}));
	app.use(cors({origin: ALLOW_ORIGIN}));
	app.use(cookieParser());
	app.use(health.ping());
	app.use(
		express.static(path.join(__dirname, 'build'))
	);
	
	// ouath2 routes
	oauth2.start(app);
	
	// pages
	app.get('/', (req, res) => {
		res.status(200).sendFile(path.join(__dirname, 'build', 'index.html'))
	});
	app.get('/login', (req, res) => {
		res.status(200).sendFile(path.join(__dirname, 'build', 'index.html'))
	});
	app.get('/lol-bets', (req, res) => {
		res.status(200).sendFile(path.join(__dirname, 'build', 'index.html'))
	});
	
	// -- http commands -- //
	
	// api200 userbase
	app.post('/token/', (req, res, next) => {
		const options = {
			url: API_URL + req.originalUrl,
			timeout: 15000,
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			formData: {
				username: req.body.username,
				password: req.body.password
			}
		};
		request(options, function(err, _res, body) {
			if(_res && _res.statusCode==200){
				const params = safelyParseJSON(body);
				res.cookie('jwt_token', params.access_token, {
					httpOnly: true,
					secure: true
				});
				res.sendStatus(200);
			}
			else res.sendStatus(400);
		});
	});
	
	app.get('/users/me', (req, res, next) => {
		auth(req).then((val)=>res.send(val)).catch(e=>res.send(e));
	});
	
	auth = (req) => new Promise((resolve, reject)=>{
		const options = {
			url: API_URL + '/users/me',
			timeout: 15000,
			method: 'GET',
			headers: {
				"Authorization": ("Bearer " + req.cookies.jwt_token)
			},
		};
		request(options, function(err, _res, body) {
			const parse = JSON.parse(body);
			resolve(parse);
		});
	});
	
	app.post('/signup/', (req, res, next) => {
		const options = {
			url: API_URL + req.originalUrl,
			timeout: 15000,
			method: 'POST'
		};
		request(options, function(err, _res, body) {
			const params = safelyParseJSON(body);
			if(_res && _res.statusCode==200){
				res.cookie('jwt_token', params.access_token, {
					httpOnly: true,
					secure: true
				});
				res.send(params);
			}
			else next(params);
		});
	});
	
	app.post('/logout/', (req, res, next) => {
		res.cookie('jwt_token', null, {maxAge: 0, httpOnly: true});
		res.sendStatus(200);
	});
	
	app.post('/lol/setBet', (req, res, next) => {
		if(!req.cookies || !req.cookies.discord_token){ res.status(401).send('Not Authorized'); return;}
		const params = req.query;
		const summoner = encodeURI(params.summoner);
		const wager = encodeURI(params.wager);
		const options = {
			url: `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summoner}`,
			timeout: 15000,
			method: 'GET',
			headers: {
				"User-Agent": "node.js",
				"X-Riot-Token": RITO_KEY
			}
		};
		request(options, function(err, _res, body) {
			if(body && body.accountId) setBet(body, params, req, res, next);
			else res.status(400).send(err);
		});
	});
	
	const setBet = (body, params, req, res, next) => {
		oauth2.getUserId(req, res, req.cookies.discord_token)
			.then((data)=>{
				database.find('zbucks', {"id": data.id}).then(account => {
					if(account){
						if(account.zbucks < params.wager || params.wager<=0){
							res.status(400).send('Invalid Wager Amount');
							return;
						}
						const lolParams = safelyParseJSON(body);
						const accountId = lolParams.accountId;
						const betTime = new Date().getTime();
						const betId = data.id+'_'+accountId+'_'+betTime+'_'+!!params.isWin;
						const betSpecs = {"bet_time": betTime, "account_id": accountId, "wager": params.wager, "is_win": !!params.isWin};
						
						database.add('lol_bets', {"id":  data.id, "username":  account.username, "bet_id": betId, "bet_specs": betSpecs}, {})
							.then(result => {
								let parsed = safelyParseJSON(body)
								parsed.betSpecs = betSpecs;
								
								database.addOrUpdate('zbucks', {"id": data.id}, {$inc:{"zbucks": parseInt(params.wager)*(-1)}}).then(result => {
									res.send(JSON.stringify(parsed));
								})
								.catch(error => {
									res.status(500).send(error);
								});
							})
							.catch(error => {
								res.status(500).send(error);
							});
					}
					else res.status(404).send('No Account on File');
				})
				.catch(error=>res.status(500).send(error));
			})
		.catch(error => {
			res.status(500).send(error);
		});
	}
	
	app.post('/lol/checkBet', (req, res, next) => {
		const params = req.query;
		const accountId = params.accountId;
		const userId = params.userId;
		const betId = params.betId;
		
		database.find('lol_bets', {"bet_id": betId}).then(bet => {
			if(bet){	
				const options = {
					url: `https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountId}?beginTime={bet.bet_time}`,
					timeout: 15000,
					method: 'GET',
					headers: {
						"User-Agent": "node.js",
						"X-Riot-Token": RITO_KEY
					}
				};
				request(options, function(err, _res, body) {
					if(body) res.send(body);
					else next(errorMessage(err));
				});
			}
			else next('error');
		})
		.catch(error => {
			next('error');
		});
	});
	
	
	// helper 
	safelyParseJSON = (json) => {
		let parsed = {}
		try {
			if(json != null) parsed = JSON.parse(json)
		} catch (e) {
		// Oh well, but whatever...
		}
		return parsed;
	}
}}