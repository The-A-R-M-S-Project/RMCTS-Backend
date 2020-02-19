const express = require('express');

const router = express.Router();

const adminControllers = require('../controllers/Admin');

//====================routes===========================
router.get('/', (req, res)=>{
    res.json({message: 'Hello, admin!'});
})
router.post('/add-equipment', adminControllers.addItem)
router.get('/equipment', adminControllers.getItem)

module.exports = router;