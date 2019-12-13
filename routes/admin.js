const express = require('express');

const router = express.Router();

const adminControllers = require('../controllers/admin');

//====================routes===========================
router.get('/admin', (req, res)=>{
    res.json({message: 'Hello, admin!'});
})
router.post('/add-equipment', adminControllers.addItem)
router.get('/equipment', adminControllers.getItem)

module.exports = router;