const userController = require("../controllers/user.controller");

//Valideringspaket
const Joi = require("joi");


//Admin routes
const userRouteArr = [
    {
        method: 'POST',
        path: '/user',
        //Validering med Joi
        options: {
            auth: false,
            validate: {
                //Objekt som valideras och skickas med
                payload: Joi.object({
                    firstname: Joi.string().min(2).required(),
                    lastname: Joi.string().min(2).required(),
                    email: Joi.string().email().required(),
                    username: Joi.string().min(3).required(),
                    password: Joi.string().min(5).required()
                }),
                failAction: (request, h, err) => {
                    //Error meddelande om validering misslyckas
                    return h.response({error: err.message}).code(400).takeover();
                }
            }
        },
        handler: userController.addNewUser
    },
    {
        method: 'POST',
        path: '/login',
        options: {
                auth: false,
            validate: {
                //Objekt som valideras och skickas med
                payload: Joi.object({
                    username: Joi.string().min(3).required(),
                    password: Joi.string().min(5).required()
                }),
                failAction: (request, h, err) => {
                    //Error meddelande om validering misslyckas
                    return h.response({error: err.message}).code(400).takeover();
                }
            }
        },
        handler: userController.loginUser
    },
    {
        method: 'GET',
        path: '/userpage',
        handler: userController.getUserPage
    },
    {
        method: 'GET',
        path: '/userpage/logout',
        options: {
            auth: false,
        },
        handler: userController.logoutUser
    },
]

//Exporterar route array
module.exports = userRouteArr;
