const path = require('path');

const SUMMONER_NAME = 'slurphy';

const data = require(path.join('C:/Users/brand/PycharmProjects/flaskProject/src/data/in', `${SUMMONER_NAME}_pyReady_data.json`));
for (const [key, value] of Object.entries(data)) {
    console.log(key, value.length)
}