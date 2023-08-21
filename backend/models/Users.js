const mongoose = require('mongoose');

// Define a sub-document schema for stories

// Define the main User schema
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// Create and export the user model
const User = mongoose.model('User', UserSchema);
User.createIndexes();
module.exports = User;