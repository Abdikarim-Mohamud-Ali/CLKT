const verifyForm = document.getElementById("verifyForm");

const message = document.getElementById("message");

const resendButton = document.getElementById("resendButton");

// VERIFY EMAIL

verifyForm.addEventListener("submit", async function(event) {


// Stop the browser from refreshing the page
event.preventDefault();

// Get the email and verification code
const email = document.getElementById("email").value;
const code = document.getElementById("code").value;

try {

    // Send the verification information to our live Render backend
    const response = await fetch(
        "https://clkt-backend.onrender.com/api/users/verify",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email: email,
                code: code
            })
        }
    );

    // Get the backend's response
    const data = await response.json();

    // Show the result
    message.textContent = data.message;

    // If verification succeeded
    if (response.ok) {

        // Give the user a moment to see the success message
        setTimeout(function() {

            // Send them to the CLKT homepage
            window.location.href = "index.html";

        }, 1000);
    }

} catch (error) {

    // Show a friendly message if the backend cannot be reached
    message.textContent =
        "Unable to connect to CLKT. Please try again.";

    console.error(error);

}


});

// RESEND VERIFICATION CODE

resendButton.addEventListener("click", async function() {


// Get the email
const email = document.getElementById("email").value;

// Make sure an email was entered
if (!email) {

    message.textContent =
        "Please enter your email first.";

    return;
}

try {

    // Ask the live backend to generate and send a new code
    const response = await fetch(
        "https://clkt-backend.onrender.com/api/users/resend-verification",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email: email
            })
        }
    );

    // Get the backend's response
    const data = await response.json();

    // Show the result
    message.textContent = data.message;

} catch (error) {

    // Show a friendly message if the backend cannot be reached
    message.textContent =
        "Unable to connect to CLKT. Please try again.";

    console.error(error);

}


});
