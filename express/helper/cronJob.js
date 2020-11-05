const {giveCases} = require("../bets/caseItems");

const startCron = (func, timeInSeconds) => {
    return setInterval(func, timeInSeconds*1000)
};
const stopCron = (chron) => {
    clearInterval(chron);
};

const startCrons = () => {

    startCron(giveCases, 7200);

};

module.exports = {
    startCron,
    stopCron,
    startCrons
}