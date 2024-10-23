// auth.js

// Simulate a function that checks email and password in DynamoDB (or any other backend service)
function handleLogin(email, password) {
    // Replace this with actual validation logic, such as fetching user data from a database
    const userData = {
        email: "user@example.com", // Example email
        password: "password123",   // Example password (hashed ideally)
    };

    // Check if the entered email and password match the user's stored credentials
    if (email === userData.email && password === userData.password) {
        // If credentials match, redirect to the homepage or dashboard
        window.location.href = 'index.html';
    } else {
        // If credentials don't match, redirect to the incorrect-password.html page
        window.location.href = 'incorrect-password.html';
    }
}

// Function to get values from login form and trigger login validation
document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the form from submitting normally

    // Get email and password input values from the form
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Call the login function to check credentials
    handleLogin(email, password);
});
