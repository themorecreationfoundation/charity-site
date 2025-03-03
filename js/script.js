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
    
    if (!slider || slides.length === 0) return;

    let currentIndex = 0;
    const totalSlides = slides.length;

    // Auto-play variables (currently not in use as autoplay is disabled)
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

    // Auto-play functions (if needed, these can be enabled later)
    function startSlider() {
        sliderInterval = setInterval(showNextSlide, 4000);
        isPlaying = true;
    }

    function stopSlider() {
        clearInterval(sliderInterval);
        isPlaying = false;
    }

    function resetSliderInterval() {
        clearInterval(sliderInterval);
        if (isPlaying) {
            startSlider();
        }
    }

    // Event Listeners for navigation buttons
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

    // Adjust on window resize
    window.addEventListener('resize', () => {
        showSlide(currentIndex);
    });

    // Only show the initial slide; do not start the interval.
    showSlide(currentIndex);
    // Uncomment the following line if you wish to enable autoplay:
    // startSlider();
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
    
    // Open Learn More Modal (new code)
    const learnMoreButton = document.getElementById('learnMoreButton');
    const learnMoreModal = document.getElementById('learnMoreModal');
    if (learnMoreButton && learnMoreModal) {
        learnMoreButton.addEventListener('click', (e) => {
            e.preventDefault();
            learnMoreModal.style.display = 'block';
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
        if (e.target === learnMoreModal) {
            learnMoreModal.style.display = 'none';
        }
    });
}
