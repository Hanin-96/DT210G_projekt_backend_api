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
        required: true,
        min: 1,
        max: 5,
    },
    status: {
        type: String,
        required: true,
        unique: false,
        trim: true
    },
    recommend: {
        type: Boolean,
        required: false,
    },
    like: [{
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
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