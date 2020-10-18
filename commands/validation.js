module.exports = {
	hasError(error) {
		if(error) console.log(error);
		return !!error;
	},
	tryTo(callback) {
		try{
			return callback();
		}catch(error){console.log(error)}
	}
};
