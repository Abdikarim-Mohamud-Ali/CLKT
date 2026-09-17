/* =========================================================
   CLKT.COM
   COMPLETE JAVASCRIPT
   Voice Recorder + Basic Interactions
   ========================================================= */


/* =========================================================
   1. GET HTML ELEMENTS
   ========================================================= */

// The main "What do you want to say?" button
const voiceInputButton = document.getElementById("voiceInputButton");

// The smaller Voice button underneath it
const quickVoiceButton = document.getElementById("quickVoiceButton");

// Voice button on mobile
const mobileVoiceButton = document.getElementById("mobileVoiceButton");

// The entire voice recorder box
const voiceRecorder = document.getElementById("voiceRecorder");

// Start recording button
const startRecordingButton =
    document.getElementById("startRecordingButton");

// Stop recording button
const stopRecordingButton =
    document.getElementById("stopRecordingButton");

// The little recording dot
const recordingDot =
    document.getElementById("recordingDot");

// Text that says "Ready to record" / "Recording..."
const recordingText =
    document.getElementById("recordingText");

// Timer
const recordingTime =
    document.getElementById("recordingTime");

// Where the recorded audio player will appear
const audioPreview =
    document.getElementById("audioPreview");

// Publish button
const publishVoiceButton =
    document.getElementById("publishVoiceButton");


/* =========================================================
   2. RECORDING VARIABLES
   ========================================================= */

// This will contain the MediaRecorder object
let mediaRecorder = null;

// This stores the pieces of audio while we record
let audioChunks = [];

// This will eventually contain our complete audio file
let audioBlob = null;

// This will contain the temporary URL used for playback
let audioURL = null;

// This stores the timer
let recordingInterval = null;

// Number of seconds recorded
let recordingSeconds = 0;

// This will store access to the microphone
let microphoneStream = null;


/* =========================================================
   3. OPEN THE VOICE RECORDER
   ========================================================= */

function openVoiceRecorder() {

    // Remove the "hidden" class
    voiceRecorder.classList.remove("hidden");

    // Scroll to the recorder
    voiceRecorder.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


/* =========================================================
   4. CONNECT THE VOICE BUTTONS
   ========================================================= */

// Main voice input button
voiceInputButton.addEventListener("click", function() {

    openVoiceRecorder();

});


// Quick voice button
quickVoiceButton.addEventListener("click", function() {

    openVoiceRecorder();

});


// Mobile voice button
mobileVoiceButton.addEventListener("click", function() {

    openVoiceRecorder();

});


/* =========================================================
   5. START RECORDING
   ========================================================= */

startRecordingButton.addEventListener("click", async function() {

    /*
        First we ask the browser for permission
        to use the microphone.
    */

    try {

        microphoneStream =
            await navigator.mediaDevices.getUserMedia({
                audio: true
            });

    }

    catch (error) {

        console.error(
            "Microphone permission error:",
            error
        );

        recordingText.textContent =
            "Microphone permission denied.";

        return;

    }


    /* -----------------------------------------------------
       RESET PREVIOUS RECORDING
       ----------------------------------------------------- */

    audioChunks = [];

    audioBlob = null;

    audioPreview.innerHTML = "";

    publishVoiceButton.disabled = true;


    /* -----------------------------------------------------
       CREATE MEDIA RECORDER
       ----------------------------------------------------- */

    mediaRecorder =
        new MediaRecorder(microphoneStream);


    /* -----------------------------------------------------
       WHEN AUDIO DATA IS AVAILABLE
       ----------------------------------------------------- */

    mediaRecorder.addEventListener(
        "dataavailable",
        function(event) {

            /*
                The browser gives us small pieces
                of the recording.

                We store each piece inside audioChunks.
            */

            if (event.data.size > 0) {

                audioChunks.push(event.data);

            }

        }
    );


    /* -----------------------------------------------------
       WHEN RECORDING STOPS
       ----------------------------------------------------- */

    mediaRecorder.addEventListener(
        "stop",
        function() {

            /*
                Combine all the audio pieces
                into one audio file.
            */

            audioBlob = new Blob(
                audioChunks,
                {
                    type: "audio/webm"
                }
            );


            /* ---------------------------------------------
               CREATE PLAYBACK URL
               --------------------------------------------- */

            audioURL =
                URL.createObjectURL(audioBlob);


            /* ---------------------------------------------
               CREATE AUDIO PLAYER
               --------------------------------------------- */

            const audioPlayer =
                document.createElement("audio");

            audioPlayer.controls = true;

            audioPlayer.src = audioURL;

            audioPreview.innerHTML = "";

            audioPreview.appendChild(audioPlayer);


            /* ---------------------------------------------
               ENABLE PUBLISH BUTTON
               --------------------------------------------- */

            publishVoiceButton.disabled = false;


            /* ---------------------------------------------
               RESET RECORDING UI
               --------------------------------------------- */

            recordingDot.classList.remove(
                "recording"
            );

            recordingText.textContent =
                "Recording finished";


            /* ---------------------------------------------
               STOP USING THE MICROPHONE
               --------------------------------------------- */

            if (microphoneStream) {

                microphoneStream
                    .getTracks()
                    .forEach(function(track) {

                        track.stop();

                    });

                microphoneStream = null;

            }

        }
    );


    /* =====================================================
       START THE ACTUAL RECORDING
       ===================================================== */

    mediaRecorder.start();


    /* -----------------------------------------------------
       CHANGE UI
       ----------------------------------------------------- */

    recordingDot.classList.add("recording");

    recordingText.textContent =
        "Recording...";


    startRecordingButton.disabled = true;

    stopRecordingButton.disabled = false;


    /* -----------------------------------------------------
       RESET TIMER
       ----------------------------------------------------- */

    recordingSeconds = 0;

    recordingTime.textContent =
        "00:00";


    /* -----------------------------------------------------
       START TIMER
       ----------------------------------------------------- */

    recordingInterval =
        setInterval(function() {

            recordingSeconds++;

            const minutes =
                Math.floor(recordingSeconds / 60);

            const seconds =
                recordingSeconds % 60;


            /*
                padStart makes:

                1

                become:

                01
            */

            const formattedMinutes =
                String(minutes).padStart(2, "0");

            const formattedSeconds =
                String(seconds).padStart(2, "0");


            recordingTime.textContent =
                `${formattedMinutes}:${formattedSeconds}`;

        }, 1000);

});


/* =========================================================
   6. STOP RECORDING
   ========================================================= */

stopRecordingButton.addEventListener(
    "click",
    function() {

        /*
            Check that a recording actually exists.
        */

        if (
            mediaRecorder &&
            mediaRecorder.state === "recording"
        ) {

            mediaRecorder.stop();

        }


        /* -------------------------------------------------
           STOP TIMER
           ------------------------------------------------- */

        clearInterval(recordingInterval);


        /* -------------------------------------------------
           CHANGE BUTTONS
           ------------------------------------------------- */

        startRecordingButton.disabled = false;

        stopRecordingButton.disabled = true;

    }
);


/* =========================================================
   7. PUBLISH VOICE POST
   ========================================================= */

publishVoiceButton.addEventListener(
    "click",
    function() {

        /*
            At this stage we are NOT sending the audio
            to a server yet.

            We will do that when we build the backend.
        */

        if (!audioBlob) {

            alert("Please record something first.");

            return;

        }


        alert(
            "Your voice post is ready! Backend upload will be connected next."
        );


        console.log(
            "Recorded audio:",
            audioBlob
        );


        /*
            Later this section will become something like:

            const formData = new FormData();

            formData.append("audio", audioBlob);

            fetch("/api/posts", {
                method: "POST",
                body: formData
            });

            That is how the real CLKT server
            will receive the voice recording.
        */

    }
);


/* =========================================================
   8. SEARCH
   ========================================================= */

const searchInput =
    document.querySelector(".search-input");


searchInput.addEventListener(
    "keydown",
    function(event) {

        /*
            Check whether the user pressed Enter.
        */

        if (event.key === "Enter") {

            const searchText =
                searchInput.value.trim();


            if (searchText === "") {

                return;

            }


            console.log(
                "Searching for:",
                searchText
            );


            /*
                Real search will later connect
                to the CLKT backend/database.
            */

        }

    }
);


/* =========================================================
   9. FOLLOW BUTTONS
   ========================================================= */

const followButtons =
    document.querySelectorAll(".follow-button");


followButtons.forEach(function(button) {

    button.addEventListener(
        "click",
        function() {

            /*
                Temporary frontend behavior.

                Later this will actually create
                a relationship in our database.
            */

            if (button.textContent.trim() === "Follow") {

                button.textContent = "Following";

            }

            else {

                button.textContent = "Follow";

            }

        }
    );

});


/* =========================================================
   10. POST LIKE BUTTONS
   ========================================================= */

const postActionButtons =
    document.querySelectorAll(".post-actions button");


postActionButtons.forEach(function(button) {

    button.addEventListener(
        "click",
        function() {

            const buttonText =
                button.textContent.trim();


            /*
                Only temporarily demonstrate
                button interaction.
            */

            if (buttonText.includes("Like")) {

                if (button.classList.contains("liked")) {

                    button.classList.remove("liked");

                    button.textContent =
                        "❤️ Like";

                }

                else {

                    button.classList.add("liked");

                    button.textContent =
                        "❤️ Liked";

                }

            }

        }
    );

});


/* =========================================================
   11. VOICE PLAY BUTTONS
   ========================================================= */

const playButtons =
    document.querySelectorAll(".play-button");


playButtons.forEach(function(button) {

    button.addEventListener(
        "click",
        function() {

            /*
                The temporary posts do not have real
                audio files yet.

                Real voice posts will eventually
                contain actual audio URLs from
                our database/storage.
            */

            alert(
                "This post will play real voice audio once the backend is connected."
            );

        }
    );

});


/* =========================================================
   12. NAVIGATION BUTTONS
   ========================================================= */

const navButtons =
    document.querySelectorAll(".nav-button");


navButtons.forEach(function(button) {

    button.addEventListener(
        "click",
        function() {

            const page =
                button.textContent.trim();


            console.log(
                "Navigation clicked:",
                page
            );


            /*
                Later these will connect to real pages:

                Home
                Discover
                Notifications
                Profile
            */

        }
    );

});


/* =========================================================
   13. CLEAN UP AUDIO URL
   ========================================================= */

window.addEventListener(
    "beforeunload",
    function() {

        /*
            Free the temporary memory used
            by the audio playback URL.
        */

        if (audioURL) {

            URL.revokeObjectURL(audioURL);

        }

    }
);


/* =========================================================
   CLKT JAVASCRIPT LOADED
   ========================================================= */

console.log(
    "CLKT.com JavaScript loaded successfully."
);