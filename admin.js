document.addEventListener('DOMContentLoaded', function() {
    if (!isLoggedIn()) {
        alert('Please login to access admin panel');
        window.location.href = 'login.html';
        return;
    }
});

function showTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    const buttons = document.querySelectorAll('.tab-btn');
    
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove('active');
    }
    
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active');
    }
    
    document.getElementById(tabName + 'Tab').classList.add('active');
    event.target.classList.add('active');
}

document.getElementById("createTourForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const guideID = document.getElementById("tourGuide").value.trim();
    const title = document.getElementById("tourName").value.trim();
    const description = document.getElementById("tourDescription").value.trim();
    const duration = document.getElementById("tourDuration").value.trim();
    const language = document.getElementById("tourLanguage").value.trim();
    const price = document.getElementById("tourPrice").value.trim();
    const capacity = document.getElementById("tourCapacity").value.trim();

    if (!guideID || !title || !duration || !language || !price || !capacity) {
        alert("All fields are required");
        return;
    }

    const times = duration.split('-');
    const startTime = times[0] ? times[0].trim() + ':00' : '09:00:00';
    const endTime = times[1] ? times[1].trim() + ':00' : '11:00:00';

    try {
        const res = await fetch(API_ENDPOINTS.admin.tours, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": "Bearer " + getAuthToken()
            },
            body: JSON.stringify({
                guideID: parseInt(guideID),
                title: title,
                description: description,
                startTime: startTime,
                endTime: endTime,
                date: new Date().toISOString().split('T')[0],
                maxParticipants: parseInt(capacity),
                availableSpots: parseInt(capacity),
                price: parseFloat(price),
                language: language
            })
        });

        const data = await res.json();
        if (res.ok) {
            alert(data.message || "Tour created successfully!");
            document.getElementById("createTourForm").reset();
        } else {
            alert(data.message || data.error || "Tour creation failed");
        }
    } catch (err) {
        console.log(err);
        alert("Could not connect to server. Try again later.");
    }
});

document.getElementById("addAdminForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("adminName").value.trim();
    const email = document.getElementById("adminEmail").value.trim();
    const password = document.getElementById("adminPassword").value.trim();

    if (!name || !email || !password) {
        alert("All fields are required");
        return;
    }

    try {
        const res = await fetch(API_ENDPOINTS.admin.admins, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": "Bearer " + getAuthToken()
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password,
                phone: '0000000000'
            })
        });

        const data = await res.json();
        if (res.ok) {
            alert(data.message || "Admin created successfully!");
            document.getElementById("addAdminForm").reset();
        } else {
            alert(data.message || data.error || "Admin creation failed");
        }
    } catch (err) {
        console.log(err);
        alert("Could not connect to server. Try again later.");
    }
});

async function deleteTour(tourID) {
    if (!confirm("Are you sure you want to delete this tour?")) {
        return;
    }

    try {
        const res = await fetch(API_ENDPOINTS.admin.tourById(tourID), {
            method: "DELETE",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": "Bearer " + getAuthToken()
            }
        });

        const data = await res.json();
        if (res.ok) {
            alert(data.message || "Tour deleted successfully!");
            window.location.reload();
        } else {
            alert(data.message || data.error || "Delete failed");
        }
    } catch (err) {
        console.log(err);
        alert("Could not connect to server. Try again later.");
    }
}

async function updateTourStatus(tourID) {
    const newStatus = prompt("Enter new status (scheduled, ongoing, completed, canceled):");
    
    if (!newStatus) return;
    
    const validStatuses = ['scheduled', 'ongoing', 'completed', 'canceled'];
    if (!validStatuses.includes(newStatus.toLowerCase())) {
        alert("Invalid status");
        return;
    }

    try {
        const res = await fetch(API_ENDPOINTS.admin.tourById(tourID), {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": "Bearer " + getAuthToken()
            },
            body: JSON.stringify({ TourStatus: newStatus })
        });

        const data = await res.json();
        if (res.ok) {
            alert(data.message || "Tour status updated successfully!");
            window.location.reload();
        } else {
            alert(data.message || data.error || "Update failed");
        }
    } catch (err) {
        console.log(err);
        alert("Could not connect to server. Try again later.");
    }
}