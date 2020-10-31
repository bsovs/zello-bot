const request = require('request');
const oauth2 = require("../oauth/oauth2");
const database = require("../../database");
const {MULTIPLIER} = require("../config/constants");
const {safelyParseJSON} = require("../helper/helper");
const {RANKED_SOLO} = require("../config/constants");
const { RITO_KEY } = require('../config/constants'),
    {ErrorHandler} = require('../errors/errorHandler');

let betIdCache = [];
/*
betIdCache.push(betId);

const betIndex = betIdCache.findIndex(betId => betId == bet.bet_id);
betIdCache.splice(betIndex, 1);
 */

const checkBet = (req, res) => {
    const params = req.query;
    const betId = params && params.betId
    oauth2.getUserId(req, res, req.cookies.discord_token, req.cookies.discord_refresh_token)
        .then((data) => {
            if (data) {
                database.find('lol_bets', {"id": data.id, "bet_id": betId}).then(bet => {
                    if (bet && !bet.claimed && !betIdCache.find(_betId => _betId == betId)) {

                        const options = {
                            url: `https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/${bet.bet_specs.lol_id}?beginTime=${bet.bet_specs.bet_time}`,
                            timeout: 15000,
                            method: 'GET',
                            headers: {
                                "User-Agent": "node.js",
                                "X-Riot-Token": RITO_KEY
                            }
                        };
                        request(options, function (err, _res, body) {
                            if (body && _res.statusCode === 200) {
                                const matchData = safelyParseJSON(body);
                                const match = matchData && matchData.matches.reverse().find(_match => _match.queue === RANKED_SOLO);
                                if (match && match.timestamp >= bet.bet_specs.bet_time) {
                                    searchMatch(res, data, bet, match.gameId);
                                } else res.status(200).send({error: 'Match not played yet'});
                            } else res.status(200).send({error: 'Match not played yet'});
                        });
                    } else res.status(200).send({error: 'Bet Already Claimed'});
                })
                    .catch(error => {
                        res.status(500).send(error);
                    });
            } else res.status(404).send('No Account on File');
        })
        .catch(error => {
            res.status(401).send(error);
        });
};

const searchMatch = (res, userData, bet, gameId) => {
    const options = {
        url: `https://na1.api.riotgames.com/lol/match/v4/matches/${gameId}`,
        timeout: 15000,
        method: 'GET',
        headers: {
            "User-Agent": "node.js",
            "X-Riot-Token": RITO_KEY
        }
    };
    request(options, function (err, _res, body) {
        if (body && _res.statusCode === 200) {
            const matchData = safelyParseJSON(body);
            if (!matchData || !matchData.participantIdentities) {
                res.status(404).send('Match not found');
                return;
            }

            const participantIdentity = matchData.participantIdentities.find(p => p.player.accountId == bet.bet_specs.lol_id);
            const participant = matchData.participants.find(p => p.participantId == participantIdentity.participantId);

            const didWin = participant.stats.win == bet.bet_specs.is_win;

            database.findAndUpdate('lol_bets', {"bet_id": bet.bet_id, "claimed": false}, {$set: {"claimed": true}})
                .then((oldBet) => {
                    // TODO: copy over old bets to new database

                    if (didWin) {
                        database.addOrUpdate('zbucks', {"id": userData.id}, {$inc: {"zbucks": (MULTIPLIER * parseInt(bet.bet_specs.wager))}})
                            .catch(error => {
                                console.log(error);
                            });
                    }
                })
                .catch(error => {
                    console.log(error);
                });

            res.status(200).send({
                didWin: didWin,
                winnings: didWin ? ('+' + bet.bet_specs.wager) : ('-' + bet.bet_specs.wager)
            });
        } else res.status(200).send('Match Data Not Found');
    });
};


module.exports = {
    checkBet
}