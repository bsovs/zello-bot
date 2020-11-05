const {ErrorHandler} = require('../errors/errorHandler');
const database = require("../../database");
const {reducer} = require("../helper/helper");
const {getRandomInt} = require("../helper/helper");

const ITEM_TYPES = [
    {'class': 'COMMON', 'weight': 200, 'color': '#d1fff8'},
    {'class': 'RARE', 'weight': 50, 'color': '#50f52f'},
    {'class': 'LEGENDARY', 'weight': 15, 'color': '#fc401e'},
    {'class': 'MYTHIC', 'weight': 2, 'color': '#db25d5'}
];

const getCaseItems = () => {
    return database.findAll('case_items', {}).then(caseItems =>
        JSON.stringify({"items": caseItems, "itemTypes": ITEM_TYPES})
    ).catch(error => {
        throw new ErrorHandler(500, 'Database Error');
    });
};

const getKeysAndCases = (userData) => {
    return database.find('user_items', {"id": userData.id}).then(userItems => {
        return {"keys": userItems.keys, "cases": userItems.cases}
    }).catch(error => {
        throw new ErrorHandler(500, 'Database Error');
    });
};

const addKeysAndCases = (userData, numKeys, numCases) => {
    return database.findAndUpdate('user_items', {"id": userData.id}, {
        $inc: {
            "keys": (numKeys),
            "cases": (numCases)
        }
    }).then(_ => {
        return true;
    }).catch(error => {
        throw new ErrorHandler(500, 'Database Error');
    });
};

const openCase = (userData) => {
    return database.find('user_items', {"id": userData.id}).then(userItems => {
        if (userItems.keys > 0 && userItems.cases > 0) {
            return useKey(userData);
        } else {
            throw new ErrorHandler(401, 'No Keys')
        }
    }).catch(error => {
        throw new ErrorHandler(500, 'Database Error');
    });
};

const useKey = (userData) => {
    return database.findAndUpdate('user_items', {"id": userData.id}, {$inc: {"keys": (-1), "cases": (-1)}}).then(_ => {
        return randomItem().then(returnItem => updateDatabase(userData, returnItem)).catch(error => {
            throw error
        });
    }).catch(error => {
        throw new ErrorHandler(500, 'Database Error');
    });
};

const randomItem = () => {
    return getCaseItems()
        .then(items => {
            const itemsList = JSON.parse(items).items;
            const typeValues = ITEM_TYPES.map(itemType => itemType.weight);
            const randNum = getRandomInt(0, typeValues.reduce(reducer));
            const itemValue = ITEM_TYPES.find(itemType => (randNum <= typeValues.slice(0, typeValues.indexOf(itemType.weight) + 1).reduce(reducer)));
            const itemsOfClass = itemsList.filter(item => item.class.toUpperCase() === itemValue.class.toUpperCase());
            const itemNum = getRandomInt(0, itemsOfClass.length - 1);

            console.log(itemsOfClass[itemNum]);

            return itemsOfClass[itemNum];
        })
        .catch(error => error);
};

const updateDatabase = (userData, returnItem) => {
    return database.findAndUpdate('user_items', {'id': userData.id}, {$push: {'items': returnItem}}).then(_ => {
        return JSON.stringify({"item": returnItem});
    }).catch(error => {
        throw new ErrorHandler(500, 'Database Error');
    });
};

const giveCases = () => {
    return database.findAll('zbucks', {}).then(users => {
        const user = users[getRandomInt(0, users.length)];
        return database.addOrUpdate('user_items', {"id": user.id}, {$inc: {"keys": 0, "cases": 1}})
            .then(() => {
                console.log(user);
                return true;
            }).catch(() => Promise.reject(new ErrorHandler(500, 'Database Error')));
    }).catch(() => Promise.reject(new ErrorHandler(500, 'Database Error')));
};

const buyKeys = (userData) => {
    return database.findAndUpdate('zbucks', {'id': userData.id}, {$inc: {'zbucks': (-125)}}).then(() =>
        database.addOrUpdate('user_items', {'id': userData.id}, {$inc: {'keys': 1, 'cases': 0}})
            .then(() => {
                return JSON.stringify({"keys": 1});
            }).catch(() => Promise.reject(new ErrorHandler(500, 'Database Error')))
    ).catch(() => Promise.reject(new ErrorHandler(500, 'Database Error')));
}

module.exports = {
    getCaseItems,
    getKeysAndCases,
    addKeysAndCases,
    openCase,
    giveCases,
    buyKeys
}
