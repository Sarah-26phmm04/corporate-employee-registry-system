

document.addEventListener("DOMContentLoaded", function () {

 

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

   

    console.log("LavenderLabs JavaScript loaded successfully!");

});
