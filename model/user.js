const mongoose = require('mongoose');

const userSchema = mongoose.Schema({

    firstName: {
        type: String,
        default: null
    },
    lastName: {
        type: String,
        default: null
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        unique: true
    },
    
    token: {
        type: String,
        
    },
});

module.exports = mongoose.model("user", userSchema);