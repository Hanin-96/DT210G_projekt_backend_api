//Importerar koppling till model
const Review = require("../models/review.model");


//Lägger till ny review
exports.addReview = async (request, h) => {
    try {
        console.log("testar om addReview kallas...")
        const { reviewText, rating, pagesRead, status, recommend, like, userId, bookId } = request.payload;

        const review = new Review({
            reviewText,
            rating,
            pagesRead,
            status,
            recommend,
            like,
            userId,
            bookId
        });

        console.log("testar", review)

        if (!userId) {
            return h.response({ error: "AnvändarId saknas..." }).code(404);
        }

        if (!bookId) {
            return h.response({ error: "BookId saknas..." }).code(404);
        }

        const newReview = await review.save();

        console.log("Review saved", newReview);

        return h.response({
            message: "Ny recension har lagts till",
            newReview: newReview
        }).code(201);
    } catch (err) {
        return h.response({ message: 'Något gick fel på serversidan' }).code(500);
    }
}

//Hämta alla reviews
exports.getAllReviews = async (request, h) => {
    const reviews = await Review.find().populate("userId", "username firstname lastname");
    
    //Returnera alla reviews
    return h.response({ reviews: reviews });

}