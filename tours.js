let allTours = [];

document.addEventListener('DOMContentLoaded', function() {
    loadTours();
    setupSearch();
});

async function loadTours() {
    const container = document.getElementById('toursContainer');
    
    try {
        container.innerHTML = '<p class="loading">Loading tours...</p>';
        
        const response = await fetch(API_ENDPOINTS.tours.all);
        
        if (!response.ok) {
            throw new Error('Failed to fetch tours');
        }
        
        const data = await response.json();
        console.log('Tours data:', data);
        
        allTours = data.tours || data.data || data || [];
        
        if (allTours.length === 0) {
            container.innerHTML = '<p class="loading">No tours available</p>';
            return;
        }
        
        displayTours(allTours);
    } catch (error) {
        console.error('Error loading tours:', error);
        container.innerHTML = '<p class="loading">Error loading tours. Please try again later.</p>';
    }
}

function displayTours(tours) {
    const container = document.getElementById('toursContainer');
    
    if (tours.length === 0) {
        container.innerHTML = '<p class="loading">No tours found</p>';
        return;
    }
    
    let html = '';
    for (let i = 0; i < tours.length; i++) {
        const tour = tours[i];
        
        const tourID = tour.TourID || tour.tourID || tour.id || tour._id;
        const tourName = tour.Title || tour.title || tour.name || 'Unnamed Tour';
        const tourGuide = tour.GuideID || tour.guideID || tour.guide || 'N/A';
        const startTime = tour.StartTime || tour.startTime || '';
        const endTime = tour.EndTime || tour.endTime || '';
        const tourDuration = startTime && endTime ? startTime + ' - ' + endTime : 'N/A';
        const tourPrice = tour.Price || tour.price || 0;
        const tourCapacity = tour.MaxParticipants || tour.maxParticipants || tour.capacity || 'N/A';
        const tourAvailable = tour.AvailableSpots || tour.availableSpots || tourCapacity;
        const tourLanguage = tour.Language || tour.language || 'N/A';
        const tourDesc = tour.Description || tour.description || 'No description available';
        const tourStatus = tour.TourStatus || tour.tourStatus || tour.status || 'scheduled';
        
        html += '<div class="tour-card">';
        html += '<h3>' + tourName + '</h3>';
        html += '<p><strong>Tour ID:</strong> ' + tourID + '</p>';
        html += '<p><strong>Guide ID:</strong> ' + tourGuide + '</p>';
        html += '<p><strong>Duration:</strong> ' + tourDuration + '</p>';
        html += '<p><strong>Language:</strong> ' + tourLanguage + '</p>';
        html += '<p><strong>Price:</strong> $' + tourPrice + '</p>';
        html += '<p><strong>Available Spots:</strong> ' + tourAvailable + ' / ' + tourCapacity + '</p>';
        html += '<p><strong>Status:</strong> ' + tourStatus + '</p>';
        html += '<p>' + tourDesc + '</p>';
        html += '<button onclick="bookTour(' + tourID + ')">Book Tour (ID: ' + tourID + ')</button>';
        html += '</div>';
    }
    
    container.innerHTML = html;
}

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        if (!searchTerm) {
            displayTours(allTours);
            return;
        }
        
        const filtered = [];
        
        for (let i = 0; i < allTours.length; i++) {
            const tour = allTours[i];
            
            const tourID = String(tour.TourID || tour.tourID || tour.id || tour._id || '');
            const name = String(tour.Title || tour.title || tour.name || '').toLowerCase();
            const desc = String(tour.Description || tour.description || '').toLowerCase();
            const guide = String(tour.GuideID || tour.guideID || tour.guide || '').toLowerCase();
            
            if (tourID.includes(searchTerm) || 
                name.includes(searchTerm) || 
                desc.includes(searchTerm) || 
                guide.includes(searchTerm)) {
                filtered.push(tour);
            }
        }
        
        displayTours(filtered);
    });
}

function bookTour(tourID) {
    if (!isLoggedIn()) {
        alert('Please login first to book a tour');
        window.location.href = 'login.html';
        return;
    }
    localStorage.setItem('selectedTourID', tourID);
    window.location.href = 'tickets.html';
}