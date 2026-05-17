/* ===================================
   HOTEL GREEN INN — MAIN JAVASCRIPT
   =================================== */

// ---- PRELOADER ----
window.addEventListener('load', () => {
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        preloader.classList.add('hidden');
        setTimeout(() => preloader.remove(), 700);
    }, 1500);
});

// ---- CUSTOM CURSOR ----
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
});

function animateFollower() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
}
animateFollower();

document.querySelectorAll('a, button, .room-card, .amenity-card, .gallery__item').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.width = '20px';
        cursor.style.height = '20px';
        cursor.style.background = 'var(--gold)';
        follower.style.width = '60px';
        follower.style.height = '60px';
    });
    el.addEventListener('mouseleave', () => {
        cursor.style.width = '10px';
        cursor.style.height = '10px';
        cursor.style.background = 'var(--green-mid)';
        follower.style.width = '36px';
        follower.style.height = '36px';
    });
});

// ---- HEADER SCROLL ----
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    updateActiveNav();
});

// ---- HAMBURGER MENU ----
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    nav.classList.toggle('open');
    document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
});

document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        nav.classList.remove('open');
        document.body.style.overflow = '';
    });
});

// Click outside to close
document.addEventListener('click', (e) => {
    if (nav.classList.contains('open') && !nav.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove('open');
        nav.classList.remove('open');
        document.body.style.overflow = '';
    }
});

// ---- ACTIVE NAV ON SCROLL ----
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    sections.forEach(section => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        const id = section.getAttribute('id');
        const link = document.querySelector(`.nav__link[href="#${id}"]`);
        if (link) {
            if (scrollPos >= top && scrollPos < bottom) {
                document.querySelectorAll('.nav__link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        }
    });
}

// ---- SCROLL REVEAL ----
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => {
                entry.target.classList.add('revealed');
            }, parseInt(delay));
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    revealObserver.observe(el);
});

// ---- TESTIMONIAL SLIDER ----
const testimonials = document.querySelectorAll('.testimonial');
const dots = document.querySelectorAll('.dot');
let currentTestimonial = 0;
let testimonialTimer;

function showTestimonial(index) {
    testimonials[currentTestimonial].classList.remove('active');
    dots[currentTestimonial].classList.remove('active');
    currentTestimonial = index;
    testimonials[currentTestimonial].classList.add('active');
    dots[currentTestimonial].classList.add('active');
}

function nextTestimonial() {
    const next = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(next);
}

if (dots.length > 0) {
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            clearInterval(testimonialTimer);
            showTestimonial(parseInt(dot.dataset.index));
            testimonialTimer = setInterval(nextTestimonial, 5000);
        });
    });

    testimonialTimer = setInterval(nextTestimonial, 5000);
}

// ---- BOOKING FORM ----
const bookingForm = document.getElementById('bookingForm');
const toast = document.getElementById('toast');

if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = bookingForm.querySelector('button[type="submit"]');
        btn.textContent = 'Sending...';
        btn.disabled = true;
        btn.style.opacity = '0.7';

        setTimeout(() => {
            btn.textContent = '✓ Request Sent!';
            btn.style.background = 'var(--green-light)';

            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 4000);

            setTimeout(() => {
                bookingForm.reset();
                btn.textContent = 'Confirm Reservation 🌿';
                btn.disabled = false;
                btn.style.opacity = '1';
                btn.style.background = '';
            }, 3000);
        }, 1500);
    });
}

// ---- SET MIN DATE ON BOOKING FORM ----
const dateInputs = document.querySelectorAll('input[type="date"]');
if (dateInputs.length > 0) {
    const today = new Date().toISOString().split('T')[0];
    dateInputs.forEach(input => input.setAttribute('min', today));

    const checkIn = document.querySelector('input[type="date"]:first-of-type');
    const checkOut = document.querySelector('input[type="date"]:last-of-type');
    if (checkIn && checkOut) {
        checkIn.addEventListener('change', () => {
            checkOut.setAttribute('min', checkIn.value);
        });
    }
}

// ---- NEWSLETTER ----
const newsletterBtn = document.querySelector('.newsletter button');
const newsletterInput = document.querySelector('.newsletter input');
if (newsletterBtn) {
    newsletterBtn.addEventListener('click', () => {
        const email = newsletterInput.value.trim();
        if (email && email.includes('@')) {
            newsletterBtn.textContent = '✓';
            newsletterBtn.style.background = 'var(--green-pale)';
            newsletterInput.value = '';
            setTimeout(() => {
                newsletterBtn.textContent = '→';
                newsletterBtn.style.background = '';
            }, 3000);
        } else {
            newsletterInput.style.borderColor = '#ff6b6b';
            setTimeout(() => newsletterInput.style.borderColor = '', 1500);
        }
    });
}

// ---- GALLERY LIGHTBOX (simple) ----
document.querySelectorAll('.gallery__item').forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const label = img?.getAttribute('alt') || 'Gallery';
        const emoji = img?.getAttribute('data-emoji') || '🌿';
        // Create lightbox overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
      position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:9000;
      display:flex;align-items:center;justify-content:center;cursor:pointer;
      animation:fadeInOverlay 0.3s ease;
    `;
        overlay.innerHTML = `
      <div style="text-align:center;color:#fff;">
        <div style="font-size:8rem;margin-bottom:1rem;">${emoji}</div>
        <div style="font-family:'Cormorant Garamond',serif;font-size:2rem;font-style:italic;">${label}</div>
        <div style="font-size:0.75rem;letter-spacing:3px;opacity:0.5;margin-top:12px;text-transform:uppercase;">Click anywhere to close</div>
      </div>
    `;
        document.body.appendChild(overlay);
        overlay.addEventListener('click', () => overlay.remove());
    });
});

// Add keyframe for overlay
const style = document.createElement('style');
style.textContent = '@keyframes fadeInOverlay { from { opacity:0 } to { opacity:1 } }';
document.head.appendChild(style);

// ---- SMOOTH SCROLL for anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const offset = 80;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// ---- COUNTER ANIMATION ----
function animateCounter(el, target, suffix = '') {
    let count = 0;
    const increment = target / 60;
    const timer = setInterval(() => {
        count += increment;
        if (count >= target) {
            el.textContent = target + suffix;
            clearInterval(timer);
        } else {
            el.textContent = Math.floor(count) + suffix;
        }
    }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const nums = entry.target.querySelectorAll('.stat__num');
            nums.forEach(num => {
                const text = num.textContent;
                if (text.includes('★')) { animateCounter(num, 4.9, '★'); }
                else if (text.includes('47')) { animateCounter(num, 47); }
                else if (text.includes('12')) { animateCounter(num, 12); }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero__stats');
if (heroStats) statsObserver.observe(heroStats);

console.log('🌿 Hotel Green Inn — Website loaded successfully');
