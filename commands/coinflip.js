const reply = require('./reply');
const database = require('../database');
const {reducer} = require("../express/helper/helper");
const {getRandomInt} = require("../express/helper/helper");
const zbucks = require('./zbucks');
const _ = require("lodash");
const Discord = require('discord.js');

const EMPTY_ACCOUNT = {"id": null, "username": null, "server_id": null, "zbucks": 0};

const validate = (message, args) => {
    args = args.filter(arg => !Discord.MessageMentions.USERS_PATTERN.test(arg) && _.toNumber(arg));
    if (!args[0]) return reject(message);
    else return args;
};

const reject = (message) => {
    reply.to(message, message.author, 'Please enter a wager amount');
    return false;
};

const enter = (message, args) => {
    database.find('zbucks', {"id": message.author.id})
        .then(account => {
            console.log(account.zbucks, args[0]);
            if (account && account.zbucks >= _.toNumber(args[0])) {
                joinOrCreate(message, _.toNumber(args[0]))
                    .then(() => subtractFunds(message, args[0]).catch(error => Promise.reject(error)))
                    .catch(error => new Error(error))
            } else reply.to(message, message.author, 'Insufficient Funds.');
        })
        .catch(error => {
            console.log(error);
            reply.basic(message, error);
        });
};

let games = {};
const mins = 2;

const joinOrCreate = async(message, amount) => {
    return new Promise(async(resolve, reject) => {
        if (message.mentions.users.first()) {
            try {
                const gameHost = message.mentions.users.first();
                games[`${gameHost.id}`].game.push({id: message.author.id, username: message.author.username, wager: amount});
            } catch (e) {
                reject(`${message.author} Game does not exist.`);
            }
            console.log(message.mentions.users.first(), games)
        } else {
            games[`${message.author.id}`] = {
                game: [{id: message.author.id, username: message.author.username, wager: amount}],
                timer: Date.now()
            };
            console.log(games)
            const gameMessage = await message.channel.send(`\`\`\`\n Starting CoinFlip in ${mins}mins \n\`\`\``).then(m => m);
            setTimeout(() => startGame(gameMessage, message.author.id), 60000*mins);
        }
        resolve();
    });
};

const startGame = async(gameMessage, id) => {
    let i = 10;
    const interval = setInterval(()=>{
        gameMessage.edit(`\`\`\`\n Starting CoinFlip in ${i} \n\`\`\``).then(()=>{
            if(i--===0) {
                clearInterval(interval);
                declareWinner(gameMessage, id);
            }
        }).catch();
    }, 1000);
};

const declareWinner = (message, id) => {
    const {winner, amount} = randomItem(games[`${id}`]);
    message.edit(`\`\`\`\n And the winner is... \n\`\`\``).catch();
    setTimeout(()=>{
        message.edit(`\`\`\`\n ${winner.username}!!!  \n\`\`\``).catch();
        zbucks.add(message, winner, amount);
    }, 2000);
};

const randomItem = (itemsList) => {
    const wagers = itemsList.game.map(bet => bet.wager);
    const randNum = getRandomInt(0, wagers.reduce(reducer));
    const itemValue = itemsList.game.find((itemType, i) => (randNum <= wagers.slice(0, i+1).reduce(reducer)));

    console.log(itemValue, wagers.reduce(reducer));

    return {winner:itemValue,amount:wagers.reduce(reducer)};
};

const subtractFunds = (message, amount) =>
    database.addOrUpdate('zbucks', {"id": message.author.id}, {$inc: {"zbucks": (-1) * amount}})
        .then(result => {
            if (result) reply.to(message, message.author, `Entered into Coin-Flip w/ wager $${amount}`);
        })
        .catch(error => Promise.reject(error));

module.exports = {
    name: 'coinflip',
    description: 'Flip Coin',
    emptyAccount: EMPTY_ACCOUNT,
    execute(message, args) {
        args = validate(message, args);
        if (args.length) {
            enter(message, args);
        }
    }
};