const express = require('express');

const router = express.Router();

router.get('/catalog', (req, res)=>{
    res.json({message: 'Here goes the catalog!'});
})

module.exports = router;