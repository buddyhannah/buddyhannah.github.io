let currentSlide = 0;
const slides = document.querySelectorAll(".slide");

function showSlide(index) {
    // Hide all slides
    slides.forEach(slide => {
        slide.style.display = "none";
    });

    // Wrap around if index is out of bounds
    if (index >= slides.length) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = slides.length - 1;
    } else {
        currentSlide = index;
    }

    // Show the selected slide
    slides[currentSlide].style.display = "block";
}

function changeSlide(step) {
    showSlide(currentSlide + step);
}

document.addEventListener("DOMContentLoaded", function () {
    let images = document.querySelectorAll(".fade-container .fade-img");
    let currentIndex = 0;

    function fadeImages() {
        images[currentIndex].style.opacity = "0"; // Hide current image
        currentIndex = (currentIndex + 1) % images.length; // Move to next image
        images[currentIndex].style.opacity = "1"; // Show next image
    }

    setInterval(fadeImages, 3000); // Change every 3 seconds
});


// Initialize slideshow
showSlide(currentSlide);



document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.getElementById("theme-toggle");
    const body = document.body;

    // Check sessionStorage for theme preference
    if (sessionStorage.getItem("darkMode") === "enabled") {
        body.classList.add("dark");
    }

    toggleButton.onclick = function () {
        body.classList.toggle("dark");

        // Store preference in sessionStorage
        if (body.classList.contains("dark")) {
            sessionStorage.setItem("darkMode", "enabled");
        } else {
            sessionStorage.setItem("darkMode", "disabled");
        }
    };
});