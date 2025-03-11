"use strict";

//Initierar hapi
const Hapi = require("@hapi/hapi");

//Hämtar route
const userRoute = require('./routes/user.route');
const bookRoute = require('./routes/book.route');
const reviewRoute = require('./routes/review.route');

//Hämtar auth
const auth = require('./auth/authentication');

//Hämtar databas koppling
const databaseConnection = require('./database/connectDatabase');

//Användning av .env fil för användning av variabler
require("dotenv").config();

const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT || 3000,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['*'],
                credentials: true,
                maxAge: 86400,
                headers:
                    [
                        "Accept",
                        "Content-Type",
                        "Access-Control-Allow-Origin"
                    ]
            }
        }
    });

    //Koppla till databasen
    databaseConnection();

    // Registrerar JWT auth strategin
    await auth.register(server);

    //User route
    server.route(userRoute);

    //Book route
    server.route(bookRoute);

    //Review route
    server.route(reviewRoute);

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();