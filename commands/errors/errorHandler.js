class ErrorHandler extends Error {
    constructor(message) {
        super();
        this.message = message;
    }
}

const errorMessage = (message, error) => {
    const errorMsg = error ? `${error}` : '';
    message.reply(`there was an error trying to execute that command! \n ${errorMsg}`)
        .catch(e => console.log(e));
}

module.exports = {
    ErrorHandler,
    errorMessage
}