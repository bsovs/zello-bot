const express = require('express'), path = require('path'), health = require('express-ping'),
    cors = require('cors'), cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'), router = express.Router();

const { HOME_PATH } = require('./config/constants');

const database = require('../database');
const oauth2 = require('./oauth/oauth2');
const {getKeysAndCases} = require("./bets/caseItems");
const {openCase} = require("./bets/caseItems");
const {getKeys} = require("./bets/caseItems");
const {getCaseItems} = require("./bets/caseItems");
const {cache} = require("./helper/cache");
const {getOdds} = require("./bets/odds");
const {bankList} = require("./zbucks/bankList");
const {roulette} = require("./bets/roulette");
const { handleError, ErrorHandler } = require('./errors/errorHandler')
const { ALLOW_ORIGIN } = require('./config/constants')
const { checkBet } = require('./bets/checkBet');
const { setBet } = require('./bets/setBet');
const { popularBets } = require('./bets/popularBets');
const cronJob = require('./helper/cronJob');
const {buyKeys} = require("./bets/caseItems");

const start = function (app) {

    // start database
    database.getClient().catch(error => console.log(error));

    // -- middleware -- //

    app.use('/', router);
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(cors({origin: ALLOW_ORIGIN}));
    app.use(cookieParser());
    app.use(health.ping());
    app.use(
        express.static(path.join(HOME_PATH, 'build'))
    );

    // oauth2 routes
    oauth2.start(app, router);

    // start crons
    cronJob.startCrons();

    // -- pages routes -- //

    router.get('/', (req, res) => {
        res.status(200).sendFile(path.join(HOME_PATH, 'build', 'index.html'));
    });
    router.get('/login', (req, res) => {
        res.redirect('/');
        //res.status(200).sendFile(path.join(HOME_PATH, 'build', 'index.html'));
    });
    router.get('/bets', (req, res) => {
        res.status(200).sendFile(path.join(HOME_PATH, 'build', 'index.html'));
    });
    router.get('/bets/lol-bets', (req, res) => {
        res.status(200).sendFile(path.join(HOME_PATH, 'build', 'index.html'));
    });
    router.get('/bets/my-bets', (req, res) => {
        res.status(200).sendFile(path.join(HOME_PATH, 'build', 'index.html'));
    });
    router.get('/bets/roulette', (req, res) => {
        res.status(200).sendFile(path.join(HOME_PATH, 'build', 'index.html'));
    });
    router.get('/items', (req, res) => {
        res.status(200).sendFile(path.join(HOME_PATH, 'build', 'index.html'));
    });
    router.get('/items/cases', (req, res) => {
        res.status(200).sendFile(path.join(HOME_PATH, 'build', 'index.html'));
    });

    // -- http commands -- //

    app.get('/error', (req, res, next) => {
        throw new ErrorHandler(501, 'error message');
    });

    app.get('/profile', (req, res, next) => {
        oauth2.getUserId(req, res, req.cookies.discord_token, req.cookies.discord_refresh_token)
            .then((data) => {
                res.status(200).send(data);
            })
            .catch((error) => {
                next(error);
            });
    });

    app.post('/lol/setBet', (req, res, next) => {
        if (!req.cookies || (!req.cookies.discord_token && !req.cookies.discord_refresh_token)) {
            throw new ErrorHandler(401, 'Not Authorized');
        }
        else setBet(req, res).then(data => res.status(200).send(data)).catch(error => {console.log(error);next(error)});
    });

    app.get('/lol/getBets', (req, res, next) => {
        oauth2.getUserId(req, res, req.cookies.discord_token, req.cookies.discord_refresh_token)
            .then((data) => {
                database.findAll('lol_bets', {"id": data.id}).then(bets => {
                    if (bets) {
                        res.status(200).send(JSON.stringify(bets));
                    } else res.status(404).send('No Bets on File');
                })
                    .catch(error => res.status(500).send(error));
            })
            .catch((code, error) => {
                res.status(code).send(error);
            });
    });

    app.get('/lol/getPopularBets', (req, res, next) => {
        oauth2.getUserId(req, res, req.cookies.discord_token, req.cookies.discord_refresh_token)
            .then((data) => {
                popularBets().then(data => res.status(200).send(data)).catch(error => next(error));
            })
            .catch((error) => next(error));
    });

    app.get('/lol/get-odds', cache(3600), (req, res, next) => {
        oauth2.getUserId(req, res, req.cookies.discord_token, req.cookies.discord_refresh_token)
            .then((data) => {
                getOdds(req).then(_data => res.status(200).send(_data)).catch(error => next(error));
            })
            .catch((error) => next(error));
    });

    app.get('/zbucks/getBankList', (req, res, next) => {
        oauth2.getUserId(req, res, req.cookies.discord_token, req.cookies.discord_refresh_token)
            .then((data) => {
                bankList().then(data => res.status(200).send(data)).catch(error => next(error));
            })
            .catch((error) => next(error));
    });

    app.post('/lol/checkBet', (req, res, next) => {
        if (!req.cookies || (!req.cookies.discord_token && !req.cookies.discord_refresh_token)) {
            res.status(401).send('Not Authorized');
            return;
        }
        checkBet(req, res);
    });

    app.post('/bets/roulette', (req, res, next) => {
        if (!req.cookies || (!req.cookies.discord_token && !req.cookies.discord_refresh_token)) {
            throw new ErrorHandler(401, 'Not Authorized')
        }
        else {
            oauth2.getUserId(req, res, req.cookies.discord_token, req.cookies.discord_refresh_token)
                .then((userData) => {
                    roulette(req.query, userData).then(_data => res.status(200).send(_data)).catch(error => next(error));
                })
                .catch((error) => next(error));
        }
    });

    app.get('/bets/case-items', cache(30), (req, res, next) => {
        getCaseItems().then(_data => res.status(200).send(_data)).catch(error => next(error));
    });

    app.get('/bets/keys', (req, res, next) => {
        if (!req.cookies || (!req.cookies.discord_token && !req.cookies.discord_refresh_token)) {
            throw new ErrorHandler(401, 'Not Authorized')
        }
        else {
            oauth2.getUserId(req, res, req.cookies.discord_token, req.cookies.discord_refresh_token)
                .then((userData) => {
                    getKeysAndCases(userData).then(_data => res.status(200).send(_data)).catch(error => next(error));
                })
                .catch((error) => next(error));
        }
    });

    app.post('/bets/open-case', (req, res, next) => {
        if (!req.cookies || (!req.cookies.discord_token && !req.cookies.discord_refresh_token)) {
            throw new ErrorHandler(401, 'Not Authorized')
        }
        else {
            oauth2.getUserId(req, res, req.cookies.discord_token, req.cookies.discord_refresh_token)
                .then((userData) => {
                    openCase(userData).then(_data => res.status(200).send(_data)).catch(error => next(error));
                })
                .catch((error) => next(error));
        }
    });

    app.post('/bets/buy-keys', (req, res, next) => {
        if (!req.cookies || (!req.cookies.discord_token && !req.cookies.discord_refresh_token)) {
            throw new ErrorHandler(401, 'Not Authorized')
        }
        else {
            oauth2.getUserId(req, res, req.cookies.discord_token, req.cookies.discord_refresh_token)
                .then((userData) => {
                    buyKeys(userData).then(_data => res.status(200).send(_data)).catch(error => next(error));
                })
                .catch((error) => next(error));
        }
    });

    // error handler middleware --must be last
    app.use((err, req, res, next) => {
        console.log(err);
        handleError(err, res);
    });
};

module.exports = {
    start
}
