const express = require('express');
const equipmentControllers = require('../controllers/Equipment')
const router = express.Router();
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer');

router.post('/add-item', auth, multer.multerUploads, equipmentControllers.addItem)
router.get('/equipment', auth, equipmentControllers.getUserEquipment)
router.delete('/delete-item/:id', auth, equipmentControllers.deleteItem)
router.put('/edit-item', auth, multer.multerUploads, equipmentControllers.updateItem)
router.get('/catalog-default', equipmentControllers.getCatalogDefault)
router.post('/search', auth, equipmentControllers.getQueryMatch)
router.get('/item/:id', equipmentControllers.getItem)
router.post('/reservation/:id', auth, equipmentControllers.makeReservation)

// router.get('/catalog', (req, res)=>{
//     res.json({message: 'Here goes the catalog!'});
// })

// add equipment

module.exports = router;