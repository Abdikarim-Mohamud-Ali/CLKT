
const registerForm =
    document.getElementById("registerForm");

const message =
    document.getElementById("message");


registerForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();

        const name =
            document.getElementById("name").value.trim();

        const username =
            document.getElementById("username").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;


        message.textContent =
            "Creating your CLKT account...";


        try {

            const response = await fetch(
                "https://clkt-backend.onrender.com/api/users/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name: name,
                        username: username,
                        email: email,
                        password: password
                    })
                }
            );


            const data =
                await response.json();


            message.textContent =
                data.message;


            if (response.ok) {

                localStorage.setItem(
                    "clktVerificationEmail",
                    email
                );

                window.location.href =
                    "verify.html";
            }


        } catch (error) {

            message.textContent =
                "Unable to connect to CLKT. Please try again.";

            console.error(error);
        }
    }
);