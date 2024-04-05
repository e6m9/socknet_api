const { User, Thought } = require('../models');
const { isValidObjectId } = require('mongoose');

module.exports = {

    // get all users
    async getUsers(req, res) {
        try {
            const users = await User.find();
            res.json(users);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    //get single user
    async getSingleUser(req, res) {
        try {
            const user = await User.findById(req.params.userId)

                .populate('thoughts')
                .populate('friends');

            if (!user) {
                return res.status(404).json({ message: 'no user with that id' });
            }
            res.json(user);
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // create user
    async createUser(req, res) {
        try {
            const user = await User.create(req.body);
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // update user
    async updateUser(req, res) {
        try {
            const user = await User.findByIdAndUpdate(
                req.params.userId,
                req.body,
                { new: true, runValidators: true }
            );
            if (!user) {
                return res.status(404).json({ message: 'no user with that id' });
            }
            res.json(user);
        } catch (err) {
            res.status(400).json(err);
        }
    },

    // delete user
    async deleteUser(req, res) {
        try {
            const user = await User.findOneAndDelete({ _id: req.params.userId });
    
            if (!user) {
                return res.status(404).json({ message: 'No user with that ID.' });
            }
            await Thought.deleteMany({ username: user.username });
    
            const thoughtsWithUserReactions = await Thought.find({ 'reactions.username': user.username });
            for (const thought of thoughtsWithUserReactions) {
                thought.reactions = thought.reactions.filter(reaction => reaction.username !== user.username);
                await thought.save();
            }
    
            res.json({ message: 'User, their thoughts, and their reactions in other thoughts have been deleted.' });
        } catch (err) {
            console.error("Error deleting user:", err);
            res.status(500).json({ message: "Error deleting user", error: err.message });
        }
    },

    // add friend
    async addFriend(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $addToSet: { friends: req.params.friendId } },
                {
                    new: true,
                    runValidators: true
                }
            ).populate('friends');

            if (!user) {
                return res.status(404).json({ message: 'no user with that id' });
            }

            res.json(user);
        } catch (err) {
            console.error("error adding friend:", err);
            res.status(500).json({ message: 'error adding friend', error: err.message });
        }
    },

    // remove friend
    async removeFriend(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $pull: { friends: req.params.friendId } },
                { new: true, }
            ).populate('friends');

            if (!user) {
                return res.status(404).json({ message: 'no user with that id' });
            }

            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    }
};