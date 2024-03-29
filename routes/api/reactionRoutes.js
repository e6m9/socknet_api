const express = require('express');
const router = express.Router({ mergeParams: true });

const {
    createReaction,
    deleteReaction,
} = require('../controllers/reactionController');


// api/reactions/thought/:id
router.route('/thought/:id').post(createReaction);

// api/reactions/:id
router.route('/:id').delete(deleteReaction);

module.exports = router;