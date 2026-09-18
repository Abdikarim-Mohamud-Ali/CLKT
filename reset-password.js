
const resetPasswordForm =
    document.getElementById("resetPasswordForm");

const message =
    document.getElementById("message");

const resetButton =
    document.getElementById("resetButton");


resetPasswordForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const login =
            localStorage.getItem(
                "clktPasswordResetLogin"
            );

        const code =
            document.getElementById("code").value.trim();

        const newPassword =
            document.getElementById("newPassword").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;


        if (!login) {

            message.textContent =
                "Your password reset session has expired. Please start again.";

            return;

        }


        if (code.length !== 6) {

            message.textContent =
                "Please enter the 6-digit verification code.";

            return;

        }


        if (newPassword !== confirmPassword) {

            message.textContent =
                "The passwords do not match.";

            return;

        }


        if (newPassword.length < 8) {

            message.textContent =
                "Password must be at least 8 characters.";

            return;

        }


        message.textContent =
            "Resetting your password...";

        resetButton.disabled = true;


        try {

            const response = await fetch(
                "https://clkt-backend.onrender.com/api/users/reset-password",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        login: login,
                        code: code,
                        newPassword: newPassword
                    })
                }
            );


            const data = await response.json();


            if (!response.ok) {

                message.textContent =
                    data.message;

                resetButton.disabled = false;

                return;

            }


            localStorage.removeItem(
                "clktPasswordResetLogin"
            );


            message.textContent =
                "Password reset successfully. Redirecting to login...";


            setTimeout(function() {

                window.location.href =
                    "login.html";

            }, 1500);


        } catch (error) {

            console.error(error);


            message.textContent =
                "Unable to connect to CLKT. Please try again.";

            resetButton.disabled = false;

        }

    }
);

