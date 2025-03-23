const bookController = require("../controllers/book.controller");


//Admin routes
const bookRouteArr = [
    {
        method: 'GET',
        path: '/books',
        //Validering med Joi
        options: {
            auth: false
        },
        handler: bookController.getBooks
    },
    {
        method: 'GET',
        path: '/book/{bookId}',
        options: {
            auth: false
        },
        handler: bookController.getBookById
    },
    
]

//Exporterar route array
module.exports = bookRouteArr;
