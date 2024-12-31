const Gallery = require('../models/galleryModel');
const News = require('../models/newsModel');

const test = async (req, res) => {
    res.json({ response: 'Test success' });
}

// ................. Image Gallery Fetch ......................... 
const getImages = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const images = await Gallery.find({ type: "image" })
            .skip(skip)
            .limit(limit);

        if (images.length > 0) {
            res.status(200).json(images);
        } else {
            res.status(404).json({ error: "Image gallery not found" });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Database error: ' + error.message });
    }
}

// ................. Video Gallery Fetch ......................... 
const getVideos = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const videos = await Gallery.find({ type: "video" })
            .skip(skip)
            .limit(limit);

        if (videos.length > 0) {
            res.status(200).json(videos);
        } else {
            res.status(404).json({ error: "Video gallery not found" });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Database error: ' + error.message });
    }
}

// ................. Fetch News ......................... 
const getNews = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const news = await News.find()
            .skip(skip)
            .limit(limit);

        if (news.length > 0) {
            res.status(200).json(news);
        } else {
            res.status(404).json({ error: "News not found" });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Database error: ' + error.message });
    }
}

module.exports = {
    test,
    getImages,
    getVideos,
    getNews,
}
