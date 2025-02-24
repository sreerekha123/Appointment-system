function initBookingWidget(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return console.error("Booking widget container not found!");

    container.innerHTML = `
        <style>
            .booking-widget { font-family: Arial, sans-serif; max-width: 400px; margin: auto; text-align: center; }
            .slot { background: #28a745; color: white; padding: 10px; margin: 5px; border-radius: 5px; cursor: pointer; display: inline-block; width: 45%; }
            .slot:hover { background: #218838; } .booked { background: gray !important; cursor: not-allowed; }
            input, button { width: 100%; padding: 10px; margin: 5px 0; border: 1px solid #ccc; border-radius: 5px; }
            button { background: #007bff; color: white; border: none; cursor: pointer; } button:hover { background: #0056b3; }
        </style>

        <div class="booking-widget">
            <h2>Book Appointment</h2>
            <input type="date" id="date">
            <div id="timeslot-list"></div>
            <input type="text" id="name" placeholder="Your Name">
            <input type="tel" id="phone" placeholder="Phone Number">
            <input type="hidden" id="selected-time">
            <button onclick="bookAppointment()">Book Now</button>
            <h3>Booked Appointments</h3>
            <ul id="booked-list"></ul>
        </div>
    `;

    generateTimeSlots();
}

const bookedAppointments = {};

function generateTimeSlots() {
    const timeslotList = document.getElementById("timeslot-list");
    timeslotList.innerHTML = "";
    for (let h = 10; h < 17; h++) {
        if (h === 13) continue;
        for (let m of [0, 30]) {
            let time = `${h % 12 || 12}:${m ? "30" : "00"} ${h < 12 ? "AM" : "PM"}`;
            let slot = document.createElement("div");
            slot.className = "slot"; slot.textContent = time; slot.dataset.time = time;
            slot.onclick = () => selectSlot(slot);
            timeslotList.appendChild(slot);
        }
    }
}

function selectSlot(slot) {
    if (slot.classList.contains("booked")) return;
    document.querySelectorAll(".slot").forEach(s => s.style.background = "#28a745");
    slot.style.background = "#ffc107";
    document.getElementById("selected-time").value = slot.dataset.time;
}

function bookAppointment() {
    let name = document.getElementById("name").value,
        phone = document.getElementById("phone").value,
        date = document.getElementById("date").value,
        time = document.getElementById("selected-time").value;
    
    if (!name || !phone || !date || !time) return alert("Please fill all fields.");
    let key = `${date}_${time}`;
    if (bookedAppointments[key]) return alert("Slot already booked!");

    bookedAppointments[key] = { name, phone };
    updateBookedList();
    markBookedSlot(time);
}

function updateBookedList() {
    let list = document.getElementById("booked-list");
    list.innerHTML = "";
    for (let [key, { name, phone }] of Object.entries(bookedAppointments)) {
        let li = document.createElement("li");
        li.textContent = `${key.split("_")[1]} - ${name} (${phone})`;
        list.appendChild(li);
    }
}

function markBookedSlot(time) {
    document.querySelectorAll(".slot").forEach(slot => {
        if (slot.dataset.time === time) {
            slot.classList.add("booked");
            slot.onclick = null;
        }
    });
}
