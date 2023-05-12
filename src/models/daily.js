const mongoose = require('../config/mongoConnection');

const dailySchema = new mongoose.Schema({
    date: String,
    totalHours: String,
    pickedUpDiesel: String,
    dateCreated: String,
    contractor: String,
    superintendent: String,
    name: String,
    foreman: String,
    equipmentDescription: String,
    workDescription: String,
    extraWorkDescription: String,
    notes: String,
    employeesNo: String,
    employees: Array,
    imagesIds: Array
})

module.exports = mongoose.models.Daily || mongoose.model('Daily', dailySchema);