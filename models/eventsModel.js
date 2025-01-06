const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
var eventsSchema = new mongoose.Schema({
    event: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
},
    {
        timestamps: true, // Automatically add createdAt and updatedAt fields
    });

module.exports = mongoose.model('Events', eventsSchema);