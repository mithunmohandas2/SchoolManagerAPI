const mongoose = require('mongoose');
require('dotenv').config()
const MongoDB_Link = "mongodb+srv://mithunsruthi:test1234@cluster0.patjqvm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

mongoose.Promise = global.Promise;

// Check if the MongoDB link is available before attempting connection
if (!process.env.MongoDB_Link) {
  console.error('MongoDB connection string is missing!');
  process.exit(1); // Exit the process if no DB link is provided
}

// Connect to MongoDB using the MongoDB link from the environment variable
mongoose.connect(MongoDB_Link, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Export the connection (useful for reusing the connection in other files)
module.exports = mongoose;