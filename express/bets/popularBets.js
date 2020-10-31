const database = require('../../database'),
    {ErrorHandler} = require('../errors/errorHandler');

const popularBets = () => {
    const queryId = "$bet_specs.lol_id";
    const queryCommand = {
        "_id": queryId,
        "avg_wager": {$avg: {$toInt: "$bet_specs.wager"}},
        "avg_is_win": {$avg: {$toInt: "$bet_specs.is_win"}},
        "count": {$sum: 1}
    };
    return database.groupAndSort('lol_bets', queryCommand)
        .then(bets => {
            if (bets) {
                return transformToBet(bets);
            } else throw new ErrorHandler(500, 'No Bets on File');
        })
        .catch(error => {
            throw new ErrorHandler(500, error);
        });
};

const transformToBet = (bets) => {
    return Promise.all(bets.map(bet => {
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
                .catch(error => {
                    reject(error)
                });
        });
    }))
        .then(_newBets => {
            return(JSON.stringify(_newBets));
        })
        .catch(error => {
            throw new ErrorHandler(500, error);
        });
};

module.exports = {
    popularBets
}