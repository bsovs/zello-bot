const database =  require('../../database'),
    request = require('request');
const oauth2 = require("../oauth/oauth2");
const {getOdds} = require("./odds");
const {safelyParseJSON} = require("../helper/helper");
const {stringToBool} = require("../helper/helper");
const { RITO_KEY } = require('../config/constants'),
    { validateSetBetParams } = require('../helper/helper'),
    {ErrorHandler} = require('../errors/errorHandler');

const setBet = (req, res) => {
    return summonerSearch(req, res);
};

const summonerSearch = (req, res) => {
    const params = req.query;

    if (!validateSetBetParams(params)) {
        throw new ErrorHandler(500, 'Invalid Parameters');
    }

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

    return new Promise((resolve, reject) =>
        request(options, function (err, _res, body) {
            console.log(body);
            if (body && _res.statusCode === 200)
                findAndValidate(body, params, req, res)
                    .then(data => resolve(data))
                    .catch(error => reject(error));
            else reject(new ErrorHandler(500, 'Error finding summoner'));
        })
    );
};

const findAndValidate = (body, params, req, res) => {
    return oauth2.getUserId(req, res, req.cookies.discord_token, req.cookies.discord_refresh_token)
        .then((data) => {
            return database.find('zbucks', {"id": data.id}).then(account => {
                if (account) {
                    if (!params.wager || account.zbucks < params.wager || params.wager <= 0) {
                        throw new ErrorHandler(400, 'Invalid Wager Amount');
                    }

                    return getOdds({query: {summonerName: params.summoner}})
                        .then(_odds => updateDatabase(data, account, body, params, _odds))
                        .catch(error => error);

                } else throw new ErrorHandler(404, 'No Account On File');
            })
                .catch(error => {throw new ErrorHandler(500, 'error3')});
        })
        .catch(error => {
            throw new ErrorHandler(500, 'error4');
        });
};

const updateDatabase = (userData, zbucksAccount, body, params, betOdds) => {
    params.isWin = stringToBool(params.isWin);
    const lolParams = safelyParseJSON(body);
    const betTime = new Date().getTime();
    const betId = userData.id + '_' + lolParams.accountId + '_' + betTime + '_' + params.isWin;
    const betSpecs = {
        "bet_time": betTime,
        "lol_id": lolParams.accountId,
        "lol_name": lolParams.name,
        "wager": params.wager,
        "is_win": params.isWin,
        "bet_odds": JSON.parse(betOdds)
    };

    return database.add('lol_bets', {
        "id": userData.id,
        "username": zbucksAccount.username,
        "bet_id": betId,
        "claimed": false,
        "bet_specs": betSpecs
    }, {})
        .then(result => {
            let parsed = lolParams;
            parsed.betSpecs = betSpecs;

            return database.addOrUpdate('zbucks', {"id": userData.id}, {$inc: {"zbucks": parseInt(params.wager) * (-1)}})
                .then(() => {
                    return JSON.stringify(parsed);
                })
                .catch(error => {
                    throw new ErrorHandler(500, 'error1');
                });
        })
        .catch(error => {
            throw new ErrorHandler(500, 'error2');
        });
};


module.exports = {
    setBet
}