document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', () => {
        // Toggle the navigation visibility
        navLinks.classList.toggle('active');
        
        // Optional: Animate the hamburger bars into an 'X'
        const bars = document.querySelectorAll('.bar');
        bars[0].style.transform = navLinks.classList.contains('active') 
            ? 'rotate(45deg) translate(5px, 6px)' : 'none';
        bars[1].style.opacity = navLinks.classList.contains('active') 
            ? '0' : '1';
        bars[2].style.transform = navLinks.classList.contains('active') 
            ? 'rotate(-45deg) translate(5px, -6px)' : 'none';
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
});