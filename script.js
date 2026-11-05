// ======================================
// LAVENDERLABS - FRONTEND JAVASCRIPT
// ======================================

document.addEventListener("DOMContentLoaded", function () {

    // 1. REGISTRATION FORM VALIDATION

    const registerForm = document.querySelector(
        'form[action="/register"]'
    );

    if (registerForm) {
        registerForm.addEventListener("submit", function (event) {

            const password = registerForm.querySelector(
                'input[name="password"]'
            );

            if (password.value.length < 4) {
                event.preventDefault();
                alert("Password must contain at least 4 characters.");
                password.focus();
            }

        });
    }

    // 2. LOGIN FORM VALIDATION

    const loginForm = document.querySelector(
        'form[action="/login"]'
    );

    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {

            const email = loginForm.querySelector(
                'input[name="email"]'
            );

            const password = loginForm.querySelector(
                'input[name="password"]'
            );

            if (!email.value.trim() || !password.value) {
                event.preventDefault();
                alert("Please enter your email and password.");
            }

        });
    }

    // 3. PROFILE UPDATE CONFIRMATION

    const updateForm = document.querySelector(
        'form[action="/update-profile"]'
    );

    if (updateForm) {
        updateForm.addEventListener("submit", function (event) {

            const confirmUpdate = confirm(
                "Are you sure you want to update your profile?"
            );

            if (!confirmUpdate) {
                event.preventDefault();
            }

        });
    }

    // 4. DELETE ACCOUNT CONFIRMATION

    const deleteForm = document.querySelector(
        'form[action="/delete-account"]'
    );

    if (deleteForm) {
        deleteForm.addEventListener("submit", function (event) {

            const confirmDelete = confirm(
                "Are you sure you want to delete your account? This cannot be undone."
            );

            if (!confirmDelete) {
                event.preventDefault();
            }

        });
    }

    // 5. WELCOME MESSAGE IN CONSOLE

    console.log("LavenderLabs JavaScript loaded successfully!");

});