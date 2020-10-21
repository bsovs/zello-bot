/***

const reply = require('./reply');
module.exports = {

    name: 'help',                    //change this to the command code
    description: 'Get Commands',    //change this to the command description

    execute(message, args) {
        // do stuff here
        // args is an array of words that came after the command ex. ['-set', 'sohozang']
        // don't touch message
        
        reply.basic(message, 'Your message to display goes here' );
    }
};


***/