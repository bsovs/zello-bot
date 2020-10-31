const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;

const DB_PASS = process.env.DB_PASS || require('./ignore/secret.json').DB_PASS;

module.exports = {
    name: 'mongodb',
    description: 'Connect to MongoDB',
    client: null,
    connect() {
        const uri = `mongodb+srv://sovranb:${DB_PASS}@cluster0.ovjzi.mongodb.net/Cluster0?retryWrites=true&w=majority`;
        const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
        return new Promise((resolve, reject) =>
            client.connect(error => {
                if (error) {
                    client.close();
                    reject('Unable to connect to database', error);
                } else {
                    console.log('MongoDB Connected!');
                    resolve(client);
                }
            })
        );
    },
    getClient() {
        return new Promise((resolve, reject) => {
            if (!module.exports.client)
                module.exports.connect()
                    .then(client => {
                        module.exports.client = client;
                        resolve(client)
                    })
                    .catch(error => reject(error));
            else resolve(module.exports.client);
        });
    },
    find(tableName, value) {
        return new Promise((resolve, reject) =>
            module.exports.getClient().then(client =>
                client.db("zello").collection(tableName).findOne(value, function (err, result) {
                    if (err) reject(err);
                    else resolve(result);
                })
            ).catch(error => reject(error))
        );
    },
    findAll(tableName, value) {
        return new Promise((resolve, reject) =>
            module.exports.getClient().then(client =>
                client.db("zello").collection(tableName).find(value).toArray(function (err, result) {
                    if (err) reject(err);
                    else {
                        let A = [];
                        result.forEach(D => A.push(D));
                        let U = [...new Set(A)]
                        resolve(U);
                    }
                })
            ).catch(error => reject(error))
        );
    },
    findAndUpdate(tableName, query, update, options) {
        return module.exports.getClient().then(client =>
            client.db("zello").collection(tableName).findOneAndUpdate(query, update, options)
                .then(updatedDocument => {
                    return updatedDocument;
                }));
    },
    addOrUpdate(tableName, id, command) {
        return new Promise((resolve, reject) =>
            module.exports.getClient().then(client =>
                client.db("zello").collection(tableName).updateOne(id, command, {upsert: true}, function (err, result) {
                    if (err) reject(err);
                    else resolve(result);
                })
            ).catch(error => reject(error))
        );
    },
    add(tableName, id, command) {
        return new Promise((resolve, reject) =>
            module.exports.getClient().then(client =>
                client.db("zello").collection(tableName).insertOne(id, command, function (err, result) {
                    if (err) reject(err);
                    else resolve(result);
                })
            ).catch(error => reject(error))
        );
    },
    average(tableName, queryId, amountId) {
        return new Promise((resolve, reject) =>
            module.exports.getClient().then(client =>
                client.db("zello").collection(tableName).aggregate({
                    $group: {
                        "_id": queryId,
                        "avg": {$avg: {$toInt: amountId}}
                    }
                }, function (err, result) {
                    if (err) reject(err);
                    else resolve(result);
                })
            ).catch(error => reject(error))
        );
    },
    mostPopular(tableName, queryId) {
        return new Promise((resolve, reject) =>
            module.exports.getClient().then(client =>
                client.db("zello").collection(tableName).aggregate({$sortByCount: queryId}, function (err, result) {
                    if (err) reject(err);
                    else resolve(result);
                })
            ).catch(error => reject(error))
        );
    },
    groupAndSort(tableName, command) {
        return new Promise((resolve, reject) =>
            module.exports.getClient().then(client =>
                client.db("zello").collection(tableName).aggregate({$group: command}, {$sort: {count: -1}}).toArray(function (err, result) { //TODO: MAP LIST OF COMMANDS
                    if (err) reject(err);
                    else resolve(result);
                })
            ).catch(error => reject(error))
        );
    }
}
