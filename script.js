// Script para Botillería Don Raucho

document.addEventListener('DOMContentLoaded', function () {
    // Efecto de scroll suave en anclas
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Animación de elementos al hacer scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        observer.observe(section);
    });

    // Carrusel simple
    const carousel = document.getElementById('default-carousel');
    if (carousel) {
        const items = carousel.querySelectorAll('[data-carousel-item]');
        const prevBtn = carousel.querySelector('[data-carousel-prev]');
        const nextBtn = carousel.querySelector('[data-carousel-next]');
        const indicators = carousel.querySelectorAll('[data-carousel-slide-to]');

        let currentIndex = 0;

        function showSlide(index) {
            items.forEach((item, i) => {
                if (i === index) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });

            indicators.forEach((indicator, i) => {
                if (i === index) {
                    indicator.setAttribute('aria-current', 'true');
                    indicator.classList.add('bg-white');
                } else {
                    indicator.setAttribute('aria-current', 'false');
                    indicator.classList.remove('bg-white');
                }
            });
        }

        prevBtn?.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + items.length) % items.length;
            showSlide(currentIndex);
        });

        nextBtn?.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % items.length;
            showSlide(currentIndex);
        });

        indicators.forEach((indicator, i) => {
            indicator.addEventListener('click', () => {
                currentIndex = i;
                showSlide(currentIndex);
            });
        });

        // Auto-rotate each 5 seconds
        setInterval(() => {
            currentIndex = (currentIndex + 1) % items.length;
            showSlide(currentIndex);
        }, 5000);

        // Mostrar la primera imagen
        showSlide(0);
    }

    // Mapa interactivo
    const mapElement = document.getElementById('map');
    if (mapElement) {
        // Coordenadas de Angol, Chile
        const map = L.map('map').setView([-37.81909289065312, -72.67175960064439], 20);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; CartoDB'
        }).addTo(map);

        // Marcador personalizado negro
        const blackIcon = L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });

        // Agregar marcador con popup
        const marker = L.marker([-37.81909289065312, -72.67175960064439], {icon: blackIcon}).addTo(map);
        marker.bindPopup('<b>Don Raucho Botillería</b><br>Av. Dillman Bullock, 3036, Angol, Chile').openPopup();
        
        // Hacer zoom al hacer click en el marcador
        marker.on('click', function() {
            map.zoomIn();
        });
    }
});

