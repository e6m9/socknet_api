const router = require('express').Router();
const thoughtRoutes = require('./thoughtRoutes');
const reactionRoutes = require('./reactionRoutes');

router.use('/thoughts', thoughtRoutes);
router.use('/reactions', reactionRoutes);

module.exports = router;