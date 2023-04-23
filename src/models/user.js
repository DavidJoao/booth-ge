const mongoose = require('../config/mongoConnection');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    isAdmin: Boolean,
    isForeman: Boolean,
})

module.exports = mongoose.models.User || mongoose.model('User', userSchema);