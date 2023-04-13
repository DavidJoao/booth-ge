const mongoose = require('../config/mongoConnection');

const notificationSchema = new mongoose.Schema({
    author: String,
    date: String,
    message: String,
    title: String
})

module.exports = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);