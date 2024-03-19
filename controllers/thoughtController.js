const { User, Thought } = require('../models');

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
        try {
            const thought = await Thought.findById(req.params.thoughtId)
                .populate('username')
                .populate('reactions');

            if (!thought) {
                return res.status(404).json({ message: 'no thought with that id' });
            }

            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
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

    // delete a thought
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
            const reaction = await Thought.findByIdAndUpdate(
                req.params.thoughtId,
                { $pull: { reactions: { reactionId: req.params.reactionId } } },
                { new: true }
            );
            if (!reaction) {
                return res.status(404).json({ message: 'no thought with that id' });
            }
            res.json(reaction);
        } catch (err) {
            res.status(400).json(err);
        }
    }
};