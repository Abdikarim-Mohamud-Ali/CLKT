
const resetPasswordForm =
    document.getElementById("resetPasswordForm");

const message =
    document.getElementById("message");

const resetButton =
    document.getElementById("resetButton");

const codeInput =
    document.getElementById("code");

const newPasswordInput =
    document.getElementById("newPassword");

const confirmPasswordInput =
    document.getElementById("confirmPassword");

const login =
    localStorage.getItem(
        "clktPasswordResetLogin"
    );


newPasswordInput.parentElement.style.display = "none";

confirmPasswordInput.parentElement.style.display = "none";

resetButton.style.display = "none";


const verifyButton =
    document.createElement("button");

verifyButton.type = "button";

verifyButton.textContent =
    "Verify code";

verifyButton.style.marginTop = "10px";

codeInput.parentElement.appendChild(
    verifyButton
);


verifyButton.addEventListener(
    "click",
    async function() {

        const code =
            codeInput.value.trim();


        if (code.length !== 6) {

            message.textContent =
                "Please enter the 6-digit verification code.";

            return;

        }


        if (!login) {

            message.textContent =
                "Your password reset session has expired. Please start again.";

            return;

        }


        message.textContent =
            "Verifying code...";

        verifyButton.disabled = true;


        try {

            const response = await fetch(
                "https://clkt-backend.onrender.com/api/users/verify-reset-code",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        login: login,
                        code: code
                    })
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                message.textContent =
                    data.message;

                verifyButton.disabled = false;

                return;

            }


            message.textContent =
                "Code verified. You can now choose your new password.";

            codeInput.disabled = true;

            verifyButton.style.display =
                "none";


            newPasswordInput.parentElement.style.display =
                "block";

            confirmPasswordInput.parentElement.style.display =
                "block";

            resetButton.style.display =
                "block";


        } catch (error) {

            console.error(error);


            message.textContent =
                "Unable to connect to CLKT. Please try again.";

            verifyButton.disabled = false;

        }

    }
);


resetPasswordForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const code =
            codeInput.value.trim();

        const newPassword =
            newPasswordInput.value;

        const confirmPassword =
            confirmPasswordInput.value;


        if (!login) {

            message.textContent =
                "Your password reset session has expired. Please start again.";

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


            const data =
                await response.json();


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



