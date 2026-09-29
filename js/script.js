/**
 * CareDose — Master Frontend Logic Engine & DRF API Layer
 * Universal Integration: Login, Signup, Alarms, Edit Medicine, Caretaker Portal, Dashboard & Analytics
 */

// ==========================================
// 1. Initial Mock Seed Data
// ==========================================
(function initializeSeedData() {
    if (!localStorage.getItem('caredose_users')) {
        const defaultUsers = [
            { id: 'usr_patient1', name: 'John Doe', email: 'patient@caredose.com', password: 'Password123', role: 'patient', status: 'active', phone: '9876543210' },
            { id: 'usr_caretaker1', name: 'Sarah Care', email: 'caretaker@caredose.com', password: 'Password123', role: 'caretaker', status: 'active', phone: '9876543211' },
            { id: 'usr_admin1', name: 'System Admin', email: 'admin@caredose.com', password: 'AdminPassword1', role: 'admin', status: 'active', phone: '9876543212' }
        ];
        localStorage.setItem('caredose_users', JSON.stringify(defaultUsers));
    }

    if (!localStorage.getItem('profile_usr_patient1')) {
        localStorage.setItem('profile_usr_patient1', JSON.stringify({
            name: 'John Doe',
            age: '45',
            gender: 'Male',
            bloodGroup: 'O+',
            emergencyContact: '+91 9876543210',
            allergies: 'Penicillin'
        }));
    }

    if (!localStorage.getItem('medicines_usr_patient1')) {
        localStorage.setItem('medicines_usr_patient1', JSON.stringify([
            { id: 'med_1', name: 'Paracetamol', dosage: '500 mg', type: 'Tablet', foodTiming: 'After Food', startDate: '2026-08-28', frequency: '1', time: ['08:00', '20:00'] },
            { id: 'med_2', name: 'Metformin', dosage: '500 mg', type: 'Tablet', foodTiming: 'With Food', startDate: '2026-08-28', frequency: '1', time: ['13:00'] }
        ]));
    }

    if (!localStorage.getItem('health_records_usr_patient1')) {
        localStorage.setItem('health_records_usr_patient1', JSON.stringify({
            conditions: [
                { name: 'Type 2 Diabetes', notes: 'Diagnosed in 2023 by Dr. Smith' },
                { name: 'Mild Hypertension', notes: 'Routine checkup monitoring' }
            ],
            vitals: [
                { id: 'v1', type: 'Pulse', value: '78', unit: 'bpm', date: '2026-08-28' },
                { id: 'v2', type: 'Weight', value: '70', unit: 'kg', date: '2026-08-28' },
                { id: 'v3', type: 'Pulse', value: '82', unit: 'bpm', date: '2026-08-26' },
                { id: 'v4', type: 'Weight', value: '70.5', unit: 'kg', date: '2026-08-24' },
                { id: 'v5', type: 'Pulse', value: '76', unit: 'bpm', date: '2026-08-20' },
                { id: 'v6', type: 'Weight', value: '71', unit: 'kg', date: '2026-08-15' }
            ],
            reports: [
                { title: 'Blood Glucose Lab Report', date: '2026-08-10', notes: 'Fasting 110 mg/dL' }
            ],
            prescriptions: []
        }));
    }

    if (!localStorage.getItem('dose_history_usr_patient1')) {
        localStorage.setItem('dose_history_usr_patient1', JSON.stringify([
            { medicineName: 'Paracetamol', dosage: '500 mg', scheduledTime: '08:00', date: '2026-08-28', time: '08:05 AM', status: 'Taken' },
            { medicineName: 'Metformin', dosage: '500 mg', scheduledTime: '13:00', date: '2026-08-28', time: '01:10 PM', status: 'Taken' },
            { medicineName: 'Paracetamol', dosage: '500 mg', scheduledTime: '20:00', date: '2026-08-27', time: '08:00 PM', status: 'Taken' },
            { medicineName: 'Paracetamol', dosage: '500 mg', scheduledTime: '08:00', date: '2026-08-27', time: '08:00 AM', status: 'Missed' },
            { medicineName: 'Metformin', dosage: '500 mg', scheduledTime: '13:00', date: '2026-08-26', time: '01:00 PM', status: 'Taken' }
        ]));
    }

    if (!localStorage.getItem('caretaker_links')) {
        localStorage.setItem('caretaker_links', JSON.stringify([
            {
                patientId: 'usr_patient1',
                caretakerId: 'usr_caretaker1',
                caretakerName: 'Sarah Care',
                caretakerEmail: 'caretaker@caredose.com',
                permissions: {
                    viewSchedule: true,
                    viewAdherence: true,
                    viewVitals: true,
                    viewEmergency: true,
                    canAddMedicine: false
                }
            }
        ]));
    }
})();

// ==========================================
// 2. Storage & REST API Interface
// ==========================================
const CareDoseAPI = {
    getCurrentUser() {
        return JSON.parse(localStorage.getItem('currentUser')) || null;
    },
    setCurrentUser(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    },
    logout() {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    },
    getUsers() {
        return JSON.parse(localStorage.getItem('caredose_users')) || [];
    },
    saveUsers(users) {
        localStorage.setItem('caredose_users', JSON.stringify(users));
    },

    getMedicines(patientId) {
        return JSON.parse(localStorage.getItem(`medicines_${patientId}`)) || [];
    },
    saveMedicines(patientId, medicines) {
        localStorage.setItem(`medicines_${patientId}`, JSON.stringify(medicines));
    },

    getDailyDoseSlots(patientId, dateStr) {
        const key = `daily_doses_${patientId}_${dateStr}`;
        return JSON.parse(localStorage.getItem(key)) || {};
    },
    saveDailyDoseSlot(patientId, dateStr, slotKey, status) {
        const key = `daily_doses_${patientId}_${dateStr}`;
        const slots = this.getDailyDoseSlots(patientId, dateStr);
        slots[slotKey] = status;
        localStorage.setItem(key, JSON.stringify(slots));
    },

    getDoseHistory(patientId) {
        return JSON.parse(localStorage.getItem(`dose_history_${patientId}`)) || [];
    },
    saveDoseHistory(patientId, history) {
        localStorage.setItem(`dose_history_${patientId}`, JSON.stringify(history));
    },

    getHealthRecords(patientId) {
        return JSON.parse(localStorage.getItem(`health_records_${patientId}`)) || {
            conditions: [],
            vitals: [],
            reports: [],
            prescriptions: []
        };
    },
    saveHealthRecords(patientId, records) {
        localStorage.setItem(`health_records_${patientId}`, JSON.stringify(records));
    },

    getNotifications(userId) {
        return JSON.parse(localStorage.getItem(`notifications_${userId}`)) || [];
    },
    saveNotifications(userId, notifs) {
        localStorage.setItem(`notifications_${userId}`, JSON.stringify(notifs));
    },

    getCaretakerLinks() {
        return JSON.parse(localStorage.getItem('caretaker_links')) || [];
    },
    saveCaretakerLinks(links) {
        localStorage.setItem('caretaker_links', JSON.stringify(links));
    },

    getMasterDrugDatabase() {
        return JSON.parse(localStorage.getItem('master_drug_db')) || [
            { id: 'dr_1', name: 'Paracetamol', dosage: '500mg', type: 'Tablet', warnings: 'Do not exceed 4000mg daily. Avoid with liver conditions.', foodWarning: 'After Food' },
            { id: 'dr_2', name: 'Amoxicillin', dosage: '250mg', type: 'Capsule', warnings: 'Complete full course. Watch for penicillin allergy.', foodWarning: 'Before Food' },
            { id: 'dr_3', name: 'Metformin', dosage: '500mg', type: 'Tablet', warnings: 'Take with meals to minimize gastrointestinal discomfort.', foodWarning: 'With Food' }
        ];
    },
    saveMasterDrugDatabase(db) {
        localStorage.setItem('master_drug_db', JSON.stringify(db));
    }
};

// ==========================================
// 3. UI Helpers & Global Theme
// ==========================================
(function applyGlobalThemeImmediately() {
    const savedTheme = localStorage.getItem('caredose_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
})();

window.toggleGlobalTheme = function() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const target = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', target);
    localStorage.setItem('caredose_theme', target);
    showToast(`Switched to ${target.toUpperCase()} mode 🌓`, 'info');
};

function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'}</span> <div>${message}</div>`;
    container.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 3500);
}

function togglePassword(inputId, el) {
    const input = document.getElementById(inputId);
    if (input) {
        input.type = input.type === 'password' ? 'text' : 'password';
        el.style.opacity = input.type === 'text' ? '1' : '0.6';
    }
}

function requireAuth(allowedRoles = []) {
    const user = CareDoseAPI.getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
        return null;
    }
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        showToast('Access denied for this role', 'error');
        if (user.role === 'admin') window.location.href = 'admin.html';
        else if (user.role === 'caretaker') window.location.href = 'caretaker.html';
        else window.location.href = 'dashboard.html';
        return null;
    }
    return user;
}

// ==========================================
// 4. Continuous Alarm Audio Engine
// ==========================================
let alarmAudioContext = null;
let alarmIntervalId = null;

function startContinuousAlarm() {
    stopContinuousAlarm();
    const tone = localStorage.getItem('caredose_alarm_sound') || 'chime';

    const playTonePattern = () => {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            if (!alarmAudioContext || alarmAudioContext.state === 'closed') {
                alarmAudioContext = new AudioContext();
            }

            const ctx = alarmAudioContext;
            const now = ctx.currentTime;

            if (tone === 'digital') {
                [0, 0.15, 0.3].forEach(offset => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.type = 'square';
                    osc.frequency.setValueAtTime(1046.5, now + offset);
                    gain.gain.setValueAtTime(0.2, now + offset);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.1);
                    osc.start(now + offset);
                    osc.stop(now + offset + 0.12);
                });
            } else if (tone === 'bell') {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(800, now);
                gain.gain.setValueAtTime(0.4, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
                osc.start(now);
                osc.stop(now + 0.75);
            } else {
                [0, 0.25].forEach((offset, i) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(i === 0 ? 659.25 : 880, now + offset);
                    gain.gain.setValueAtTime(0.3, now + offset);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.22);
                    osc.start(now + offset);
                    osc.stop(now + offset + 0.24);
                });
            }
        } catch (e) {
            console.warn('Audio Context waiting for user gesture:', e);
        }
    };

    playTonePattern();
    alarmIntervalId = setInterval(playTonePattern, 1500);
}

function stopContinuousAlarm() {
    if (alarmIntervalId) {
        clearInterval(alarmIntervalId);
        alarmIntervalId = null;
    }
}

function showAlarmModal(medicine, time) {
    let existing = document.getElementById('caredose-alarm-modal');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'caredose-alarm-modal';
    overlay.className = 'custom-modal-overlay active';
    overlay.style.zIndex = '99999';

    overlay.innerHTML = `
        <div class="custom-modal" style="text-align: center; border-top: 6px solid var(--danger);">
            <div style="font-size: 3rem; margin-bottom: 0.5rem; animation: pulse 1s infinite;">⏰</div>
            <h2 style="color: var(--danger); margin-bottom: 0.25rem;">MEDICINE ALARM RINGING!</h2>
            <p style="font-size: 1.1rem; color: var(--text-main); margin-bottom: 0.5rem;">
                Time to take <b>${medicine.name}</b> (${medicine.dosage})
            </p>
            <div class="info-box" style="text-align: left; margin: 1rem 0;">
                <p>⏰ <b>Scheduled Time:</b> ${time}</p>
                <p>🍽️ <b>Instruction:</b> ${medicine.foodTiming || 'Anytime'}</p>
            </div>
            <div style="display: flex; gap: 0.75rem; justify-content: center; margin-top: 1.25rem;">
                <button class="btn btn-success" onclick="takeDoseFromAlarm('${medicine.id}', '${time}')">
                    ✅ Take Now
                </button>
                <button class="btn btn-warning" onclick="snoozeAlarm('${medicine.id}', '${time}')">
                    ⏳ Snooze 5 Min
                </button>
                <button class="btn btn-outline" onclick="closeAlarmModal()">
                    Dismiss
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
    startContinuousAlarm();

    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`CareDose Reminder: ${medicine.name}`, {
            body: `Scheduled for ${time} (${medicine.foodTiming || 'Anytime'}).`,
            icon: 'images/doctor.png'
        });
    }
}

window.closeAlarmModal = function() {
    stopContinuousAlarm();
    const modal = document.getElementById('caredose-alarm-modal');
    if (modal) modal.remove();
};

window.takeDoseFromAlarm = function(medId, time) {
    stopContinuousAlarm();
    updateDoseSlotState(medId, time, 'Taken');
    closeAlarmModal();
    showToast('Medicine marked as Taken! ✅', 'success');
};

window.snoozeAlarm = function(medId, time) {
    stopContinuousAlarm();
    closeAlarmModal();
    showToast(`Alarm for ${time} snoozed for 5 minutes`, 'info');
};

function startReminderDaemon() {
    setInterval(() => {
        const user = CareDoseAPI.getCurrentUser();
        if (!user || user.role !== 'patient') return;

        const now = new Date();
        const currentHours = now.getHours().toString().padStart(2, '0');
        const currentMinutes = now.getMinutes().toString().padStart(2, '0');
        const currentTimeStr = `${currentHours}:${currentMinutes}`;
        const todayDateStr = now.toISOString().split('T')[0];

        const medicines = CareDoseAPI.getMedicines(user.id);
        const dailySlots = CareDoseAPI.getDailyDoseSlots(user.id, todayDateStr);
        const alertedKey = `alerted_${user.id}_${todayDateStr}`;
        let alertedList = JSON.parse(localStorage.getItem(alertedKey)) || [];

        medicines.forEach(med => {
            const times = Array.isArray(med.time) ? med.time : [med.time];
            times.forEach(t => {
                const slotKey = `${med.id}_${t}`;
                const isTaken = dailySlots[slotKey] === 'Taken';

                if (t === currentTimeStr && !isTaken && !alertedList.includes(slotKey)) {
                    alertedList.push(slotKey);
                    localStorage.setItem(alertedKey, JSON.stringify(alertedList));

                    showAlarmModal(med, t);

                    const notifs = CareDoseAPI.getNotifications(user.id);
                    notifs.unshift({
                        id: 'notif_' + Date.now(),
                        title: `Medicine Reminder: ${med.name}`,
                        message: `It is ${t}. Please take your ${med.dosage} (${med.foodTiming || 'Anytime'}).`,
                        date: 'Just now',
                        read: false
                    });
                    CareDoseAPI.saveNotifications(user.id, notifs);
                    updateNotificationBadge(user.id);
                }
            });
        });
    }, 3000);
}

function updateNotificationBadge(userId) {
    const badge = document.getElementById('notif-badge');
    if (!badge) return;
    const notifs = CareDoseAPI.getNotifications(userId);
    const unreadCount = notifs.filter(n => !n.read).length;
    badge.innerText = unreadCount;
    badge.style.display = unreadCount > 0 ? 'inline-block' : 'none';
}

// ==========================================
// 5. Medicine Management & EDIT Modal Logic
// ==========================================
function initMedicinePage() {
    const addBtn = document.getElementById('addMedicineBtn');
    if (!addBtn) return;

    const user = requireAuth();
    if (!user) return;

    const doseCountSelect = document.getElementById('doseCount');
    const timeContainer = document.getElementById('timeContainer');
    if (doseCountSelect && timeContainer) {
        doseCountSelect.addEventListener('change', () => {
            const count = parseInt(doseCountSelect.value) || 1;
            timeContainer.innerHTML = '';
            for (let i = 0; i < count; i++) {
                const input = document.createElement('input');
                input.type = 'time';
                input.className = 'medicineTime';
                const hour = (8 + i * 4).toString().padStart(2, '0');
                input.value = `${hour}:00`;
                input.style.marginBottom = '0.4rem';
                timeContainer.appendChild(input);
            }
        });
    }

    renderMedicineList(user.id);

    addBtn.addEventListener('click', () => {
        const nameInput = document.getElementById('medicineName');
        const dosageInput = document.getElementById('dosage');
        const typeInput = document.getElementById('medicineType');
        const foodTimingInput = document.getElementById('foodTiming');
        const startDateInput = document.getElementById('startDate');
        const durationInput = document.getElementById('duration');
        const endDateInput = document.getElementById('endDate');
        const frequencyInput = document.getElementById('frequency');

        const name = nameInput ? nameInput.value.trim() : '';
        const dosage = dosageInput ? dosageInput.value.trim() : '';
        const type = typeInput ? typeInput.value : 'Tablet';
        const foodTiming = foodTimingInput ? foodTimingInput.value : 'After Food';
        const startDate = startDateInput && startDateInput.value ? startDateInput.value : new Date().toISOString().split('T')[0];
        const duration = durationInput ? durationInput.value : '7';
        const endDate = (duration === 'custom' && endDateInput) ? endDateInput.value : null;
        const frequency = frequencyInput ? frequencyInput.value : '1';

        if (!name || !dosage) {
            showToast('Please enter both Medicine Name and Dosage!', 'warning');
            return;
        }

        const existingMeds = CareDoseAPI.getMedicines(user.id);
        if (existingMeds.some(m => m.name.toLowerCase() === name.toLowerCase())) {
            if (!confirm(`Warning: "${name}" is already in your schedule. Do you wish to add another dose?`)) {
                return;
            }
        }

        const timeInputs = document.querySelectorAll('.medicineTime');
        let times = Array.from(timeInputs).map(inp => inp.value).filter(Boolean);
        if (times.length === 0) times = ['08:00'];

        const newMedicine = {
            id: 'med_' + Date.now(),
            name,
            dosage,
            type,
            foodTiming,
            startDate,
            duration,
            endDate,
            frequency,
            time: times
        };

        existingMeds.push(newMedicine);
        CareDoseAPI.saveMedicines(user.id, existingMeds);
        showToast(`"${name}" added to schedule! Reminder active for ${times.join(', ')}`, 'success');

        if (nameInput) nameInput.value = '';
        if (dosageInput) dosageInput.value = '';

        renderMedicineList(user.id);
    });
}

function renderMedicineList(patientId) {
    const container = document.getElementById('medicine-container');
    if (!container) return;

    const medicines = CareDoseAPI.getMedicines(patientId);
    if (medicines.length === 0) {
        container.innerHTML = '<p>No medicines added yet.</p>';
        return;
    }

    container.innerHTML = '';
    medicines.forEach(m => {
        const div = document.createElement('div');
        div.className = 'med-item-card';
        div.innerHTML = `
            <div>
                <h4>💊 ${m.name} (${m.dosage}) - ${m.type || 'Medicine'}</h4>
                <p class="med-item-meta">⏰ ${Array.isArray(m.time) ? m.time.join(', ') : m.time} | 🍽️ ${m.foodTiming || 'Anytime'}</p>
                <small style="color:var(--text-muted);">Frequency: Every ${m.frequency || '1'} Day(s)</small>
            </div>
            <div style="display: flex; gap: 0.4rem;">
                <button class="btn btn-sm btn-outline" onclick="openEditModal('${m.id}')">✏️ Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteMedicine('${m.id}')">Delete</button>
            </div>
        `;
        container.appendChild(div);
    });
}

window.openEditModal = function(medId) {
    const user = CareDoseAPI.getCurrentUser();
    if (!user) return;

    const medicines = CareDoseAPI.getMedicines(user.id);
    const med = medicines.find(m => m.id === medId);
    if (!med) return;

    document.getElementById('editMedId').value = med.id;
    document.getElementById('editMedName').value = med.name;
    document.getElementById('editDosage').value = med.dosage;
    document.getElementById('editMedType').value = med.type || 'Tablet';
    document.getElementById('editMedTimes').value = Array.isArray(med.time) ? med.time.join(', ') : med.time;
    document.getElementById('editFoodTiming').value = med.foodTiming || 'After Food';
    document.getElementById('editFrequency').value = med.frequency || '1';

    document.getElementById('editMedicineModal').classList.add('active');
};

window.closeEditModal = function() {
    const modal = document.getElementById('editMedicineModal');
    if (modal) modal.classList.remove('active');
};

window.saveEditedMedicine = function() {
    const user = CareDoseAPI.getCurrentUser();
    if (!user) return;

    const medId = document.getElementById('editMedId').value;
    let medicines = CareDoseAPI.getMedicines(user.id);
    const med = medicines.find(m => m.id === medId);

    if (med) {
        med.name = document.getElementById('editMedName').value.trim();
        med.dosage = document.getElementById('editDosage').value.trim();
        med.type = document.getElementById('editMedType').value;
        med.foodTiming = document.getElementById('editFoodTiming').value;
        med.frequency = document.getElementById('editFrequency').value;

        const timesStr = document.getElementById('editMedTimes').value;
        med.time = timesStr.split(',').map(t => t.trim()).filter(Boolean);

        CareDoseAPI.saveMedicines(user.id, medicines);
        showToast('Medicine schedule updated successfully! ✅', 'success');
        closeEditModal();
        renderMedicineList(user.id);
    }
};

window.deleteMedicine = function(medId) {
    const user = CareDoseAPI.getCurrentUser();
    if (!user) return;
    let medicines = CareDoseAPI.getMedicines(user.id);
    medicines = medicines.filter(m => m.id !== medId);
    CareDoseAPI.saveMedicines(user.id, medicines);
    showToast('Medicine removed from schedule', 'info');
    renderMedicineList(user.id);
};

// ==========================================
// 6. Dashboard Engine & Immediate Status Sync
// ==========================================
function initDashboard() {
    const todayMedicinesDiv = document.getElementById('today-medicines');
    if (!todayMedicinesDiv) return;

    const user = requireAuth(['patient']);
    if (!user) return;

    const welcomeMsg = document.getElementById('welcomeMessage');
    if (welcomeMsg) welcomeMsg.innerText = `Good Day, ${user.name} 👋`;

    const todayDateStr = new Date().toISOString().split('T')[0];
    const medicines = CareDoseAPI.getMedicines(user.id);
    const dailySlots = CareDoseAPI.getDailyDoseSlots(user.id, todayDateStr);

    let doseList = [];

    medicines.forEach(med => {
        const times = Array.isArray(med.time) ? med.time : [med.time];
        times.forEach(t => {
            const slotKey = `${med.id}_${t}`;
            const slotStatus = dailySlots[slotKey] || 'Pending';

            doseList.push({
                medId: med.id,
                name: med.name,
                dosage: med.dosage,
                foodTiming: med.foodTiming,
                time: t,
                slotKey: slotKey,
                status: slotStatus
            });
        });
    });

    doseList.sort((a, b) => a.time.localeCompare(b.time));

    const total = doseList.length;
    const taken = doseList.filter(d => d.status === 'Taken').length;
    const pending = doseList.filter(d => d.status === 'Pending').length;

    document.getElementById('total-medicines') && (document.getElementById('total-medicines').innerText = total);
    document.getElementById('taken-medicines') && (document.getElementById('taken-medicines').innerText = taken);
    document.getElementById('pending-medicines') && (document.getElementById('pending-medicines').innerText = pending);

    const progressPercent = total > 0 ? Math.round((taken / total) * 100) : 0;
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    if (progressFill) progressFill.style.width = `${progressPercent}%`;
    if (progressText) progressText.innerText = `${progressPercent}% Completed`;

    if (doseList.length === 0) {
        todayMedicinesDiv.innerHTML = '<p>No medicines scheduled for today.</p>';
    } else {
        todayMedicinesDiv.innerHTML = '';
        doseList.forEach(d => {
            const item = document.createElement('div');
            item.className = `med-item-card ${d.status.toLowerCase()}`;
            item.innerHTML = `
                <div class="med-item-info">
                    <h4>💊 ${d.name} (${d.dosage})</h4>
                    <div class="med-item-meta">⏰ <b>${d.time}</b> | 🍽️ ${d.foodTiming || 'Anytime'}</div>
                </div>
                <div style="display: flex; gap: 0.4rem; align-items: center; flex-wrap: wrap;">
                    <span class="status-badge status-${d.status.toLowerCase()}">${d.status}</span>
                    ${d.status !== 'Taken' ? `
                        <button class="btn btn-sm btn-success" onclick="updateDoseSlotState('${d.medId}', '${d.time}', 'Taken')">Take Now</button>
                        <button class="btn btn-sm btn-outline" onclick="updateDoseSlotState('${d.medId}', '${d.time}', 'Skipped')">Skip</button>
                    ` : `
                        <button class="btn btn-sm btn-secondary" onclick="updateDoseSlotState('${d.medId}', '${d.time}', 'Pending')">Undo</button>
                    `}
                </div>
            `;
            todayMedicinesDiv.appendChild(item);
        });
    }

    const userProfile = JSON.parse(localStorage.getItem(`profile_${user.id}`)) || {};
    document.getElementById('dashboard-profile-name') && (document.getElementById('dashboard-profile-name').innerText = user.name || 'Not Added');
    document.getElementById('dashboard-blood-group') && (document.getElementById('dashboard-blood-group').innerText = userProfile.bloodGroup || 'Not Added');
    document.getElementById('dashboard-emergency-contact') && (document.getElementById('dashboard-emergency-contact').innerText = userProfile.emergencyContact || 'Not Added');
    document.getElementById('dashboard-allergies') && (document.getElementById('dashboard-allergies').innerText = userProfile.allergies || 'None');

    updateNotificationBadge(user.id);
}

window.updateDoseSlotState = function(medId, time, newState) {
    const user = CareDoseAPI.getCurrentUser();
    if (!user) return;

    const todayDateStr = new Date().toISOString().split('T')[0];
    const slotKey = `${medId}_${time}`;

    CareDoseAPI.saveDailyDoseSlot(user.id, todayDateStr, slotKey, newState);

    const medicines = CareDoseAPI.getMedicines(user.id);
    const med = medicines.find(m => m.id === medId);
    if (med) {
        const history = CareDoseAPI.getDoseHistory(user.id);
        history.unshift({
            medicineName: med.name,
            dosage: med.dosage,
            scheduledTime: time,
            date: todayDateStr,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: newState
        });
        CareDoseAPI.saveDoseHistory(user.id, history);
    }

    showToast(`Dose at ${time} marked as ${newState}`, 'success');
    initDashboard();
};

// ==========================================
// 7. Profile & Granular Caretaker Controls
// ==========================================
function initHealthProfile() {
    const user = CareDoseAPI.getCurrentUser();
    if (!user) return;

    const saveProfileBtn = document.getElementById('saveProfileBtn');
    const profileData = JSON.parse(localStorage.getItem(`profile_${user.id}`)) || {};

    if (document.getElementById('profileName')) document.getElementById('profileName').value = profileData.name || user.name || '';
    if (document.getElementById('profileAge')) document.getElementById('profileAge').value = profileData.age || '';
    if (document.getElementById('profileGender')) document.getElementById('profileGender').value = profileData.gender || '';
    if (document.getElementById('bloodGroup')) document.getElementById('bloodGroup').value = profileData.bloodGroup || '';
    if (document.getElementById('emergencyContact')) document.getElementById('emergencyContact').value = profileData.emergencyContact || '';
    if (document.getElementById('allergies')) document.getElementById('allergies').value = profileData.allergies || '';

    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', () => {
            const updated = {
                name: document.getElementById('profileName').value.trim(),
                age: document.getElementById('profileAge').value.trim(),
                gender: document.getElementById('profileGender').value,
                bloodGroup: document.getElementById('bloodGroup').value.trim(),
                emergencyContact: document.getElementById('emergencyContact').value.trim(),
                allergies: document.getElementById('allergies').value.trim()
            };
            localStorage.setItem(`profile_${user.id}`, JSON.stringify(updated));
            showToast('Health profile saved successfully!', 'success');
        });
    }

    const linkCaretakerBtn = document.getElementById('linkCaretakerBtn');
    if (linkCaretakerBtn) {
        linkCaretakerBtn.addEventListener('click', () => {
            const ctEmail = document.getElementById('caretakerEmail').value.trim().toLowerCase();
            const users = CareDoseAPI.getUsers();
            const caretaker = users.find(u => u.email === ctEmail && u.role === 'caretaker');

            if (!caretaker) {
                showToast('No registered Caretaker found with that email.', 'error');
                return;
            }

            let links = CareDoseAPI.getCaretakerLinks();
            links = links.filter(l => !(l.patientId === user.id && l.caretakerId === caretaker.id));

            links.push({
                patientId: user.id,
                caretakerId: caretaker.id,
                caretakerName: caretaker.name,
                caretakerEmail: caretaker.email,
                permissions: {
                    viewSchedule: document.getElementById('permSchedule') ? document.getElementById('permSchedule').checked : true,
                    viewAdherence: document.getElementById('permAdherence') ? document.getElementById('permAdherence').checked : true,
                    viewVitals: document.getElementById('permVitals') ? document.getElementById('permVitals').checked : false,
                    viewEmergency: document.getElementById('permEmergency') ? document.getElementById('permEmergency').checked : true,
                    canAddMedicine: false
                }
            });

            CareDoseAPI.saveCaretakerLinks(links);
            showToast(`Caretaker ${caretaker.name} linked with granular permissions!`, 'success');
            document.getElementById('caretakerStatus') && (document.getElementById('caretakerStatus').innerText = `Linked: ${caretaker.name} (${caretaker.email})`);
        });
    }
}

// ==========================================
// 8. Caretaker Portal Engine
// ==========================================
let caretakerTrendsChartInstance = null;

function initCaretakerPage() {
    const ctWelcome = document.getElementById('caretakerWelcome');
    if (!ctWelcome) return;

    const user = requireAuth(['caretaker']);
    if (!user) return;

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
    ctWelcome.innerText = `${greeting}, ${user.name} 👋`;

    const links = CareDoseAPI.getCaretakerLinks().filter(l => l.caretakerId === user.id);
    const selectorWrapper = document.getElementById('patientSelectorWrapper');
    const dropdown = document.getElementById('patientSelectDropdown');

    if (links.length === 0) {
        const grid = document.querySelector('.dashboard-grid');
        if (grid) {
            grid.innerHTML = `
                <div class="card" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🧑‍⚕️</div>
                    <h3>No Linked Patients</h3>
                    <p>You have not been linked to any patients yet. Ask your patient to enter your email (<b>${user.email}</b>) in their Profile page to grant you monitoring access.</p>
                </div>
            `;
        }
        return;
    }

    if (selectorWrapper && dropdown) {
        selectorWrapper.style.display = 'flex';
        dropdown.innerHTML = '';
        const users = CareDoseAPI.getUsers();

        links.forEach(l => {
            const patientUser = users.find(u => u.id === l.patientId);
            const name = patientUser ? patientUser.name : (l.patientName || 'Patient');
            const opt = document.createElement('option');
            opt.value = l.patientId;
            opt.innerText = name;
            dropdown.appendChild(opt);
        });

        let selectedPatientId = localStorage.getItem('caretaker_selected_patient_' + user.id);
        if (!selectedPatientId || !links.some(l => l.patientId === selectedPatientId)) {
            selectedPatientId = links[0].patientId;
        }
        dropdown.value = selectedPatientId;
        renderCaretakerViewForPatient(user, selectedPatientId);
    }
}

window.onSelectedPatientChange = function(newPatientId) {
    const user = CareDoseAPI.getCurrentUser();
    if (!user) return;
    localStorage.setItem('caretaker_selected_patient_' + user.id, newPatientId);
    renderCaretakerViewForPatient(user, newPatientId);
};

function renderCaretakerViewForPatient(caretakerUser, patientId) {
    const links = CareDoseAPI.getCaretakerLinks().filter(l => l.caretakerId === caretakerUser.id);
    const link = links.find(l => l.patientId === patientId) || links[0];
    const perms = link ? (link.permissions || {}) : {};

    const allUsers = CareDoseAPI.getUsers();
    const patientUser = allUsers.find(u => u.id === patientId);
    const patientName = patientUser ? patientUser.name : 'Patient';

    const profile = JSON.parse(localStorage.getItem(`profile_${patientId}`)) || {};
    const medicines = CareDoseAPI.getMedicines(patientId);
    const history = CareDoseAPI.getDoseHistory(patientId);
    const healthRecords = CareDoseAPI.getHealthRecords(patientId);
    const todayDateStr = new Date().toISOString().split('T')[0];
    const dailySlots = CareDoseAPI.getDailyDoseSlots(patientId, todayDateStr);

    const permListEl = document.getElementById('grantedPermissionsList');
    if (permListEl) {
        permListEl.innerHTML = `
            <span class="permission-badge-pill"><i class="fa-solid fa-check" style="color:var(--success);"></i> Schedule</span>
            <span class="permission-badge-pill" style="opacity: ${perms.viewAdherence ? '1' : '0.4'}"><i class="fa-solid ${perms.viewAdherence ? 'fa-check' : 'fa-xmark'}" style="color:${perms.viewAdherence ? 'var(--success)' : 'var(--danger)'};"></i> Adherence</span>
            <span class="permission-badge-pill" style="opacity: ${perms.viewVitals ? '1' : '0.4'}"><i class="fa-solid ${perms.viewVitals ? 'fa-check' : 'fa-xmark'}" style="color:${perms.viewVitals ? 'var(--success)' : 'var(--danger)'};"></i> Vitals</span>
            <span class="permission-badge-pill" style="opacity: ${perms.viewEmergency ? '1' : '0.4'}"><i class="fa-solid ${perms.viewEmergency ? 'fa-check' : 'fa-xmark'}" style="color:${perms.viewEmergency ? 'var(--success)' : 'var(--danger)'};"></i> Emergency</span>
        `;
    }

    const addMedBtn = document.getElementById('ctAddMedicineBtn');
    if (addMedBtn) addMedBtn.style.display = perms.canAddMedicine ? 'block' : 'none';

    document.getElementById('poName') && (document.getElementById('poName').innerText = patientName);
    document.getElementById('poAgeGender') && (document.getElementById('poAgeGender').innerText = `${profile.age ? profile.age + ' yrs' : 'Not Added'} / ${profile.gender || 'Not Added'}`);
    document.getElementById('poBlood') && (document.getElementById('poBlood').innerText = perms.viewEmergency ? (profile.bloodGroup || 'Not Added') : '[Restricted by Patient]');
    document.getElementById('poEmergency') && (document.getElementById('poEmergency').innerText = perms.viewEmergency ? (profile.emergencyContact || 'Not Added') : '[Restricted by Patient]');
    document.getElementById('poAllergies') && (document.getElementById('poAllergies').innerText = perms.viewEmergency ? (profile.allergies || 'None Reported') : '[Restricted by Patient]');
    document.getElementById('poConditions') && (document.getElementById('poConditions').innerText = perms.viewVitals ? (healthRecords.conditions.map(c => c.name).join(', ') || 'None Documented') : '[Restricted by Patient]');

    if (perms.viewEmergency) {
        document.getElementById('emgContact') && (document.getElementById('emgContact').innerText = profile.emergencyContact || patientUser?.phone || 'Not Added');
        document.getElementById('emgBlood') && (document.getElementById('emgBlood').innerText = profile.bloodGroup || 'Not Added');
        document.getElementById('emgAllergies') && (document.getElementById('emgAllergies').innerText = profile.allergies || 'None Reported');
        const callBtn = document.getElementById('callEmergencyBtn');
        if (callBtn && profile.emergencyContact) callBtn.href = 'tel:' + profile.emergencyContact;
    }

    const todayContainer = document.getElementById('caretakerTodayMedicines');
    if (todayContainer) {
        document.getElementById('todayDateLabel') && (document.getElementById('todayDateLabel').innerText = new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }));

        let todayDoses = [];
        medicines.forEach(m => {
            const times = Array.isArray(m.time) ? m.time : [m.time];
            times.forEach(t => {
                const slotKey = `${m.id}_${t}`;
                todayDoses.push({
                    medId: m.id,
                    name: m.name,
                    dosage: m.dosage,
                    foodTiming: m.foodTiming,
                    time: t,
                    slotKey: slotKey,
                    status: dailySlots[slotKey] || 'Pending'
                });
            });
        });

        todayDoses.sort((a, b) => a.time.localeCompare(b.time));

        if (todayDoses.length === 0) {
            todayContainer.innerHTML = '<p style="color:var(--text-muted);">No medicines scheduled for today.</p>';
        } else {
            todayContainer.innerHTML = '';
            todayDoses.forEach(d => {
                const item = document.createElement('div');
                item.className = `med-item-card ${d.status.toLowerCase()}`;
                item.innerHTML = `
                    <div class="med-item-info">
                        <h4>💊 ${d.name} (${d.dosage})</h4>
                        <div class="med-item-meta">⏰ <b>${d.time}</b> | 🍽️ ${d.foodTiming || 'Anytime'}</div>
                    </div>
                    <div>
                        <span class="status-badge status-${d.status.toLowerCase()}">${d.status}</span>
                    </div>
                `;
                todayContainer.appendChild(item);
            });
        }
    }

    if (perms.viewAdherence) {
        const total = history.length;
        const taken = history.filter(h => h.status === 'Taken').length;
        const missed = history.filter(h => h.status === 'Missed').length;
        const adherencePct = total > 0 ? Math.round((taken / total) * 100) : 100;

        document.getElementById('ct-adherence-pct') && (document.getElementById('ct-adherence-pct').innerText = `${adherencePct}%`);
        document.getElementById('ct-doses-taken') && (document.getElementById('ct-doses-taken').innerText = taken);
        document.getElementById('ct-doses-missed') && (document.getElementById('ct-doses-missed').innerText = missed);
        document.getElementById('ct-adherence-progress') && (document.getElementById('ct-adherence-progress').style.width = `${adherencePct}%`);
        document.getElementById('ct-adherence-text') && (document.getElementById('ct-adherence-text').innerText = `${adherencePct}% overall adherence rate`);
    }

    if (perms.viewVitals && typeof Chart !== 'undefined') {
        renderHealthTrendsGraph(healthRecords.vitals, 7);
    }

    const recordsListEl = document.getElementById('ctHealthRecordsList');
    if (recordsListEl && perms.viewVitals) {
        if (healthRecords.vitals.length === 0 && healthRecords.conditions.length === 0) {
            recordsListEl.innerHTML = '<p style="color:var(--text-muted);">No health records logged.</p>';
        } else {
            recordsListEl.innerHTML = '';
            healthRecords.vitals.slice(0, 4).forEach(v => {
                recordsListEl.innerHTML += `
                    <div class="med-item-card" style="padding: 0.6rem 0.8rem; margin-bottom: 0.4rem;">
                        <div><b>${v.type}:</b> ${v.value} ${v.unit || ''}</div>
                        <small style="color:var(--text-muted);">${v.date}</small>
                    </div>
                `;
            });
        }
    }

    const allMedsEl = document.getElementById('caretakerAllMedicines');
    if (allMedsEl) {
        if (medicines.length === 0) {
            allMedsEl.innerHTML = '<p style="color:var(--text-muted);">No active prescriptions found.</p>';
        } else {
            allMedsEl.innerHTML = '';
            medicines.forEach(m => {
                allMedsEl.innerHTML += `
                    <div class="med-item-card">
                        <div>
                            <h4>💊 ${m.name} (${m.dosage}) - ${m.type || 'Medicine'}</h4>
                            <p class="med-item-meta">⏰ ${Array.isArray(m.time) ? m.time.join(', ') : m.time} | 🍽️ ${m.foodTiming || 'Anytime'} | Frequency: Every ${m.frequency || '1'} Day(s)</p>
                        </div>
                        <span class="status-badge status-upcoming">Active</span>
                    </div>
                `;
            });
        }
    }
}

function renderHealthTrendsGraph(vitalsList, daysLimit = 7) {
    const canvas = document.getElementById('caretakerTrendsChart');
    if (!canvas) return;

    const noMsg = document.getElementById('noTrendsMsg');
    const pulseVitals = vitalsList.filter(v => v.type === 'Pulse').slice(0, daysLimit).reverse();
    const weightVitals = vitalsList.filter(v => v.type === 'Weight').slice(0, daysLimit).reverse();

    if (pulseVitals.length === 0 && weightVitals.length === 0) {
        canvas.style.display = 'none';
        if (noMsg) noMsg.style.display = 'block';
        return;
    }

    canvas.style.display = 'block';
    if (noMsg) noMsg.style.display = 'none';

    const labels = pulseVitals.map(v => v.date || 'Day');
    const pulseData = pulseVitals.map(v => parseFloat(v.value) || 0);
    const weightData = weightVitals.map(v => parseFloat(v.value) || 0);

    if (caretakerTrendsChartInstance) {
        caretakerTrendsChartInstance.destroy();
    }

    const ctx = canvas.getContext('2d');
    caretakerTrendsChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels.length > 0 ? labels : ['Day 1', 'Day 2', 'Day 3', 'Day 4'],
            datasets: [
                {
                    label: 'Pulse (bpm)',
                    data: pulseData.length > 0 ? pulseData : [72, 75, 78, 80],
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.3,
                    fill: true
                },
                {
                    label: 'Weight (kg)',
                    data: weightData.length > 0 ? weightData : [70, 70.2, 70, 69.8],
                    borderColor: '#0d9488',
                    backgroundColor: 'rgba(13, 148, 136, 0.1)',
                    tension: 0.3,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'top' } },
            scales: { y: { beginAtZero: false } }
        }
    });
}

// ==========================================
// 9. MASTER DOCUMENT READY INITIALIZER
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Logout Action
    const logoutBtns = document.querySelectorAll('#logoutBtn, .logout-btn');
    logoutBtns.forEach(btn => btn.addEventListener('click', (e) => {
        e.preventDefault();
        CareDoseAPI.logout();
    }));

    // 2. Signup Form Submission Handler
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('signupName').value.trim();
            const email = document.getElementById('signupEmail').value.trim().toLowerCase();
            const phone = document.getElementById('signupPhone').value.trim();
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const role = document.getElementById('userType').value;

            if (password !== confirmPassword) {
                showToast('Passwords do not match!', 'error');
                return;
            }

            const users = CareDoseAPI.getUsers();
            if (users.some(u => u.email === email)) {
                showToast('Email already registered! Please login.', 'error');
                return;
            }

            const newUser = { id: 'usr_' + Date.now(), name, email, phone, password, role, status: 'active' };
            users.push(newUser);
            CareDoseAPI.saveUsers(users);
            CareDoseAPI.setCurrentUser(newUser);

            showToast('Account created successfully!', 'success');
            setTimeout(() => {
                if (role === 'admin') window.location.href = 'admin.html';
                else if (role === 'caretaker') window.location.href = 'caretaker.html';
                else window.location.href = 'dashboard.html';
            }, 800);
        });
    }

    // 3. Login Form Submission Handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value.trim().toLowerCase();
            const password = document.getElementById('loginPassword').value;

            const users = CareDoseAPI.getUsers();
            const user = users.find(u => u.email === email && u.password === password);

            if (!user) {
                showToast('Invalid email or password', 'error');
                return;
            }
            if (user.status === 'deactivated') {
                showToast('Account deactivated by administrator.', 'error');
                return;
            }

            CareDoseAPI.setCurrentUser(user);
            showToast(`Welcome back, ${user.name}!`, 'success');
            setTimeout(() => {
                if (user.role === 'admin') window.location.href = 'admin.html';
                else if (user.role === 'caretaker') window.location.href = 'caretaker.html';
                else window.location.href = 'dashboard.html';
            }, 800);
        });
    }

    // 4. Initialize Specific Page Modules
    initDashboard();
    initMedicinePage();
    initHealthProfile();
    initCaretakerPage();

    // 5. Start Background Alarms & Request Notification Permission
    startReminderDaemon();
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
});