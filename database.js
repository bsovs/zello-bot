const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;

const DB_PASS = process.env.DB_PASS || require('./ignore/secret.json').DB_PASS;

module.exports = {
	name: 'mongodb',
	description: 'Connect to MongoDB',
	connect(){
		const uri = `mongodb+srv://sovranb:${DB_PASS}@cluster0.ovjzi.mongodb.net/Cluster0?retryWrites=true&w=majority`;
		const client = new MongoClient(uri, { useNewUrlParser: true });
		return new Promise((resolve, reject) => 
			client.connect(error => {
				if(error){
					client.close();
					reject(error);
				}
				resolve(client);	
			})
		);
	},
	find(tableName, value) {	
		return new Promise((resolve, reject) => 
			module.exports.connect().then((client) => {
				client.db("zello").collection(tableName).findOne(value, function(err, result) {
					if(err) reject(err);
					else resolve(result);
				});
				client.close();
			})
			.catch(error => reject(error))
		);
	},
	addOrUpdate(tableName, id, command) {
		return new Promise((resolve, reject) => 
			module.exports.connect().then((client) => {
				client.db("zello").collection(tableName).updateOne(id, command, { upsert: true }, function(err, result) {
					if(err) reject(err);
					else resolve(result);
				});
				client.close();
			})
			.catch(error => reject(error))
		);
	},
	add(tableName, id, command) {
		return new Promise((resolve, reject) => 
			module.exports.connect().then((client) => {
				client.db("zello").collection(tableName).insertOne(id, command, function(err, result) {
					if(err) reject(err);
					else resolve(result);
				});
				client.close();
			})
			.catch(error => reject(error))
		);
	}
}