const mongoose = require('../config/mongoConnection');

const dailySchema = new mongoose.Schema({
    date: String,
    dateCreated: String,
    foreman: String,
    totalHours: String,
    pickedUpDiesel: String,
    contractor: String,
    superintendent: String,
    name: String,
    workDescription: String,
    extraWorkDescription: String,
    notes: String,
    equipmentNo: String,
    employeesNo: String,
    rentedNo: String,
    employees: Array,
    rentedEmployees: Array,
    equipment: Array

})

module.exports = mongoose.models.Daily || mongoose.model('Daily', dailySchema);