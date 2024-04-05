const connection = require('../config/connection');
const { User, Thought } = require('../models');
const { users, thoughts } = require('./data'); 

connection.once('open', async () => {
    const seedDatabase = async () => {
        await User.deleteMany({});
        await Thought.deleteMany({});

        const insertedUsers = await User.insertMany(users);
        const userMap = insertedUsers.reduce((acc, user) => {
            acc[user.username] = { id: user._id, username: user.username };
            return acc;
        }, {});

        for (let thought of thoughts) {
            const userDetail = userMap[thought.username];

            let preparedThought = {
                ...thought,
                userId: userDetail.id,
                username: userDetail.username, 
            };

            if (preparedThought.reactions && preparedThought.reactions.length > 0) {
                preparedThought.reactions = preparedThought.reactions.map(reaction => ({
                    ...reaction,
                    userId: userMap[reaction.username].id, 
                    username: userMap[reaction.username].username,
                }));
            }

            const createdThought = await Thought.create(preparedThought);

            await User.findByIdAndUpdate(userDetail.id, { $push: { thoughts: createdThought._id } }, { new: true });
        }

        console.log('Database seeded successfully!');
        process.exit(0);
    };

    seedDatabase().catch((err) => {
        console.error('Failed to seed database:', err);
        process.exit(1);
    });
});
