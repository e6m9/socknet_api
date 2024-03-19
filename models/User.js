const { Schema, model } = require('mongoose');

// user model schema
const userSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },
        email: {
            type: String,
            unique: true,
            required: true,
            // matching validation here
            match: [/^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/, 'Please use a valid email address']
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Thought'
            },
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
        ],
    },  {
    toJSON: {
        virtuals: true,
    },
    id: false,
});

userSchema
 .virtual('friendCount')
 .get(function () {
    return this.friends.length;
 });

 const User = model('user', userSchema);

 module.exports = User