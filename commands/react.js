const {getRandomInt} = require("../express/helper/helper");
module.exports = {
    name: 'react',
    description: 'Add random emoji to message',
    execute(message, args) {
        const emojis = message.guild.emojis.cache.map(_emoji => _emoji.id);
        const emoji = emojis[getRandomInt(0, emojis.length-1)];
        message.react(emoji);
    }
};