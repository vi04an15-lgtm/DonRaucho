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

    if (lenis) {
        lenis.on('scroll', ({ scroll }) => {
            navbar.classList.toggle('scrolled', scroll > 40);
        });
    } else {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 40);
        }, { passive: true });
    }
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
        if (lenis) {
            isExpanded ? lenis.start() : lenis.stop();
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
                if (lenis) {
                    lenis.scrollTo(target, { offset: -64, duration: 1.4 });
                } else {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
}

function initScrollAnimations() {
    const elements = document.querySelectorAll('.scroll-animate');
    if (!elements.length) return;

    // Estado inicial vía JS: si JS no carga, los elementos son visibles por defecto
    elements.forEach(el => el.classList.add('opacity-0', 'translate-y-6'));

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('opacity-0', 'translate-y-6');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });

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

function initGaleria() {
    if (typeof Swiper === 'undefined') return;
    new Swiper('.galeria-swiper', {
        loop: true,
        speed: 3500,
        autoplay: {
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        },
        slidesPerView: 'auto',
        spaceBetween: 16,
        grabCursor: true,
        allowTouchMove: true,
        freeMode: true,
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initAgeVerification();
    initScrollAnimations();
    initGaleria();

    let lenis = null;
    try {
        lenis = initLenis();
    } catch (e) {
        console.warn('Lenis no disponible, usando scroll nativo.', e);
    }

    initNavbar(lenis);
    initMobileMenu(lenis);
    initSmoothScroll(lenis);
});
