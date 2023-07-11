const { allCollections, NewCollection, deleteCollection, getCollection } = require('../controllers/collection_controller');

const router = require('express').Router();


router.get('/allCollections',allCollections);
router.post('/newCollection',NewCollection);
router.post('/delete/:id',deleteCollection);
router.get('/:id',getCollection);


module.exports = router;