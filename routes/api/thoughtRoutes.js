const express = require('express');
const router = express.Router();

const {
    getThoughts,
    getSingleThought,
    createThought,
    updateThought,
    deleteThought,
    createReaction,
    deleteReaction,
} = require('../../controllers/thoughtController');

// api/thoughts
router.route('/').get(getThoughts).post(createThought);

// api/thoughts/:thoughtId
router.route('/:id').get(getSingleThought).put(updateThought).delete(deleteThought);

// api/reactions/thoughts/:thoughtId/reaction
router.route('/thoughtId/reaction').post(createReaction).delete(deleteReaction);;

module.exports = router;