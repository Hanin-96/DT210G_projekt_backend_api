//Importerar koppling till model
const Review = require("../models/review.model");
const User = require("../models/user.model");

//JWT autentisering
const Jwt = require('@hapi/jwt');


//Lägger till ny review
exports.addReview = async (request, h) => {
    try {
        //console.log("testar om addReview kallas...")
        const { reviewText, rating, status, recommend, userId, bookId } = request.payload;

        const review = new Review({
            reviewText,
            rating,
            status,
            recommend,
            userId,
            bookId
        });

        //console.log("testar", review)

        //Hämtar token från cookie
        const token = request.state.jwt;

        if (!token) {
            return h.response({ message: "Ingen token" }).code(401);
        }

        //Hämta userId från token
        const userIdFromToken = await getUserId(token);

        if (!userId || userIdFromToken != userId) {
            return h.response({ error: "AnvändarId saknas..." }).code(404);
        }

        if (!bookId) {
            return h.response({ error: "BookId saknas..." }).code(404);
        }

        const newReview = await review.save();

        //console.log("Review saved", newReview);

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

        const reviews = await Review.find({ bookId }).populate("userId", "username firstname lastname");

        //console.log("Bokrecensioner", reviews);

        return h.response({
            reviews: reviews
        }).code(200);

    } catch (error) {
        return h.response({ message: "Serverfel, inga recensioner hittades för boken" }).code(500);
    }
}

//Hämta specifika reviews utifrån user
exports.getReviewsByUser = async (request, h) => {
    try {
        const userId = request.params._id;

        //Hämtar token från cookie
        const token = request.state.jwt;

        if (!token) {
            return h.response({ message: "Ingen token" }).code(401);
        }

        //Hämta userId från token
        const userIdFromToken = await getUserId(token);
        //console.log("token", token)

        const userExists = await User.findById(userId);
        //console.log("Userexists:", userExists)

        if (!userExists || userExists._id != userIdFromToken) {
            return h.response({ message: "Användaren har inte tillgång till recensionerna" }).code(403);
        }

        //Hämtar reviews utifrån userId
        const reviewsByUserId = await Review.find({ userId }).populate("userId", "username firstname lastname");

        if (reviewsByUserId.length === 0) {
            return h.response({ message: "Inga recensioner hittades för användaren" }).code(404);
        }
        //console.log("reviews by id:", reviewsByUserId)

        return h.response({
            reviewsByUserId: reviewsByUserId
        }).code(200);

    } catch (error) {
        return h.response({ message: "Serverfel, det gick inte att hämta recensioner för användaren" }).code(500);
    }

}

//Ta bort en bok review
exports.deleteReview = async (request, h) => {
    try {

        //Hämtar id för review från url
        const reviewId = request.params._id;
        //console.log("reviewId:", reviewId);

        const review = await Review.findById(reviewId);
        if (!review) {
            return h.response({ message: "Bokrecensionen finns inte" }).code(404);
        }
        //console.log("review:", review);

        const userExists = await User.findById(review.userId);
        //console.log("Userexists:", userExists)

        //Hämtar token från cookie
        const token = request.state.jwt;

        if (!token) {
            return h.response({ message: "Ingen token" }).code(401);
        }

        //Hämta userId från token
        const userIdFromToken = await getUserId(token);

        if (!userExists || review.userId != userIdFromToken) {
            return h.response({ error: "AnvändarId saknas..." }).code(403);
        }

        //Ta bort recensionen
        await Review.findByIdAndDelete(reviewId);
        //console.log("Bokrecension borttagen:", reviewId)
        return h.response({ message: "Bokrecensionen har raderats" }).code(200);


    } catch (error) {
        return h.response({ message: "Serverfel, det gick inte att ta bort recensionen" }).code(500);
    }

}

//Uppdatera en bok review

exports.updateReview = async (request, h) => {
    try {
        const reviewId = request.params._id;

        //console.log(reviewId);
        //Hämtar review id
        const review = await Review.findById(reviewId);

        if (!review) {
            return h.response({ message: "Recensionen finns inte..." }).code(404);
        }

        const userExists = await User.findById(review.userId);

        //Hämtar token från cookie
        const token = request.state.jwt;


        if (!token) {
            return h.response({ message: "Ingen token" }).code(401);
        }


        //Hämta userId från token
        const userIdFromToken = await getUserId(token);

        if (!userExists || review.userId != userIdFromToken) {
            return h.response({ message: "Användaren har inte tillgång till recensionen" }).code(403);
        }

        //Uppdaterar review med ny payload som skickas in
        const updatedReview = await Review.findByIdAndUpdate(
            reviewId,
            request.payload,
            { new: true }
        );

        if (updatedReview) {
            return h.response({
                message: "Recensionen har uppdaterats",
                updatedReview: updatedReview
            }).code(200);
        } else {
            return h.response("Recensionen kunde inte uppdateras").code(404);

        }
    } catch (error) {
        return h.response("Serverfel, det gick inte att uppdatera recensionen").code(500);
    }

}

//Uppdatera like funktionalitet på reviews
exports.addLikeToReview = async (request, h) => {
    try {
        const reviewId = request.params._id;

        //Hämtar like från payload
        const like = request.payload.like;


        //console.log(reviewId);
        //console.log("like:", like)
        //Hämtar review id
        const review = await Review.findById(reviewId);

        //Hämtar token från cookie
        const token = request.state.jwt;


        if (!token) {
            return h.response({ message: "Ingen token" }).code(401);
        }

        //Hämta userId från token
        const userIdFromToken = await getUserId(token);
        //console.log("userId:", userIdFromToken);

        if (!userIdFromToken) {
            return h.response({ message: "Användaren har inte tillgång till recensionen" }).code(403);
        }

        if (!review) {
            return h.response({ message: "Recensionen finns inte..." }).code(404);
        }

        if (like) {
            //Kontrollerar om användaren har likeat tidigare
            //console.log("review:", review)
            //console.log("reviewLike:", review.like)
            if (review.like.includes(userIdFromToken)) {
                return h.response({ message: 'Du har redan like:at denna recension' }).code(400);
            }

            review.like.push(userIdFromToken);

        } else {
      
            //Tar bort like utifrån userId
            const index = review.like.indexOf(userIdFromToken);
            if (index > -1) { 
                review.like.splice(index, 1); 
            }

        }

        await review.save();
        //Returnerar längden på likes dvs antal
        return h.response({ review: review });


    } catch (error) {
        return h.response("Serverfel, det gick inte att uppdatera recensionen").code(500);
    }

}

//Kontrollerar att userId från token finns och returnerar userId
async function getUserId(token) {

    //Decode token för att hämta user
    const decodedToken = Jwt.token.decode(token);

    //Kontrollerar om användaren inte finns med i payload i cookien
    if (!decodedToken.decoded || !decodedToken.decoded.payload || !decodedToken.decoded.payload.user) {
        return h.response({ message: "Användare finns inte..." }).code(401);
    }

    //Om användare finns, hämta userId
    const userIdFromToken = decodedToken.decoded.payload.user._id;
    //console.log("userid from token:", userIdFromToken);

    return userIdFromToken;

}

