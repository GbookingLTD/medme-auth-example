const express = require('express')

// Import the axios library, to make HTTP requests
const fetch = require('node-fetch')

const crypto = require('crypto');

// This is the client ID and client secret that you obtained
// while registering the application
const clientID = '5e4eda94383ef1ea0d8d0209'
const clientSecret = 'super_secret_12345'

const app = express()
const cookieParser = require('cookie-parser')

const sessions = {};

app.use(cookieParser());

// Declare the redirect route
app.get('/oauth/redirect', (req, handler_res) => {
    // The req.query object has the query params that
    // were sent to this route. We want the `code` param
    const code = req.query.code;
    fetch(`https://oauthv2.gbooking.ru/authorize/token`, {
        // make a POST request
        method: 'POST',
        // Set the content type header, so that we get the response in JSOn
        headers: {
            accept: 'application/json'
        },
        body: {
            client_id: clientID,
            client_secret: clientSecret,
            code
        }
    })
        .then(res => res.text()
            .then(text => {
                if (text === "INVALID_TOKEN")
                    throw Error("INVALID_TOKEN");
                if (text === "Unauthorized")
                    throw Error("Unauthorized");
                // catch UB error and get json
                let json;
                try {
                    json = JSON.parse(text);
                    return {status: res.status, json: json}
                } catch (err) {
                    console.error("JSON.parse error", text);
                    throw err;
                }
            })
        )
        .then(res => {
            if (res.json.error) {
                console.error("authtoken\nerror_code:%s\nerror_description:%s\nerror_uri:%s", res.json.error,
                    res.json.error_description, res.json.error_uri);
                handler_res.json(res.status, res.json);
                return;
            }

            // Теперь мы можем передать access token на сторону клиента, но делать этого не рекомендуется.
            // Вместо этого лучше передать идентификатор сессии.
            // По нему клиент будет обрашаться на ваш сервер,
            // который уже, имея access token будет обращаться к серверу api gbooking/med.me.
            // Так вы сможете ограничивать время доступа к данным через access token из вашего приложения,
            // в зависимости от ваших политик безопасности.

            const sid = crypto.randomBytes(64).toString('hex');
            sessions[sid] = res.json;

            // Куки HTTPonly не доступны из JavaScript через свойства Document.cookie API,
            // что помогает избежать межсайтового скриптинга (XSS).
            res.cookie('sid', sid, { maxAge: 900000, httpOnly: true });

            // redirect the user to the welcome page, along with the access token
            // тут можете использовать json ответ вместо редиректа для мобильного приложения
            handler_res.redirect(`/welcome.html`)
        })
        .catch(err => {
            if (err.message === "INVALID_TOKEN" || err.message === "Unauthorized") {
                console.error("authtoken", err.message);
                handler_res.json(401, {error:err.message});
                return;
            }

            console.error("authtoken", err.message);
            handler_res.json(500, {error:"UNKNOWN_ERROR",error_description:err.message});
        })
});

// Примечание.
// Здесь или на приложении может использоваться та же самая логика обмена токенов (refresh),
// что и для клиентской авторизации.
//
// Вы можете использовать тот код, заменив localStorage на серверное хранилище сессии, а
// редирект через браузерный объект location - на редирект, используя серверные средства или ответ с соответствующим
// кодом ошибки/статусом.
//
// Для краткости мы опустили эту часть кода.

app.get('/me', (req, handler_res) => {
    const cred = sessions[req.cookies.sid];
    if (!cred)
        return handler_res.json(401, {error:"UNAUTHORIZED"});

    profile(cred.user, cred.token)
        .then(res => handler_res.json({name:res.result.profile.name}));
});

function profile(user, token) {
    return fetch('https://apiv2.gbooking.ru/rpc', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            jsonrpc: "2.0",
            id: requestCounter++,
            cred: {user, token},
            method: "profile.get_profile",
            params: {
                id: user
            }
        })
    })
        // Parse the response as JSON
        .then(res => res.json())
}

app.use(express.static(__dirname + '/public'))
app.listen(80)