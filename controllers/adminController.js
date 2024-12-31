const User = require('../models/userModel');
const Gallery = require('../models/galleryModel');
const News = require('../models/newsModel');
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

// .................Update User Data......................... 
const updateUser = async (req, res) => {
    try {
        const { _id } = req.params;
        const updatedData = req.body;

        let users = await User.findByIdAndUpdate(_id, updatedData, { new: true });
        if (!users) return res.status(404).json({ error: 'User not found' });

        const updatedUser = await User.findOne({ _id });
        const tokenData = await createToken(updatedUser._id);
        res.status(200).json({
            _id: updatedUser._id,
            username: updatedUser.username,
            phone: updatedUser.phone,
            email: updatedUser.email,
            admin: updatedUser.admin,
            token: tokenData,
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Database error: ' + error.message });
    }
}

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
        });
        await newImage.save();

        res.status(200).json({
            success: true,
            path: imagePath
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Database error: ' + error.message });
    }
}

// -------------------- Add to Gallery ---------------------------------- 
const addToGallery = async (req, res) => {
    try {
        const { type, path } = req.body;

        const newFile = new Gallery({ type, path });
        await newFile.save();

        res.status(200).json({
            success: true,
            path: path
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

module.exports = {
    loginAdmin,
    updateUser,
    uploadPhoto,
    addToGallery,
    addNews,
};
