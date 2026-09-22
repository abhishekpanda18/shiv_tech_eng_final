/* =========================================
   HERO SCROLL VIDEO
========================================= */

const video = document.getElementById("heroVideo");
const heroSection = document.querySelector(".hero-scroll");

let target = 0;
let current = 0;
let animationFrame = null;


/* Get scroll position */

function updateTarget() {

    if (!heroSection) {
        return;
    }

    const rect =
        heroSection.getBoundingClientRect();

    const max =
        heroSection.offsetHeight -
        window.innerHeight;

    if (max <= 0) {
        return;
    }

    target =
        Math.max(
            0,
            Math.min(
                1,
                -rect.top / max
            )
        );

    if (!animationFrame) {
        animationFrame =
            requestAnimationFrame(
                renderVideo
            );
    }
}


/* Smoothly move video */

function renderVideo() {

    animationFrame = null;

    current +=
        (target - current) * 0.12;

    if (
        video &&
        video.readyState >= 2 &&
        Number.isFinite(video.duration)
    ) {

        const duration =
            Math.max(
                0,
                video.duration - 0.03
            );

        video.currentTime =
            current * duration;
    }

    if (
        Math.abs(
            target - current
        ) > 0.0005
    ) {

        animationFrame =
            requestAnimationFrame(
                renderVideo
            );
    }
}


/* Events */

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


if (video) {

    video.addEventListener(
        "loadedmetadata",
        updateTarget
    );

    video.addEventListener(
        "canplay",
        updateTarget
    );
}


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


    {
        number: "11",

        name: "Pin Plunger",

        description:
            "Compact spring-loaded positioning.",

        mainImage:
            "products/pin plunger/WhatsApp Image 2026-09-17 at 19.01.32.jpeg",

        images: [
            "products/pin plunger/WhatsApp Image 2026-09-17 at 19.01.32.jpeg",
            "products/pin plunger/WhatsApp Image 2026-09-17 at 19.01.32_1.jpeg"
        ]
    },


    {
        number: "12",

        name: "Shoulder Bolt / Stripper Bolt",

        description:
            "Precision mechanical fastening.",

        mainImage:
            "products/shoulder bolt_ stripper bolt/WhatsApp Image 2026-09-17 at 19.01.33.jpeg",

        images: [
            "products/shoulder bolt_ stripper bolt/WhatsApp Image 2026-09-17 at 19.01.33.jpeg",
            "products/shoulder bolt_ stripper bolt/WhatsApp Image 2026-09-17 at 19.01.33_1.jpeg"
        ]
    },


    {
        number: "13",

        name: "Quick Ball Lock Pin",

        description:
            "Rapid-release industrial fastening.",

        mainImage:
            "products/quick ball lock pin/WhatsApp Image 2026-09-17 at 19.01.34.jpeg",

        images: [
            "products/quick ball lock pin/WhatsApp Image 2026-09-17 at 19.01.34.jpeg",
            "products/quick ball lock pin/WhatsApp Image 2026-09-17 at 19.01.34_1.jpeg"
        ]
    }

];


/* =========================================
   PRODUCT GRID
========================================= */

const productList =
    document.getElementById(
        "productList"
    );


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
    document.getElementById(
        "productModal"
    );

const modalBackdrop =
    document.getElementById(
        "modalBackdrop"
    );

const modalClose =
    document.getElementById(
        "modalClose"
    );

const modalTitle =
    document.getElementById(
        "modalTitle"
    );

const modalNumber =
    document.getElementById(
        "modalNumber"
    );

const modalPages =
    document.getElementById(
        "modalPages"
    );


/* Open modal */

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
                            ${index === 0
                                ? "PRODUCT"
                                : `VIEW ${String(index + 1).padStart(2, "0")}`
                            }
                        </div>

                    </div>
                `;

            }
        ).join("");


    productModal.classList.add(
        "active"
    );

    productModal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow =
        "hidden";
}


/* Close modal */

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


/* Product click */

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

            const number =
                card.dataset.product;

            const product =
                products.find(
                    item =>
                        item.number === number
                );

            if (product) {
                openProduct(product);
            }

        }
    );


    /* Keyboard accessibility */

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

            const number =
                card.dataset.product;

            const product =
                products.find(
                    item =>
                        item.number === number
                );

            if (product) {
                openProduct(product);
            }

        }
    );

}


/* Modal controls */

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


/* Escape key */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            productModal &&
            productModal.classList.contains("active")
        ) {

            closeProduct();

        }

    }
);  