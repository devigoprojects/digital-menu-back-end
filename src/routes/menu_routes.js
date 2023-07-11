const { newMenu, getAll } = require('../controllers/menu_controller');

const router = require('express').Router();


router.post('/newMenu',newMenu);
router.get('/all',getAll);

module.exports = router;