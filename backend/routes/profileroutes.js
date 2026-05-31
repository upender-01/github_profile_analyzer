const express = require('express');
const router = express.Router();

const {
    analyzeprofile,
    getprofileByUsername
} = require('../controllers/profilecontroller');

router.post('/analyze', analyzeprofile);

router.get(
    '/profiles/:username',
    getprofileByUsername
);

module.exports = router;
