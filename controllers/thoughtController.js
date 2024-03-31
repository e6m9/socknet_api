const { User, Thought } = require('../models');
const { isValidObjectId } = require('mongoose');


module.exports = {
    // get all thoughts
    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find();
            res.json(thoughts);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // get a single thought
    async getSingleThought(req, res) {
        console.log('Request URL:', req.path);
        console.log('requested thought id:', req.params.thoughtId);
        if (!isValidObjectId(req.params.thoughtId)) {
            return res.status(400).json({ message: 'Invalid ID format' });;
        }
        try {
            const thought = await Thought.findById(req.params.thoughtId)
                .populate('reactions');

            if (!thought) {
                return res.status(404).json({ message: 'no thought with that id' })
        }

            res.json(thought);
        } catch (err) {
            console.error("Error fetching thought:", err);
        res.status(500).json({ message: "Error fetching thought", error: err.message });
        }
    },

    // create a thought
    async createThought(req, res) {
        try {
            const thought = await Thought.create(req.body);
            await User.findByIdAndUpdate(
                req.body.userId,
                { $push: { thoughts: thought._id } },
                { new: true }
            );
            res.json(thought);
        } catch (err) {
            res.status(400).json(err);
        }
    },

    // update a thought
    async updateThought(req, res) {
        try {
            const thought = await Thought.findByIdAndUpdate(
                req.params.thoughtId,
                req.body,
                { new: true, runValidators: true }
            );
            if (!thought) {
                return res.status(404).json({ message: 'no thought with that id' });
            }
            res.json(thought);
        } catch (err) {
            res.status(400).json(err);
        }
    },

    // delete a thought and its associated reactions
    async deleteThought(req, res) {
        try {
            const thought = await Thought.findByIdAndDelete(req.params.thoughtId);
            if (!thought) {
                return res.status(404).json({ message: 'no thought with that id' });
            }
            await User.findByIdAndUpdate(thought.userId,
                { $pull: { thoughts: thought._id } },
                { new: true }
            );
            res.json({ message: 'thought deleted' });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // create a reaction
    async createReaction(req, res) {
        try {
            const reaction = await Thought.findByIdAndUpdate(
                req.params.thoughtId,
                { $push: { reactions: req.body } },
                { new: true, runValidators: true }
            );
            if (!reaction) {
                return res.status(404).json({ message: 'no thought with that id' });
            }
            res.json(reaction);
        } catch (err) {
            res.status(400).json(err);
        }
    },

    // delete a reaction
    async deleteReaction(req, res) {
        try {
            const thought = await Thought.findByIdAndUpdate(
                req.params.thoughtId,
                { $pull: { reactions: { reactionId: req.params._Id } } },
                { new: true }
            );
            if (!thought) {
                return res.status(404).json({ message: 'no thought with that id' });
            }
            res.json(thought);
        } catch (err) {
            res.status(400).json(err);
        }
    }
};