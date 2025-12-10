document.getElementById("signupForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const phone = document.getElementById("signupPhone").value.trim();
    const password = document.getElementById("signupPassword").value.trim();
    const role = document.getElementById("signupRole").value;

    let valid = true;
    
    if (!name || name.length < 2) {
        document.getElementById("signupNameErr").innerText = "Name must be at least 2 characters";
        valid = false;
    } else {
        document.getElementById("signupNameErr").innerText = "";
    }

    if (!email.includes("@")) {
        document.getElementById("signupEmailErr").innerText = "Invalid Email Format";
        valid = false;
    } else {
        document.getElementById("signupEmailErr").innerText = "";
    }

    if (!phone || phone.length < 10) {
        document.getElementById("signupPhoneErr").innerText = "Please enter a valid phone number";
        valid = false;
    } else {
        document.getElementById("signupPhoneErr").innerText = "";
    }

    if (password.length < 6) {
        document.getElementById("signupPasswordErr").innerText = "Minimum 6 Characters";
        valid = false;
    } else {
        document.getElementById("signupPasswordErr").innerText = "";
    }

    const validRoles = ['guide', 'visitor'];
    if (!validRoles.includes(role)) {
        document.getElementById("signupRoleErr").innerText = "Please select a valid role";
        valid = false;
    } else {
        document.getElementById("signupRoleErr").innerText = "";
    }

    if (!valid) return;

    try {
        const res = await fetch(API_ENDPOINTS.auth.register, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ name, email, phone, password, role })
        });

        const data = await res.json();
        if (res.ok) {
            alert(data.message || "Registration successful!");
            window.location.href = "login.html";
        } else {
            alert(data.message || "Signup Failed");
        }
    } catch (err) {
        console.log(err);
        alert("Could not connect to server. Try again later.");
    }
});
