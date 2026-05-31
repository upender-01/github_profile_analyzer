const express = require('express');
const router = express.Router();

const profileController = require('../controllers/profilecontroller');

router.post('/analyze', profileController.analyzeprofile);
router.get('/profiles/:username', profileController.getprofileByUsername);

module.exports = router;
