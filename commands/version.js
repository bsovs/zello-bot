const fetch = require('node-fetch');
const reply = require('./reply');

const getValue = (res) => {
	if(typeof res !== 'object' || res == null) return res;
	return Object.entries(res).map(entry => { const [key, value] = entry; return `${key}: ${value}`});
};
const getValues = (res) => {
	return Object.entries(res).map(entry => { const [key, value] = entry; return ({'name': key, 'value': getValue(value)})});
}

module.exports = {
	name: 'v',
	description: 'Version of Zello-Bot',
	execute(message) {
		fetch(global.URL+'/ping')
			.then(res => {return res.json()})
			.then(res => {
				const values = getValues(res.application);
				reply.table(message, values, false, 'Version Info:' )
			})
			.catch(error => console.log(error));
	}
};
