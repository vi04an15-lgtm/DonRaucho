/**
 * @file script.js
 * @description Lógica de cliente para la página de Don Raucho Botillería.
 * @summary Este script encapsula toda la interactividad del sitio. Se estructura en módulos que se inicializan
 *          una vez que el DOM está completamente cargado. Cada módulo gestiona una funcionalidad específica
 *          (menú móvil, animaciones, carrusel, mapa), promoviendo la mantenibilidad y escalabilidad del código.
 */

/**
 * @function initMobileMenu
 * @description Inicializa la funcionalidad del menú de navegación móvil.
 *              Gestiona la apertura/cierre del menú, la accesibilidad (atributos ARIA) y
 *              la aplicación de un overlay en el contenido principal para mejorar el foco.
 */
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mainContent = document.querySelector('main');

    if (!menuToggle || !mobileMenu || !mainContent) {
        console.warn('No se encontraron los elementos necesarios para el menú móvil.');
        return;
    }

    const menuLinks = mobileMenu.querySelectorAll('a');

    const toggleMenu = (expand) => {
        const isExpanded = typeof expand === 'boolean' ? expand : menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        mobileMenu.classList.toggle('hidden', isExpanded);
        mainContent.classList.toggle('menu-open-overlay', !isExpanded);
    };

    menuToggle.addEventListener('click', () => toggleMenu());
    menuLinks.forEach(link => {
        link.addEventListener('click', () => toggleMenu(true));
    });
}

/**
 * @function initSmoothScroll
 * @description Implementa un desplazamiento suave y animado para todos los enlaces de anclaje internos.
 *              Mejora la experiencia de navegación al moverse entre secciones.
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            const targetElement = document.querySelector(href);

            if (href !== '#' && targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * @function initScrollAnimations
 * @description Activa animaciones de entrada para elementos a medida que se vuelven visibles en el viewport.
 *              Utiliza la API IntersectionObserver para un rendimiento óptimo.
 */
function initScrollAnimations() {
    const scrollElements = document.querySelectorAll('.scroll-animate');
    if (scrollElements.length === 0) return;

    const elementObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('opacity-0', 'translate-y-4');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    scrollElements.forEach(el => elementObserver.observe(el));
}

/**
 * @function initCarousel
 * @description Inicializa la funcionalidad del carrusel de imágenes.
 *              Gestiona la navegación manual (botones y indicadores) y la rotación automática.
 */
function initCarousel() {
    const carousel = document.getElementById('default-carousel');
    if (!carousel) return;

    const items = carousel.querySelectorAll('[data-carousel-item]');
    const prevBtn = carousel.querySelector('[data-carousel-prev]');
    const nextBtn = carousel.querySelector('[data-carousel-next]');
    const indicators = carousel.querySelectorAll('[data-carousel-slide-to]');
    let currentIndex = 0;
    const slideInterval = 5000; // 5 segundos

    if (items.length === 0) return;

    function showSlide(index) {
        // Validar índice
        const newIndex = (index + items.length) % items.length;
        currentIndex = newIndex;

        items.forEach((item, i) => item.classList.toggle('hidden', i !== newIndex));
        indicators.forEach((indicator, i) => indicator.setAttribute('aria-current', i === newIndex));
    }

    prevBtn?.addEventListener('click', () => showSlide(currentIndex - 1));
    nextBtn?.addEventListener('click', () => showSlide(currentIndex + 1));
    indicators.forEach((indicator, i) => indicator.addEventListener('click', () => showSlide(i)));

    setInterval(() => showSlide(currentIndex + 1), slideInterval);

    showSlide(0); // Iniciar con la primera diapositiva
}

/**
 * @function initInteractiveMap
 * @description Inicializa el mapa interactivo de Leaflet.js con la ubicación del negocio.
 *              Utiliza un marcador personalizado y un proveedor de tiles minimalista.
 */
function initInteractiveMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    const coords = [-37.81909289065312, -72.67175960064439];
    const zoomLevel = 18;

    try {
        const map = L.map('map').setView(coords, zoomLevel);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        }).addTo(map);

        const blackIcon = L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });

        const marker = L.marker(coords, { icon: blackIcon }).addTo(map);
        marker.bindPopup('<b>Don Raucho Botillería</b><br>Av. Dillman Bullock, 3036, Angol, Chile').openPopup();
        marker.on('click', () => map.setView(coords, zoomLevel + 2)); // Zoom in on click
    } catch (error) {
        console.error("Error al inicializar el mapa de Leaflet:", error);
        mapElement.innerHTML = '<p class="text-center text-red-500">No se pudo cargar el mapa.</p>';
    }
}

/**
 * @function init
 * @description Función principal de inicialización. Se encarga de orquestar la llamada a todos los módulos.
 */
function init() {
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initCarousel();
    initInteractiveMap();
}

// El evento DOMContentLoaded asegura que el script se ejecute solo después de que todo el HTML ha sido cargado y parseado.
document.addEventListener('DOMContentLoaded', init);
