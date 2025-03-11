const bookController = require("../controllers/book.controller");

//Valideringspaket
const Joi = require("joi");


//Admin routes
const bookRouteArr = [
    {
        method: 'GET',
        path: '/book/{query}',
        //Validering med Joi
        options: {
            auth: false
        },
        handler: bookController.getBooks
    },
    
]

//Exporterar route array
module.exports = bookRouteArr;
