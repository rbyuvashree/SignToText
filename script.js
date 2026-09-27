/* =========================================================
   SIGNTOTEXT AI
   New Minimal Translator Interface
   ========================================================= */


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const videoElement =
    document.getElementById("webcam");

const canvasElement =
    document.getElementById("output_canvas");

const canvasCtx =
    canvasElement
        ? canvasElement.getContext("2d")
        : null;

const gestureOutput =
    document.getElementById("detected-gesture");

const confidenceBar =
    document.getElementById("confidence-bar");

const confidenceValue =
    document.getElementById("confidence-value");

const themeButton =
    document.getElementById("theme-toggle");

const themeIcon =
    document.getElementById("theme-icon");

const themeText =
    document.getElementById("theme-text");

const cameraStatus =
    document.querySelector(".camera-status");


/* =========================================================
   THEME
   ========================================================= */

function updateTheme(isLight) {

    if (isLight) {

        document.body.classList.add("light-theme");

        if (themeIcon) {
            themeIcon.innerHTML =
                '<i class="fa-solid fa-sun"></i>';
        }

        if (themeText) {
            themeText.textContent = "Dark";
        }

    } else {

        document.body.classList.remove("light-theme");

        if (themeIcon) {
            themeIcon.innerHTML =
                '<i class="fa-solid fa-moon"></i>';
        }

        if (themeText) {
            themeText.textContent = "Light";
        }
    }
}


/* Load saved theme */

const savedTheme =
    localStorage.getItem("signtotext-theme");

updateTheme(savedTheme === "light");


/* Theme button */

if (themeButton) {

    themeButton.addEventListener("click", () => {

        const isCurrentlyLight =
            document.body.classList.contains("light-theme");

        const newTheme =
            !isCurrentlyLight;

        updateTheme(newTheme);

        localStorage.setItem(
            "signtotext-theme",
            newTheme ? "light" : "dark"
        );
    });
}


/* =========================================================
   CAMERA STATUS
   ========================================================= */

function setCameraStatus(
    message,
    online = true
) {

    if (!cameraStatus) {
        return;
    }

    const color =
        online
            ? "#20b486"
            : "#ef6675";

    cameraStatus.innerHTML = `
        <span
            class="camera-dot"
            style="
                background: ${color};
                box-shadow: 0 0 8px ${color};
            "
        ></span>

        ${message}
    `;
}


/* =========================================================
   CONFIDENCE
   ========================================================= */

function setConfidence(value) {

    const percentage =
        Math.max(
            0,
            Math.min(100, value)
        );

    if (confidenceBar) {

        confidenceBar.style.width =
            percentage + "%";
    }

    if (confidenceValue) {

        confidenceValue.textContent =
            percentage + "%";
    }
}


/* =========================================================
   GESTURE STABILIZATION
   ========================================================= */

let previousGesture = "";

let stableFrames = 0;

const requiredFrames = 3;


function showGesture(gesture) {

    if (!gestureOutput) {
        return;
    }


    if (gesture === previousGesture) {

        stableFrames++;

    } else {

        previousGesture = gesture;

        stableFrames = 0;
    }


    if (
        stableFrames >= requiredFrames ||
        gesture === "No hands detected"
    ) {

        gestureOutput.textContent =
            gesture;
    }
}


/* =========================================================
   DISTANCE FUNCTION
   ========================================================= */

function distance(pointA, pointB) {

    return Math.sqrt(

        Math.pow(
            pointA.x - pointB.x,
            2
        ) +

        Math.pow(
            pointA.y - pointB.y,
            2
        ) +

        Math.pow(
            pointA.z - pointB.z,
            2
        )
    );
}


/* =========================================================
   GESTURE CLASSIFICATION
   ========================================================= */

function classifyGesture(hand) {

    const palmSize =
        distance(
            hand[0],
            hand[9]
        );


    if (palmSize === 0) {

        return "Tracking Sign...";
    }


    /* Finger states */

    const indexOpen =
        hand[8].y < hand[6].y;

    const middleOpen =
        hand[12].y < hand[10].y;

    const ringOpen =
        hand[16].y < hand[14].y;

    const pinkyOpen =
        hand[20].y < hand[18].y;


    /* Thumb */

    const thumbUp =
        hand[4].y < hand[3].y &&
        hand[3].y < hand[2].y;

    const thumbExtended =
        Math.abs(
            hand[4].x - hand[0].x
        ) >
        Math.abs(
            hand[2].x - hand[0].x
        );


    /* Thumb distances */

    const thumbIndex =
        distance(
            hand[4],
            hand[8]
        ) / palmSize;

    const thumbMiddle =
        distance(
            hand[4],
            hand[12]
        ) / palmSize;

    const thumbRing =
        distance(
            hand[4],
            hand[16]
        ) / palmSize;

    const thumbPinky =
        distance(
            hand[4],
            hand[20]
        ) / palmSize;


    /* Hand orientation */

    const sideways =
        Math.abs(
            hand[8].x - hand[20].x
        ) >
        Math.abs(
            hand[8].y - hand[20].y
        );


    /* =====================================================
       NUMBERS 6 - 9
       ===================================================== */

    if (
        thumbPinky < 0.35 &&
        indexOpen &&
        middleOpen &&
        ringOpen
    ) {

        return "6";
    }


    if (
        thumbRing < 0.35 &&
        indexOpen &&
        middleOpen &&
        pinkyOpen
    ) {

        return "7";
    }


    if (
        thumbMiddle < 0.35 &&
        indexOpen &&
        ringOpen &&
        pinkyOpen
    ) {

        return "8";
    }


    if (
        thumbIndex < 0.35 &&
        middleOpen &&
        ringOpen &&
        pinkyOpen
    ) {

        return "9";
    }


    /* =====================================================
       WORDS
       ===================================================== */


    /* Hello */

    if (
        thumbExtended &&
        indexOpen &&
        middleOpen &&
        ringOpen &&
        pinkyOpen &&
        sideways
    ) {

        return "Hello";
    }


    /* Love You */

    if (
        thumbExtended &&
        indexOpen &&
        !middleOpen &&
        !ringOpen &&
        pinkyOpen
    ) {

        return "Love You";
    }


    /* Call Me */

    if (
        thumbExtended &&
        !indexOpen &&
        !middleOpen &&
        !ringOpen &&
        pinkyOpen
    ) {

        return "Call Me";
    }


    /* Thumbs Up */

    if (
        thumbUp &&
        !indexOpen &&
        !middleOpen &&
        !ringOpen &&
        !pinkyOpen
    ) {

        return "Thumbs Up";
    }


    /* Help */

    if (
        !indexOpen &&
        !middleOpen &&
        !ringOpen &&
        !pinkyOpen &&
        hand[0].y > 0.55
    ) {

        return "Help";
    }


    /* Angry */

    if (
        !indexOpen &&
        !middleOpen &&
        !ringOpen &&
        !pinkyOpen &&
        !thumbExtended &&
        !thumbUp &&
        hand[0].y <= 0.55
    ) {

        return "Angry";
    }


    /* =====================================================
       NUMBERS 1 - 5
       ===================================================== */


    /* 1 */

    if (
        indexOpen &&
        !middleOpen &&
        !ringOpen &&
        !pinkyOpen &&
        !thumbExtended
    ) {

        return "1";
    }


    /* 2 */

    if (
        indexOpen &&
        middleOpen &&
        !ringOpen &&
        !pinkyOpen &&
        !thumbExtended
    ) {

        return "2";
    }


    /* 3 */

    if (
        thumbExtended &&
        indexOpen &&
        middleOpen &&
        !ringOpen &&
        !pinkyOpen
    ) {

        return "3";
    }


    /* 4 */

    if (
        !thumbExtended &&
        indexOpen &&
        middleOpen &&
        ringOpen &&
        pinkyOpen
    ) {

        return "4";
    }


    /* 5 */

    if (
        thumbExtended &&
        indexOpen &&
        middleOpen &&
        ringOpen &&
        pinkyOpen &&
        !sideways
    ) {

        return "5";
    }


    return "Tracking Sign...";
}


/* =========================================================
   MEDIAPIPE
   ========================================================= */

let hands = null;


if (typeof Hands !== "undefined") {

    hands = new Hands({

        locateFile: function(file) {

            return (
                "https://cdn.jsdelivr.net/npm/@mediapipe/hands/" +
                file
            );
        }
    });


    hands.setOptions({

        maxNumHands: 1,

        modelComplexity: 1,

        minDetectionConfidence: 0.7,

        minTrackingConfidence: 0.7
    });


    hands.onResults(
        handleResults
    );

} else {

    console.error(
        "MediaPipe Hands library was not loaded."
    );

    setCameraStatus(
        "AI ENGINE ERROR",
        false
    );
}


/* =========================================================
   MEDIAPIPE RESULTS
   ========================================================= */

function handleResults(results) {

    if (
        !canvasElement ||
        !canvasCtx ||
        !videoElement
    ) {

        return;
    }


    /* Canvas size */

    if (
        videoElement.videoWidth > 0 &&
        videoElement.videoHeight > 0
    ) {

        canvasElement.width =
            videoElement.videoWidth;

        canvasElement.height =
            videoElement.videoHeight;
    }


    /* Clear */

    canvasCtx.clearRect(
        0,
        0,
        canvasElement.width,
        canvasElement.height
    );


    /* =====================================================
       HAND FOUND
       ===================================================== */

    if (
        results.multiHandLandmarks &&
        results.multiHandLandmarks.length > 0
    ) {

        const hand =
            results.multiHandLandmarks[0];


        /* Draw connections */

        if (
            typeof drawConnectors !== "undefined"
        ) {

            drawConnectors(
                canvasCtx,
                hand,
                HAND_CONNECTIONS,
                {
                    color: "#7778ff",
                    lineWidth: 3
                }
            );
        }


        /* Draw landmarks */

        if (
            typeof drawLandmarks !== "undefined"
        ) {

            drawLandmarks(
                canvasCtx,
                hand,
                {
                    color: "#ffffff",
                    lineWidth: 1,
                    radius: 4
                }
            );
        }


        /* Detect gesture */

        const gesture =
            classifyGesture(hand);


        showGesture(gesture);


        /* Camera status */

        setCameraStatus(
            "CAMERA CONNECTED",
            true
        );


        /* UI confidence */

        setConfidence(82);

    } else {

        showGesture(
            "No hands detected"
        );

        setConfidence(0);

        setCameraStatus(
            "CAMERA CONNECTED",
            true
        );
    }
}


/* =========================================================
   CAMERA
   ========================================================= */

let camera = null;


if (
    typeof Camera !== "undefined" &&
    videoElement &&
    hands
) {

    camera = new Camera(
        videoElement,
        {

            onFrame: async function() {

                if (hands) {

                    await hands.send({
                        image: videoElement
                    });
                }
            },

            width: 640,

            height: 480
        }
    );

} else {

    console.error(
        "Camera or MediaPipe is unavailable."
    );
}


/* =========================================================
   START CAMERA
   ========================================================= */

if (camera) {

    try {

        camera.start();

        console.log(
            "SignToText camera started."
        );

        setCameraStatus(
            "CAMERA READY",
            true
        );

    } catch (error) {

        console.error(
            "Camera start failed:",
            error
        );

        setCameraStatus(
            "CAMERA ERROR",
            false
        );

        if (gestureOutput) {

            gestureOutput.textContent =
                "Camera access required";
        }
    }
}


/* =========================================================
   VIDEO READY
   ========================================================= */

if (videoElement) {

    videoElement.addEventListener(
        "loadeddata",
        function() {

            console.log(
                "Video stream ready."
            );

            setCameraStatus(
                "CAMERA READY",
                true
            );
        }
    );
}


/* =========================================================
   VIDEO ERROR
   ========================================================= */

if (videoElement) {

    videoElement.addEventListener(
        "error",
        function() {

            console.error(
                "Video stream error."
            );

            setCameraStatus(
                "CAMERA ERROR",
                false
            );

            if (gestureOutput) {

                gestureOutput.textContent =
                    "Camera error";
            }
        }
    );
}


/* =========================================================
   PAGE LOAD
   ========================================================= */

window.addEventListener(
    "load",
    function() {

        setConfidence(0);

        if (gestureOutput) {

            gestureOutput.textContent =
                "Waiting for hand sign...";
        }

        console.log(
            "SignToText AI loaded successfully."
        );
    }
);