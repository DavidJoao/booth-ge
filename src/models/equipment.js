const mongoose = require('../config/mongoConnection');

const equipmentSchema = new mongoose.Schema({
    name: String,
    number: String,
    accessories: [{}]
})

module.exports = mongoose.models.Equipment || mongoose.model('Equipment', equipmentSchema);