const axios = require('axios');
const {ErrorHandler} = require("../errors/errorHandler");

const oauth2 = {
    client_id: (process.env.PORT ? '767053379700129813' : '767448946728632371'),
    client_secret: (process.env.CLIENT_SECRET || require("../../ignore/config.json").client_secret),
    redirect_uri: (process.env.PORT ? 'https://zellobot.herokuapp.com' : 'http://localhost:8080'),
    scope: "identify connections"
};

const start = function (app, router) {

    app.get('/api/discord/callback', (req, res) => {
        const params = req.query;
        if (!req.data) {
            res.redirect(global.URL + '/api/discord/oauth_callback?code=' + String(params.code));
        }
    });

    router.get('/api/discord/oauth_callback', (req, res) => {
        const params = req.query;
        let data = `client_id=${oauth2.client_id}&client_secret=${oauth2.client_secret}&grant_type=authorization_code&code=${params.code}&redirect_uri=${oauth2.redirect_uri}/api/discord/callback&scope=${oauth2.scope}`;
        let headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
        axios.post("https://discord.com/api/v6/oauth2/token", data, {
            headers: headers
        }).then(response => {
            let info = response.data;

            res.cookie('discord_token', info.access_token, {
                httpOnly: true,
                maxAge: (info.expires_in)
            });
            res.cookie('discord_refresh_token', info.refresh_token, {
                httpOnly: true
            });
            res.cookie('user', true, {});

            module.exports.getUserId(req, res, info.access_token)
                .then(() => res.redirect(global.URL+'/bets'))
                .catch(() => res.redirect(global.URL+'/bets'));
        }).catch(error => {
            console.error("[oauth2.js]", error);
        });
    });

    router.get('/api/discord', (req, res) => {
        if (!req.cookies || !req.cookies.discord_token) {
            if (req.cookies && req.cookies.discord_refresh_token) module.exports.refreshToken(req, res, req.cookies.discord_refresh_token)
                .then(() => res.status(200).redirect('/bets'))
                .catch(() => res.redirect(req.originalUrl));
            else {
                res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${oauth2.client_id}&scope=${oauth2.scope}&response_type=code&redirect_uri=${oauth2.redirect_uri}/api/discord/callback`);
            }
        } else res.status(301).redirect('/bets');
    });
};

const refreshToken = function (req, res, refresh_token) {
    return new Promise((resolve, reject) => {
        let data = `client_id=${oauth2.client_id}&client_secret=${oauth2.client_secret}&grant_type=refresh_token&refresh_token=${refresh_token}&redirect_uri=${oauth2.redirect_uri}/api/discord/callback&scope=${oauth2.scope}`;
        let headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
        axios.post("https://discord.com/api/v6/oauth2/token", data, {
            headers: headers
        }).then(response => {
            let info = response.data;

            res.cookie('discord_token', info.access_token, {
                httpOnly: true,
                maxAge: (info.expires_in)
            });
            res.cookie('discord_refresh_token', info.refresh_token, {
                httpOnly: true
            });
            res.cookie('user', true, {});
            console.log('refreshed');
            resolve(info.access_token, info.refresh_token);
        }).catch(error => {
            res.cookie('discord_refresh_token', null, {
                maxAge: (0)
            });
            reject('Invalid Refresh Token');
        });
    });
};

const getUserId = function(req, res, access_token, refresh_token) {
    return new Promise((resolve, reject) => {
        axios.get('https://discord.com/api/users/@me', {
            headers: {'authorization': `Bearer ${access_token}`}
        })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                if (error.response.status === 401) {
                    refreshToken(req, res, refresh_token)
                        .then((new_access_token, new_refresh_token) => {
                            getUserId(req, res, new_access_token, new_refresh_token)
                                .then(response => { resolve(response) })
                                .catch(_error => { reject(_error) })
                        })
                        .catch(_error => { reject(new ErrorHandler(500, String(_error))) });
                } else {
                    reject(new ErrorHandler(error.response.status, String(error.response.data)));
                }
            });
    });
};

const oauthRequired = (req, res) => {
    if (!req.cookies || !req.cookies.discord_token) {
        if (req.cookies && req.cookies.discord_refresh_token)
            oauth2.refreshToken(req, res, req.cookies.discord_refresh_token)
                .then(response => res.status(200).sendFile(path.join(__dirname, 'build', 'index.html')))
                .catch(error => res.redirect('/'));
        else {
            res.redirect('/');
        }
    } else res.status(200).sendFile(path.join(__dirname, 'build', 'index.html'));
};

module.exports = {
    start,
    getUserId,
    refreshToken
}
	