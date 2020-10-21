/***

const reply = require('./reply');

module.exports = {

    name: 'example',                //change this to the command code. right now it is activated by typing !example
    description: 'An Example',      //change this to the command description

    execute(message, args) {
        
		// do stuff here
        // args is an array of words that came after the command ex. ['-set', 'sohozang']
        // message variable is used to get properties from the message. learn more at https://discord.js.org/#/docs/main/stable/class/Message
        
        reply.basic(message, 'Your message to display goes here' );
		
		//check out reply.js for list of available reply methods
    }
};


***/