const {safelyParseJSON} = require("../helper/helper");
const request = require('request');
const {RITO_KEY} = require("../config/constants");

const findId = (summoner) => {
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
            const summonerDate = safelyParseJSON(body);
            if (body && _res.statusCode === 200) resolve(summonerDate.accountId);
            else reject(new Error('No Summoner Found'));
        })
    );
};

const findMatches = (accountId, startIndex) => {
    const options = {
        url: `https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountId}?beginIndex=${startIndex}&queue=420&queue=440`,
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
                const matchData = safelyParseJSON(body);
                const matches = matchData.matches;
                if (matches) {
                    resolve(matches);
                } else resolve(null);
            }
        })
    );
};

const searchMatch = (match, accountId) => {
    const options = {
        url: `https://na1.api.riotgames.com/lol/match/v4/matches/${match.gameId}`,
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
                const matchData = safelyParseJSON(body);
                if (!matchData || !matchData.participantIdentities) {
                    resolve(null);
                }

                const participantIdentity = matchData.participantIdentities.find(p => p.player.accountId === accountId);
                const participant = matchData.participants.find(p => p.participantId === participantIdentity.participantId);

                Object.assign(match, participant.stats, participant.timeline);
                delete participant.stats && delete participant.timeline;
                Object.assign(match, participant);

                console.log('done:', match.gameId);

                resolve(match);

            } else {
                console.log(new Error('Match Data Not Found'), body);
                resolve(null);
            }
        }));
};

module.exports = {
    findId,
    findMatches,
    searchMatch
}
