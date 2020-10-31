const database = require("../../database");
const {ErrorHandler} = require("../errors/errorHandler");
const {getRandomInt} = require('../helper/helper');
const {ROULETTE_SIZE} = require("../config/constants");

const roulette = (params, userData) => {
    const wheelNumber = getRandomInt(0, ROULETTE_SIZE-1);

    const winnings = calcWinnings(wheelNumber, params.betNumber, params.wager);
    console.log(userData.username, params, '#'+wheelNumber, '$'+winnings);

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
            return ((didWin ? 2 : -1) * parseInt(wager));
        }
        else {
            const didWin = (parseInt(betNumber) === wheelNumber);
            return ((didWin ? ROULETTE_SIZE : -1) * parseInt(wager));
        }
    }catch(e){
        throw new ErrorHandler(500, 'Invalid Params')
    }
};

module.exports = {
    roulette
}