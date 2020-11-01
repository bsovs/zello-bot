const MULTIPLIER = 2;
const RANKED_SOLO = 420, RANKED_FLEX = 440;
const RANKED_SOLO_QUEUE_TYPE = "RANKED_SOLO_5x5";

const API_URL = process.env.PORT ? 'http://localhost:8000' : 'https://api200.herokuapp.com';

const RITO_KEY = process.env.RITO_KEY || require("../../ignore/config.json").RITO_KEY;
const ALLOW_ORIGIN = global.isLocal ? [`http://localhost:8080`, `http://localhost:3000`] : 'https://zellobot.herokuapp.com';

const HOME_PATH = __dirname + '/../../';

const ROULETTE_SIZE = 32;

module.exports = {
    MULTIPLIER,
    RANKED_SOLO,
    RANKED_FLEX,
    RANKED_SOLO_QUEUE_TYPE,
    API_URL,
    RITO_KEY,
    ALLOW_ORIGIN,
    HOME_PATH,
    ROULETTE_SIZE
}