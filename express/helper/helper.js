// helper methods
const safelyParseJSON = (json) => {
    let parsed = {}
    try {
        if (json != null) parsed = JSON.parse(json)
    } catch (e) {
        // Oh well, but whatever...
    }
    return parsed;
};

const stringToBool = (str) => (str == 'true');

const validateSetBetParams = (params) => {
    let valid = true;
    try {
        parseInt(params.wager);
    } catch (e) {
        valid = false
    }
    if (params.isWin != "true" && params.isWin != "false") valid = false;

    return valid;
};

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const reducer = (accumulator, currentValue) => accumulator + currentValue;

const isDefined = (obj) => (typeof obj !== 'undefined');

module.exports = {
    safelyParseJSON,
    stringToBool,
    validateSetBetParams,
    isDefined,
    getRandomInt,
    reducer
}