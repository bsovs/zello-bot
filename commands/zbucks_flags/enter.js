const reply = require('../reply');
const database = require('../../database');
const {getRandomInt} = require("../../express/helper/helper");

module.exports = {
    name: 'enter',
    description: 'Buy a raffle ticket for 250 z-bucks.',
    claimAmount: 250,
    execute(message, args, parent) {
        const claimAmount = module.exports.claimAmount;
        database.find('zbucks', {"id": message.author.id}).then(account => {
            if (!account) account = parent.newAccount(message);
            if (account.zbucks >= claimAmount) {
                database.addOrUpdate('zbucks', {"id": account.id}, {$inc: {"zbucks": (-1) * claimAmount}})
                    .then(result => {
                        if (result) {
                            const ticket_id = account.id + '_' + String(Math.round(Math.random() * 10000)) + '_' + String(Date.now());
                            database.add('raffle', {"id": account.id, "ticked_id": ticket_id})
                                .then(_result => {
                                    if (_result) {
                                        const emojis = message.guild.emojis.cache.map(_emoji => _emoji.id);
                                        const emoji = emojis[getRandomInt(0, emojis.length-1)];
                                        message.react(emoji);
                                        reply.direct.embed(message, 'Raffle Entered', `Ticket ID: ${ticket_id}`,
                                            'https://discordapp.com/channels/766804341439856670/766804341439856673/775445505476001792',
                                            'Bank of Zello ©', false);
                                    }
                                })
                                .catch(error => {
                                    console.log(error);
                                    reply.error(message, `Failed to enter ${account.id} into the raffle!`, null);
                                });
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        reply.error(message, `Failed to Add ${claimAmount} Z-Bucks`, null);
                    });
            } else reply.to(message, `Account: ${account.id} has insufficient funds.`);
        })
            .catch(error => {
                console.log(error);
                reply.error(message, `Failed to find z-bucks for ${message.author}. Database Fetch Error.`, null);
            });
    }
};