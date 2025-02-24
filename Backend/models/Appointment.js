const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    date: { type: String, required: true }, 
    timeSlot: { type: String, required: true } 
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
