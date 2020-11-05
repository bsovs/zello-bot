const database = require("../../database");
const {addKeysAndCases} = require("./caseItems");
const {ErrorHandler} = require("../errors/errorHandler");
const {getRandomInt} = require('../helper/helper');
const {ROULETTE_SIZE} = require("../config/constants");

const roulette = (params, userData) => {
    const wheelNumber = getRandomInt(0, ROULETTE_SIZE);

    const winnings = calcWinnings(wheelNumber, params.betNumber, params.wager);
    console.log(userData.username, params, '#'+wheelNumber, '$'+winnings);

    if (wheelNumber === 0 &&  parseInt(params.wager) >= 20) addKeysAndCases(userData, 1, 0).catch(e => {console.log(e)});

    return database.addOrUpdate('zbucks', {"id": userData.id}, {$inc: {"zbucks": winnings}})
        .then(() => {
            return {"winningNumber": wheelNumber, "winnings": winnings, "didWin": (winnings>0)};
        })
        .catch(error => {
            throw new ErrorHandler(500, 'Internal Server Error')
        });
};

const colorToInt = (color) => color === "Red" ? 0 : 1;

const calcWinnings = (wheelNumber, betNumber, wager) => {
    try {
        if ((betNumber === "Red" || betNumber === "Black")) {
            const didWin = (wheelNumber !== 0) ? (colorToInt(betNumber) === (wheelNumber%2)) : false;
            return ((didWin ? 1 : -1) * parseInt(wager));
        }
        else {
            const didWin = (wheelNumber !== 0) && (parseInt(betNumber) === wheelNumber);
            return ((didWin ? ROULETTE_SIZE : -1) * parseInt(wager));
        }
    }catch(e){
        throw new ErrorHandler(500, 'Invalid Params')
    }
};

module.exports = {
    roulette
}