/* ======================================================
   🔊 AUDIO AUTOPLAY FIX (REQUIRED FOR DEPLOYED VERSION)
   ====================================================== */
window.addEventListener("click", unlockAudio, { once: true });
window.addEventListener("keydown", unlockAudio, { once: true });

function unlockAudio() {
    const audio = document.getElementById("cut-sound");
    if (!audio) return;

    audio.volume = 0.01; // low so user doesn't hear unlock

    audio.play().then(() => {
        audio.pause();
        audio.currentTime = 0;
        audio.volume = 1; // restore volume
    }).catch(() => {});
}



/* ======================================================
   ORIGINAL FUNCTIONALITY BELOW — UNCHANGED
   ====================================================== */

let modalFlag = false;
let removeFlag = false;

const addBtn = document.querySelector(".add-btn");
const removeBtn = document.querySelector(".remove-btn");
const modalCont = document.querySelector(".modal-cont");
const modalTaskArea = document.querySelector(".textArea-cont");
const mainCont = document.querySelector(".main-cont");
const dueDateInput = document.querySelector(".due-date-input");

const allPriorityColors = document.querySelectorAll(".priority-color");
const toolBoxColors = document.querySelectorAll(".color");
const cutSound = document.getElementById("cut-sound");

const colorsArray = ["lightpink", "lightgreen", "lightblue", "black"];

let ticketColor = "lightpink";



// OPEN/CLOSE MODAL
addBtn.addEventListener("click", () => {
    modalFlag = !modalFlag;
    modalCont.style.display = modalFlag ? "flex" : "none";
});


// DELETE MODE TOGGLE
removeBtn.addEventListener("click", () => {
    removeFlag = !removeFlag;
    removeBtn.style.color = removeFlag ? "red" : "black";
});



// SHIFT ALONE CREATES TICKET
modalTaskArea.addEventListener("keydown", (e) => {
    if (e.key === "Shift") {
        e.preventDefault();

        const task = modalTaskArea.value.trim();
        const due = dueDateInput.value;

        if (!task) return;

        createTicket(task, due);

        modalCont.style.display = "none";
        modalTaskArea.value = "";
        dueDateInput.value = "";
        modalFlag = false;
    }
});



// CREATE TICKET
function createTicket(task, dueDate) {
    const id = Math.random().toString(36).substr(2, 6);

    const ticket = document.createElement("div");
    ticket.classList.add("ticket-cont");

    ticket.innerHTML = `
        <div class="ticket-done-btn">Done</div>
        <div class="ticket-color ${ticketColor}"></div>
        <div class="ticket-id">#${id}</div>
        <div class="task-area">${task}</div>
        ${dueDate ? `<div class="ticket-due">Due: ${dueDate}</div>` : ""}
        <div class="ticket-lock"><i class="fa-solid fa-lock"></i></div>
    `;

    handleDone(ticket);
    handleLock(ticket);
    handleColor(ticket);
    handleRemoval(ticket);

    mainCont.appendChild(ticket);
}



// DONE BUTTON HANDLER
function handleDone(ticket) {
    const btn = ticket.querySelector(".ticket-done-btn");

    btn.addEventListener("click", () => {
        ticket.classList.add("ticket-cut-animation");

        if (cutSound) {
            cutSound.currentTime = 0;
            cutSound.play().catch(() => {});
        }

        setTimeout(() => {
            ticket.remove();
        }, 600);
    });
}



// PRIORITY SELECTOR
allPriorityColors.forEach((col) => {
    col.addEventListener("click", () => {
        allPriorityColors.forEach((c) => c.classList.remove("active"));
        col.classList.add("active");

        colorsArray.forEach((clr) => {
            if (col.classList.contains(clr)) ticketColor = clr;
        });
    });
});



// FILTER TICKETS BY COLOR
toolBoxColors.forEach((col) => {
    col.addEventListener("click", () => {
        const selectedColor = colorsArray.find((c) =>
            col.classList.contains(c)
        );
        document.querySelectorAll(".ticket-cont").forEach((t) => {
            const band = t.querySelector(".ticket-color");
            t.style.display = band.classList.contains(selectedColor)
                ? "flex"
                : "none";
        });
    });

    // DOUBLE CLICK → SHOW ALL
    col.addEventListener("dblclick", () => {
        document.querySelectorAll(".ticket-cont").forEach((t) => {
            t.style.display = "flex";
        });
    });
});



// LOCK / UNLOCK EDIT
function handleLock(ticket) {
    const lockIcon = ticket.querySelector(".ticket-lock i");
    const taskArea = ticket.querySelector(".task-area");

    lockIcon.addEventListener("click", () => {
        if (lockIcon.classList.contains("fa-lock")) {
            lockIcon.classList.replace("fa-lock", "fa-lock-open");
            taskArea.contentEditable = true;
        } else {
            lockIcon.classList.replace("fa-lock-open", "fa-lock");
            taskArea.contentEditable = false;
        }
    });
}



// CYCLE COLOR BAND
function handleColor(ticket) {
    const band = ticket.querySelector(".ticket-color");

    band.addEventListener("click", () => {
        let current = colorsArray.find((c) => band.classList.contains(c));
        let idx = colorsArray.indexOf(current);
        let next = colorsArray[(idx + 1) % colorsArray.length];

        band.classList.remove(current);
        band.classList.add(next);
    });
}



// DELETE MODE → CLICK TO REMOVE
function handleRemoval(ticket) {
    ticket.addEventListener("click", () => {
        if (removeFlag) ticket.remove();
    });
}
