const verifyForm = document.getElementById("verifyForm");

const message = document.getElementById("message");

const resendButton = document.getElementById("resendButton");

// GET THE EMAIL SAVED DURING REGISTRATION

const email = localStorage.getItem("clktVerificationEmail");

// MAKE SURE AN EMAIL EXISTS

if (!email) {


message.textContent =
    "Your registration session could not be found. Please register again.";

verifyForm.style.display = "none";

resendButton.style.display = "none";


}

// VERIFY EMAIL

verifyForm.addEventListener("submit", async function(event) {


// Stop the browser from refreshing the page
event.preventDefault();


// Get the verification code
const code = document.getElementById("code").value;


// Show a temporary message
message.textContent =
    "Verifying your email...";


try {

    // Send the saved email and code
    // to our live Render backend
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

        // Remove the saved verification email
        localStorage.removeItem(
            "clktVerificationEmail"
        );


        // Give the user a moment to see
        // the success message
        setTimeout(function() {

            // Send them to the CLKT homepage
            window.location.href = "index.html";

        }, 1000);

    }


} catch (error) {

    // Show a friendly message if
    // the server cannot be reached
    message.textContent =
        "Unable to connect to CLKT. Please try again.";


    console.error(error);

}


});

// RESEND VERIFICATION CODE

resendButton.addEventListener("click", async function() {


// Make sure an email exists
if (!email) {

    message.textContent =
        "Your registration session could not be found. Please register again.";

    return;

}


// Show a temporary message
message.textContent =
    "Sending a new verification code...";


try {

    // Ask the live backend to generate
    // and send a new code
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

    // Show a friendly message if
    // the server cannot be reached
    message.textContent =
        "Unable to connect to CLKT. Please try again.";


    console.error(error);

}


});
