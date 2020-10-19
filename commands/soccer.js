const fetch = require('node-fetch');
const reply = require('./reply');

const getValues = (res) => {
	let values = [{'name': 'Position', 'value': []}, {'name': 'Team', 'value': []}, {'name': 'Points', 'value': []}];
	(res).forEach(team => { 
		values[0]['value'].push(team.position);
		values[1]['value'].push(team.team.name);
		values[2]['value'].push(team.points);
	});
	return values;
}

module.exports = {
	name: 'soccer',
	description: 'PL Soccer Table',
	execute(message, args) {
		fetch('https://data-ui.football-data.org/fd/competitions/2021/table', {
			method: 'GET',
			headers: {
				'X-Auth-Token': '45e9db198a424221809993b4136d5042',
				'Accept-Encoding': ''
			}
		})
		.then(res => {return res.json()})
		.then(res => {
			if(res.status!=='success') return;
			const values = getValues(res.data);
			reply.table(message, values, true, 'Standings:' )
		})
		.catch(error => console.log(error));
	}
};