// Function to handle the redirection
function redirectToError() {
    window.location.href = 'error.html';
}

// Set a timer to call the redirect function after 2 seconds
setTimeout(redirectToError, 500);
