/* =========================================================
   CLKT.COM
   Main JavaScript
   Logged-in User + Voice Recorder
   ========================================================= */


/* =========================================================
   1. GET LOGGED-IN USER
   ========================================================= */

const token =
    localStorage.getItem("clktToken");

const storedUser =
    localStorage.getItem("clktUser");


/*
    If there is no login token or user information,
    send the visitor back to the login page.
*/

if (!token || !storedUser) {

    window.location.href =
        "login.html";

}


/* =========================================================
   2. CONVERT SAVED USER DATA INTO JAVASCRIPT OBJECT
   ========================================================= */

let currentUser = null;


try {

    currentUser =
        JSON.parse(storedUser);

}
catch (error) {

    console.error(
        "Could not read saved CLKT user:",
        error
    );

    localStorage.removeItem("clktToken");
    localStorage.removeItem("clktUser");

    window.location.href =
        "login.html";

}


/* =========================================================
   3. GET PROFILE ELEMENTS
   ========================================================= */

const sidebarProfilePicture =
    document.getElementById(
        "sidebarProfilePicture"
    );

const sidebarProfileName =
    document.getElementById(
        "sidebarProfileName"
    );

const sidebarProfileUsername =
    document.getElementById(
        "sidebarProfileUsername"
    );

const createPostProfilePicture =
    document.getElementById(
        "createPostProfilePicture"
    );


/* =========================================================
   4. DISPLAY LOGGED-IN USER
   ========================================================= */

if (currentUser) {

    /*
        Get the first letter of the user's name.

        Example:

        Abdikarim
        becomes:

        A
    */

    const firstLetter =
        currentUser.name
            ? currentUser.name
                .charAt(0)
                .toUpperCase()
            : "U";


    /*
        Display the user's real name.
    */

    if (sidebarProfileName) {

        sidebarProfileName.textContent =
            currentUser.name;

    }


    /*
        Display the user's real username.
    */

    if (sidebarProfileUsername) {

        sidebarProfileUsername.textContent =
            "@" + currentUser.username;

    }


    /*
        Display the user's first letter
        inside the profile picture.
    */

    if (sidebarProfilePicture) {

        sidebarProfilePicture.textContent =
            firstLetter;

    }


    if (createPostProfilePicture) {

        createPostProfilePicture.textContent =
            firstLetter;

    }

}


/* =========================================================
   5. GET VOICE RECORDER ELEMENTS
   ========================================================= */

const voiceInputButton =
    document.getElementById(
        "voiceInputButton"
    );

const quickVoiceButton =
    document.getElementById(
        "quickVoiceButton"
    );

const mobileVoiceButton =
    document.getElementById(
        "mobileVoiceButton"
    );

const voiceRecorder =
    document.getElementById(
        "voiceRecorder"
    );

const startRecordingButton =
    document.getElementById(
        "startRecordingButton"
    );

const stopRecordingButton =
    document.getElementById(
        "stopRecordingButton"
    );

const recordingDot =
    document.getElementById(
        "recordingDot"
    );

const recordingText =
    document.getElementById(
        "recordingText"
    );

const recordingTime =
    document.getElementById(
        "recordingTime"
    );

const audioPreview =
    document.getElementById(
        "audioPreview"
    );

const publishVoiceButton =
    document.getElementById(
        "publishVoiceButton"
    );


/* =========================================================
   6. RECORDING VARIABLES
   ========================================================= */

let mediaRecorder = null;

let audioChunks = [];

let audioBlob = null;

let audioURL = null;

let recordingInterval = null;

let recordingSeconds = 0;

let microphoneStream = null;


/* =========================================================
   7. OPEN VOICE RECORDER
   ========================================================= */

function openVoiceRecorder() {

    if (!voiceRecorder) {
        return;
    }


    voiceRecorder.classList.remove(
        "hidden"
    );


    voiceRecorder.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


/* =========================================================
   8. CONNECT VOICE BUTTONS
   ========================================================= */

if (voiceInputButton) {

    voiceInputButton.addEventListener(
        "click",
        function() {

            openVoiceRecorder();

        }
    );

}


if (quickVoiceButton) {

    quickVoiceButton.addEventListener(
        "click",
        function() {

            openVoiceRecorder();

        }
    );

}


if (mobileVoiceButton) {

    mobileVoiceButton.addEventListener(
        "click",
        function() {

            openVoiceRecorder();

        }
    );

}


/* =========================================================
   9. START RECORDING
   ========================================================= */

if (startRecordingButton) {

    startRecordingButton.addEventListener(
        "click",
        async function() {


            /*
                Ask the browser for microphone permission.
            */

            try {

                microphoneStream =
                    await navigator.mediaDevices
                        .getUserMedia({
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


            /* ---------------------------------------------
               RESET PREVIOUS RECORDING
               --------------------------------------------- */

            audioChunks = [];

            audioBlob = null;


            if (audioPreview) {

                audioPreview.innerHTML = "";

            }


            if (publishVoiceButton) {

                publishVoiceButton.disabled =
                    true;

            }


            /* ---------------------------------------------
               CREATE MEDIA RECORDER
               --------------------------------------------- */

            mediaRecorder =
                new MediaRecorder(
                    microphoneStream
                );


            /* ---------------------------------------------
               RECEIVE AUDIO DATA
               --------------------------------------------- */

            mediaRecorder.addEventListener(
                "dataavailable",
                function(event) {

                    if (event.data.size > 0) {

                        audioChunks.push(
                            event.data
                        );

                    }

                }
            );


            /* ---------------------------------------------
               WHEN RECORDING STOPS
               --------------------------------------------- */

            mediaRecorder.addEventListener(
                "stop",
                function() {


                    /*
                        Combine all recorded audio pieces
                        into one audio file.
                    */

                    audioBlob =
                        new Blob(
                            audioChunks,
                            {
                                type: "audio/webm"
                            }
                        );


                    /* -------------------------------------
                       CREATE TEMPORARY PLAYBACK URL
                       ------------------------------------- */

                    audioURL =
                        URL.createObjectURL(
                            audioBlob
                        );


                    /* -------------------------------------
                       CREATE AUDIO PLAYER
                       ------------------------------------- */

                    const audioPlayer =
                        document.createElement(
                            "audio"
                        );


                    audioPlayer.controls =
                        true;


                    audioPlayer.src =
                        audioURL;


                    if (audioPreview) {

                        audioPreview.innerHTML =
                            "";

                        audioPreview.appendChild(
                            audioPlayer
                        );

                    }


                    /* -------------------------------------
                       ENABLE PUBLISH BUTTON
                       ------------------------------------- */

                    if (publishVoiceButton) {

                        publishVoiceButton.disabled =
                            false;

                    }


                    /* -------------------------------------
                       UPDATE RECORDING STATUS
                       ------------------------------------- */

                    if (recordingDot) {

                        recordingDot.classList.remove(
                            "recording"
                        );

                    }


                    if (recordingText) {

                        recordingText.textContent =
                            "Recording finished";

                    }


                    /* -------------------------------------
                       RELEASE MICROPHONE
                       ------------------------------------- */

                    if (microphoneStream) {

                        microphoneStream
                            .getTracks()
                            .forEach(
                                function(track) {

                                    track.stop();

                                }
                            );

                        microphoneStream =
                            null;

                    }

                }
            );


            /* =================================================
               START ACTUAL RECORDING
               ================================================= */

            mediaRecorder.start();


            /* ---------------------------------------------
               UPDATE RECORDING UI
               --------------------------------------------- */

            if (recordingDot) {

                recordingDot.classList.add(
                    "recording"
                );

            }


            if (recordingText) {

                recordingText.textContent =
                    "Recording...";

            }


            startRecordingButton.disabled =
                true;


            if (stopRecordingButton) {

                stopRecordingButton.disabled =
                    false;

            }


            /* ---------------------------------------------
               RESET TIMER
               --------------------------------------------- */

            recordingSeconds =
                0;


            if (recordingTime) {

                recordingTime.textContent =
                    "00:00";

            }


            /* ---------------------------------------------
               START TIMER
               --------------------------------------------- */

            recordingInterval =
                setInterval(
                    function() {

                        recordingSeconds++;


                        const minutes =
                            Math.floor(
                                recordingSeconds / 60
                            );


                        const seconds =
                            recordingSeconds % 60;


                        const formattedMinutes =
                            String(minutes)
                                .padStart(2, "0");


                        const formattedSeconds =
                            String(seconds)
                                .padStart(2, "0");


                        if (recordingTime) {

                            recordingTime.textContent =
                                `${formattedMinutes}:${formattedSeconds}`;

                        }

                    },
                    1000
                );

        }
    );

}


/* =========================================================
   10. STOP RECORDING
   ========================================================= */

if (stopRecordingButton) {

    stopRecordingButton.addEventListener(
        "click",
        function() {


            if (
                mediaRecorder &&
                mediaRecorder.state === "recording"
            ) {

                mediaRecorder.stop();

            }


            clearInterval(
                recordingInterval
            );


            if (startRecordingButton) {

                startRecordingButton.disabled =
                    false;

            }


            stopRecordingButton.disabled =
                true;

        }
    );

}


/* =========================================================
   11. PUBLISH VOICE POST
   ========================================================= */

if (publishVoiceButton) {

    publishVoiceButton.addEventListener(
        "click",
        function() {


            /*
                The audio upload system is not connected
                to the backend yet.

                For now we only confirm that a recording
                exists.
            */

            if (!audioBlob) {

                alert(
                    "Please record something first."
                );

                return;

            }


            alert(
                "Your voice recording is ready. The real post upload system will be connected next."
            );


            console.log(
                "Recorded audio:",
                audioBlob
            );

        }
    );

}


/* =========================================================
   12. SEARCH
   ========================================================= */

const searchInput =
    document.querySelector(
        ".search-input"
    );


if (searchInput) {

    searchInput.addEventListener(
        "keydown",
        function(event) {


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
                    Real search will eventually
                    connect to the CLKT backend.
                */

            }

        }
    );

}


/* =========================================================
   13. NAVIGATION BUTTONS
   ========================================================= */

const navButtons =
    document.querySelectorAll(
        ".nav-button"
    );


navButtons.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                const page =
                    button.textContent.trim();


                console.log(
                    "Navigation clicked:",
                    page
                );

            }
        );

    }
);


/* =========================================================
   14. CLEAN UP AUDIO URL
   ========================================================= */

window.addEventListener(
    "beforeunload",
    function() {


        if (audioURL) {

            URL.revokeObjectURL(
                audioURL
            );

        }

    }
);


/* =========================================================
   CLKT JAVASCRIPT LOADED
   ========================================================= */

console.log(
    "CLKT.com JavaScript loaded successfully."
);
async function loadPosts() {

    const postsContainer =
        document.getElementById("postsContainer");

    if (!postsContainer) {
        return;
    }

    try {

        const response =
            await fetch(
                "https://clkt-backend.onrender.com/api/posts"
            );

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data.message || "Unable to load posts."
            );

        }

        postsContainer.innerHTML = "";

        if (
            !data.posts ||
            data.posts.length === 0
        ) {

            postsContainer.innerHTML =
                "<p>No posts yet.</p>";

            return;
        }

        data.posts.forEach(function(post) {

            const postElement =
                document.createElement("div");

            postElement.className =
                "post-card";

            postElement.innerHTML = `
                <h3>${post.user.name}</h3>
                <p>@${post.user.username}</p>
                <p>${post.text || ""}</p>
            `;

            postsContainer.appendChild(
                postElement
            );

        });

    } catch (error) {

        console.error(
            "Unable to load posts:",
            error
        );

        postsContainer.innerHTML =
            "<p>Unable to load posts.</p>";
    }
}

loadPosts();