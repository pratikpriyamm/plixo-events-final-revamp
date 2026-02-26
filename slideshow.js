document.addEventListener("DOMContentLoaded", () => {
    // Locate the slideshow container on the current page
    const container = document.querySelector('.slideshow-container');

    if (container) {
        initHeroSlideshow(container);
    }
});

async function initHeroSlideshow(container) {
    try {
        // 1. Fetch the image data (GITHUB PAGES SAFE)
        // If we are in the /services/ folder, go up one level ('../'). Otherwise, stay here ('./').
        const isServicePage = window.location.pathname.includes('/services/');
        const jsonPath = isServicePage ? '../gallery.json' : './gallery.json';
        
        const response = await fetch(jsonPath);
        if (!response.ok) throw new Error("Failed to load gallery data");
        const data = await response.json();

        // 2. Identify which category to show
        const categoryId = container.getAttribute('data-id');
        const categoryData = data.find(item => item.id === categoryId);

        if (!categoryData || !categoryData.images) {
            console.error(`No images found for category: ${categoryId}`);
            return;
        }

        // 3. Render the images
        renderSlides(container, categoryData.images, isServicePage);

        // 4. Initialize the Button Controls
        setupControls(container);

    } catch (error) {
        console.error("Slideshow Error:", error);
    }
}

function renderSlides(container, images, isServicePage) {
    // Clear any existing content
    container.innerHTML = '';

    images.forEach((src, index) => {
        const slide = document.createElement('div');
        slide.className = 'mySlides fade'; 
        
        // Show the first slide by default
        if (index === 0) slide.style.display = 'block';
        else slide.style.display = 'none';

        const img = document.createElement('img');
        
        // GitHub Pages Image Pathing Fix
        img.src = isServicePage ? '../' + src : './' + src;
        
        img.style.width = '100%';
        img.alt = "Slideshow Image";

        slide.appendChild(img);
        container.appendChild(slide);
    });
}

function setupControls(container) {
    let slideIndex = 0;
    const slides = container.getElementsByClassName("mySlides");
    
    // Safety check just in case no images loaded
    if (slides.length === 0) return; 

    // Find the buttons (they are siblings to the container window)
    // We look up to the main wrapper (.hero-slideshow-side) then find buttons
    const wrapper = container.closest('.hero-slideshow-side');
    if (!wrapper) return;
    
    const prevBtn = wrapper.querySelector('.prev');
    const nextBtn = wrapper.querySelector('.next');

    // Function to change slides
    function showSlide(n) {
        // Wrap around logic
        if (n >= slides.length) slideIndex = 0;
        else if (n < 0) slideIndex = slides.length - 1;
        else slideIndex = n;

        // Hide all
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        // Show new
        slides[slideIndex].style.display = "block";
    }

    // Event Listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', () => showSlide(slideIndex - 1));
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => showSlide(slideIndex + 1));
    }

    // Optional: Auto-play every 5 seconds
    setInterval(() => showSlide(slideIndex + 1), 5000);
}