const mongoose = require('../config/mongoConnection');

const jobsiteSchema = new mongoose.Schema({
    name: String,
    address: String,
    employees: Array,
    superintendent: String,
})

module.exports = mongoose.models.Jobsite || mongoose.model('Jobsite', jobsiteSchema);