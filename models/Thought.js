const { Schema, Types, model } = require('mongoose');
const dayjs = require('dayjs');

const reactionSchema = new Schema({
    reactionText: {
        type: String,
        required: true,
        maxlength: 280
    },
    username: {
        type: String,
        required: true,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now,
        // getter to format on query
        get: (timestamp) => dayjs(timestamp).format('YYYY MM DD HH:mm:ss')
    }
}, {
    toJSON: {
        getters: true
    },
    id: false
});

const thoughtSchema = new Schema({
    username: {
        type: String,
        required: true,
        ref: 'User'
    },
    thoughtText: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280
    },
    createdAt: {
        type: Date,
        default: Date.now,
        // getter method used to format on query
        get: (timestamp) => dayjs(timestamp).format('YYYY MM DD HH:mm:ss')
    },
    reactions: [reactionSchema]
}, {
    toJSON: {
        virtuals: true,
        getters: true
    },
    id: false
});

// virtual for reactionCount
thoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
});

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;