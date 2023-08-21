const mongoose = require('mongoose');

// Define a sub-document schema for stories
const Storyschema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    title: String,
    url: String,
    story: String
});


// Create and export the user model
const Stories = mongoose.model('Story', Storyschema);
module.exports = Stories;