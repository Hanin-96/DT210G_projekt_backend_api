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
                    status: Joi.string().required(),
                    recommend: Joi.boolean().default(false),
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
        //Hämta reviews utifrån bok
        method: 'GET',
        path: '/reviews/book/{id}',
        options: {
            auth: false
        },
        handler: reviewController.getReviewsByBook
    },
    {
        //Hämta specifika reviews utifrån user
        method: 'GET',
        path: '/reviews/{_id}',
        handler: reviewController.getReviewsByUser
    },
    {
        //Ta bort review
        method: 'DELETE',
        path: '/review/{_id}',
        handler: reviewController.deleteReview
    },
    {
        //Uppdatera review
        method: 'PUT',
        path: '/review/{_id}',
        //Validering med Joi
        options: {
            validate: {
                //Objekt som valideras och skickas med
                payload: Joi.object({
                    reviewText: Joi.string().min(2).required(),
                    rating: Joi.number().min(1).max(5).required(),
                    status: Joi.string().required(),
                    recommend: Joi.boolean().default(false),
                    userId: Joi.string().required(),
                    bookId: Joi.string().required()
                }),
                failAction: (request, h, err) => {
                    //Error meddelande om validering misslyckas
                    return h.response({ error: err.message }).code(400).takeover();
                }
            },
            handler: reviewController.updateReview
        }
    },
    {
        //Uppdatera review
        method: 'PATCH',
        path: '/review/{_id}/like',
        //Validering med Joi
        options: {
            validate: {
                //Objekt som valideras och skickas med
                payload: Joi.object({
                    like: Joi.boolean().default(true),
                }),
                failAction: (request, h, err) => {
                    //Error meddelande om validering misslyckas
                    return h.response({ error: err.message }).code(400).takeover();
                }
            },
            handler: reviewController.addLikeToReview
        }
    }

]

//Exporterar route array
module.exports = reviewRouteArr;
