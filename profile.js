document.addEventListener('DOMContentLoaded', function() {
    if (!isLoggedIn()) {
        alert('Please login to view profile');
        window.location.href = 'login.html';
        return;
    }
});

document.getElementById("updateForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const userID = document.getElementById("userID").value.trim();
    const name = document.getElementById("profileName").value.trim();
    const email = document.getElementById("profileEmail").value.trim();
    const phone = document.getElementById("profilePhone").value.trim();

    if (!userID || !name || !email || !phone) {
        alert("All fields are required");
        return;
    }

    try {
        const res = await fetch(API_ENDPOINTS.users.update, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": "Bearer " + getAuthToken()
            },
            body: JSON.stringify({ userID: parseInt(userID), name, email, phone })
        });

        const data = await res.json();
        if (res.ok) {
            alert(data.message || "Profile updated successfully!");
        } else {
            alert(data.message || data.error || "Update failed");
        }
    } catch (err) {
        console.log(err);
        alert("Could not connect to server. Try again later.");
    }
});

document.getElementById("passwordForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const userID = document.getElementById("userID").value.trim();
    const name = document.getElementById("profileName").value.trim();
    const email = document.getElementById("profileEmail").value.trim();
    const phone = document.getElementById("profilePhone").value.trim();
    const newPassword = document.getElementById("newPassword").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    if (newPassword !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    if (newPassword.length < 8) {
        alert("Password must be at least 8 characters");
        return;
    }

    try {
        const res = await fetch(API_ENDPOINTS.users.update, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": "Bearer " + getAuthToken()
            },
            body: JSON.stringify({ 
                userID: parseInt(userID), 
                name, 
                email, 
                phone, 
                password: newPassword 
            })
        });

        const data = await res.json();
        if (res.ok) {
            alert(data.message || "Password changed successfully!");
            document.getElementById("passwordForm").reset();
        } else {
            alert(data.message || data.error || "Password change failed");
        }
    } catch (err) {
        console.log(err);
        alert("Could not connect to server. Try again later.");
    }
});

document.getElementById("logoutBtn").addEventListener("click", function() {
    if (confirm("Are you sure you want to logout?")) {
        removeAuthToken();
        alert("Logged out successfully");
        window.location.href = "index.html";
    }
});