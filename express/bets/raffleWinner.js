const database = require("../../database");
const {getRandomInt} = require("../helper/helper");
const {ErrorHandler} = require("../../commands/errors/errorHandler");

const getEntries = () => {
    return database.findAll('raffle', {})
        .then(users => users)
        .catch(() => Promise.reject(new ErrorHandler(500, 'Database Error')));
};

const getWinner = (id) => {
    return database.find('zbucks', {id: id})
        .then(user => user)
        .catch(() => Promise.reject(new ErrorHandler(500, 'Database Error')));
};

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async() => {
    /*
    console.log('\n Loading...');
    const entries = await getEntries();
    const tickets = entries.map(entry => entry.ticked_id);

    console.log('All Tickets:');
    await timeout(3000);
    console.log(tickets);
    await timeout(5000);

    console.log('\n ... calculating winner \n');

    const winning_ticket = tickets[getRandomInt(0, tickets.length-1)];
    //const winner = entries.find(entry => entry.ticked_id === winning_ticket);

    await timeout(10000);
    console.log('Winning Ticket ID:', winning_ticket);
    //await timeout(2000);
    */

    console.log('Winner:', await getWinner('144988313097338880'));
})();

