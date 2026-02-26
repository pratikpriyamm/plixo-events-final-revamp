document.addEventListener("DOMContentLoaded", () => {
    // MODE 1: Slider (Home, Wedding, Corporate, Private Pages)
    // Updated to target your specific container IDs
    const slideshowContainers = document.querySelectorAll('.slideshow-container');
    slideshowContainers.forEach(container => {
        loadSliderGallery(container);
    });

    // MODE 2: Full Grid (Gallery.html)
    const gridContainer = document.getElementById('galleryGrid');
    if (gridContainer) {
        loadFullPageGallery(gridContainer);
    }
});

// ==========================================
// LOGIC FOR SLIDER (Home & Service Pages)
// ==========================================
async function loadSliderGallery(container) {
    try {
        const data = await fetchGalleryData();
        const pageId = container.getAttribute('data-id');
        let targetImages = [];

        if (pageId === 'main') {
            // Main Page: Aggregate ALL images
            data.forEach(section => {
                targetImages = targetImages.concat(section.images);
            });
        } else {
            // Service Pages: Find specific category
            const sectionData = data.find(item => item.id === pageId);
            if (sectionData && sectionData.images) {
                targetImages = sectionData.images;
            }
        }

        renderSlider(container, targetImages);

    } catch (error) {
        console.error("Slider Error:", error);
    }
}

function renderSlider(container, images) {
    container.innerHTML = ""; // Clears the dark screen
    const fragment = document.createDocumentFragment();

    images.forEach((imagePath, index) => {
        // Creates the exact structure your CSS expects
        const img = document.createElement('img');
        
        // Fixes the path issue for GitHub Pages so images load from subfolders
        const isServicePage = window.location.pathname.includes('/services/');
        img.src = isServicePage ? `../${imagePath}` : imagePath;
        
        img.className = 'slide-img'; // Matches your CSS
        img.alt = "Plixo Event Gallery"; 
        img.loading = "lazy"; 

        // Makes the very first image visible
        if (index === 0) {
            img.classList.add('active');
        }

        fragment.appendChild(img);
    });

    container.appendChild(fragment);

    // --- START THE AUTO-SLIDESHOW ---
    let currentSlide = 0;
    const slides = container.querySelectorAll('.slide-img');
    
    if (slides.length > 1) {
        setInterval(() => {
            // Hide current slide
            slides[currentSlide].classList.remove('active');
            
            // Move to the next slide, loop back to 0 if at the end
            currentSlide = (currentSlide + 1) % slides.length;
            
            // Show new slide
            slides[currentSlide].classList.add('active');
        }, 3000); // Changes image every 3 seconds
    }
}

// ==========================================
// LOGIC FOR FULL PAGE GRID (gallery.html)
// ==========================================
async function loadFullPageGallery(container) {
    try {
        const data = await fetchGalleryData();
        
        // 1. Get URL Parameter
        const params = new URLSearchParams(window.location.search);
        const urlCategory = params.get("category");

        // 2. ID Mapper (Matches URL to JSON ID)
        const idMap = {
            "weddings": "wedding",
            "private": "social",
            "corporate": "corporate"
        };
        const targetId = idMap[urlCategory] || urlCategory;

        // 3. Find Data
        const galleryData = data.find(item => item.id === targetId);
        
        // 4. Update Title & Render
        const titleElement = document.getElementById("galleryTitle");
        
        if (!galleryData) {
            if (titleElement) titleElement.textContent = "Gallery Not Found";
            return;
        }

        if (titleElement) titleElement.textContent = galleryData.title;

        // Render Grid Images
        const fragment = document.createDocumentFragment();
        galleryData.images.forEach(src => {
            const img = document.createElement("img");
            // GitHub pages relative path fix
            img.src = src.startsWith('./') ? src : `./${src}`;
            img.loading = "lazy";
            img.alt = galleryData.title;
            fragment.appendChild(img);
        });
        
        container.innerHTML = ""; // Clear loading state
        container.appendChild(fragment);

    } catch (error) {
        console.error("Grid Error:", error);
        document.getElementById("galleryTitle").textContent = "Error Loading Gallery";
    }
}

// ==========================================
// SHARED HELPER (Fetches JSON dynamically)
// ==========================================
async function fetchGalleryData() {
    // Dynamically checks if we are inside the 'services' folder or at the root
    // This perfectly prevents the GitHub Pages 404 Error!
    const basePath = window.location.pathname.includes('/services/') ? '../' : './';
    
    const response = await fetch(basePath + 'gallery.json');
    if (!response.ok) throw new Error("Failed to load gallery data");
    return await response.json();
}