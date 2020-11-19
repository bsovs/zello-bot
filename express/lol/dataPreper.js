const fs = require('fs');
const path = require('path');
const fetch = require('./dataFetcher');

const summoners_json = require('./summoner_list.json');

(async () => {
    for (let summoner of summoners_json.summoners) {
        try {
            await fetch.findId(summoner).then(async accountId => {
                let matchIds = [];
                let indexes = []
                for (let i = 0; i < 500; i += 100) indexes.push(i);

                console.log(`\n==============================\n`);
                console.log(`  Finding Data For ${summoner} \n`);

                await Promise.all(indexes.map((i, index) =>
                    throttleProcess(index, () => fetch.findMatches(accountId, i)
                        .then(_id => matchIds.push(..._id))
                        .catch(e => {
                            console.log(e);
                        }))
                ));
                console.log('Matches:', matchIds.length);
                await findMatchData(matchIds, accountId, summoner);

            }).catch(e => console.log(e));
        } catch (e) {
            console.log(new Error(e))
        }
    }
})();

const throttleProcess = (index, callback) => new Promise(resolve =>
    setTimeout(() => {
        console.log(index, Date.now());
        resolve(callback())
    }, index * 1500)
);

let _match = {};

const appendToArray = (data) => {
    if(data == null) return;
    for (const [key, value] of Object.entries(data)) {
        _match[`${key}`] = [..._match[`${key}`] || [], value];
    }
}

const findMatchData = async (matches, accountId, name) => {
    try {
        await Promise.all(matches.map((match, index) => throttleProcess(index,
            () => fetch.searchMatch(match, accountId).then(matchData => appendToArray(matchData)
            ))))
            .then(data_json => {

                for (const [key] of Object.entries(_match)) {
                    if (_match[key].length < _match.gameId.length) delete _match[key];
                }

                fs.writeFileSync(
                    path.join('C:/Users/brand/PycharmProjects/flaskProject/src/data/in', `${name}_pyReady_data.json`),
                    JSON.stringify(_match));

                // fs.writeFileSync(path.join(__dirname, `data/out/${name}_pyReady_data.json`), JSON.stringify(_match));
                _match = {};

                console.log(`+++++++++++++++++++++++++++++++++++`);
                console.log(`\n    ...COMPLETED - ${name}\n`);
                console.log(`+++++++++++++++++++++++++++++++++++`);

            }).catch(error => console.log(error))
    } catch (e) {
        console.log(new Error(e))
    }
};
