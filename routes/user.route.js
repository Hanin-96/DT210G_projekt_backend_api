const userController = require("../controllers/user.controller");

//Valideringspaket
const Joi = require("joi");


//Admin routes
const adminRouteArr = [
    {
        method: 'POST',
        path: '/adduser',
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
        handler: adminController.addNewUser
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
        handler: adminController.loginUser
    },
    {
        method: 'GET',
        path: '/admin',
        handler: adminController.getSecretData
    },
    {
        method: 'GET',
        path: '/admin/logout',
        options: {
            auth: false,
        },
        handler: adminController.logoutUser
    },
]

//Exporterar route array
module.exports = userRouteArr;
