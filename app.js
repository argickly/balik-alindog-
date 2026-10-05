const current = location.pathname.split("/").pop() || "index.html";

document.querySelectorAll("[data-nav]").forEach(link => {
    if (link.getAttribute("href") === current) {
        link.classList.add("active");
    }
});

const menuBtn = document.querySelector("#menuBtn");
const mobileNav = document.querySelector("#mobileNav");

if (menuBtn && mobileNav) {
    menuBtn.addEventListener("click", () => {
        mobileNav.classList.toggle("open");
    });
}

function applySavedTheme() {
    const savedTheme = localStorage.getItem("balikTheme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    } else {
        document.body.classList.remove("dark-mode");
    }
}

function setTheme(mode) {
    if (mode === "dark") {
        document.body.classList.add("dark-mode");
        localStorage.setItem("balikTheme", "dark");
    } else {
        document.body.classList.remove("dark-mode");
        localStorage.setItem("balikTheme", "light");
    }
}

function escapeHtml(str) {
    return str.replace(/[&<>"']/g, function(character) {
        const characters = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };
        return characters[character];
    });
}

function saveReminder() {
    const reminderText = document.querySelector("#reminderText")?.value.trim();
    const reminderTime = document.querySelector("#reminderTime")?.value;

    if (!reminderText) {
        alert("Please enter a reminder.");
        return;
    }

    const reminders = JSON.parse(localStorage.getItem("balikReminders") || "[]");
    reminders.push({ text: reminderText, time: reminderTime });
    localStorage.setItem("balikReminders", JSON.stringify(reminders));
    renderReminders();

    document.querySelector("#reminderText").value = "";
    document.querySelector("#reminderTime").value = "";
}

function deleteReminder(index) {
    const reminders = JSON.parse(localStorage.getItem("balikReminders") || "[]");
    reminders.splice(index, 1);
    localStorage.setItem("balikReminders", JSON.stringify(reminders));
    renderReminders();
}

function renderReminders() {
    const reminderList = document.querySelector("#reminderList");
    if (!reminderList) return;

    const reminders = JSON.parse(localStorage.getItem("balikReminders") || "[]");

    if (reminders.length === 0) {
        reminderList.innerHTML = '<p class="muted">No reminders yet.</p>';
        return;
    }

    reminderList.innerHTML = reminders.map((reminder, index) => `
        <div class="list-item">
            <div>
                <strong>${escapeHtml(reminder.text)}</strong>
                <div class="muted">${reminder.time || "No time set"}</div>
            </div>
            <button class="btn btn-outline" onclick="deleteReminder(${index})">Remove</button>
        </div>
    `).join("");
}

function addCustomExercise() {
    const exerciseSelect = document.querySelector("#exerciseSelect");
    const programList = document.querySelector("#customProgramList");

    if (!exerciseSelect || !programList || !exerciseSelect.value) return;

    const item = document.createElement("div");
    item.className = "list-item";

    item.innerHTML = `
        <span>${escapeHtml(exerciseSelect.value)}</span>
        <button class="btn btn-outline" type="button">Remove</button>
    `;

    item.querySelector("button").addEventListener("click", () => item.remove());
    programList.appendChild(item);
}

document.addEventListener("DOMContentLoaded", () => {
    applySavedTheme();
    renderReminders();
});
