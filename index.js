document.addEventListener('DOMContentLoaded', function() {
    // Nickname Animation
    const nicknames = document.querySelectorAll('.nickname');
    let nicknameIndex = 0;
    
    function cycleNicknames() {
        // Hide all nicknames
        nicknames.forEach(nick => {
            gsap.to(nick, { opacity: 0, duration: 0.5 });
        });
        
        // Show next nickname
        gsap.to(nicknames[nicknameIndex], { opacity: 1, duration: 0.5, delay: 0.5 });
        
        // Update index
        nicknameIndex = (nicknameIndex + 1) % nicknames.length;
    }
    
    // Initial display
    gsap.to(nicknames[0], { opacity: 1, duration: 0.5 });
    
    // Start cycling
    setInterval(cycleNicknames, 3000);
    
    // Create confetti
    function createConfetti() {
        const hero = document.getElementById('hero');
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        
        // Random position, color and size
        const size = Math.random() * 15 + 5;
        const colors = ['#e91e63', '#f48fb1', '#f8bbd0', '#fce4ec', '#ad1457', '#c2185b'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        confetti.style.backgroundColor = randomColor;
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.top = '-20px';
        
        hero.appendChild(confetti);
        
        // Animate falling
        gsap.to(confetti, {
            y: `${window.innerHeight + 20}px`,
            x: `${(Math.random() - 0.5) * 200}px`,
            rotation: Math.random() * 360,
            duration: Math.random() * 3 + 2,
            ease: 'none',
            onComplete: () => {
                confetti.remove();
            }
        });
    }
    
    // Create confetti at intervals
    setInterval(createConfetti, 200);
    
    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetElement.offsetTop,
                behavior: 'smooth'
            });
        });
    });

    // Balloon Pop Interaction
    const balloons = document.querySelectorAll('.balloon');
    balloons.forEach(balloon => {
        balloon.addEventListener('click', () => {
            gsap.to(balloon, { 
                scale: 1.2, 
                duration: 0.2,
                onComplete: () => {
                    gsap.to(balloon, { 
                        scale: 0, 
                        opacity: 0,
                        duration: 0.3, 
                        onComplete: () => balloon.remove() 
                    });
                }
            });
        });
    });

    // Password Protection
    const overlay = document.getElementById('password-overlay');
    const unlockBtn = document.getElementById('unlock-btn');
    const passwordInput = document.getElementById('password-input');
    const errorMessage = document.getElementById('error-message');
    const backgroundMusic = document.getElementById('background-music'); // Reference to the audio element

    function fadeInMusic(audio, targetVolume, duration) {
        audio.volume = 0; // Start at 0 volume
        audio.play(); // Start playing the audio
        const step = targetVolume / (duration / 100); // Calculate the volume increment per step
        let currentVolume = 0;

        const fadeInterval = setInterval(() => {
            currentVolume += step;
            if (currentVolume >= targetVolume) {
                audio.volume = targetVolume; // Set to target volume
                clearInterval(fadeInterval); // Stop the interval
            } else {
                audio.volume = currentVolume; // Incrementally increase volume
            }
        }, 100); // Adjust volume every 100ms
    }

    function checkPassword() {
        const password = passwordInput.value;
        if (password === 'JO07') {
            overlay.style.display = 'none';
            fadeInMusic(backgroundMusic, 0.65, 6000); // Fade in to 65% volume over 3 seconds
        } else {
            errorMessage.textContent = "Don't tell me you've forgotten👀";
            passwordInput.value = '';
            passwordInput.focus();
        }
    }

    // Use one event listener for both button click and Enter key
    unlockBtn.addEventListener('click', checkPassword);
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkPassword();
        }
    });

    // Carousel Functionality
    // Unified Carousel Functionality
    const track = document.querySelector('.carousel-track');
    const items = Array.from(track.children);
    const prevButton = document.querySelector('.prev-btn');
    const nextButton = document.querySelector('.next-btn');

    let currentSlide = 0;
    let itemWidth = items[0].getBoundingClientRect().width;

    // Update carousel position based on the current slide
    function updateCarouselPosition() {
        track.style.transform = `translateX(-${currentSlide * itemWidth}px)`;
    }

    // Recalculate item width on window resize for responsiveness
    function updateItemWidth() {
        itemWidth = items[0].getBoundingClientRect().width;
        updateCarouselPosition();
    }
    window.addEventListener('resize', updateItemWidth);

    // Go to the next slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % items.length;
        track.style.transition = 'transform 0.5s ease-in-out';
        updateCarouselPosition();
        resetInterval();
    }

    // Go to the previous slide
    function prevSlide() {
        currentSlide = (currentSlide - 1 + items.length) % items.length;
        track.style.transition = 'transform 0.5s ease-in-out';
        updateCarouselPosition();
        resetInterval();
    }

    // Auto-advance carousel every 2500ms
    let carouselInterval = setInterval(nextSlide, 2500);

    function resetInterval() {
        clearInterval(carouselInterval);
        carouselInterval = setInterval(nextSlide, 2500);
    }

    // Touch events for mobile swiping
    let startX, endX;
    const minSwipeDistance = 50;

    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    track.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        const distance = endX - startX;
        if (Math.abs(distance) >= minSwipeDistance) {
            if (distance > 0) {
                prevSlide();
            } else {
                nextSlide();
            }
        }
    });

    // Click handlers for navigation buttons
    nextButton.addEventListener('click', nextSlide);
    prevButton.addEventListener('click', prevSlide);

});
