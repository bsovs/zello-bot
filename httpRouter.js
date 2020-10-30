const express = require('express'), path = require('path'), health = require('express-ping'), 
	request = require('request'), cors = require('cors'), cookieParser = require('cookie-parser'), 
	bodyParser = require('body-parser'), router = express.Router();

const database = require('./database');
const oauth2 = require('./oauth2');

const MULTIPLIER = 2;
const RANKED_SOLO = 420;

module.exports = {
	
async start(app){
	
	// Start database 
	database.getClient().catch(error=>console.log(error));
	
	const config = global.isLocal ? require("./ignore/config.json") : null;
	const API_URL = global.isLocal ? 'http://localhost:8000' : 'https://api200.herokuapp.com';

	const RITO_KEY = process.env.RITO_KEY || config.RITO_KEY;
	const ALLOW_ORIGIN = isLocal ? [`http://localhost:8080`, `http://localhost:3000`] : 'https://zellobot.herokuapp.com';
	
	errorMessage = (msg) => { return JSON.stringify({"error": `${msg}`}) };

	// usages
	app.use('/', router);
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: true}));
	app.use(cors({origin: ALLOW_ORIGIN}));
	app.use(cookieParser());
	app.use(health.ping());
	app.use(
		express.static(path.join(__dirname, 'build'))
	);
	
	// ouath2 routes
	oauth2.start(app, router);
	
	// pages
	router.get('/', (req, res) => {
		res.status(200).sendFile(path.join(__dirname, 'build', 'index.html'));
	});
	router.get('/login', (req, res) => {
		res.redirect('/');
		//res.status(200).sendFile(path.join(__dirname, 'build', 'index.html'));
	});
	router.get('/bets', (req, res) => {
		res.status(200).sendFile(path.join(__dirname, 'build', 'index.html'));
	});
	router.get('/bets/lol-bets', (req, res) => {
		res.status(200).sendFile(path.join(__dirname, 'build', 'index.html'));
	});
	router.get('/bets/my-bets', (req, res) => {
		res.status(200).sendFile(path.join(__dirname, 'build', 'index.html'));
	});
	
	const oautRequired = (req, res) => {
		if(!req.cookies || !req.cookies.discord_token){
			if(req.cookies && req.cookies.discord_refresh_token) 
				oauth2.refreshToken(req, res, req.cookies.discord_refresh_token)
					.then(response => res.status(200).sendFile(path.join(__dirname, 'build', 'index.html')))
					.catch(error => res.redirect('/'));
			else {
				res.redirect('/');
			}
		}
		else res.status(200).sendFile(path.join(__dirname, 'build', 'index.html'));
	}
	
	// -- http commands -- //
	
	// api200 userbase ///////////////////////////////deprecated
	/*
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
	*/
	/////////////////////////////////////////////////////////////////
	
	app.get('/profile', (req, res, next) => {
		oauth2.getUserId(req, res, req.cookies.discord_token, req.cookies.discord_refresh_token)
			.then((data)=>{
				res.status(200).send(data);
			})
			.catch(error => {
				res.status(500).send(error);
			});
	});
	
	app.post('/lol/setBet', (req, res, next) => {
		if(!req.cookies || (!req.cookies.discord_token && !req.cookies.discord_refresh_token)){ res.status(401).send('Not Authorized'); return;}
		
		const params = req.query;
		if(!validateSetBetParams(params)){ res.status(400).send('Invalid Request'); return;}
		
		const summoner = encodeURI(params.summoner);
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
			console.log(body);
			if(body && _res.statusCode===200) setBet(body, params, req, res, next);
			else res.status(400).send(body);
		});
	});
	
	const setBet = (body, params, req, res, next) => {
		oauth2.getUserId(req, res, req.cookies.discord_token, req.cookies.discord_refresh_token)
			.then((data)=>{
				database.find('zbucks', {"id": data.id}).then(account => {
					if(account){
						if(!params.wager || account.zbucks < params.wager || params.wager<=0){
							res.status(400).send('Invalid Wager Amount');
							return;
						}
						console.log(params.isWin);
						params.isWin = stringToBool(params.isWin);
						
						const lolParams = safelyParseJSON(body);
						const betTime = new Date().getTime();
						const betId = data.id+'_'+lolParams.accountId+'_'+betTime+'_'+params.isWin;
						const betSpecs = {"bet_time": betTime, "lol_id": lolParams.accountId, "lol_name": lolParams.name, "wager": params.wager, "is_win": params.isWin};
						
						database.add('lol_bets', {"id":  data.id, "username":  account.username, "bet_id": betId, "claimed": false, "bet_specs": betSpecs}, {})
							.then(result => {
								let parsed = lolParams;
								parsed.betSpecs = betSpecs;
								
								console.log(parsed);
								
								database.addOrUpdate('zbucks', {"id": data.id}, {$inc:{"zbucks": parseInt(params.wager)*(-1)}}).then(result => {
									res.status(200).send(JSON.stringify(parsed));
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
	
	app.get('/lol/getBets', (req, res, next) => {
		oauth2.getUserId(req, res, req.cookies.discord_token, req.cookies.discord_refresh_token)
			.then((data)=>{
				database.findAll('lol_bets', {"id": data.id}).then(bets => {
					if(bets){
						res.status(200).send(JSON.stringify(bets));
					}
					else res.status(404).send('No Bets on File');
				})
				.catch(error=>res.status(500).send(error));
			})
		.catch(error => {
			res.status(401).send(error);
		});
	});
	
	app.get('/lol/getPopularBets', (req, res, next) => {
		oauth2.getUserId(req, res, req.cookies.discord_token, req.cookies.discord_refresh_token)
			.then((data)=>{
				getPopularBets(res);
			})
		.catch(error => {
			res.status(401).send(error);
		});
	});

	const getPopularBets = (res) => {
		const queryId = "$bet_specs.lol_id";
		const queryCommand = {"_id": queryId, "avg_wager": {$avg: {$toInt: "$bet_specs.wager"}}, "avg_is_win": {$avg: {$toInt: "$bet_specs.is_win"}}, "count": {$sum: 1}};
		database.groupAndSort('lol_bets', queryCommand)
			.then(bets => {
				if(bets){
					return transformToBet(res, bets);
				}
				else res.status(500).send('No Bets on File');
			})
			.catch(error => {res.status(500).send(error);});
	};
	
	const transformToBet = (res, bets) => {
		Promise.all(bets.map(bet => {
			return new Promise((resolve, reject) => {
				database.find('lol_bets', {"bet_specs.lol_id": bet._id})
					.then(account => {
						
					let newBet = 
						{
							id: "",
							username: "",
							bet_id: "",
							claimed: false,
							bet_specs: {
								bet_time: 0,
								lol_id: bet._id,
								lol_name: account && account.bet_specs.lol_name,
								wager: bet.avg_wager,
								is_win: (bet.avg_is_win >= 0.5)
							}
						}
						resolve(newBet);
					})
					.catch(error=>{reject(error)});
			});
		}))
		.then(_newBets => {
			res.status(200).send(JSON.stringify(_newBets));
		})
		.catch(error => {res.status(500).send(error);});
	};
	
	app.post('/lol/checkBet', (req, res, next) => {
		if(!req.cookies || (!req.cookies.discord_token && !req.cookies.discord_refresh_token)){ res.status(401).send('Not Authorized'); return;}
		const params = req.query;
		const betId = params && params.betId
		oauth2.getUserId(req, res, req.cookies.discord_token, req.cookies.discord_refresh_token)
			.then((data)=>{
				if(data){
					database.find('lol_bets', {"id": data.id, "bet_id": betId}).then(bet => {
						if(bet && !bet.claimed){	
							const options = {
								url: `https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/${bet.bet_specs.lol_id}?beginTime=${bet.bet_specs.bet_time}`,
								timeout: 15000,
								method: 'GET',
								headers: {
									"User-Agent": "node.js",
									"X-Riot-Token": RITO_KEY
								}
							};
							request(options, function(err, _res, body) {
								if(body && _res.statusCode===200) {
									const matchData = safelyParseJSON(body);
									const match = matchData && matchData.matches.reverse().find(match => match.queue == RANKED_SOLO);
									if(match && match.timestamp >= bet.bet_specs.bet_time){
										searchMatch(res, data, bet, match.gameId);
									}
									else res.status(200).send({error:'Match not played yet'});
								}
								else res.status(200).send({error:'Match not played yet'});
							});
						}
						else res.status(200).send({error:'Bet Already Claimed'});
					})
					.catch(error => {
						res.status(500).send(error);
					});
				}
				else res.status(404).send('No Account on File');
			})
			.catch(error => {
				res.status(401).send(error);
			});
	});
	
	searchMatch = (res, userData, bet, gameId) => {
		const options = {
			url: `https://na1.api.riotgames.com/lol/match/v4/matches/${gameId}`,
			timeout: 15000,
			method: 'GET',
			headers: {
				"User-Agent": "node.js",
				"X-Riot-Token": RITO_KEY
			}
		};
		request(options, function(err, _res, body) {
			if(body && _res.statusCode===200) {
				const matchData = safelyParseJSON(body);
				if(!matchData || !matchData.participantIdentities){res.status(404).send('Match not found'); return;}
				
				const participantIdentity = matchData.participantIdentities.find(p => p.player.accountId == bet.bet_specs.lol_id);
				const participant = matchData.participants.find(p => p.participantId == participantIdentity.participantId);
				
				const didWin = participant.stats.win==bet.bet_specs.is_win;
				
				if(didWin){
					database.addOrUpdate('zbucks', {"id": userData.id}, {$inc:{"zbucks": (MULTIPLIER*parseInt(bet.bet_specs.wager))}})
						.catch(error => {console.log(error);});
				}
				database.addOrUpdate('lol_bets', {"bet_id": bet.bet_id}, {$set:{"claimed": true}})
					.then((oldBet)=>{
						// copy over old bets to new database
					})
					.catch(error => {console.log(error);});
				
				res.status(200).send({didWin: didWin, winnings: didWin ? ('+'+bet.bet_specs.wager) : ('-'+bet.bet_specs.wager)});
			}
			else res.status(200).send('Match Data Not Found');
		});
	}
	
	// helper methods
	safelyParseJSON = (json) => {
		let parsed = {}
		try {
			if(json != null) parsed = JSON.parse(json)
		} catch (e) {
		// Oh well, but whatever...
		}
		return parsed;
	}
	
	stringToBool = (str) => (str == 'true');
	
	validateSetBetParams = (params) => {
		let valid = true;
		try{
			parseInt(params.wager);
		}catch(e){ 
			valid = false 
		}
		if(params.isWin != "true" || params.isWin != "false") valid = false;
		
		return valid;
	}
	
	isDefined = (obj) => (typeof obj !== 'undefined');
}}
