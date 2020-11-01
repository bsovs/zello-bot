const request = require('request');
const database = require("../../database");
const cache = require("../helper/cache");
const {RANKED_SOLO_QUEUE_TYPE} = require("../config/constants");
const {setSummonerData} = require("./summonerData");
const {safelyParseJSON} = require("../helper/helper");
const {RITO_KEY} = require('../config/constants');
const {ErrorHandler} = require('../errors/errorHandler');

const getOdds = (req) => {
    const params = req.query;
    const summonerName = String(params.summonerName).toLowerCase();

    const cachedOdds = cache.getCachedValue('__odds__'+summonerName);

    if (cachedOdds){
        return new Promise(resolve => resolve(cachedOdds));
    }else {
        return database.find('lol_summoner', {"name": summonerName})
            .then(summoner => {
                if (summoner && summoner.id) {
                    return getLeagueDataAndOdds(summoner.id, summonerName);
                } else {
                    return setSummonerData(params.summonerName)
                        .then(summonerData => getLeagueDataAndOdds(summonerData.id, summonerName))
                        .catch(error => error);
                }
            })
            .catch(error => {
                throw new ErrorHandler(500, 'Database Error');
            });
    }
};

const getLeagueDataAndOdds = (summonerId, summonerName) => {
    const options = {
        url: `https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}`,
        timeout: 15000,
        method: 'GET',
        headers: {
            "User-Agent": "node.js",
            "X-Riot-Token": RITO_KEY
        }
    };
    return new Promise((resolve, reject) =>
        request(options, function (err, _res, body) {
            if (body && _res.statusCode === 200) {
                const leagueData = safelyParseJSON(body);
                const rankedSoloData = leagueData.find(league => league.queueType === RANKED_SOLO_QUEUE_TYPE)
                const odds = rankedSoloData && calculateOdds(rankedSoloData);
                if (odds && rankedSoloData) {

                    const returnBody = JSON.stringify(oddsTransformer(odds, rankedSoloData.summonerName));
                    cache.setCachedValue('__odds__'+summonerName, returnBody, 3600);
                    resolve(returnBody);

                } else reject(new ErrorHandler(404, 'Summoner Not Ranked'));
            } else reject(new ErrorHandler(404, 'Summoner League Not Found'));
        })
    );
};

const oddsTransformer = (odds, summonerName) => {
    return {
        "odds": odds,
        "return": calcReturn(odds),
        "payout": calcSpread(odds),
        "summonerName": summonerName
    };
};

const calcReturn = (odds) => 1/odds;

const calcSpread = (odds) => {
    const sign = odds > 0.5 ? (-1) : 1;
    if(sign > 0) return Math.round(100 * calcReturn(odds) - 100);
    else return Math.round(sign * 100 / (calcReturn(odds) - 1));
}

const calculateOdds = (summonerLeagueData) => {
    try {
        const gamesPlayed = summonerLeagueData.wins + summonerLeagueData.losses;
        return summonerLeagueData.wins / gamesPlayed;
    } catch (e) {
        return null;
    }
};


module.exports = {
    getOdds
}