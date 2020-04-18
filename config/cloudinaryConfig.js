const cloudinary = require('cloudinary')
require('dotenv').config();

const config = cloudinary.config
const uploader = cloudinary.uploader

const cloudinaryConfig = () => config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

module.exports = { cloudinaryConfig, uploader };