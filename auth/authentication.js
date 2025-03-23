const Cookie = require('@hapi/cookie');
const Jwt = require('@hapi/jwt');
require("dotenv").config();

const authentication = {
    register: async (server) => {
        await server.register([Cookie, Jwt]);

        //Registrering av cookie
        server.auth.strategy('session', 'cookie', {
            cookie: {
                name: 'jwt',
                password: process.env.COOKIE_PASSWORD,
                isSecure: true,
                path: '/',
                ttl: 60 * 60 * 1000,
                isSameSite: 'None',
                clearInvalid: true,
                isHttpOnly: true
            },

            //Validera cookie
            validate: async (request, session) => {
                try {
                    //Hämtar token från session
                    const token = session;
                    if(!token) {
                        return {isValid: false};
                    }
                    const artifacts = Jwt.token.decode(token);

                    try {
                        //verifierar token
                        Jwt.token.verify(artifacts, {
                            key: process.env.JWT_SECRET_KEY,
                            algorithms: ['HS256']
                        });
                        return {
                            isValid: true,
                            credentials: artifacts.decoded.payload
                        };
                    } catch (err) {
                        console.error('Token verifiering fel:', err);
                        return { isValid: false };
                    }

                } catch(err) {
                    console.error('Token verifiering fel:', err);
                    return { isValid: false };
                }
            }
        })
        server.auth.default('session');
    }

}

module.exports = authentication;