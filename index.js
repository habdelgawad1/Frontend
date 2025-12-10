document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
});

function checkLoginStatus() {
    const authBtn = document.getElementById('authBtn');
    
    if (isLoggedIn()) {
        authBtn.textContent = 'Logout';
        authBtn.classList.add('logout');
        authBtn.href = '#';
        
        authBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to logout?')) {
                removeAuthToken();
                alert('Logged out successfully');
                window.location.reload();
            }
        });
        
        const title = document.querySelector('h1');
        const loginIndicator = document.createElement('small');
        loginIndicator.style.fontSize = '14px';
        loginIndicator.style.color = '#666';
        loginIndicator.style.display = 'block';
        loginIndicator.textContent = 'Logged In';
        title.appendChild(loginIndicator);
    } else {
        authBtn.textContent = 'Login';
        authBtn.href = 'login.html';
    }
}
