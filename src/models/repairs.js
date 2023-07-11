const mongoose = require('../config/mongoConnection');

const repairSchema = new mongoose.Schema({
    name: String,
    reason: String,
    date: String,
})

module.exports = mongoose.models.Repair || mongoose.model('Repair', repairSchema);