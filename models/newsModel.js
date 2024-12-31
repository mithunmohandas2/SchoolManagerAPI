const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
var newsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
},
    {
        timestamps: true, // Automatically add createdAt and updatedAt fields
    });

module.exports = mongoose.model('News', newsSchema);