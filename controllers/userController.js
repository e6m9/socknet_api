const { User, Thought } = require('../models');

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
            const user = await User.findOneAndRemove({ _id: req.params.userId });

            if (!user) {
                return res.status(404).json({ message: 'no user with that id' });
            }
            // delete user's thoughts
            await Thought.deleteMany({ username: user.username });
            res.json({ message: 'user and thoughts deleted' });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async addFriend(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                req.params.userId,
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
            res.status(500).json(err);
        }
    },

    // remove friend
    async removeFriend(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                req.params.userId,
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
