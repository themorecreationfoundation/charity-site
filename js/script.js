document.addEventListener('DOMContentLoaded', () => {
    initSlider('.main-slider');
    initSlider('.author-slider');
    initModals(); // Function to handle modal logic
});

function initSlider(selector) {
    const container = document.querySelector(selector);
    if (!container) return; // If the container isn't found, exit.

    const slider = container.querySelector('.slider');
    const slides = container.querySelectorAll('.slide');
    const prevBtn = container.querySelector('.prev-btn');
    const nextBtn = container.querySelector('.next-btn');
    const pausePlayBtn = container.querySelector('.pause-play-btn');
    
    if (!slider || slides.length === 0) return;

    let currentIndex = 0;
    const totalSlides = slides.length;

    // ▼ Changed to 'false' so it doesn't autoplay.
    let isPlaying = false;
    let sliderInterval;

    function showSlide(index) {
        slider.style.transform = `translateX(-${index * 100}%)`;
    }

    function showNextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        showSlide(currentIndex);
    }

    function showPrevSlide() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        showSlide(currentIndex);
    }

    function startSlider() {
        sliderInterval = setInterval(showNextSlide, 4000);
        if (pausePlayBtn) {
            pausePlayBtn.innerHTML = '&#10074;&#10074;'; // pause icon
            pausePlayBtn.setAttribute('aria-label', 'Pause Slider');
        }
        isPlaying = true;
    }

    function stopSlider() {
        clearInterval(sliderInterval);
        if (pausePlayBtn) {
            pausePlayBtn.innerHTML = '&#9658;'; // play icon
            pausePlayBtn.setAttribute('aria-label', 'Play Slider');
        }
        isPlaying = false;
    }

    function resetSliderInterval() {
        clearInterval(sliderInterval);
        if (isPlaying) {
            startSlider();
        }
    }

    // Event Listeners if buttons exist
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            showNextSlide();
            resetSliderInterval();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            showPrevSlide();
            resetSliderInterval();
        });
    }

    if (pausePlayBtn) {
        pausePlayBtn.addEventListener('click', () => {
            if (isPlaying) {
                stopSlider();
            } else {
                startSlider();
            }
        });
    }

    // Adjust on window resize
    window.addEventListener('resize', () => {
        showSlide(currentIndex);
    });

    // ▼ Only show the initial slide; do not start the interval.
    showSlide(currentIndex);
    // startSlider(); // Removed/Commented out to stop automatic slide.
}

function initModals() {
    const termsLink = document.getElementById('termsLink');
    const privacyLink = document.getElementById('privacyLink');
    const termsModal = document.getElementById('termsModal');
    const privacyModal = document.getElementById('privacyModal');
    const closeButtons = document.querySelectorAll('.close-btn');

    // Open Terms Modal
    if (termsLink && termsModal) {
        termsLink.addEventListener('click', (e) => {
            e.preventDefault();
            termsModal.style.display = 'block';
        });
    }

    // Open Privacy Modal
    if (privacyLink && privacyModal) {
        privacyLink.addEventListener('click', (e) => {
            e.preventDefault();
            privacyModal.style.display = 'block';
        });
    }

    // Close modals on close button
    closeButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const modalId = btn.getAttribute('data-close');
            document.getElementById(modalId).style.display = 'none';
        });
    });

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === termsModal) {
            termsModal.style.display = 'none';
        }
        if (e.target === privacyModal) {
            privacyModal.style.display = 'none';
        }
    });
}
