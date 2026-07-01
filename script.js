document.addEventListener('DOMContentLoaded', () => {
    // State
    let selectedDate = '';
    let selectedTime = '';
    let selectedMood = 50;
    let selectedFood = '';
    let selectedMusic = '';

    // Elements
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const step3 = document.getElementById('step-3');
    const step4 = document.getElementById('step-4');
    const step5 = document.getElementById('step-5');
    const step6 = document.getElementById('step-6');
    const stepLoading = document.getElementById('step-loading');
    const step7 = document.getElementById('step-7');

    const btnYes = document.getElementById('btn-yes');
    const btnNo = document.getElementById('btn-no');
    const btnNext2 = document.getElementById('btn-next-2');

    // Step 3 Elements
    const datePicker = document.getElementById('date-picker');
    const timePicker = document.getElementById('time-picker');
    const terminalLog = document.getElementById('overthinking-log');
    const btnNext3 = document.getElementById('btn-next-3');

    // Step 4 Elements
    const moodSlider = document.getElementById('mood-slider');
    const btnNext4 = document.getElementById('btn-next-4');

    // Step 5 & 6 Elements
    const dynamicFoodGrid = document.getElementById('dynamic-food-grid');
    const btnNext5 = document.getElementById('btn-next-5');
    const musicCards = document.querySelectorAll('.music-card');
    const btnNext6 = document.getElementById('btn-next-6');

    // Confirmation Elements
    const summaryText = document.getElementById('summary-text');
    const btnDownload = document.getElementById('btn-download');
    const btnCopy = document.getElementById('btn-copy');

    // Content Arrays (Local Ghanaian Cuisine & Snacks)
    const lowKeyOptions = [
        "Kelewele 🌶️",
        "Beans & Plantain 🍛",
        "Bofrot (Doughnuts) 🍩",
        "Indomie & Fried Egg 🍳"
    ];

    const energeticOptions = [
        "Jollof Rice 🍚",
        "Banku & Grilled Tilapia 🐟",
        "Waakye 🍛",
        "Fried Yam & Chicken 🍗🍟"
    ];

    // Utility to show step
    const showStep = (stepElement) => {
        document.querySelectorAll('.step').forEach(step => {
            step.classList.remove('active');
        });

        setTimeout(() => {
            stepElement.classList.add('active');
        }, 10);
    };

    // Step 1: Runaway No button
    let noButtonClicks = 0;
    const moveNoButton = () => {
        if (noButtonClicks === 0) {
            const rect = btnNo.getBoundingClientRect();
            btnNo.style.position = 'fixed';
            btnNo.style.left = `${rect.left}px`;
            btnNo.style.top = `${rect.top}px`;
            btnNo.style.width = `${rect.width}px`;
            btnNo.style.margin = '0';
        }
        noButtonClicks++;

        const padding = 20;
        const maxX = window.innerWidth - btnNo.offsetWidth - padding;
        const maxY = window.innerHeight - btnNo.offsetHeight - padding;

        const x = Math.max(padding, Math.random() * maxX);
        const y = Math.max(padding, Math.random() * maxY);

        btnNo.style.left = `${x}px`;
        btnNo.style.top = `${y}px`;
    };

    btnNo.addEventListener('mouseover', moveNoButton);
    btnNo.addEventListener('touchstart', (e) => {
        e.preventDefault();
        moveNoButton();
    });

    btnYes.addEventListener('click', () => {
        btnYes.innerHTML = '<div class="loader" style="width: 16px; height: 16px; border-width: 2px; margin-bottom: 0;"></div>';
        btnYes.disabled = true;
        btnNo.style.opacity = '0';
        setTimeout(() => showStep(step2), 800);
    });

    // Step 2 -> 3
    btnNext2.addEventListener('click', () => showStep(step3));

    // Step 3: Scheduling & Terminal Log
    const checkStep3 = () => {
        if (datePicker.value && timePicker.value) {
            btnNext3.disabled = false;
        } else {
            btnNext3.disabled = true;
        }
    };

    const today = new Date().toISOString().split('T')[0];
    datePicker.setAttribute('min', today);

    datePicker.addEventListener('change', () => {
        selectedDate = datePicker.value;
        const dateObj = new Date(selectedDate);
        dateObj.setMinutes(dateObj.getMinutes() + dateObj.getTimezoneOffset());
        const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });

        terminalLog.innerText = `> Selected date: ${dayName}.\n> Checking availability... cleared all other plans.\n> Status: Excitement levels spiking.`;
        checkStep3();
    });

    timePicker.addEventListener('change', () => {
        selectedTime = timePicker.value;
        // Strip out the custom text for a shorter log display
        const displayTime = selectedTime.split('–')[0].trim();
        terminalLog.innerText = `> Time locked: ${displayTime}.\n> Ambiance optimizer: Engaged.\n> Alert: Butterflies detected in stomach.`;
        checkStep3();
    });

    btnNext3.addEventListener('click', () => showStep(step4));

    // Step 4: Mood Tracker
    moodSlider.addEventListener('input', (e) => {
        selectedMood = e.target.value;
    });

    btnNext4.addEventListener('click', () => {
        // Populate step 5 based on mood
        dynamicFoodGrid.innerHTML = '';
        const options = selectedMood < 50 ? lowKeyOptions : energeticOptions;

        options.forEach(opt => {
            const div = document.createElement('div');
            div.className = 'food-card';
            div.setAttribute('data-food', opt);
            div.innerHTML = `<span class="label">${opt}</span>`;

            div.addEventListener('click', () => {
                document.querySelectorAll('#dynamic-food-grid .food-card').forEach(c => c.classList.remove('selected'));
                div.classList.add('selected');
                selectedFood = opt;
                btnNext5.disabled = false;
            });

            dynamicFoodGrid.appendChild(div);
        });

        showStep(step5);
    });

    // Step 5 -> 6
    btnNext5.addEventListener('click', () => showStep(step6));

    // Step 6: Music Selection
    musicCards.forEach(card => {
        card.addEventListener('click', () => {
            musicCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedMusic = card.getAttribute('data-music');
            btnNext6.disabled = false;
        });
    });

    btnNext6.addEventListener('click', () => {
        showStep(stepLoading);

        const logElement = document.getElementById('loading-log');
        const logs = [
            "Initializing sequence...",
            "Consulting the stars...",
            "Plotting perfect evening trajectory...",
            "Calibrating acoustic vibes...",
            "Syncing butterflies protocol..."
        ];

        let logIndex = 0;
        const logInterval = setInterval(() => {
            logIndex++;
            if (logIndex < logs.length) {
                logElement.innerText = logs[logIndex];
            }
        }, 600);

        setTimeout(() => {
            clearInterval(logInterval);

            const dateObj = new Date(selectedDate);
            dateObj.setMinutes(dateObj.getMinutes() + dateObj.getTimezoneOffset());
            const options = { weekday: 'long', month: 'short', day: 'numeric' };
            const formattedDate = dateObj.toLocaleDateString('en-US', options);

            summaryText.innerHTML = `Date: <strong>${formattedDate}</strong><br>Time: <strong>${selectedTime}</strong><br>Agenda: <strong>${selectedFood}</strong><br>Soundtrack: <strong>${selectedMusic}</strong>`;
            showStep(step7);
        }, 3200);
    });

    // Step 7: Actions

    // ICS Generator Helper
    const generateICS = () => {
        // Parse date and time
        const dateObj = new Date(selectedDate);
        dateObj.setMinutes(dateObj.getMinutes() + dateObj.getTimezoneOffset()); // Localize

        // Convert "18:00" to components
        const isAmPm = selectedTime.includes('M');
        let hours = 19; // default 7 PM
        let minutes = 0;

        if (isAmPm) {
            const timeParts = selectedTime.match(/(\d+):(\d+)\s+(PM|AM)/i);
            if (timeParts) {
                hours = parseInt(timeParts[1]);
                minutes = parseInt(timeParts[2]);
                if (timeParts[3].toUpperCase() === 'PM' && hours < 12) hours += 12;
                if (timeParts[3].toUpperCase() === 'AM' && hours === 12) hours = 0;
            }
        } else {
            // It's 24h format like "18:00"
            const timeParts = selectedTime.split(':');
            hours = parseInt(timeParts[0]);
            minutes = parseInt(timeParts[1]);
        }

        // Set hours
        dateObj.setHours(hours, minutes, 0);

        // Calculate End Time (assume 2 hours duration)
        const endObj = new Date(dateObj.getTime() + (2 * 60 * 60 * 1000));

        // Format to YYYYMMDDTHHMMSS format (Local time format for ICS)
        const formatICSDate = (d) => {
            const pad = (n) => n < 10 ? '0' + n : n;
            return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
        };

        const dtStart = formatICSDate(dateObj);
        const dtEnd = formatICSDate(endObj);

        const icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Date Planner App//EN',
            'BEGIN:VEVENT',
            `DTSTART:${dtStart}`,
            `DTEND:${dtEnd}`,
            `SUMMARY:Date ♥`,
            `DESCRIPTION:Agenda: ${selectedFood}\\nSoundtrack: ${selectedMusic}`,
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\\r\\n');

        return icsContent;
    };

    btnDownload.addEventListener('click', () => {
        const icsData = generateICS();
        const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', 'date_invitation.ics');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Visual feedback
        const originalHTML = btnDownload.innerHTML;
        btnDownload.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:8px; vertical-align: text-bottom;"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg>Downloaded!`;
        setTimeout(() => {
            btnDownload.innerHTML = originalHTML;
        }, 3000);
    });

    btnCopy.addEventListener('click', () => {
        const dateObj = new Date(selectedDate);
        dateObj.setMinutes(dateObj.getMinutes() + dateObj.getTimezoneOffset());
        const formattedDate = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

        const textToCopy = `Date Confirmed.\n\nDate: ${formattedDate}\nTime: ${selectedTime}\nAgenda: ${selectedFood}\nSoundtrack: ${selectedMusic}\n\nSystem status: Excited.`;

        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalHTML = btnCopy.innerHTML;
            btnCopy.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:8px; vertical-align: text-bottom;"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg>Copied to clipboard`;
            setTimeout(() => {
                btnCopy.innerHTML = originalHTML;
            }, 3000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            btnCopy.innerText = "Error copying data";
        });
    });

    // --- Subtle Cosmic Background Floating Hearts ---
    const getHeartColor = () => {
        const choice = Math.floor(Math.random() * 3);
        const opacity = 0.02 + Math.random() * 0.05;
        if (choice === 0) {
            // Green (Nebula style)
            return `rgba(74, 222, 128, ${opacity})`;
        } else if (choice === 1) {
            // White (Star style)
            return `rgba(250, 250, 250, ${opacity})`;
        } else {
            // Black/Charcoal (Void style - slightly higher opacity to be visible)
            return `rgba(63, 63, 70, ${opacity * 3.5})`;
        }
    };

    const spawnBgHeart = () => {
        const heart = document.createElement('div');
        heart.className = 'bg-heart';
        heart.innerHTML = '♥';

        // Random horizontal position
        heart.style.left = `${Math.random() * 100}vw`;

        // Random size (between 16px and 36px)
        const size = 16 + Math.random() * 20;
        heart.style.fontSize = `${size}px`;

        // Random Cosmic Heart color
        heart.style.color = getHeartColor();

        // Random speed
        const duration = 12 + Math.random() * 12;
        heart.style.animationDuration = `${duration}s`;

        document.body.appendChild(heart);

        // Remove from DOM when animation ends
        setTimeout(() => {
            heart.remove();
        }, duration * 1000);
    };

    // Pre-populate initial wave of background hearts
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const initialHeart = document.createElement('div');
            initialHeart.className = 'bg-heart';
            initialHeart.innerHTML = '♥';
            initialHeart.style.left = `${Math.random() * 100}vw`;
            const size = 16 + Math.random() * 20;
            initialHeart.style.fontSize = `${size}px`;
            initialHeart.style.color = getHeartColor();

            // Put it somewhere up the screen initially
            const initialY = Math.random() * 90;
            initialHeart.style.transform = `translateY(-${initialY}vh)`;

            const duration = 12 + Math.random() * 12;
            const remainingDuration = duration * (1 - initialY / 100);
            initialHeart.style.animationDuration = `${duration}s`;

            document.body.appendChild(initialHeart);

            setTimeout(() => {
                initialHeart.remove();
            }, remainingDuration * 1000);
        }, Math.random() * 1000);
    }

    // --- Interactive Romantic Click Bursts ---
    const createClickBurst = (e) => {
        const colors = [
            'rgba(74, 222, 128, 0.85)',
            'rgba(255, 255, 255, 0.85)',
            'rgba(63, 63, 70, 0.7)'
        ];

        const burstCount = 6;
        for (let i = 0; i < burstCount; i++) {
            const heart = document.createElement('div');
            heart.className = 'burst-heart';
            heart.innerHTML = '♥';

            const x = e.clientX;
            const y = e.clientY;

            heart.style.left = `${x}px`;
            heart.style.top = `${y}px`;

            const color = colors[Math.floor(Math.random() * colors.length)];
            heart.style.color = color;

            const size = 14 + Math.random() * 12;
            heart.style.fontSize = `${size}px`;

            const angle = Math.random() * Math.PI * 2;
            const distance = 25 + Math.random() * 45;
            const destX = Math.cos(angle) * distance;
            const destY = Math.sin(angle) * distance - 40;

            heart.style.setProperty('--dest-x', `${destX}px`);
            heart.style.setProperty('--dest-y', `${destY}px`);

            document.body.appendChild(heart);

            setTimeout(() => {
                heart.remove();
            }, 1200);
        }
    };

    document.addEventListener('click', (e) => {
        if (e.target.closest('.btn') || e.target.closest('.food-card') || e.target.closest('input') || e.target.closest('select')) {
            createClickBurst(e);
        }
    });

    // Spawn new ones periodically
    setInterval(spawnBgHeart, 2500);
});
