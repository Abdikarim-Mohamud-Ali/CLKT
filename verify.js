
const verifyForm =
    document.getElementById("verifyForm");

const codeInput =
    document.getElementById("code");

const verifyButton =
    document.getElementById("verifyButton");

const resendButton =
    document.getElementById("resendButton");

const message =
    document.getElementById("message");

const emailDisplay =
    document.getElementById("emailDisplay");


const login =
    localStorage.getItem("clktVerificationLogin") ||
    localStorage.getItem("clktVerificationEmail");


if (!login) {

    emailDisplay.textContent =
        "No verification account found.";

    verifyButton.disabled = true;
    resendButton.disabled = true;

} else {

    emailDisplay.textContent =
        login;
}


verifyForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const code =
            codeInput.value.trim();


        if (code.length !== 6) {

            message.textContent =
                "Please enter the 6-digit verification code.";

            return;
        }


        if (!login) {

            message.textContent =
                "Your verification session has expired. Please register or log in again.";

            return;
        }


        message.textContent =
            "Verifying your email...";

        verifyButton.disabled = true;


        try {

            const response =
                await fetch(
                    "https://clkt-backend.onrender.com/api/users/verify",
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

                verifyButton.disabled =
                    false;

                return;
            }


            message.textContent =
                "Email verified successfully! Redirecting to login...";


            localStorage.removeItem(
                "clktVerificationEmail"
            );

            localStorage.removeItem(
                "clktVerificationLogin"
            );


            setTimeout(function() {

                window.location.href =
                    "login.html";

            }, 1500);


        } catch (error) {

            console.error(error);


            message.textContent =
                "Unable to connect to CLKT. Please try again.";

            verifyButton.disabled =
                false;
        }
    }
);


resendButton.addEventListener(
    "click",
    async function() {

        if (!login) {

            message.textContent =
                "Your verification session has expired. Please register or log in again.";

            return;
        }


        message.textContent =
            "Sending a new verification code...";

        resendButton.disabled =
            true;


        try {

            const response =
                await fetch(
                    "https://clkt-backend.onrender.com/api/users/resend-verification",
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


            const data =
                await response.json();


            message.textContent =
                data.message;


            if (!response.ok) {

                resendButton.disabled =
                    false;

                return;
            }


            codeInput.value = "";


            setTimeout(function() {

                resendButton.disabled =
                    false;

            }, 3000);


        } catch (error) {

            console.error(error);


            message.textContent =
                "Unable to connect to CLKT. Please try again.";

            resendButton.disabled =
                false;
        }
    }
);