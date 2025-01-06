const mongoose = require('mongoose'); 

// Declare the Schema of the Mongo model
var gallerySchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["image", "video"],
        required: true,
    },
    path: {
        type: String,
        required: true,
    },
    filename: {
        type: String,
    },
    thumbnail: {
        type: String,
    }
}, { timestamps: true });

module.exports = mongoose.model('Gallery', gallerySchema);