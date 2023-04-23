const mongoose = require('../config/mongoConnection');

const timesheetSchema = new mongoose.Schema({
    author: String,
    days: Array
})

module.exports = mongoose.models.Timesheet || mongoose.model('Timesheet', timesheetSchema);