const mcache = require('memory-cache');

const cache = (durationInSeconds) => {
    return (req, res, next) => {
        let key = '__express__' + req.originalUrl || req.url
        let cachedBody = mcache.get(key)
        if (cachedBody) {
            console.log('From Cache: ' + String(cachedBody));
            res.status(200).send(cachedBody);
        } else {
            res.sendResponse = res.status(200).send
            res.send = (body) => {
                mcache.put(key, body, durationInSeconds * 1000);
                res.sendResponse(body)
            }
            next()
        }
    }
};

const getCachedValue = (id) => {
    let key = '__value__' + id;
    let cachedBody = mcache.get(key)
    if (cachedBody) {
        console.log('From Val Cache: ' + String(cachedBody));
        return cachedBody;
    } else {
        return null;
    }
};

const setCachedValue = (id, value, durationInSeconds) => {
    let key = '__value__' + id;
    let cachedBody = mcache.get(key)
    if (cachedBody) {
        return false;
    } else {
        console.log('Val Cache Set: ' + String(id));
        mcache.put(key, value, durationInSeconds * 1000);
        return true;
    }
};

module.exports = {
    cache,
    getCachedValue,
    setCachedValue
}
