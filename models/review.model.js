//Review modell

const { required } = require("@hapi/joi/lib/base");
const { type } = require("@hapi/joi/lib/extend");
const Mongoose = require("mongoose");

//Schema för User
const reviewSchema = new Mongoose.Schema({
    reviewText: {
        type: String,
        required: true,
        unique: false,
        trim: true
    },
    rating: {
        type: Number,
        required: false,
        min: 1,
        max: 5,
    },
    pagesRead: {
        type: Number,
        required: false,
    },
    status: {
        type: String,
        required: false,
        unique: false,
        trim: true
    },
    recommend: {
        type: Boolean,
        required: false,
    },
    like: {
        type: Number,
        required: false
    },
    userId: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bookId: {
        type: String,
        required: true,
        trim: true
    },

    created: {
        type: Date,
        default: Date.now
    },

});

const Review = Mongoose.model("Review", reviewSchema);
module.exports = Review;