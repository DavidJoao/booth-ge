const mongoose = require('../config/mongoConnection');

const jobsiteSchema = new mongoose.Schema({
    name: String,
    address: String,
    employees: Array,
    equipment: Array,
    accessories: Array,
    superintendent: String,
    startTime: String,
    contractor: String,
    status: String,
})

module.exports = mongoose.models.Jobsite || mongoose.model('Jobsite', jobsiteSchema);