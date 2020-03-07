const express = require('express');
const equipmentControllers = require('../controllers/Equipment')
const router = express.Router();
const auth = require('../controllers/auth');

router.post('/add-item', auth, equipmentControllers.addItem)
router.get('/equipment', auth, equipmentControllers.getUserEquipment)

// router.get('/catalog', (req, res)=>{
//     res.json({message: 'Here goes the catalog!'});
// })

// add equipment

module.exports = router;