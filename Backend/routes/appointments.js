const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

// Generate available slots
const generateSlots = () => {
    const slots = [];
    const startTime = 10; // 10 AM
    const endTime = 17; // 5 PM

    for (let hour = startTime; hour < endTime; hour++) {
        for (let min = 0; min < 60; min += 30) {
            const formattedTime = `${hour % 12 === 0 ? 12 : hour % 12}:${min === 0 ? '00' : '30'} ${hour < 12 ? 'AM' : 'PM'}`;
            if (formattedTime !== "1:00 PM" && formattedTime !== "1:30 PM") {
                slots.push(formattedTime);
            }
        }
    }
    return slots;
};

// Get available slots for a specific date
router.get('/available-slots/:date', async (req, res) => {
    const { date } = req.params;
    const bookedAppointments = await Appointment.find({ date }).select('timeSlot');
    const bookedSlots = bookedAppointments.map(appointment => appointment.timeSlot);
    const availableSlots = generateSlots().filter(slot => !bookedSlots.includes(slot));

    res.json({ availableSlots });
});

// Book an appointment
router.post('/book', async (req, res) => {
    const { name, phone, date, timeSlot } = req.body;

    const existingAppointment = await Appointment.findOne({ date, timeSlot });
    if (existingAppointment) {
        return res.status(400).json({ message: 'Time slot already booked' });
    }

    const newAppointment = new Appointment({ name, phone, date, timeSlot });
    await newAppointment.save();
    res.status(201).json({ message: 'Appointment booked successfully' });
});

module.exports = router;
