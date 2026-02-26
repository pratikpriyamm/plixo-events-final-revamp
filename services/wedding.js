document.addEventListener('DOMContentLoaded', () => {
    
    /* -----------------------------------------------
        MOBILE MENU TOGGLE
    ----------------------------------------------- */
    const menuBtn = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            // 1. Triggers the "X" animation in CSS
            menuBtn.classList.toggle('active'); 
            
            // 2. Opens/Closes the dropdown menu
            navLinks.classList.toggle('active'); 

            // 3. Accessibility update
            const expanded = menuBtn.classList.contains('active');
            menuBtn.setAttribute('aria-expanded', expanded);
        });
    }

});