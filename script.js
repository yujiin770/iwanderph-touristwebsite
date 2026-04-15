document.addEventListener('DOMContentLoaded', () => {

    // --- AUTOMATIC IMAGE SLIDER ---
    const philippineImages = [
        "https://images.pexels.com/photos/1632242/pexels-photo-1632242.jpeg", // El Nido, Palawan
        "https://images.pexels.com/photos/11995818/pexels-photo-11995818.jpeg", // Bohol, Chocolate Hills
        "https://images.pexels.com/photos/1598991/pexels-photo-1598991.jpeg", // Siargao Island
        "https://images.pexels.com/photos/2085739/pexels-photo-2085739.jpeg", // Mayon Volcano
        "https://images.pexels.com/photos/236681/pexels-photo-236681.jpeg"  // Coron, Palawan
    ];

    const sliderImage = document.querySelector('.slider-image');
    let currentImageIndex = 0;

    

    // --- THEME TOGGLER & HAMBURGER (No changes needed here) ---

    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const themeIcon = themeToggleBtn.querySelector('i');

    const setTheme = (theme) => {
        body.classList.remove('light-mode', 'dark-mode');
        body.classList.add(theme);

        themeIcon.classList.remove('fa-moon', 'fa-sun');
        if (theme === 'dark-mode') {
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.add('fa-moon');
        }
        localStorage.setItem('theme', theme);
    };
    
    const savedTheme = localStorage.getItem('theme') || 'light-mode';
    setTheme(savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const newTheme = body.classList.contains('light-mode') ? 'dark-mode' : 'light-mode';
        setTheme(newTheme);
    });

    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const hamburgerIcon = hamburger.querySelector('i');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const isActive = navLinks.classList.contains('active');
        hamburgerIcon.classList.remove('fa-bars', 'fa-times');
        hamburgerIcon.classList.add(isActive ? 'fa-times' : 'fa-bars');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburgerIcon.classList.remove('fa-times');
                hamburgerIcon.classList.add('fa-bars');
            }
        });
    });
});