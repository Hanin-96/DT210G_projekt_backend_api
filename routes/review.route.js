const reviewController = require("../controllers/review.controller");

//Valideringspaket
const Joi = require("joi");


//Admin routes
const reviewRouteArr = [
    {
        method: 'POST',
        path: '/review',
        //Validering med Joi
        options: {
            auth: false,
            validate: {
                //Objekt som valideras och skickas med
                payload: Joi.object({
                    reviewText: Joi.string().min(2).required(),
                    rating: Joi.number().min(1).max(5),
                    pagesRead: Joi.number().min(1),
                    status: Joi.string(),
                    recommend: Joi.boolean(),
                    userId: Joi.any().required(),
                    bookId: Joi.string().required()
                }),
                failAction: (request, h, err) => {
                    //Error meddelande om validering misslyckas
                    return h.response({error: err.message}).code(400).takeover();
                }
            }
        },
        handler: reviewController.addReview
    },
    
]

//Exporterar route array
module.exports = reviewRouteArr;
