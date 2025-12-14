// Main JavaScript file for Birthday Celebration

document.addEventListener('DOMContentLoaded', function() {
    // Cake throw animation on first load
    const cakeAnimation = document.getElementById('cakeAnimation');
    
    // Check if animation has been shown before
    if (!sessionStorage.getItem('cakeAnimationShown')) {
        // Set flag to prevent animation on refresh
        sessionStorage.setItem('cakeAnimationShown', 'true');
        
        // Show and animate the cake
        setTimeout(() => {
            cakeAnimation.classList.add('cake-throw');
            
            // Remove the animation class after it completes
            setTimeout(() => {
                cakeAnimation.classList.remove('cake-throw');
                cakeAnimation.style.display = 'none';
            }, 3000);
        }, 1000); // Short delay to ensure everything is loaded
    } else {
        cakeAnimation.style.display = 'none';
    }
    // Audio player functionality
    const playButton = document.getElementById('playButton');
    const audio = document.getElementById('birthdayAudio');
    const playIcon = playButton.querySelector('.play-icon');
    let isPlaying = false;

    playButton.addEventListener('click', function() {
        if (isPlaying) {
            audio.pause();
            playIcon.innerHTML = '<path d="M8 5v14l11-7z"></path>';
            playButton.innerHTML = playButton.innerHTML.replace('Berhenti', 'Putar Ucapan');
        } else {
            audio.play().then(() => {
                playIcon.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path>';
                playButton.innerHTML = playButton.innerHTML.replace('Putar Ucapan', 'Berhenti');
            }).catch(error => {
                console.error('Error playing audio:', error);
                alert('Tidak dapat memutar audio. Pastikan file suara_arta.m4a ada di folder assets.');
            });
        }
        isPlaying = !isPlaying;
    });

    // Update button text when audio ends
    audio.addEventListener('ended', function() {
        isPlaying = false;
        playIcon.innerHTML = '<path d="M8 5v14l11-7z"></path>';
        playButton.innerHTML = playButton.innerHTML.replace('Berhenti', 'Putar Ucapan');
    });

    // Pause audio when page is hidden (tab change)
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            if (isPlaying) {
                audio.pause();
                isPlaying = false;
                playIcon.innerHTML = '<path d="M8 5v14l11-7z"></path>';
                playButton.innerHTML = playButton.innerHTML.replace('Berhenti', 'Putar Ucapan');
            }
        }
    });
    // Create canvas for fireworks
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    document.body.appendChild(canvas);
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    const ctx = canvas.getContext('2d');
    const fireworks = [];
    const particles = [];
    
    // Firework class
    class Firework {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height;
            this.targetY = 100 + Math.random() * (canvas.height * 0.3);
            this.speed = 2 + Math.random() * 3;
            this.radius = 2;
            this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
            this.alive = true;
        }
        
        update() {
            if (this.y > this.targetY) {
                this.y -= this.speed;
            } else {
                this.explode();
                this.alive = false;
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        
        explode() {
            const particleCount = 100;
            for (let i = 0; i < particleCount; i++) {
                const angle = (i / particleCount) * Math.PI * 2;
                const speed = 1 + Math.random() * 4;
                particles.push({
                    x: this.x,
                    y: this.y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    radius: 1 + Math.random() * 2,
                    color: this.color,
                    alpha: 1,
                    decay: 0.01 + Math.random() * 0.02
                });
            }
        }
    }
    
    // Animation loop
    function animate() {
        // Clear with semi-transparent black for trail effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Randomly launch fireworks
        if (Math.random() < 0.05) {
            fireworks.push(new Firework());
        }
        
        // Update and draw fireworks
        for (let i = fireworks.length - 1; i >= 0; i--) {
            const fw = fireworks[i];
            fw.update();
            fw.draw();
            
            if (!fw.alive) {
                fireworks.splice(i, 1);
            }
        }
        
        // Update and draw particles
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.05; // gravity
            p.alpha -= p.decay;
            
            if (p.alpha <= 0) {
                particles.splice(i, 1);
                continue;
            }
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color.replace(')', `, ${p.alpha})`).replace('rgb', 'rgba');
            ctx.fill();
        }
        
        requestAnimationFrame(animate);
    }
    
    // Start animation
    animate();

    // Image Modal Functionality
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalQuote = document.getElementById('modalQuote');
    const closeBtn = document.querySelector('.close');
    const galleryItems = document.querySelectorAll('.gallery-item img');
    
    // List of quotes
    const quotes = [
        "Selamat ulang tahun, orang yang paling aku sayang. Terima kasih sudah jadi rumah ternyaman.",
        "Di hari spesialmu ini, aku cuma mau bilang: aku bersyukur banget punya kamu.",
        "Bertambah usiamu, bertambah juga rasa cintaku ke kamu.",
        "Kamu adalah doa yang diam-diam aku minta, lalu Tuhan kabulkan.",
        "Selamat ulang tahun, cintaku. Semoga semua mimpimu pelan-pelan jadi nyata, aku temani.",
        "Kamu bukan sekadar pacar, kamu adalah bagian penting dari hidupku.",
        "Terima kasih sudah selalu ada, bahkan saat aku sedang tidak baik-baik saja.",
        "Di hari lahirmu, aku berharap kebahagiaan selalu memilihmu.",
        "Aku jatuh cinta lagi dan lagi setiap hari, terutama hari ini.",
        "Selamat bertambah usia, semoga senyummu tak pernah kehilangan alasan.",
        "Dunia mungkin tidak selalu ramah, tapi aku akan selalu ada di sisimu.",
        "Kamu adalah cerita terbaik yang pernah hadir dalam hidupku.",
        "Semoga langkahmu selalu ringan dan hatimu selalu tenang.",
        "Terima kasih sudah mencintaiku dengan caramu yang sederhana tapi tulus.",
        "Hari ini milikmu, tapi cintaku untukmu berlaku setiap hari.",
        "Selamat ulang tahun, sayang. Semoga kita selalu tumbuh bersama, bukan menjauh."
    ];
    
    // Function to get a random quote
    function getRandomQuote() {
        return quotes[Math.floor(Math.random() * quotes.length)];
    }

    // Function to open modal with clicked image
    function openModal(imgSrc) {
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('show');
            modalImg.src = imgSrc;
            // Set a random quote
            modalQuote.textContent = getRandomQuote();
            document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
        }, 10);
    }

    // Function to close modal
    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Re-enable scrolling
        }, 300);
    }

    // Add click event to all gallery images
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            openModal(this.src);
        });
    });

    // Close modal when clicking the close button
    closeBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside the image
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });
});

// Add any additional functionality here
