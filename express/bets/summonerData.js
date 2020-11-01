const database = require("../../database");
const request = require('request');
const {safelyParseJSON} = require("../helper/helper");
const {ErrorHandler} = require("../errors/errorHandler");
const {RITO_KEY} = require("../config/constants");

const setSummonerData = (summonerName) => {
    return summonerSearch(summonerName).then(summonerData =>
        database.addOrUpdate('lol_summoner', {"name": summonerName},
            {$set: {"name": summonerName, "id": summonerData.id, "accountId": summonerData.accountId, "puuid": summonerData.puuid, "level": summonerData.summonerLevel}})
            .then(() => {
                return summonerData;
            })
            .catch(error => {
                throw new ErrorHandler(500, 'Database Error');
            }))
        .catch(error => error)
};

const summonerSearch = (summonerName) => {
    const summoner = encodeURI(summonerName);
    const options = {
        url: `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summoner}`,
        timeout: 15000,
        method: 'GET',
        headers: {
            "User-Agent": "node.js",
            "X-Riot-Token": RITO_KEY
        }
    };

    console.log('Search For: ', summonerName);

    return new Promise((resolve, reject) =>
        request(options, function (err, _res, body) {
            console.log(body);
            if (body && _res.statusCode === 200) {
                const json = safelyParseJSON(body);
                json != null ? resolve(json) : reject(new ErrorHandler(500, 'JSON Parsing Error'));
            }
            else reject(new ErrorHandler(500, 'Error finding summoner'));
        })
    );
};

module.exports = {
    setSummonerData
}