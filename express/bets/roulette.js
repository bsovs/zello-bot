const database = require("../../database");
const {ErrorHandler} = require("../errors/errorHandler");
const {getRandomInt} = require('../helper/helper');
const {ROULETTE_SIZE} = require("../config/constants");

const roulette = (params, userData) => {
    const wheelNumber = getRandomInt(0, ROULETTE_SIZE);
    const didWin = (parseInt(params.betNumber) === wheelNumber);

    console.log(params, wheelNumber);

    return database.addOrUpdate('zbucks', {"id": userData.id}, {$inc: {"zbucks": calcWinnings(didWin, params.wager)}})
        .then(() => {
            return {"winningNumber": wheelNumber};
        })
        .catch(error => {
            throw new ErrorHandler(500, 'Internal Server Error')
        });
};

const calcWinnings = (didWin, wager) => {
    try {
        return ((didWin ? ROULETTE_SIZE : -1) * parseInt(wager));
    }catch(e){
        throw new ErrorHandler(500, e)
    }
};

module.exports = {
    roulette
}