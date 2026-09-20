// =====================================================
// CLKT.COM FRONTEND APP
// =====================================================

// =====================================================
// LOGGED-IN USER
// =====================================================

const token = localStorage.getItem("clktToken");

let currentUser = null;

try {

    const savedUser = localStorage.getItem("clktUser");

    if (savedUser) {

        currentUser = JSON.parse(savedUser);

    }

} catch (error) {

    console.error(
        "Could not read saved user:",
        error
    );

}


// =====================================================
// PROFILE INFORMATION
// =====================================================

const profileName = document.getElementById("profileName");
const profileUsername = document.getElementById("profileUsername");

if (currentUser) {

    if (profileName) {

        profileName.textContent =
            currentUser.name || "CLKT User";

    }

    if (profileUsername) {

        profileUsername.textContent =
            currentUser.username
                ? "@" + currentUser.username
                : "";

    }

}


// =====================================================
// VOICE RECORDER ELEMENTS
// =====================================================

const voiceInputButton =
    document.getElementById("voiceInputButton");

const quickVoiceButton =
    document.getElementById("quickVoiceButton");

const mobileVoiceButton =
    document.getElementById("mobileVoiceButton");

const voiceRecorder =
    document.getElementById("voiceRecorder");

const startRecordingButton =
    document.getElementById("startRecordingButton");

const stopRecordingButton =
    document.getElementById("stopRecordingButton");

const recordingDot =
    document.getElementById("recordingDot");

const recordingText =
    document.getElementById("recordingText");

const recordingTime =
    document.getElementById("recordingTime");

const audioPreview =
    document.getElementById("audioPreview");

const publishVoiceButton =
    document.getElementById("publishVoiceButton");


// =====================================================
// RECORDING VARIABLES
// =====================================================

let mediaRecorder = null;

let audioChunks = [];

let audioBlob = null;

let audioURL = null;

let recordingInterval = null;

let recordingSeconds = 0;

let microphoneStream = null;


// =====================================================
// OPEN VOICE RECORDER
// =====================================================

function openVoiceRecorder() {

    if (!voiceRecorder) {

        console.error(
            "Voice recorder element was not found."
        );

        return;

    }

    voiceRecorder.style.display = "block";

}


if (voiceInputButton) {

    voiceInputButton.addEventListener(
        "click",
        openVoiceRecorder
    );

}


if (quickVoiceButton) {

    quickVoiceButton.addEventListener(
        "click",
        openVoiceRecorder
    );

}


if (mobileVoiceButton) {

    mobileVoiceButton.addEventListener(
        "click",
        openVoiceRecorder
    );

}


// =====================================================
// START RECORDING
// =====================================================

if (startRecordingButton) {

    startRecordingButton.addEventListener(
        "click",
        async function() {

            try {

                console.log(
                    "Requesting microphone permission..."
                );

                microphoneStream =
                    await navigator.mediaDevices.getUserMedia({
                        audio: true
                    });

                console.log(
                    "Microphone permission granted."
                );


                audioChunks = [];

                audioBlob = null;


                mediaRecorder =
                    new MediaRecorder(
                        microphoneStream
                    );


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


                mediaRecorder.addEventListener(
                    "stop",
                    function() {

                        console.log(
                            "Recording stopped."
                        );


                        audioBlob =
                            new Blob(
                                audioChunks,
                                {
                                    type:
                                        mediaRecorder.mimeType ||
                                        "audio/webm"
                                }
                            );


                        console.log(
                            "Audio blob created:",
                            audioBlob
                        );


                        if (audioURL) {

                            URL.revokeObjectURL(
                                audioURL
                            );

                        }


                        audioURL =
                            URL.createObjectURL(
                                audioBlob
                            );


                        if (audioPreview) {

                            audioPreview.innerHTML = "";


                            const audio =
                                document.createElement(
                                    "audio"
                                );


                            audio.controls = true;

                            audio.src = audioURL;

                            audio.style.width = "100%";


                            audioPreview.appendChild(
                                audio
                            );

                        }


                        if (publishVoiceButton) {

                            publishVoiceButton.disabled =
                                false;

                        }


                        if (recordingText) {

                            recordingText.textContent =
                                "Recording ready";

                        }


                        if (recordingDot) {

                            recordingDot.style.display =
                                "none";

                        }


                        if (microphoneStream) {

                            microphoneStream
                                .getTracks()
                                .forEach(
                                    function(track) {

                                        track.stop();

                                    }
                                );

                        }

                    }
                );


                mediaRecorder.start();


                console.log(
                    "Recording started."
                );


                recordingSeconds = 0;


                if (recordingTime) {

                    recordingTime.textContent =
                        "00:00";

                }


                if (recordingText) {

                    recordingText.textContent =
                        "Recording...";

                }


                if (recordingDot) {

                    recordingDot.style.display =
                        "block";

                }


                startRecordingButton.disabled =
                    true;


                if (stopRecordingButton) {

                    stopRecordingButton.disabled =
                        false;

                }


                if (publishVoiceButton) {

                    publishVoiceButton.disabled =
                        true;

                }


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


                            if (recordingTime) {

                                recordingTime.textContent =
                                    String(minutes)
                                        .padStart(2, "0")
                                    + ":" +
                                    String(seconds)
                                        .padStart(2, "0");

                            }

                        },
                        1000
                    );


            } catch (error) {

                console.error(
                    "Microphone error:",
                    error
                );


                alert(
                    "Could not access your microphone. Please allow microphone permission and try again."
                );

            }

        }
    );

}


// =====================================================
// STOP RECORDING
// =====================================================

if (stopRecordingButton) {

    stopRecordingButton.addEventListener(
        "click",
        function() {

            if (
                mediaRecorder &&
                mediaRecorder.state !== "inactive"
            ) {

                mediaRecorder.stop();

            }


            if (recordingInterval) {

                clearInterval(
                    recordingInterval
                );

                recordingInterval = null;

            }


            if (startRecordingButton) {

                startRecordingButton.disabled =
                    false;

            }


            stopRecordingButton.disabled =
                true;

        }
    );

}


// =====================================================
// PUBLISH VOICE POST
// =====================================================

if (publishVoiceButton) {

    publishVoiceButton.addEventListener(
        "click",
        async function() {

            // -------------------------------------------------
            // CHECK RECORDING
            // -------------------------------------------------

            if (!audioBlob) {

                alert(
                    "Please record your voice first."
                );

                return;

            }


            // -------------------------------------------------
            // CHECK LOGGED-IN USER
            // -------------------------------------------------

            if (!currentUser) {

                alert(
                    "You must be logged in to publish a post."
                );

                return;

            }


            const userId =
                currentUser.id ||
                currentUser._id;


            if (!userId) {

                console.error(
                    "Current user does not contain an ID:",
                    currentUser
                );


                alert(
                    "Could not find your user ID. Please log in again."
                );

                return;

            }


            try {

                // -------------------------------------------------
                // DISABLE BUTTON WHILE UPLOADING
                // -------------------------------------------------

                publishVoiceButton.disabled =
                    true;


                publishVoiceButton.textContent =
                    "Uploading...";


                console.log(
                    "Starting Cloudinary upload..."
                );


                // -------------------------------------------------
                // CREATE CLOUDINARY FORM DATA
                // -------------------------------------------------

                const formData =
                    new FormData();


                formData.append(
                    "file",
                    audioBlob
                );


                formData.append(
                    "upload_preset",
                    "clkt_voice"
                );


                // -------------------------------------------------
                // UPLOAD AUDIO TO CLOUDINARY
                // -------------------------------------------------

                const cloudinaryResponse =
                    await fetch(
                        "https://api.cloudinary.com/v1_1/ewtmbwnp/auto/upload",
                        {
                            method: "POST",
                            body: formData
                        }
                    );


                const cloudinaryData =
                    await cloudinaryResponse.json();


                console.log(
                    "Cloudinary response:",
                    cloudinaryData
                );


                // -------------------------------------------------
                // CHECK CLOUDINARY UPLOAD
                // -------------------------------------------------

                if (
                    !cloudinaryResponse.ok ||
                    !cloudinaryData.secure_url
                ) {

                    console.error(
                        "Cloudinary upload failed:",
                        cloudinaryData
                    );


                    throw new Error(
                        cloudinaryData.error?.message ||
                        "Cloudinary upload failed."
                    );

                }


                const audioUrl =
                    cloudinaryData.secure_url;


                console.log(
                    "Audio uploaded successfully."
                );


                console.log(
                    "Audio URL:",
                    audioUrl
                );


                // -------------------------------------------------
                // SEND POST TO CLKT BACKEND
                // -------------------------------------------------

                publishVoiceButton.textContent =
                    "Creating post...";


                const postResponse =
                    await fetch(
                        "https://clkt-backend.onrender.com/api/posts",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                userId:
                                    userId,

                                type:
                                    "voice",

                                text:
                                    "",

                                audioUrl:
                                    audioUrl

                            })
                        }
                    );


                const postData =
                    await postResponse.json();


                console.log(
                    "CLKT backend response:",
                    postData
                );


                // -------------------------------------------------
                // CHECK BACKEND RESPONSE
                // -------------------------------------------------

                if (!postResponse.ok) {

                    throw new Error(
                        postData.message ||
                        "Could not create the post."
                    );

                }


                // -------------------------------------------------
                // SUCCESS
                // -------------------------------------------------

                console.log(
                    "Voice post created successfully."
                );


                alert(
                    "Your voice post was published successfully!"
                );


                // -------------------------------------------------
                // RESET RECORDER
                // -------------------------------------------------

                audioBlob = null;


                if (audioURL) {

                    URL.revokeObjectURL(
                        audioURL
                    );

                    audioURL = null;

                }


                if (audioPreview) {

                    audioPreview.innerHTML = "";

                }


                if (recordingTime) {

                    recordingTime.textContent =
                        "00:00";

                }


                if (recordingText) {

                    recordingText.textContent =
                        "Ready to record";

                }


                if (recordingDot) {

                    recordingDot.style.display =
                        "none";

                }


                publishVoiceButton.textContent =
                    "Publish Voice";


                publishVoiceButton.disabled =
                    true;


                if (startRecordingButton) {

                    startRecordingButton.disabled =
                        false;

                }


                if (stopRecordingButton) {

                    stopRecordingButton.disabled =
                        true;

                }


                // -------------------------------------------------
                // RELOAD FEED
                // -------------------------------------------------

                loadPosts();


            } catch (error) {

                console.error(
                    "Publish voice post error:",
                    error
                );


                alert(
                    "Something went wrong while publishing your voice post. Check the browser console for details."
                );


                publishVoiceButton.textContent =
                    "Publish Voice";


                publishVoiceButton.disabled =
                    false;

            }

        }
    );

}


// =====================================================
// LIKE / UNLIKE POST
// =====================================================

async function toggleLike(
    postId,
    likeButton,
    likeCountElement
) {

    // -------------------------------------------------
    // CHECK LOGGED-IN USER
    // -------------------------------------------------

    if (!currentUser) {

        alert(
            "You must be logged in to like a post."
        );

        return;

    }


    const userId =
        currentUser.id ||
        currentUser._id;


    if (!userId) {

        alert(
            "Could not find your user ID. Please log in again."
        );

        return;

    }


    // -------------------------------------------------
    // DISABLE BUTTON WHILE REQUEST IS PROCESSING
    // -------------------------------------------------

    likeButton.disabled = true;


    try {

        const response =
            await fetch(
                "https://clkt-backend.onrender.com/api/posts/" +
                postId +
                "/like",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        userId:
                            userId

                    })
                }
            );


        const data =
            await response.json();


        console.log(
            "Like response:",
            data
        );


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Could not like the post."
            );

        }


        // -------------------------------------------------
        // UPDATE LIKE COUNT
        // -------------------------------------------------

        likeCountElement.textContent =
            data.likeCount;


        // -------------------------------------------------
        // UPDATE BUTTON STATE
        // -------------------------------------------------

        if (data.liked) {

            likeButton.textContent =
                "❤️ Liked";

            likeButton.dataset.liked =
                "true";

        } else {

            likeButton.textContent =
                "♡ Like";

            likeButton.dataset.liked =
                "false";

        }


    } catch (error) {

        console.error(
            "Like post error:",
            error
        );


        alert(
            "Could not like this post. Please try again."
        );

    }


    // -------------------------------------------------
    // ENABLE BUTTON AGAIN
    // -------------------------------------------------

    likeButton.disabled =
        false;

}


// =====================================================
// LOAD POSTS
// =====================================================

async function loadPosts() {

    try {

        console.log(
            "Loading CLKT posts..."
        );


        const response =
            await fetch(
                "https://clkt-backend.onrender.com/api/posts"
            );


        const data =
            await response.json();


        console.log(
            "Posts received:",
            data
        );


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Could not load posts."
            );

        }


        const posts =
            data.posts || [];


        // -------------------------------------------------
        // FIND FEED CONTAINER
        // -------------------------------------------------

        const feed =
            document.getElementById("postsContainer") ||
            document.getElementById("feed") ||
            document.querySelector(".posts");


        if (!feed) {

            console.warn(
                "Post feed container was not found."
            );

            return;

        }


        feed.innerHTML = "";


        // -------------------------------------------------
        // NO POSTS
        // -------------------------------------------------

        if (posts.length === 0) {

            feed.innerHTML =
                "<p>No posts yet.</p>";

            return;

        }


        // -------------------------------------------------
        // DISPLAY POSTS
        // -------------------------------------------------

        posts.forEach(
            function(post) {

                const postElement =
                    document.createElement(
                        "div"
                    );


                postElement.className =
                    "post";


                // -------------------------------------------------
                // USER NAME
                // -------------------------------------------------

                const name =
                    post.user?.name ||
                    "CLKT User";


                const username =
                    post.user?.username
                        ? "@" +
                          post.user.username
                        : "";


                // -------------------------------------------------
                // CREATE USER INFORMATION
                // -------------------------------------------------

                const userInfo =
                    document.createElement(
                        "div"
                    );


                userInfo.className =
                    "post-user";


                userInfo.textContent =
                    name +
                    (
                        username
                            ? " " + username
                            : ""
                    );


                postElement.appendChild(
                    userInfo
                );


                // -------------------------------------------------
                // TEXT POST
                // -------------------------------------------------

                if (
                    post.type === "text" &&
                    post.text
                ) {

                    const textElement =
                        document.createElement(
                            "p"
                        );


                    textElement.textContent =
                        post.text;


                    postElement.appendChild(
                        textElement
                    );

                }


                // -------------------------------------------------
                // VOICE POST
                // -------------------------------------------------

                if (
                    post.type === "voice" &&
                    post.audioUrl
                ) {

                    const audio =
                        document.createElement(
                            "audio"
                        );


                    audio.controls = true;

                    audio.src =
                        post.audioUrl;

                    audio.preload =
                        "metadata";

                    audio.style.width =
                        "100%";


                    postElement.appendChild(
                        audio
                    );

                }


                // -------------------------------------------------
                // PHOTO POST
                // -------------------------------------------------

                if (
                    post.type === "photo" &&
                    post.imageUrl
                ) {

                    const image =
                        document.createElement(
                            "img"
                        );


                    image.src =
                        post.imageUrl;

                    image.alt =
                        "CLKT post image";

                    image.style.maxWidth =
                        "100%";


                    postElement.appendChild(
                        image
                    );

                }


                // -------------------------------------------------
                // POST ACTIONS
                // -------------------------------------------------

                const actions =
                    document.createElement(
                        "div"
                    );


                actions.className =
                    "post-actions";


                actions.style.display =
                    "flex";

                actions.style.alignItems =
                    "center";

                actions.style.gap =
                    "10px";

                actions.style.marginTop =
                    "12px";


                // -------------------------------------------------
                // LIKE BUTTON
                // -------------------------------------------------

                const likeButton =
                    document.createElement(
                        "button"
                    );


                const likes =
                    post.likes || [];


                const userHasLiked =
                    currentUser &&
                    likes.some(
                        function(likedUserId) {

                            const likedId =
                                likedUserId._id ||
                                likedUserId;

                            const currentId =
                                currentUser.id ||
                                currentUser._id;

                            return (
                                likedId.toString() ===
                                currentId.toString()
                            );

                        }
                    );


                likeButton.textContent =
                    userHasLiked
                        ? "❤️ Liked"
                        : "♡ Like";


                likeButton.dataset.liked =
                    userHasLiked
                        ? "true"
                        : "false";


                likeButton.style.cursor =
                    "pointer";


                // -------------------------------------------------
                // LIKE COUNT
                // -------------------------------------------------

                const likeCountElement =
                    document.createElement(
                        "span"
                    );


                likeCountElement.textContent =
                    likes.length;


                likeCountElement.className =
                    "like-count";


                // -------------------------------------------------
                // LIKE BUTTON CLICK
                // -------------------------------------------------

                likeButton.addEventListener(
                    "click",
                    function() {

                        toggleLike(
                            post._id,
                            likeButton,
                            likeCountElement
                        );

                    }
                );


                actions.appendChild(
                    likeButton
                );


                actions.appendChild(
                    likeCountElement
                );


                // -------------------------------------------------
                // COMMENT BUTTON
                // -------------------------------------------------

                const commentButton =
                    document.createElement(
                        "button"
                    );


                commentButton.textContent =
                    "💬 Comment";


                commentButton.style.cursor =
                    "pointer";


                commentButton.addEventListener(
                    "click",
                    function() {

                        alert(
                            "Comments are coming soon."
                        );

                    }
                );


                actions.appendChild(
                    commentButton
                );


                // -------------------------------------------------
                // SHARE BUTTON
                // -------------------------------------------------

                const shareButton =
                    document.createElement(
                        "button"
                    );


                shareButton.textContent =
                    "↗ Share";


                shareButton.style.cursor =
                    "pointer";


                shareButton.addEventListener(
                    "click",
                    async function() {

                        try {

                            const shareData = {

                                title:
                                    "CLKT Post",

                                text:
                                    "Check out this post on CLKT.",

                                url:
                                    window.location.href +
                                    "?post=" +
                                    post._id

                            };


                            if (
                                navigator.share
                            ) {

                                await navigator.share(
                                    shareData
                                );

                            } else {

                                await navigator.clipboard.writeText(
                                    shareData.url
                                );

                                alert(
                                    "Post link copied to clipboard."
                                );

                            }

                        } catch (error) {

                            console.error(
                                "Share error:",
                                error
                            );

                        }

                    }
                );


                actions.appendChild(
                    shareButton
                );


                // -------------------------------------------------
                // ADD ACTIONS TO POST
                // -------------------------------------------------

                postElement.appendChild(
                    actions
                );


                // -------------------------------------------------
                // ADD POST TO FEED
                // -------------------------------------------------

                feed.appendChild(
                    postElement
                );

            }
        );


    } catch (error) {

        console.error(
            "Load posts error:",
            error
        );

    }

}


// =====================================================
// LOAD POSTS WHEN PAGE OPENS
// =====================================================

loadPosts();


// =====================================================
// SEARCH
// =====================================================

const searchInput =
    document.getElementById("searchInput");


if (searchInput) {

    searchInput.addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {

                console.log(
                    "Search:",
                    searchInput.value
                );

            }

        }
    );

}


// =====================================================
// NAVIGATION PLACEHOLDERS
// =====================================================

const navigationButtons =
    document.querySelectorAll(
        "[data-page]"
    );


navigationButtons.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                const page =
                    button.dataset.page;


                console.log(
                    "Navigation clicked:",
                    page
                );

            }
        );

    }
);