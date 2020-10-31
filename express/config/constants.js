const MULTIPLIER = 2;
const RANKED_SOLO = 420;

const API_URL = process.env.PORT ? 'http://localhost:8000' : 'https://api200.herokuapp.com';

const RITO_KEY = process.env.RITO_KEY || require("../../ignore/config.json").RITO_KEY;
const ALLOW_ORIGIN = global.isLocal ? [`http://localhost:8080`, `http://localhost:3000`] : 'https://zellobot.herokuapp.com';

const HOME_PATH = __dirname + '/../../';

const ROULETTE_SIZE = 32;

module.exports = {
    MULTIPLIER,
    RANKED_SOLO,
    API_URL,
    RITO_KEY,
    ALLOW_ORIGIN,
    HOME_PATH,
    ROULETTE_SIZE
}