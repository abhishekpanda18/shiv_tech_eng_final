/* =========================================
   RESPONSIVE HERO SCROLL VIDEO
   SMOOTH MOBILE SEEK ENGINE
========================================= */

const desktopVideo =
    document.getElementById("heroVideo");

const mobileVideo =
    document.getElementById("heroMobileVideo");

const heroSection =
    document.querySelector(".hero-scroll");


/* -----------------------------------------
   DEVICE DETECTION
----------------------------------------- */

const mobileQuery =
    window.matchMedia("(max-width: 700px)");

function isMobile() {
    return mobileQuery.matches;
}


/* -----------------------------------------
   ACTIVE VIDEO
----------------------------------------- */

function getActiveVideo() {

    return isMobile()
        ? mobileVideo
        : desktopVideo;
}


/* -----------------------------------------
   SCROLL STATE
----------------------------------------- */

let target = 0;
let current = 0;

let animationFrame = null;


/* -----------------------------------------
   DESKTOP VIDEO STATE
----------------------------------------- */

let desktopLastTime = -1;


/* -----------------------------------------
   MOBILE VIDEO STATE

   Prevents multiple video seeks from
   stacking up on mobile.
----------------------------------------- */

let mobileTargetTime = 0;
let mobileDisplayedTime = -1;

let mobileIsSeeking = false;
let mobileSeekQueued = false;

let mobileLastSeekTime = 0;


/*
   Minimum time between mobile seeks.

   This prevents the browser from being
   flooded with currentTime requests.
*/
const MOBILE_SEEK_INTERVAL = 45;


/*
   Ignore extremely tiny time changes.
*/
const MOBILE_SEEK_THRESHOLD = 0.035;


/* -----------------------------------------
   HERO SCROLL POSITION
----------------------------------------- */

function updateTarget() {

    if (!heroSection) {
        return;
    }

    const rect =
        heroSection.getBoundingClientRect();

    const scrollDistance =
        heroSection.offsetHeight -
        window.innerHeight;

    if (scrollDistance <= 0) {
        return;
    }

    target = Math.max(
        0,
        Math.min(
            1,
            -rect.top / scrollDistance
        )
    );

    if (!animationFrame) {

        animationFrame =
            requestAnimationFrame(
                renderHero
            );
    }
}


/* -----------------------------------------
   MOBILE SEEK
----------------------------------------- */

function requestMobileSeek(video, time) {

    if (!video) {
        return;
    }

    if (
        video.readyState < 2 ||
        !Number.isFinite(video.duration)
    ) {
        return;
    }


    const duration =
        Math.max(
            0,
            video.duration - 0.03
        );


    mobileTargetTime =
        Math.max(
            0,
            Math.min(
                duration,
                time
            )
        );


    /*
       If a seek is already happening,
       don't start another one.

       Just remember that a newer target
       exists.
    */

    if (mobileIsSeeking) {

        mobileSeekQueued = true;

        return;
    }


    const now =
        performance.now();


    /*
       Prevent extremely frequent seeks.
    */

    if (
        now - mobileLastSeekTime <
        MOBILE_SEEK_INTERVAL
    ) {

        mobileSeekQueued = true;

        return;
    }


    const difference =
        Math.abs(
            mobileTargetTime -
            mobileDisplayedTime
        );


    if (
        difference <
        MOBILE_SEEK_THRESHOLD
    ) {

        return;
    }


    mobileIsSeeking = true;
    mobileSeekQueued = false;

    mobileLastSeekTime = now;


    /*
       fastSeek() allows the browser to
       seek using a nearby keyframe when
       supported.

       For smaller movements we use
       currentTime for better accuracy.
    */

    if (
        typeof video.fastSeek === "function" &&
        Math.abs(
            mobileTargetTime -
            video.currentTime
        ) > 0.08
    ) {

        video.fastSeek(
            mobileTargetTime
        );

    } else {

        video.currentTime =
            mobileTargetTime;
    }
}


/* -----------------------------------------
   MOBILE SEEK COMPLETE
----------------------------------------- */

function handleMobileSeeked() {

    if (!mobileVideo) {
        return;
    }


    mobileIsSeeking = false;


    mobileDisplayedTime =
        mobileVideo.currentTime;


    /*
       If the user scrolled while the
       previous seek was happening,
       process the newest target.
    */

    if (mobileSeekQueued) {

        mobileSeekQueued = false;

        requestMobileSeek(
            mobileVideo,
            mobileTargetTime
        );
    }
}


/* -----------------------------------------
   HERO VIDEO RENDER
----------------------------------------- */

function renderHero() {

    animationFrame = null;


    const mobile =
        isMobile();

    const video =
        getActiveVideo();


    if (!video) {
        return;
    }


    /* -------------------------------------
       SMOOTH SCROLL INTERPOLATION
    ------------------------------------- */

    current +=
        (target - current) *
        (
            mobile
                ? 0.16
                : 0.12
        );


    /* -------------------------------------
       VIDEO
    ------------------------------------- */

    if (
        video.readyState >= 2 &&
        Number.isFinite(video.duration)
    ) {

        const duration =
            Math.max(
                0,
                video.duration - 0.03
            );


        const desiredTime =
            current * duration;


        /* ---------------------------------
           MOBILE VIDEO
        --------------------------------- */

        if (mobile) {

            requestMobileSeek(
                video,
                desiredTime
            );
        }


        /* ---------------------------------
           DESKTOP VIDEO

           Desktop behaviour remains
           essentially unchanged.
        --------------------------------- */

        else {

            const difference =
                Math.abs(
                    desiredTime -
                    desktopLastTime
                );


            if (
                difference >
                0.003
            ) {

                video.currentTime =
                    desiredTime;

                desktopLastTime =
                    desiredTime;
            }
        }
    }


    /* -------------------------------------
       KEEP ANIMATING
    ------------------------------------- */

    if (
        Math.abs(
            target - current
        ) > 0.0005
    ) {

        animationFrame =
            requestAnimationFrame(
                renderHero
            );
    }
}


/* -----------------------------------------
   PREPARE VIDEO
----------------------------------------- */

function prepareVideo(video) {

    if (!video) {
        return;
    }

    video.preload = "auto";

    video.muted = true;

    video.playsInline = true;


    video.addEventListener(
        "loadedmetadata",
        updateTarget
    );


    video.addEventListener(
        "loadeddata",
        updateTarget
    );
}


prepareVideo(desktopVideo);

prepareVideo(mobileVideo);


/* -----------------------------------------
   MOBILE SEEK EVENT
----------------------------------------- */

if (mobileVideo) {

    mobileVideo.addEventListener(
        "seeked",
        handleMobileSeeked
    );
}


/* -----------------------------------------
   DEVICE CHANGE
----------------------------------------- */

function handleDeviceChange() {

    const activeVideo =
        getActiveVideo();

    if (!activeVideo) {
        return;
    }


    current = target;


    desktopLastTime = -1;


    mobileTargetTime = 0;

    mobileDisplayedTime = -1;

    mobileIsSeeking = false;

    mobileSeekQueued = false;

    mobileLastSeekTime = 0;


    if (
        activeVideo.readyState >= 2 &&
        Number.isFinite(
            activeVideo.duration
        )
    ) {

        const duration =
            Math.max(
                0,
                activeVideo.duration - 0.03
            );


        const time =
            target * duration;


        activeVideo.currentTime =
            time;


        if (isMobile()) {

            mobileTargetTime =
                time;

            mobileDisplayedTime =
                time;
        }
    }


    updateTarget();
}


if (
    mobileQuery.addEventListener
) {

    mobileQuery.addEventListener(
        "change",
        handleDeviceChange
    );
}


/* -----------------------------------------
   EVENTS
----------------------------------------- */

window.addEventListener(
    "scroll",
    updateTarget,
    {
        passive: true
    }
);


window.addEventListener(
    "resize",
    updateTarget
);


/* -----------------------------------------
   START
----------------------------------------- */

updateTarget();


/* =========================================
   PRODUCT DATA
========================================= */

const products = [

    {
        number: "01",
        name: "Adjustable Handle",
        description:
            "Machine and fixture control components.",

        mainImage:
            "products/adjustable handle/main.jpeg",

        images: [
            "products/adjustable handle/main.jpeg",
            "products/adjustable handle/ah_1.jpeg",
            "products/adjustable handle/ah_2.jpeg"
        ]
    },


    {
        number: "02",
        name: "Ball Plunger",
        description:
            "Precision positioning and indexing.",

        mainImage:
            "products/ball plunger/main.jpeg",

        images: [
            "products/ball plunger/main.jpeg",
            "products/ball plunger/bp_1.jpeg"
        ]
    },


    {
        number: "03",
        name: "Ball Lock Pin",
        description:
            "Fast, secure removable connections.",

        mainImage:
            "products/ball lock pin/main.jpeg",

        images: [
            "products/ball lock pin/main.jpeg",
            "products/ball lock pin/blp_1.jpeg"
        ]
    },


    {
        number: "04",
        name: "Die Spring",
        description:
            "High-cycle spring applications.",

        mainImage:
            "products/Die spring/dai spring main.jpeg",

        images: [
            "products/Die spring/dai spring main.jpeg",
            "products/Die spring/ds_1.jpeg"
        ]
    },


    {
        number: "05",
        name: "Dowel Pin",
        description:
            "Accurate alignment and locating.",

        mainImage:
            "products/Dowel pin/WhatsApp Image 2026-09-17 at 19.01.27.jpeg",

        images: [
            "products/Dowel pin/WhatsApp Image 2026-09-17 at 19.01.27.jpeg",
            "products/Dowel pin/WhatsApp Image 2026-09-17 at 19.01.28.jpeg"
        ]
    },


    {
        number: "06",
        name: "Grub Screw",
        description:
            "Compact fastening solutions.",

        mainImage:
            "products/grub screw/WhatsApp Image 2026-09-17 at 19.01.28.jpeg",

        images: [
            "products/grub screw/WhatsApp Image 2026-09-17 at 19.01.28.jpeg",
            "products/grub screw/WhatsApp Image 2026-09-17 at 19.01.282.jpeg"
        ]
    },


    {
        number: "07",
        name: "Hand Wheel",
        description:
            "Manual machine adjustment.",

        mainImage:
            "products/hand wheel/WhatsApp Image 2026-09-17 at 19.01.29.jpeg",

        images: [
            "products/hand wheel/WhatsApp Image 2026-09-17 at 19.01.29.jpeg",
            "products/hand wheel/WhatsApp Image 2026-09-17 at 19.03331.29.jpeg"
        ]
    },


    {
        number: "08",
        name: "Indexing Plunger",
        description:
            "Reliable locking and indexing.",

        mainImage:
            "products/indexing plunger/WhatsApp Image 2026-09-17 at 19.01.30.jpeg",

        images: [
            "products/indexing plunger/WhatsApp Image 2026-09-17 at 19.01.30.jpeg",
            "products/indexing plunger/WhatsApp Image 2026-09-ww417 at 19.01.30.jpeg"
        ]
    },


    {
        number: "09",
        name: "Leg Level",
        description:
            "Stable and adjustable machine support.",

        mainImage:
            "products/leg level/WhatsApp Image 2026-09-17 at 19.01.30.jpeg",

        images: [
            "products/leg level/WhatsApp Image 2026-09-17 at 19.01.30.jpeg",
            "products/leg level/WhatsApp Image 2026-09-17 at 19.01.31.jpeg"
        ]
    },


    {
        number: "10",
        name: "Mold Parting Lock",
        description:
            "Secure mold alignment and locking.",

        mainImage:
            "products/mold parting lock/WhatsApp Image 2026-09-17 at 19.01.31.jpeg",

        images: [
            "products/mold parting lock/WhatsApp Image 2026-09-17 at 19.01.31.jpeg",
            "products/mold parting lock/WhatsApp Image 2026-09-17 at 19.01.32.jpeg"
        ]
    },


    /* =====================================
       PRODUCT 11
    ===================================== */

    {
        number: "11",
        name: "Pin Plunger",
        description:
            "Compact spring-loaded positioning.",

        mainImage:
            "products/pin plunger/WhatsApp Image 2026-09-17 at 19.01.32.jpeg",

        images: [
            "products/pin plunger/WhatsApp Image 2026-09-17 at 19.01.32.jpeg",

            "products/pin plunger/WhatsApp Imannnge 2026-09-17 at 19.01.32.jpeg"
        ]
    },


    /* =====================================
       PRODUCT 12
    ===================================== */

    {
        number: "12",
        name: "Shoulder Bolt / Stripper Bolt",
        description:
            "Precision mechanical fastening.",

        mainImage:
            "products/shoulder bolt_ stripper bolt/WhatsApp Image 2026-09-17 at 19.01.33.jpeg",

        images: [
            "products/shoulder bolt_ stripper bolt/WhatsApp Image 2026-09-17 at 19.01.33.jpeg",

            "products/shoulder bolt_ stripper bolt/WhatsApp Imn kjage 2026-09-17 at 19.01.33.jpeg"
        ]
    },


    /* =====================================
       PRODUCT 13
    ===================================== */

    {
        number: "13",
        name: "Quick Ball Lock Pin",
        description:
            "Rapid-release industrial fastening.",

        mainImage:
            "products/quick ball lock pin/WhatsApp Image 2026-09-17 at 19.01.34.jpeg",

        images: [
            "products/quick ball lock pin/WhatsApp Image 2026-09-17 at 19.01.34.jpeg",

            "products/quick ball lock pin/WhatsApp Imagebn kj 2026-09-17 at 19.01.34.jpeg"
        ]
    }

];


/* =========================================
   PRODUCT GRID
========================================= */

const productList =
    document.getElementById("productList");


function renderProducts() {

    if (!productList) {
        return;
    }


    productList.innerHTML =
        products.map(product => {

            return `
                <article
                    class="product-card"
                    data-product="${product.number}"
                    tabindex="0"
                    role="button"
                    aria-label="View ${product.name}"
                >

                    <div class="product-image">

                        <img
                            src="${product.mainImage}"
                            alt="${product.name}"
                            loading="lazy"
                        >

                    </div>

                    <div class="product-info">

                        <span class="product-number">
                            ${product.number}
                        </span>

                        <h3 class="product-name">
                            ${product.name}
                        </h3>

                        <p class="product-description">
                            ${product.description}
                        </p>

                    </div>

                </article>
            `;

        }).join("");
}


renderProducts();


/* =========================================
   PRODUCT MODAL
========================================= */

const productModal =
    document.getElementById("productModal");

const modalBackdrop =
    document.getElementById("modalBackdrop");

const modalClose =
    document.getElementById("modalClose");

const modalTitle =
    document.getElementById("modalTitle");

const modalNumber =
    document.getElementById("modalNumber");

const modalPages =
    document.getElementById("modalPages");


function openProduct(product) {

    if (!productModal) {
        return;
    }


    modalTitle.textContent =
        product.name;

    modalNumber.textContent =
        product.number;


    modalPages.innerHTML =
        product.images.map(
            (image, index) => {

                return `
                    <div class="modal-page">

                        <img
                            src="${image}"
                            alt="${product.name} image ${index + 1}"
                        >

                        <div class="modal-page-label">
                            ${
                                index === 0
                                    ? "PRODUCT"
                                    : `VIEW ${String(index + 1).padStart(2, "0")}`
                            }
                        </div>

                    </div>
                `;

            }
        ).join("");


    productModal.classList.add("active");

    productModal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow =
        "hidden";
}


function closeProduct() {

    if (!productModal) {
        return;
    }


    productModal.classList.remove(
        "active"
    );

    productModal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow =
        "";
}


/* =========================================
   PRODUCT CLICK
========================================= */

if (productList) {

    productList.addEventListener(
        "click",
        event => {

            const card =
                event.target.closest(
                    ".product-card"
                );


            if (!card) {
                return;
            }


            const product =
                products.find(
                    item =>
                        item.number ===
                        card.dataset.product
                );


            if (product) {
                openProduct(product);
            }

        }
    );


    productList.addEventListener(
        "keydown",
        event => {

            if (
                event.key !== "Enter" &&
                event.key !== " "
            ) {
                return;
            }


            const card =
                event.target.closest(
                    ".product-card"
                );


            if (!card) {
                return;
            }


            event.preventDefault();


            const product =
                products.find(
                    item =>
                        item.number ===
                        card.dataset.product
                );


            if (product) {
                openProduct(product);
            }

        }
    );
}


/* =========================================
   MODAL CONTROLS
========================================= */

if (modalClose) {

    modalClose.addEventListener(
        "click",
        closeProduct
    );
}


if (modalBackdrop) {

    modalBackdrop.addEventListener(
        "click",
        closeProduct
    );
}


/* =========================================
   ESCAPE KEY
========================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            productModal &&
            productModal.classList.contains(
                "active"
            )
        ) {

            closeProduct();
        }

    }
);