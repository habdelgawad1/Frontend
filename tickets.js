document.addEventListener('DOMContentLoaded', function() {
    if (!isLoggedIn()) {
        alert('Please login to book tickets');
        window.location.href = 'login.html';
        return;
    }
    
    const selectedTourID = localStorage.getItem('selectedTourID');
    if (selectedTourID) {
        document.getElementById('bookingTourID').value = selectedTourID;
        localStorage.removeItem('selectedTourID');
    }
});

document.getElementById("bookingForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const userID = document.getElementById("bookingUserID").value.trim();
    const tourID = document.getElementById("bookingTourID").value.trim();
    const numTickets = document.getElementById("numTickets").value.trim();
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

    if (!userID || !tourID || !numTickets) {
        alert("All fields are required");
        return;
    }

    try {
        const res = await fetch(API_ENDPOINTS.bookings.create, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": "Bearer " + getAuthToken()
            },
            body: JSON.stringify({ 
                userID: parseInt(userID), 
                tourID: parseInt(tourID), 
                NumberOfTickets: parseInt(numTickets) 
            })
        });

        const data = await res.json();
        if (res.ok) {
            alert(data.message || "Booking created successfully!");
            const bookingID = data.bookingID;
            if (bookingID && paymentMethod) {
                const paymentEndpoint = paymentMethod === 'cash' 
                    ? API_ENDPOINTS.bookings.payCash(bookingID)
                    : API_ENDPOINTS.bookings.payPoints(bookingID);
                
                await fetch(paymentEndpoint, {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + getAuthToken()
                    },
                    body: JSON.stringify({})
                });
            }
            
            document.getElementById("bookingForm").reset();
        } else {
            alert(data.message || data.error || "Booking failed");
        }
    } catch (err) {
        console.log(err);
        alert("Could not connect to server. Try again later.");
    }
});

async function cancelBooking(bookingID) {
    if (!confirm("Are you sure you want to cancel this booking?")) {
        return;
    }

    try {
        const res = await fetch(API_ENDPOINTS.bookings.cancel(bookingID), {
            method: "DELETE",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": "Bearer " + getAuthToken()
            }
        });

        const data = await res.json();
        if (res.ok) {
            alert(data.message || "Booking cancelled successfully!");
            window.location.reload();
        } else {
            alert(data.message || data.error || "Cancel failed");
        }
    } catch (err) {
        console.log(err);
        alert("Could not connect to server. Try again later.");
    }
}