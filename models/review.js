import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    text: {type: String, required: true},
    rating: {type: Number, required: true, min: 1, max: 5},
    userId: {type: mongoose.Schema.Types.ObjectId, required: true, index: true},
    movieId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'movies' },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('reviews', reviewSchema)