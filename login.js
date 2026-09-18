

const loginForm =
    document.getElementById("loginForm");

const message =
    document.getElementById("message");

const loginButton =
    document.getElementById("loginButton");

const resendVerificationLink =
    document.getElementById("resendVerificationLink");


loginForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const login =
            document.getElementById("login").value.trim();

        const password =
            document.getElementById("password").value;


        message.textContent =
            "Logging you in...";

        resendVerificationLink.style.display =
            "none";

        loginButton.disabled =
            true;


        try {

            const response = await fetch(
                "https://clkt-backend.onrender.com/api/users/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        login: login,
                        password: password
                    })
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                message.textContent =
                    data.message;


                if (
                    response.status === 403 &&
                    data.message ===
                    "Please verify your email before logging in."
                ) {

                    localStorage.setItem(
                        "clktVerificationEmail",
                        login
                    );


                    resendVerificationLink.style.display =
                        "block";

                }


                loginButton.disabled =
                    false;

                return;

            }


            localStorage.setItem(
                "clktToken",
                data.token
            );


            localStorage.setItem(
                "clktUser",
                JSON.stringify(data.user)
            );


            window.location.href =
                "index.html";


        } catch (error) {

            console.error(error);


            message.textContent =
                "Unable to connect to CLKT. Please try again.";

            loginButton.disabled =
                false;

        }

    }
);

