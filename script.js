document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. Lenis Smooth Scroll Initialization
    // ==========================================
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync GSAP ScrollTrigger with Lenis
    if (typeof ScrollTrigger !== 'undefined') {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0, 0);
    }
    
    // ==========================================
    // 2. Custom Cursor
    // ==========================================
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Immediate move for dot
        gsap.to(cursor, {
            x: mouseX,
            y: mouseY,
            duration: 0.1,
            ease: "power2.out"
        });
    });

    // Smoother interpolation for follower
    gsap.ticker.add(() => {
        followerX += (mouseX - followerX) * 0.15;
        followerY += (mouseY - followerY) * 0.15;
        gsap.set(cursorFollower, { x: followerX, y: followerY });
    });

    // Add hover states
    const hoverElements = document.querySelectorAll('a, button, .magnetic, .social-btn, .project-card');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            cursorFollower.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            cursorFollower.classList.remove('hover');
        });
    });

    // ==========================================
    // 3. Magnetic Elements Effect
    // ==========================================
    const magneticElements = document.querySelectorAll('.magnetic');
    
    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const strength = el.dataset.strength || 20;
            
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(el, {
                x: (x / rect.width) * strength,
                y: (y / rect.height) * strength,
                duration: 0.5,
                ease: "power2.out"
            });
        });
        
        el.addEventListener('mouseleave', () => {
            gsap.to(el, {
                x: 0,
                y: 0,
                duration: 0.8,
                ease: "elastic.out(1, 0.3)"
            });
        });
    });

    // ==========================================
    // 4. Loading Animation
    // ==========================================
    document.body.classList.add('loading');
    
    const loaderTimeline = gsap.timeline({
        onComplete: () => {
            document.body.classList.remove('loading');
            initPageAnimations();
        }
    });

    loaderTimeline
        .to('.loader-text', {
            opacity: 1,
            duration: 1,
            ease: "power3.inOut"
        })
        .to('.loader-bar', {
            width: '100%',
            duration: 1.5,
            ease: "power2.inOut"
        })
        .to('.loader', {
            yPercent: -100,
            duration: 0.8,
            ease: "power4.inOut"
        }, "+=0.3");

    // ==========================================
    // 5. Scroll Animations (GSAP)
    // ==========================================
    function initPageAnimations() {
        // Hero Elements Reveal
        gsap.from('.hero-greeting', { y: 50, opacity: 0, duration: 1, ease: "power3.out" });
        gsap.from('.hero-name', { y: 50, opacity: 0, duration: 1, delay: 0.2, ease: "power3.out" });
        gsap.from('.hero-tagline', { y: 50, opacity: 0, duration: 1, delay: 0.4, ease: "power3.out" });
        gsap.from('.hero-cta', { y: 50, opacity: 0, duration: 1, delay: 0.6, ease: "power3.out" });
        gsap.from('.hero-scroll-indicator', { opacity: 0, duration: 1, delay: 1, ease: "power2.out" });

        // Scroll Progress Bar
        gsap.to('.scroll-progress', {
            width: "100%",
            ease: "none",
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "bottom bottom",
                scrub: 0.5
            }
        });

        // Sticky Navbar Blur
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // About text reveal
        document.querySelectorAll('.reveal-text').forEach((text) => {
            gsap.from(text, {
                scrollTrigger: {
                    trigger: text,
                    start: "top 85%"
                },
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out"
            });
        });

        // Tags stagger
        gsap.from('.tag', {
            scrollTrigger: {
                trigger: '.about-tags',
                start: "top 85%"
            },
            y: 20,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "back.out(1.7)"
        });

        // Skills Progress Animation
        const skillBars = document.querySelectorAll('.skill-progress-bar');
        skillBars.forEach(bar => {
            const targetWidth = bar.getAttribute('data-width');
            gsap.to(bar, {
                scrollTrigger: {
                    trigger: bar,
                    start: "top 85%"
                },
                width: targetWidth,
                duration: 1.5,
                ease: "power3.out"
            });
        });

        // Project Cards reveal
        gsap.from('.project-card', {
            scrollTrigger: {
                trigger: '.projects-container',
                start: "top 80%"
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out"
        });

        // Form elements stagger
        gsap.from('.input-group, .btn-submit', {
            scrollTrigger: {
                trigger: '.contact-form-wrapper',
                start: "top 85%"
            },
            y: 30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out"
        });
    }

    // ==========================================
    // 6. Theme Toggle
    // ==========================================
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    let isDark = true;

    themeToggle.addEventListener('click', () => {
        isDark = !isDark;
        if (isDark) {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
        } else {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
        }
    });

    // ==========================================
    // 7. Mobile Menu Toggle
    // ==========================================
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
    
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // ==========================================
    // 8. Canvas Particles (Antigravity Feel)
    // ==========================================
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let particles = [];

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.alpha = Math.random() * 0.5 + 0.1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > width) this.speedX *= -1;
            if (this.y < 0 || this.y > height) this.speedY *= -1;
        }

        draw() {
            ctx.fillStyle = `rgba(0, 255, 204, ${this.alpha})`;
            if (!isDark) ctx.fillStyle = `rgba(0, 0, 0, ${this.alpha})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < 50; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    // ==========================================
    // 9. Utilities & Form Handling
    // ==========================================
    document.getElementById('current-year').textContent = new Date().getFullYear();

    const form = document.getElementById('contact-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = document.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<span class="submit-text">Sent!</span> <i class="fa-solid fa-check submit-icon"></i>';
        submitBtn.style.background = "linear-gradient(90deg, #00ffcc, #00d2ff)";
        
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = "";
            form.reset();
        }, 3000);
    });
});
