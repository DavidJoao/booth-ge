const mongoose = require('../config/mongoConnection');

const timesheetSchema = new mongoose.Schema({
    dateCreated: String,
    author: String,
    days: Array
})

module.exports = mongoose.models.Timesheet || mongoose.model('Timesheet', timesheetSchema);