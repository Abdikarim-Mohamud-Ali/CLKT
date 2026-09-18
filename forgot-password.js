javascript
const forgotPasswordForm =
    document.getElementById("forgotPasswordForm");

const message =
    document.getElementById("message");

const continueButton =
    document.getElementById("continueButton");


forgotPasswordForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const login =
            document.getElementById("login").value.trim();


        message.textContent =
            "Checking your account...";

        continueButton.disabled = true;


        try {

            const response = await fetch(
                "https://clkt-backend.onrender.com/api/users/forgot-password",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        login: login
                    })
                }
            );


            const data = await response.json();


            if (!response.ok) {

                message.textContent =
                    data.message;

                continueButton.disabled = false;

                return;

            }


            localStorage.setItem(
                "clktPasswordResetLogin",
                login
            );


            if (data.maskedEmail) {

                message.textContent =
                    "Verification code sent to " +
                    data.maskedEmail;

            } else {

                message.textContent =
                    data.message;

            }


            setTimeout(function() {

                window.location.href =
                    "reset-password.html";

            }, 1500);


        } catch (error) {

            console.error(error);


            message.textContent =
                "Unable to connect to CLKT. Please try again.";


            continueButton.disabled = false;

        }

    }
);

