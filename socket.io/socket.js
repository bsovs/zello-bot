module.exports = {
	open(io){
		io.on('connection', (client) => {
	  
			console.log(`Connected: ${client.id}`); //sockets open
			client.emit('connected');
		
			client.on('disconnect', () => {
				try{
					console.log('\x1b[0m',`(SOCKET) Disconnected: (${client.id})`);
				}catch(err){console.error('\x1b[0m',err)}
			});
		  
		});
	}
}