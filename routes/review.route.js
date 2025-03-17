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
            validate: {
                //Objekt som valideras och skickas med
                payload: Joi.object({
                    reviewText: Joi.string().min(2).required(),
                    rating: Joi.number().min(1).max(5).required(),
                    pagesRead: Joi.number().min(1).default(1),
                    status: Joi.string().required(),
                    recommend: Joi.boolean().default(""),
                    like: Joi.number().default(0),
                    userId: Joi.any().required(),
                    bookId: Joi.string().required()
                }),
                failAction: (request, h, err) => {
                    //Error meddelande om validering misslyckas
                    return h.response({ error: err.message }).code(400).takeover();
                }
            }
        },
        handler: reviewController.addReview
    },
    {
        method: 'GET',
        path: '/reviews',
        //Validering med Joi
        options: {
            auth: false
        },
        handler: reviewController.getAllReviews
    },
    {
        //Hämta reviews
        method: 'GET',
        path: '/reviews/{id}/book',
        options: {
            auth: false
        },
        handler: reviewController.getReviewsByBook
    },
    {
        //Hämta reviews utifrån user
        method: 'GET',
        path: '/reviews/{userId}',
        handler: reviewController.getReviewsByBook
    },
    {
        //Ta bort review
        method: 'DELETE',
        path: '/review/{_id}',
        handler: reviewController.deleteReview
    }

]

//Exporterar route array
module.exports = reviewRouteArr;
