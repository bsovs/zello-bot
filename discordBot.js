const database = require("./database");
const Discord = require("discord.js");
const fs = require('fs');
const {errorMessage} = require("./commands/errors/errorHandler");
const {authUse} = require("./commands/locked_commands/authUse");

const start = () => {

    const client = new Discord.Client();

    const prefix = "!";

    //setup commands
    client.commands = new Discord.Collection();
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
    let commandList = [];
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        if (command.name) {
            client.commands.set(command.name, command);
            if (!command.excluded) commandList.push({'name': command.name, 'description': command.description});
        }
    }

    //locked commands
    client.lockedCommands = new Discord.Collection();
    database.findAll('case_items', {})
        .then(itemsList => {
            itemsList.forEach(item => {
                if (item.name && item.command) {
                    client.lockedCommands.set(item.name.toLowerCase(), require(`./commands/locked_commands/${item.command}`));
                }
            });
        })
        .catch(error => console.log(error));

    //bot commands
    client.botCommands = new Discord.Collection();
    const botCommandFiles = fs.readdirSync('./bot_commands').filter(file => file.endsWith('.js'));
    let botCommandList = [];
    for (const file of botCommandFiles) {
        const command = require(`./bot_commands/${file}`);
        if (command.name) {
            client.botCommands.set(command.name, command);
            botCommandList.push({'name': command.name, 'description': command.description});
        }
    }

    //on message do
    client.on("message", function (message) {
        if (message.webhookID) message.fetchWebhook().then(res => {
            try {
                client.botCommands.get(message.author.username).execute(message)
            } catch {
            }
        });
        if (message.author.bot) return;

        if(message.attachments.size > 0)
            database.add('images', {'url': message.attachments.array()[0].url});

        if (!message.content.startsWith(prefix)) return;

        const commandBody = message.content.slice(prefix.length);
        const args = commandBody.split(' ').filter(arg => arg !== '');
        const command = args.shift().toLowerCase();

        if (client.commands.has(command)) {
            try {
                if (command === 'help') {
                    client.commands.get(command).execute(message, commandList);
                } else {
                    client.commands.get(command).execute(message, args);
                }
            } catch (error) {
                errorMessage(message, error)
            }
        } else if (client.lockedCommands.has(command)) {
            authUse(message.author, command)
                .then(item => {
                    console.log(item);
                    client.lockedCommands.get(command).execute(message, item)
                })
                .catch(error => errorMessage(message, error));
        }
    });
    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
    });

    //Start bot
    client.login(process.env.BOT_TOKEN || require("./ignore/config.json").BOT_TOKEN_DEV).catch(e => console.log(e));

}

module.exports = {
    start
}
