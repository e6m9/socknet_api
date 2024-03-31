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
    } catch(err) {
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

    // update user including username in thoughts and reactions if applicable
    async updateUser(req, res) {
        let updatedUser;
        try {
            updatedUser = await User.findByIdAndUpdate(
                req.params.userId,
                req.body,
                { new: true, runValidators: true }
            );
            if (!updatedUser) {
                return res.status(404).json({ message: 'no user with that id' });
            }
        } catch (err) {
            return res.status(400).json(err);
        }
    
        if (req.body.username) {
            try {
                await Thought.updateMany(
                    { userId: updatedUser._id },
                    { $set: { username: req.body.username } }
                );
    
                const thoughtsWithReactions = await Thought.find({ 
                    "reactions.username": updatedUser.username 
                });
                const updatePromises = thoughtsWithReactions.map(async (thought) => {
                    const updatedReactions = thought.reactions.map(reaction => {
                        if (reaction.username === updatedUser.username) {
                            return { ...reaction.toObject(), username: req.body.username };
                        }
                        return reaction;
                    });
                    thought.reactions = updatedReactions;
                    return thought.save();
                });
                await Promise.all(updatePromises);
    
            } catch (err) {
                return res.status(500).json({ message: "error updating user's thoughts and reactions" });
            }
        }

        res.json(updatedUser);
    },
    

    // delete user and associated thoughts and reactions
    async deleteUser(req, res) {
        try {
            const user = await User.findOneAndDelete({ _id: req.params.userId });
    
            if (!user) {
                return res.status(404).json({ message: 'no user with that id' });
            }
    
            await Thought.deleteMany({ userId: user._id });

            const thoughtsWithUserReactions = await Thought.find({ 'reactions.userId': user._id });
            for (const thought of thoughtsWithUserReactions) {
                thought.reactions = thought.reactions.filter(reaction => !reaction.userId.equals(user._id));
                await thought.save();
            }

            res.json({ message: 'user, their thoughts, and their reactions in other thoughts deleted' });
        } catch (err) {
            res.status(500).json({ message: "error deleting user" });
        }
    },
    
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
