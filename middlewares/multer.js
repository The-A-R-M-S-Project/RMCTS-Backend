const multer = require('multer');
const DataURI = require('datauri')
const path = require('path')

const storage = multer.memoryStorage();
exports.multerUploads = multer({ storage }).single('image');

const dURI = new DataURI();

// converting buffer to dataURI
exports.dataURI = req => dURI.format(path.extname(req.file.originalname).toString(), req.file.buffer)
