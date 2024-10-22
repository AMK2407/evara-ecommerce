// auth.js
document.addEventListener('DOMContentLoaded', function() {
    // Login Form Handler
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(loginForm);
        const loginData = {
            email: formData.get('email'),
            password: formData.get('password')
        };

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            });

            const data = await response.json();

            if (response.ok) {
                // Successful login
                loginMessage.textContent = 'Login successful! Redirecting...';
                loginMessage.style.color = 'green';
                window.location.href = '/index.html';
            } else {
                // Failed login
                loginMessage.textContent = data.error || 'Invalid credentials';
                loginMessage.style.color = 'red';
            }
        } catch (error) {
            loginMessage.textContent = 'An error occurred. Please try again.';
            loginMessage.style.color = 'red';
            console.error('Login error:', error);
        }
    });

    // Register Form Handler
    const registerForm = document.getElementById('registerForm');
    const registerMessage = document.getElementById('registerMessage');

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(registerForm);
        
        // Validate passwords match
        if (formData.get('password') !== formData.get('confirmPassword')) {
            registerMessage.textContent = 'Passwords do not match';
            registerMessage.style.color = 'red';
            return;
        }

        const registerData = {
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password')
        };

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(registerData)
            });

            const data = await response.json();

            if (response.ok) {
                // Successful registration
                registerMessage.textContent = 'Registration successful! Please login.';
                registerMessage.style.color = 'green';
                registerForm.reset();
            } else {
                // Failed registration
                registerMessage.textContent = data.error || 'Registration failed';
                registerMessage.style.color = 'red';
            }
        } catch (error) {
            registerMessage.textContent = 'An error occurred. Please try again.';
            registerMessage.style.color = 'red';
            console.error('Registration error:', error);
        }
    });
});