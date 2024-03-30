const connection = require('../config/connection');
const { User, Thought } = require('../models');
const { users, thoughts } = require('./data');

connection.on('error', (err) => console.error('MongoDB connection error:', err));

connection.once('open', async () => {
    const seedDatabase = async () => {
        // clear existing data
        await User.deleteMany({});
        await Thought.deleteMany({});

        // seed users
        await User.insertMany(users);

        // seed thoughts
        for (let thought of thoughts) {
            const { _id: thoughtId } = await Thought.create(thought);

            await User.findOneAndUpdate(
                { username: thought.username },
                { $push: { thoughts: thoughtId } },
                { new: true }
            );
        }

        console.log('database seeded');
        process.exit(0);
    };

    seedDatabase().catch((err) => {
        console.error('failed to seed database', err);
        process.exit(1);
    })
});