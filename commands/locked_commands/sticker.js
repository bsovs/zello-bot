const {API_URL} = require("../../express/config/constants");

const reply = require('../reply');

module.exports = {
    excluded: true,
    name: 'sticker',
    description: 'Sticker Commands Found In Cases',
    execute(message, item) {
        const url = item.href.startsWith('/') ? API_URL + item.href : item.href;
        reply.image(message, url);
    }
};