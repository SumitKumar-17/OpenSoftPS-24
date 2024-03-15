const express = require('express');
const router = express.Router();
const { searchMovies } = require('../controllers/searchController');
const { autocompleteMovies } = require('../controllers/autoCompleteController');



router.get('/autocomplete', autocompleteMovies);
router.get('/search', searchMovies);

module.exports = router;