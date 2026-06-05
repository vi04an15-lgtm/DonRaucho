function initLenis() {
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.5,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return lenis;
}

function initNavbar(lenis) {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    lenis.on('scroll', ({ scroll }) => {
        navbar.classList.toggle('scrolled', scroll > 40);
    });
    navbar.classList.toggle('scrolled', window.scrollY > 40);
}

function initMobileMenu(lenis) {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mainContent = document.querySelector('main');

    if (!menuToggle || !mobileMenu || !mainContent) return;

    const menuLinks = mobileMenu.querySelectorAll('a');

    const toggleMenu = (expand) => {
        const isExpanded = typeof expand === 'boolean' ? expand : menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        mobileMenu.classList.toggle('hidden', isExpanded);
        mainContent.classList.toggle('menu-open-overlay', !isExpanded);
        if (!isExpanded) {
            lenis.stop();
        } else {
            lenis.start();
        }
    };

    menuToggle.addEventListener('click', () => toggleMenu());
    menuLinks.forEach(link => link.addEventListener('click', () => toggleMenu(true)));
}

function initSmoothScroll(lenis) {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            const target = document.querySelector(href);
            if (href !== '#' && target) {
                e.preventDefault();
                lenis.scrollTo(target, { offset: -64, duration: 1.4 });
            }
        });
    });
}

function initScrollAnimations() {
    const elements = document.querySelectorAll('.scroll-animate');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('opacity-0', 'translate-y-6', 'translate-y-4');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    elements.forEach(el => observer.observe(el));
}

function initAgeVerification() {
    const modal = document.getElementById('age-modal');
    const confirmBtn = document.getElementById('age-confirm');
    const denyBtn = document.getElementById('age-deny');
    const birthdateInput = document.getElementById('birthdate');
    const errorMsg = document.getElementById('age-error');

    if (!modal) return;

    if (localStorage.getItem('ageVerified') === 'true') {
        modal.classList.add('hidden');
        return;
    }

    modal.style.display = 'flex';

    confirmBtn.addEventListener('click', () => {
        if (!birthdateInput.value) {
            errorMsg.textContent = 'Por favor, selecciona una fecha.';
            errorMsg.classList.remove('hidden');
            return;
        }

        const birthDate = new Date(birthdateInput.value);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;

        if (age >= 18) {
            localStorage.setItem('ageVerified', 'true');
            modal.style.display = 'none';
        } else {
            errorMsg.textContent = 'Debes ser mayor de 18 años para ingresar.';
            errorMsg.classList.remove('hidden');
        }
    });

    denyBtn.addEventListener('click', () => {
        window.location.href = 'https://www.google.com';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initAgeVerification();
    const lenis = initLenis();
    initNavbar(lenis);
    initMobileMenu(lenis);
    initSmoothScroll(lenis);
    initScrollAnimations();
});
