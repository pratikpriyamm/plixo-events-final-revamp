document.addEventListener("DOMContentLoaded", () => {
    // MODE 1: Slider (Home, Wedding, Corporate, Private Pages)
    const sliderContainer = document.getElementById('dynamic-gallery');
    if (sliderContainer) {
        loadSliderGallery(sliderContainer);
    }

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
    const fragment = document.createDocumentFragment();

    images.forEach(imagePath => {
        const slide = document.createElement('div');
        slide.className = 'gallery-slide';

        const img = document.createElement('img');
        img.src = imagePath;
        img.alt = "Plixo Event Gallery"; 
        img.loading = "lazy"; 

        slide.appendChild(img);
        fragment.appendChild(slide);
    });

    container.appendChild(fragment);
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
            img.src = src;
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
// SHARED HELPER (Fetches JSON once)
// ==========================================
async function fetchGalleryData() {
    const response = await fetch('/gallery.json');
    if (!response.ok) throw new Error("Failed to load gallery data");
    return await response.json();
}