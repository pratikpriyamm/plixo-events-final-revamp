document.addEventListener('DOMContentLoaded', () => {

    /* -----------------------------------------------
       1. Mobile Menu Toggle
    ----------------------------------------------- */
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    function toggleMenu() {
        navMenu.classList.toggle('active');
        menuBtn.classList.toggle('open');
    }

    function closeMenu() {
        navMenu.classList.remove('active');
        menuBtn.classList.remove('open');
    }

    if (menuBtn) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });
    }

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active')) {
            if (!navMenu.contains(e.target) && !menuBtn.contains(e.target)) {
                closeMenu();
            }
        }
    });

    /* -----------------------------------------------
       2. Smooth Scrolling
    ----------------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    /* -----------------------------------------------
       3. Navbar Scroll Effect (Optional Enhancement)
    ----------------------------------------------- */
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
        } else {
            navbar.style.boxShadow = "none";
        }
    });

});

document.addEventListener("DOMContentLoaded", function() {
    const messageBox = document.getElementById("messageBox");
    const charCountMsg = document.getElementById("charCountMsg");
    const contactForm = document.getElementById("contactForm");

    if (messageBox && contactForm) {
        // 1. Update counter as the user types
        messageBox.addEventListener("input", function() {
            // Remove all spaces and line breaks to get the true character count
            const textWithoutSpaces = this.value.replace(/\s/g, "");
            const count = textWithoutSpaces.length;

            charCountMsg.textContent = `Characters (excluding spaces): ${count} / 150`;

            // Change color to green if they pass 150
            if (count >= 150) {
                charCountMsg.classList.add("valid");
            } else {
                charCountMsg.classList.remove("valid");
            }
        });

        // 2. Prevent submission if rules aren't met
        contactForm.addEventListener("submit", function(event) {
            const textWithoutSpaces = messageBox.value.replace(/\s/g, "");
            
            if (textWithoutSpaces.length < 150) {
                event.preventDefault(); // STOPS the form from sending
                alert("Please ensure your message contains at least 150 characters (excluding spaces).");
                messageBox.focus(); // Brings their cursor back to the box
            }
        });
    }
});
