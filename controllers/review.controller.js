//Importerar koppling till model
const Review = require("../models/review.model");
const User = require("../models/user.model");

//JWT autentisering
const Jwt = require('@hapi/jwt');


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

//Hämta reviews för specifik bok
exports.getReviewsByBook = async (request, h) => {
    try {
        const bookId = request.params.id;

        const reviews = await Review.find({ bookId })

        console.log("Bokrecensioner", reviews)

        if (!reviews.length > 0) {
            return h.response({ message: "Inga recensioner hittades för boken" }).code(404);
        }

        console.log("Bokrecensioner", reviews)

        return h.response({
            reviews: reviews
        }).code(200);

    } catch (error) {
        return h.response({ message: "Serverfel, inga recensioner hittades för boken" }).code(500);
    }
}

//Ta bort en bok review
exports.deleteReview = async (request, h) => {
    try {
        //Hämtar token från cookie
        const token = request.state.jwt;

        if (!token) {
            return h.response({ message: "Ingen token" }).code(401);
        }

        //Hämtar id för review från url
        const reviewId = request.params._id;
        console.log("reviewId:", reviewId);

        const review = await Review.findById(reviewId);
        if (!review) {
            return h.response({ message: "Bokrecensionen finns inte" }).code(404);
        }
        console.log("review:", review);

        const userExists = await User.findById(review.userId);
        console.log("Userexists:", userExists)

        //Decode token för att hämta user
        const decodedToken = Jwt.token.decode(token);

        //Kontrollerar om användaren inte finns med i payload i cookien
        if (!decodedToken.decoded || !decodedToken.decoded.payload || !decodedToken.decoded.payload.user) {
            return h.response({ message: "Användare finns inte..." }).code(401);
        }

        //Om användare finns, hämta userId
        const userIdFromToken = decodedToken.decoded.payload.user._id;
        console.log("userid from token:", userIdFromToken);

        //Kontrollerar om recensionen tillhör användaren
        if (review.userId.toString() !== userIdFromToken) {
            return h.response({ message: "Användaren har inte tillgång till denna recension" }).code(403);
        }

        //Ta bort recensionen
        await Review.findByIdAndDelete(reviewId);
        console.log("Bokrecension borttagen:", reviewId)
        return h.response({ message: "Bokrecensionen har raderats" }).code(200);


    } catch (error) {
        return h.response({ message: "Serverfel, det gick inte att ta bort recensionen" }).code(500);
    }

}

