const express = require('express');
const router = express.Router();

const {
    getThoughts,
    getSingleThought,
    createThought,
    updateThought,
    deleteThought,
} = require('../../controllers/thoughtController');

// api/thoughts
router.route('/').get(getThoughts).post(createThought);

// api/thoughts/:thoughtId
router.route('/:id').get(getSingleThought).put(updateThought).delete(deleteThought);

module.exports = router;