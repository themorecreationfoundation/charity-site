// JavaScript code for the image slider
document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const pausePlayBtn = document.getElementById('pause-play-btn');
    let currentIndex = 0;
    const totalSlides = slides.length;
    let isPlaying = true;
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
        sliderInterval = setInterval(showNextSlide, 4000); // Change slide every 4 seconds
        pausePlayBtn.innerHTML = '&#10074;&#10074;'; // Pause symbol matching arrow style
        pausePlayBtn.setAttribute('aria-label', 'Pause Slider');
        isPlaying = true;
    }

    function stopSlider() {
        clearInterval(sliderInterval);
        pausePlayBtn.innerHTML = '&#9658;'; // Play symbol matching arrow style
        pausePlayBtn.setAttribute('aria-label', 'Play Slider');
        isPlaying = false;
    }

    function resetSliderInterval() {
        clearInterval(sliderInterval);
        if (isPlaying) {
            startSlider();
        }
    }

    // Event Listeners for Control Buttons
    nextBtn.addEventListener('click', () => {
        showNextSlide();
        resetSliderInterval();
    });

    prevBtn.addEventListener('click', () => {
        showPrevSlide();
        resetSliderInterval();
    });

    pausePlayBtn.addEventListener('click', () => {
        if (isPlaying) {
            stopSlider();
        } else {
            startSlider();
        }
    });

    // Adjust slider on window resize
    window.addEventListener('resize', () => {
        showSlide(currentIndex);
    });

    // Initialize Slider
    showSlide(currentIndex);
    startSlider();
});

document.addEventListener('DOMContentLoaded', () => {
    const termsLink = document.getElementById('termsLink');
    const privacyLink = document.getElementById('privacyLink');
    const termsModal = document.getElementById('termsModal');
    const privacyModal = document.getElementById('privacyModal');

    // Open Terms Modal
    termsLink.addEventListener('click', (e) => {
        e.preventDefault();
        termsModal.style.display = 'block';
    });

    // Open Privacy Modal
    privacyLink.addEventListener('click', (e) => {
        e.preventDefault();
        privacyModal.style.display = 'block';
    });

    // Close the modals when the close button (x) is clicked
    document.querySelectorAll('.close-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            const modalId = btn.getAttribute('data-close');
            document.getElementById(modalId).style.display = 'none';
        });
    });

    // Close the modals when clicking anywhere outside the modal content
    window.addEventListener('click', (e) => {
        if (e.target === termsModal) {
            termsModal.style.display = 'none';
        }
        if (e.target === privacyModal) {
            privacyModal.style.display = 'none';
        }
    });
});

