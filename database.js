const config = global.isLocal ? require('./ignore/secret.json') : {};

const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const url = "mongodb://localhost:27017/";

const DB_PASS = process.env.DB_PASS || config.DB_PASS;

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
			this.connect().then((client) => {
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
			this.connect().then((client) => {
				client.db("zello").collection(tableName).updateOne(id, command, { upsert: true }, function(err, result) {
					if(err) reject(err);
					else resolve(result);
				});
				client.close();
			})
			.catch(error => reject(error))
		);
		
		dbo.collection("customers").updateOne(myquery, newvalues, function(err, res) {
			if (err) throw err;
			console.log("1 document updated");
			db.close();
		});
	}
}