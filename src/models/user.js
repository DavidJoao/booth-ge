const mongoose = require('../config/mongoConnection');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    isAdmin: Boolean
})

const User = mongoose.model('User', userSchema)
module.exports = User