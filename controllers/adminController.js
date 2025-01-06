const User = require('../models/userModel');
const Gallery = require('../models/galleryModel');
const News = require('../models/newsModel');
const Events = require('../models/eventsModel');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

// .................Login Admin......................... 
const loginAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(404).json({ error: 'Please provide all fields' });

        let userMatch = await User.findOne({
            $and: [
                {
                    $or: [
                        { email: username },
                        { username: username },
                        { phone: username }
                    ]
                },
                { password: password }
            ]
        });

        if (!userMatch) return res.status(400).json({ error: 'Invalid credentials' });
        if (!userMatch.admin) return res.status(400).json({ error: 'User without admin privileges' });

        const tokenData = await createToken(userMatch._id);
        const adminData = {
            token: tokenData,
            _id: userMatch._id,
            username: userMatch.username,
            email: userMatch.email,
            phone: userMatch.phone,
            admin: userMatch.admin
        };

        res.status(200).json(adminData);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Database error: ' + error.message });
    }
}

// Create JWT Token
const createToken = async (id) => {
    try {
        return await jwt.sign({ _id: id }, process.env.secretJWT, { expiresIn: '24h' });
    } catch (error) {
        return error.message;
    }
}

// -------------------- Verify Token ---------------------------------- 
const verifyToken = async (req, res) => {
    try {
        const { token } = req.body;
        const decoded = await jwt.verify(token, process.env.secretJWT);
        if (decoded?.error) {
            res.status(401).json({
                success: false,
            });
        } else {
            res.status(200).json({
                success: true,
            });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Database error: ' + error.message });
    }
}

// .................Update User Data......................... 
const updateUser = async (req, res) => {
    try {
        const { _id, username, email, phone, password } = req.body;

        // Validate that _id is provided
        if (!_id) {
            return res.status(400).json({ error: "User ID (_id) is required." });
        }

        // Prepare the fields to update
        const updatedData = {};
        if (username) updatedData.username = username;
        if (email) updatedData.email = email;
        if (phone) updatedData.phone = phone;
        if (password) updatedData.password = password;

        // Update the user
        const updatedUser = await User.findByIdAndUpdate(_id, updatedData, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found." });
        }

        // Create a new token for the updated user
        const tokenData = await createToken(updatedUser._id);

        // Respond with the updated user data and token
        res.status(200).json({
            _id: updatedUser._id,
            username: updatedUser.username,
            phone: updatedUser.phone,
            email: updatedUser.email,
            admin: updatedUser.admin,
            token: tokenData,
        });
    } catch (error) {
        console.error("Error updating user:", error.message);
        res.status(500).json({ error: "Database error: " + error.message });
    }
};

// ---------------------- Upload Photo ---------------------------------- 
const uploadPhoto = async (req, res) => {
    try {
        if (!req.file || !req.file.mimetype.startsWith('image/')) {
            return res.status(400).json({ error: 'Only image files are allowed' });
        }

        const imagePath = '/images/' + req.file.filename;

        const newImage = new Gallery({
            type: 'image',
            path: imagePath,
            filename: req.file.filename,
        });
        await newImage.save();

        res.status(200).json({
            success: true,
            path: imagePath,
            filename: req.file.filename,
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Database error: ' + error.message });
    }
}

// -------------------- Add to Gallery ---------------------------------- 
const addToGallery = async (req, res) => {
    try {
        const { type, path, filename } = req.body;

        const newFile = new Gallery({ type, path, filename });
        await newFile.save();

        res.status(200).json({
            success: true,
            path: path,
            filename: filename,
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Database error: ' + error.message });
    }
}

// -------------------- Add News ---------------------------------- 
const addNews = async (req, res) => {
    try {
        const { title, content } = req.body;

        const newNews = new News({
            title,
            content,
        });
        await newNews.save();

        res.status(200).json({
            success: true,
            message: 'News added successfully'
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Database error: ' + error.message });
    }
}

// -------------------- Add Events ---------------------------------- 
const addEvents = async (req, res) => {
    try {
        const { event, date } = req.body;

        const newNews = new Events({
            event,
            date,
        });
        await newNews.save();

        res.status(200).json({
            success: true,
            message: 'Event added successfully'
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Database error: ' + error.message });
    }
}

// -------------------- Delete Document ---------------------------------- 
const deleteDocument = async (req, res) => {
    try {
        const { type, _id } = req.body;

        let response;
        if (type === "news") {
            response = await News.findByIdAndDelete(_id);
        } 
        else if(type ==="event") {
            response = await Events.findByIdAndDelete(_id);
        } 
        else {
            response = await Gallery.findByIdAndDelete(_id);
        }
        console.log(response);
        res.status(200).json({
            success: true,
            message: 'deleted successfully'
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Database error: ' + error.message });
    }
}

module.exports = {
    loginAdmin,
    verifyToken,
    updateUser,
    uploadPhoto,
    addToGallery,
    addNews,
    addEvents,
    deleteDocument,
};
