document.addEventListener('DOMContentLoaded', () => {
    initSliders('.image-slider');
    initModals();
    initSliderLightbox();
});

function initSliders(selector) {
    const sections = document.querySelectorAll(selector);
    sections.forEach((section) => setupSlider(section));
}

function setupSlider(section) {
    if (!section || section.dataset.sliderInitialized === 'true') return;

    const slider = section.querySelector('.slider');
       const slides = section.querySelectorAll('.slide');
    const prevBtn = section.querySelector('.prev-btn');
    const nextBtn = section.querySelector('.next-btn');
    const pausePlayBtn = section.querySelector('.pause-play-btn');

    if (!slider || slides.length === 0) return;

    let currentIndex = 0;
    const totalSlides = slides.length;
    const autoPlayEnabled = totalSlides > 1;

    let isPlaying = false;
    let sliderInterval;

    const showSlide = (index) => {
        slider.style.transform = `translateX(-${index * 100}%)`;
    };

    const showNextSlide = () => {
        currentIndex = (currentIndex + 1) % totalSlides;
        showSlide(currentIndex);
    };

    const showPrevSlide = () => {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        showSlide(currentIndex);
    };

    const updatePausePlayButton = () => {
        if (!pausePlayBtn) return;
        const icon = isPlaying ? '&#10074;&#10074;' : '&#9658;';
        const label = isPlaying ? 'Pause slider' : 'Play slider';
        pausePlayBtn.innerHTML = icon;
        pausePlayBtn.setAttribute('aria-label', label);
        pausePlayBtn.setAttribute('aria-pressed', String(isPlaying));
    };

    const startSlider = () => {
        if (!autoPlayEnabled) return;
        clearInterval(sliderInterval);
        sliderInterval = setInterval(showNextSlide, 4000);
        isPlaying = true;
        updatePausePlayButton();
    };

    const stopSlider = () => {
        clearInterval(sliderInterval);
        sliderInterval = null;
        isPlaying = false;
        updatePausePlayButton();
    };

    const resetSliderInterval = () => {
        if (!isPlaying) return;
        startSlider();
    };

    const handleNext = (event) => {
        event.stopPropagation();
        showNextSlide();
        resetSliderInterval();
    };

    const handlePrev = (event) => {
        event.stopPropagation();
        showPrevSlide();
        resetSliderInterval();
    };

    const handlePausePlay = (event) => {
        event.stopPropagation();
        if (isPlaying) {
            stopSlider();
        } else {
            startSlider();
        }
    };

    if (nextBtn) {
        nextBtn.addEventListener('click', handleNext);
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', handlePrev);
    }

    if (pausePlayBtn) {
        pausePlayBtn.addEventListener('click', handlePausePlay);
        if (!autoPlayEnabled) {
            pausePlayBtn.hidden = true;
            updatePausePlayButton();
        }
    }

    const handleResize = () => {
        showSlide(currentIndex);
    };

    window.addEventListener('resize', handleResize);

    showSlide(currentIndex);
    if (autoPlayEnabled) {
        startSlider();
    } else {
        updatePausePlayButton();
    }

    section.dataset.sliderInitialized = 'true';
    section._destroySlider = () => {
        stopSlider();
        window.removeEventListener('resize', handleResize);
        if (nextBtn) nextBtn.removeEventListener('click', handleNext);
        if (prevBtn) prevBtn.removeEventListener('click', handlePrev);
        if (pausePlayBtn) pausePlayBtn.removeEventListener('click', handlePausePlay);
    };
}

function initSliderLightbox() {
    const lightbox = document.getElementById('sliderLightbox');
    const lightboxBody = document.getElementById('sliderLightboxBody');
    const triggerSection = document.querySelector('.content-card__media--slider .image-slider');

    if (!lightbox || !lightboxBody || !triggerSection) return;

    const sliderContainer = triggerSection.querySelector('.slider-container');
    const expandButton = triggerSection.querySelector('[data-slider-expand]');
    const closeButton = lightbox.querySelector('[data-lightbox-close]');
    const resetButton = lightbox.querySelector('[data-lightbox-reset]');

    const cleanupCallbacks = [];

    const addCleanup = (callback) => {
        if (typeof callback === 'function') {
            cleanupCallbacks.push(callback);
        }
    };

    const runCleanup = () => {
        while (cleanupCallbacks.length) {
            const callback = cleanupCallbacks.pop();
            try {
                callback();
            } catch (error) {
                console.error('Error cleaning up slider lightbox:', error);
            }
        }
    };

    const teardownLightboxContent = () => {
        const activeSlider = lightboxBody.querySelector('.image-slider');
        if (activeSlider && typeof activeSlider._destroySlider === 'function') {
            activeSlider._destroySlider();
        }
        runCleanup();
        lightboxBody.innerHTML = '';
    };

    const openLightbox = () => {
        if (lightbox.classList.contains('is-visible')) return;

        const sliderClone = triggerSection.cloneNode(true);
        sliderClone.classList.add('image-slider--lightbox');
        sliderClone.removeAttribute('data-slider-initialized');
        sliderClone._destroySlider = undefined;
        sliderClone.querySelectorAll('[data-slider-initialized]').forEach((el) => el.removeAttribute('data-slider-initialized'));
        sliderClone.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'));
        sliderClone.querySelectorAll('[data-slider-expandable]').forEach((el) => el.removeAttribute('data-slider-expandable'));
        sliderClone.querySelectorAll('.slider-expand-btn').forEach((btn) => btn.remove());

        const sliderViewport = document.createElement('div');
        sliderViewport.className = 'slider-viewport';
        const sliderZoomContent = document.createElement('div');
        sliderZoomContent.className = 'slider-zoom-content';
        sliderZoomContent.appendChild(sliderClone);
        sliderViewport.appendChild(sliderZoomContent);

        teardownLightboxContent();
        lightboxBody.appendChild(sliderViewport);
        setupSlider(sliderClone);

        const zoomController = createSliderZoomController(sliderViewport, sliderZoomContent);
        addCleanup(() => zoomController.destroy());

        if (resetButton) {
            const handleReset = (event) => {
                event.stopPropagation();
                zoomController.reset();
            };
            resetButton.addEventListener('click', handleReset);
            addCleanup(() => resetButton.removeEventListener('click', handleReset));
        }

        lightbox.classList.add('is-visible');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.classList.add('no-scroll');

        if (closeButton) {
            closeButton.focus({ preventScroll: true });
        }
    };

    const closeLightbox = () => {
        teardownLightboxContent();

        lightbox.classList.remove('is-visible');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('no-scroll');

        if (expandButton) {
            expandButton.focus({ preventScroll: true });
        }
    };

    if (sliderContainer) {
        sliderContainer.addEventListener('click', (event) => {
            const isControl = event.target.closest('.control-btn') || event.target.closest('.slider-expand-btn');
            if (isControl) return;
            openLightbox();
        });
    }

    if (expandButton) {
        expandButton.addEventListener('click', (event) => {
            event.stopPropagation();
            openLightbox();
        });
    }

    if (closeButton) {
        closeButton.addEventListener('click', (event) => {
            event.stopPropagation();
            closeLightbox();
        });
    }

    lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && lightbox.classList.contains('is-visible')) {
            closeLightbox();
        }
    });
}

function createSliderZoomController(viewport, zoomContent) {
    let scale = 1;
    let translateX = 0;
    let translateY = 0;
    const minScale = 1;
    const maxScale = 3;
    const activePointers = new Map();
    let pinchData = null;
    let isPanning = false;
    let lastPanPosition = { x: 0, y: 0 };
    let lastTapTime = 0;

    const applyTransform = () => {
        zoomContent.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    };

    const clampScale = (value) => Math.min(maxScale, Math.max(minScale, value));

    const clampTranslation = () => {
        const viewportWidth = viewport.clientWidth;
        const viewportHeight = viewport.clientHeight;
        const contentWidth = zoomContent.offsetWidth * scale;
        const contentHeight = zoomContent.offsetHeight * scale;

        if (scale <= 1.01) {
            translateX = 0;
            translateY = 0;
            return;
        }

        const minX = Math.min(0, viewportWidth - contentWidth);
        const minY = Math.min(0, viewportHeight - contentHeight);
        const maxX = 0;
        const maxY = 0;

        translateX = Math.min(maxX, Math.max(minX, translateX));
        translateY = Math.min(maxY, Math.max(minY, translateY));
    };

    const updateTransform = () => {
        clampTranslation();
        applyTransform();
    };

    const getDistance = (pointA, pointB) => {
        const dx = pointA.x - pointB.x;
        const dy = pointA.y - pointB.y;
        return Math.hypot(dx, dy);
    };

    const zoomAtPoint = (targetScale, clientX, clientY) => {
        const newScale = clampScale(targetScale);
        const rect = viewport.getBoundingClientRect();
        const focusX = clientX - rect.left;
        const focusY = clientY - rect.top;
        const previousScale = scale;

        scale = newScale;
        translateX -= focusX * (scale - previousScale);
        translateY -= focusY * (scale - previousScale);
        updateTransform();
    };

    const reset = () => {
        scale = 1;
        translateX = 0;
        translateY = 0;
        pinchData = null;
        applyTransform();
    };

    const isInteractiveTarget = (target) => Boolean(
        target.closest('.control-btn') ||
        target.closest('[data-lightbox-close]') ||
        target.closest('[data-lightbox-reset]')
    );

    const handlePointerDown = (event) => {
        if (isInteractiveTarget(event.target)) return;

        viewport.setPointerCapture(event.pointerId);
        activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

        if (activePointers.size === 2) {
            const points = Array.from(activePointers.values());
            const rect = viewport.getBoundingClientRect();
            pinchData = {
                initialDistance: getDistance(points[0], points[1]),
                initialScale: scale,
                centerX: (points[0].x + points[1].x) / 2 - rect.left,
                centerY: (points[0].y + points[1].y) / 2 - rect.top,
                initialTranslateX: translateX,
                initialTranslateY: translateY,
            };
        } else if (activePointers.size === 1) {
            if (scale > 1) {
                isPanning = true;
                lastPanPosition = { x: event.clientX, y: event.clientY };
            }

            if (event.pointerType === 'touch') {
                const now = Date.now();
                if (now - lastTapTime < 300) {
                    event.preventDefault();
                    if (scale > 1) {
                        reset();
                    } else {
                        zoomAtPoint(2, event.clientX, event.clientY);
                    }
                }
                lastTapTime = now;
            }
        }
    };

    const handlePointerMove = (event) => {
        if (!activePointers.has(event.pointerId)) return;

        activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

        if (activePointers.size === 2 && pinchData) {
            const points = Array.from(activePointers.values());
            const distance = getDistance(points[0], points[1]);
            if (pinchData.initialDistance > 0) {
                scale = clampScale(pinchData.initialScale * (distance / pinchData.initialDistance));
                translateX = pinchData.initialTranslateX - (pinchData.centerX * (scale - pinchData.initialScale));
                translateY = pinchData.initialTranslateY - (pinchData.centerY * (scale - pinchData.initialScale));
                updateTransform();
            }
        } else if (isPanning && activePointers.size === 1 && scale > 1) {
            const pointer = activePointers.get(event.pointerId);
            const dx = pointer.x - lastPanPosition.x;
            const dy = pointer.y - lastPanPosition.y;
            translateX += dx;
            translateY += dy;
            lastPanPosition = { x: pointer.x, y: pointer.y };
            updateTransform();
        }
    };

    const endPointerTracking = (event) => {
        if (activePointers.has(event.pointerId)) {
            if (viewport.hasPointerCapture(event.pointerId)) {
                viewport.releasePointerCapture(event.pointerId);
            }
            activePointers.delete(event.pointerId);
        }

        if (activePointers.size < 2) {
            pinchData = null;
        }

        if (activePointers.size === 0) {
            isPanning = false;
        }
    };

    const handleWheel = (event) => {
        event.preventDefault();
        const delta = -event.deltaY;
        const zoomFactor = Math.exp(delta / 600);
        const targetScale = clampScale(scale * zoomFactor);
        zoomAtPoint(targetScale, event.clientX, event.clientY);
    };

    const handleResize = () => {
        updateTransform();
    };

    viewport.addEventListener('pointerdown', handlePointerDown);
    viewport.addEventListener('pointermove', handlePointerMove);
    viewport.addEventListener('pointerup', endPointerTracking);
    viewport.addEventListener('pointercancel', endPointerTracking);
    viewport.addEventListener('pointerleave', endPointerTracking);
    viewport.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('resize', handleResize);

    applyTransform();

    return {
        reset,
        destroy() {
            viewport.removeEventListener('pointerdown', handlePointerDown);
            viewport.removeEventListener('pointermove', handlePointerMove);
            viewport.removeEventListener('pointerup', endPointerTracking);
            viewport.removeEventListener('pointercancel', endPointerTracking);
            viewport.removeEventListener('pointerleave', endPointerTracking);
            viewport.removeEventListener('wheel', handleWheel);
            window.removeEventListener('resize', handleResize);
            activePointers.clear();
            pinchData = null;
            isPanning = false;
        },
    };
}

function initModals() {
    const termsLink = document.getElementById('termsLink');
    const privacyLink = document.getElementById('privacyLink');
    const termsModal = document.getElementById('termsModal');
    const privacyModal = document.getElementById('privacyModal');
    const closeButtons = document.querySelectorAll('.close-btn');

    if (termsLink && termsModal) {
        termsLink.addEventListener('click', (e) => {
            e.preventDefault();
            termsModal.style.display = 'block';
        });
    }

    if (privacyLink && privacyModal) {
        privacyLink.addEventListener('click', (e) => {
            e.preventDefault();
            privacyModal.style.display = 'block';
        });
    }

    const learnMoreButton = document.getElementById('learnMoreButton');
    const learnMoreModal = document.getElementById('learnMoreModal');
    if (learnMoreButton && learnMoreModal) {
        learnMoreButton.addEventListener('click', (e) => {
            e.preventDefault();
            learnMoreModal.style.display = 'block';
        });
    }

    closeButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const modalId = btn.getAttribute('data-close');
            document.getElementById(modalId).style.display = 'none';
        });
    });

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
