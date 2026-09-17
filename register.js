const registerForm = document.getElementById("registerForm");

const message = document.getElementById("message");

registerForm.addEventListener("submit", async function(event) {


// Stop the browser from refreshing the page
event.preventDefault();

// Get the information entered by the user
const name = document.getElementById("name").value;
const email = document.getElementById("email").value;
const password = document.getElementById("password").value;

// Show a temporary message
message.textContent = "Creating your CLKT account...";

try {

    // Send the information to our live Render backend
    const response = await fetch(
        "https://clkt-backend.onrender.com/api/users/register",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })
        }
    );

    // Get the backend's response
    const data = await response.json();

    // Show the backend message directly to the user
    message.textContent = data.message;

    // If registration was successful
    if (response.ok) {

        // Remember the email in the browser
        localStorage.setItem(
            "clktVerificationEmail",
            email
        );

        // Go to the verification page
        window.location.href = "verify.html";
    }

} catch (error) {

    // Show a friendly message if the server cannot be reached
    message.textContent =
        "Unable to connect to CLKT. Please try again.";

    console.error(error);
}


});
