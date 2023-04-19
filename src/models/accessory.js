const mongoose = require('../config/mongoConnection');

const accessorySchema = new mongoose.Schema({
    name: String,
})

module.exports = mongoose.models.Accessory || mongoose.model('Accessory', accessorySchema);