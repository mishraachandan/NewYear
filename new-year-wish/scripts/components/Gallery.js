/**
 * Gallery.js - Luxury Memory Gallery
 * Features:
 * - Scroll-reveal "appear from nothing" effect
 * - Elegant hover states
 * - Minimal luxury design
 */

window.Gallery = function (memorySections, sectionTitle) {
    const section = document.createElement('section');
    section.className = 'gallery-section';
    Object.assign(section.style, {
        padding: '8rem 2rem',
        background: 'var(--color-bg)'
    });

    // Section header - starts hidden
    const header = document.createElement('div');
    header.className = 'reveal-on-scroll';
    Object.assign(header.style, {
        textAlign: 'center',
        marginBottom: '5rem'
    });

    const subtitle = document.createElement('p');
    subtitle.textContent = 'A Collection of';
    Object.assign(subtitle.style, {
        fontSize: '0.9rem',
        color: 'var(--color-primary)',
        letterSpacing: '4px',
        textTransform: 'uppercase',
        marginBottom: '1rem'
    });

    const title = document.createElement('h2');
    title.textContent = sectionTitle || 'Our Memories';
    Object.assign(title.style, {
        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
        fontFamily: 'var(--font-heading)',
        fontWeight: '400',
        color: 'var(--color-text-main)',
        marginBottom: '1rem'
    });

    const decorLine = document.createElement('div');
    Object.assign(decorLine.style, {
        width: '60px',
        height: '1px',
        background: 'var(--color-primary)',
        margin: '0 auto'
    });

    header.appendChild(subtitle);
    header.appendChild(title);
    header.appendChild(decorLine);

    // Memory Grid
    const grid = document.createElement('div');
    Object.assign(grid.style, {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '3rem',
        maxWidth: '1200px',
        margin: '0 auto'
    });

    memorySections.forEach((memory, index) => {
        const card = createMemoryCard(memory, index, section);
        grid.appendChild(card);
    });

    section.appendChild(header);
    section.appendChild(grid);

    // Slideshow container
    const slideshowContainer = document.createElement('div');
    slideshowContainer.id = 'slideshow-container';
    slideshowContainer.style.display = 'none';
    section.appendChild(slideshowContainer);

    // Scroll reveal is now handled globally by app.js

    return section;
};

function createMemoryCard(memory, index, parentSection) {
    const card = document.createElement('div');
    card.className = 'memory-card reveal-on-scroll';
    // Staggered delay based on index
    card.style.transitionDelay = `${index * 200}ms`;

    Object.assign(card.style, {
        background: 'var(--color-surface)',
        overflow: 'hidden',
        cursor: 'pointer'
    });

    // Image container
    const imgContainer = document.createElement('div');
    Object.assign(imgContainer.style, {
        position: 'relative',
        height: '320px',
        overflow: 'hidden'
    });

    // Images for rotation
    let currentImageIndex = 0;
    let rotationInterval = null;
    const images = [];

    memory.photos.forEach((src, i) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = `${memory.title} - Photo ${i + 1}`;
        Object.assign(img.style, {
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: i === 0 ? '1' : '0',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
            transform: 'scale(1)'
        });
        images.push(img);
        imgContainer.appendChild(img);
    });

    // Overlay with button
    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
        position: 'absolute',
        inset: '0',
        background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        padding: '2rem',
        opacity: '0',
        transition: 'opacity 0.4s ease'
    });

    const liveBtn = document.createElement('button');
    liveBtn.textContent = 'Live the Memory';
    Object.assign(liveBtn.style, {
        padding: '0.8rem 2rem',
        fontSize: '0.75rem',
        fontFamily: 'var(--font-body)',
        background: 'transparent',
        color: 'var(--color-primary)',
        border: '1px solid var(--color-primary)',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        transform: 'translateY(20px)',
        opacity: '0'
    });
    overlay.appendChild(liveBtn);
    imgContainer.appendChild(overlay);

    // Counter
    const counter = document.createElement('div');
    counter.textContent = `1 / ${memory.photos.length}`;
    Object.assign(counter.style, {
        position: 'absolute',
        top: '15px',
        right: '15px',
        background: 'rgba(0, 0, 0, 0.7)',
        color: 'var(--color-text-muted)',
        padding: '5px 12px',
        fontSize: '0.75rem',
        letterSpacing: '2px'
    });
    imgContainer.appendChild(counter);

    // Caption
    const caption = document.createElement('div');
    Object.assign(caption.style, {
        padding: '1.5rem',
        borderTop: '1px solid rgba(255,255,255,0.05)'
    });

    const titleText = document.createElement('h3');
    titleText.textContent = memory.title;
    Object.assign(titleText.style, {
        fontSize: '1.1rem',
        fontFamily: 'var(--font-heading)',
        fontWeight: '400',
        color: 'var(--color-text-main)',
        marginBottom: '0.5rem'
    });

    const photoCount = document.createElement('span');
    photoCount.textContent = `${memory.photos.length} photographs`;
    Object.assign(photoCount.style, {
        fontSize: '0.8rem',
        color: 'var(--color-text-muted)',
        letterSpacing: '1px'
    });

    caption.appendChild(titleText);
    caption.appendChild(photoCount);

    card.appendChild(imgContainer);
    card.appendChild(caption);

    // Hover: Rotate images
    card.addEventListener('mouseenter', () => {
        overlay.style.opacity = '1';
        liveBtn.style.transform = 'translateY(0)';
        liveBtn.style.opacity = '1';
        images[currentImageIndex].style.transform = 'scale(1.05)';

        rotationInterval = setInterval(() => {
            images[currentImageIndex].style.opacity = '0';
            images[currentImageIndex].style.transform = 'scale(1)';
            currentImageIndex = (currentImageIndex + 1) % images.length;
            images[currentImageIndex].style.opacity = '1';
            images[currentImageIndex].style.transform = 'scale(1.05)';
            counter.textContent = `${currentImageIndex + 1} / ${memory.photos.length}`;
        }, 1500);
    });

    card.addEventListener('mouseleave', () => {
        overlay.style.opacity = '0';
        liveBtn.style.transform = 'translateY(20px)';
        liveBtn.style.opacity = '0';
        images[currentImageIndex].style.transform = 'scale(1)';
        clearInterval(rotationInterval);
    });

    liveBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        clearInterval(rotationInterval);
        openSlideshow(memory, currentImageIndex, parentSection);
    });

    liveBtn.addEventListener('mouseenter', () => {
        liveBtn.style.background = 'var(--color-primary)';
        liveBtn.style.color = 'var(--color-bg)';
    });
    liveBtn.addEventListener('mouseleave', () => {
        liveBtn.style.background = 'transparent';
        liveBtn.style.color = 'var(--color-primary)';
    });

    return card;
}

function openSlideshow(memory, startIndex, parentSection) {
    const container = parentSection.querySelector('#slideshow-container');
    container.innerHTML = '';

    Object.assign(container.style, {
        display: 'block',
        marginTop: '4rem',
        background: 'var(--color-surface)',
        padding: '3rem',
        position: 'relative',
        opacity: '0',
        transform: 'translateY(30px)',
        transition: 'all 0.6s ease'
    });

    setTimeout(() => {
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
    }, 50);

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    Object.assign(closeBtn.style, {
        position: 'absolute',
        top: '20px',
        right: '20px',
        background: 'transparent',
        color: 'var(--color-text-muted)',
        border: 'none',
        fontSize: '1.5rem',
        cursor: 'pointer',
        transition: 'color 0.3s'
    });
    closeBtn.addEventListener('mouseenter', () => closeBtn.style.color = 'var(--color-primary)');
    closeBtn.addEventListener('mouseleave', () => closeBtn.style.color = 'var(--color-text-muted)');
    closeBtn.addEventListener('click', () => {
        container.style.opacity = '0';
        container.style.transform = 'translateY(30px)';
        setTimeout(() => container.style.display = 'none', 600);
    });
    container.appendChild(closeBtn);

    // Title
    const title = document.createElement('h3');
    title.textContent = memory.title;
    Object.assign(title.style, {
        textAlign: 'center',
        fontFamily: 'var(--font-heading)',
        fontWeight: '400',
        fontSize: '1.5rem',
        color: 'var(--color-text-main)',
        marginBottom: '2rem'
    });
    container.appendChild(title);

    // Main image
    const mainImage = document.createElement('img');
    mainImage.src = memory.photos[startIndex];
    Object.assign(mainImage.style, {
        display: 'block',
        maxWidth: '100%',
        maxHeight: '500px',
        margin: '0 auto',
        transition: 'opacity 0.4s ease'
    });
    container.appendChild(mainImage);

    // Navigation
    const nav = document.createElement('div');
    Object.assign(nav.style, {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '3rem',
        marginTop: '2rem'
    });

    let currentIdx = startIndex;

    const createNavBtn = (text) => {
        const btn = document.createElement('button');
        btn.textContent = text;
        Object.assign(btn.style, {
            background: 'transparent',
            color: 'var(--color-primary)',
            border: '1px solid var(--color-primary)',
            padding: '0.6rem 1.5rem',
            fontSize: '0.75rem',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.3s'
        });
        btn.addEventListener('mouseenter', () => {
            btn.style.background = 'var(--color-primary)';
            btn.style.color = 'var(--color-bg)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.background = 'transparent';
            btn.style.color = 'var(--color-primary)';
        });
        return btn;
    };

    const prevBtn = createNavBtn('← Prev');
    const nextBtn = createNavBtn('Next →');
    const indicator = document.createElement('span');
    indicator.style.color = 'var(--color-text-muted)';
    indicator.style.letterSpacing = '2px';

    const updateSlide = () => {
        mainImage.style.opacity = '0.3';
        setTimeout(() => {
            mainImage.src = memory.photos[currentIdx];
            mainImage.style.opacity = '1';
        }, 200);
        indicator.textContent = `${currentIdx + 1} / ${memory.photos.length}`;
    };

    prevBtn.addEventListener('click', () => {
        currentIdx = (currentIdx - 1 + memory.photos.length) % memory.photos.length;
        updateSlide();
    });

    nextBtn.addEventListener('click', () => {
        currentIdx = (currentIdx + 1) % memory.photos.length;
        updateSlide();
    });

    updateSlide();
    nav.append(prevBtn, indicator, nextBtn);
    container.appendChild(nav);

    container.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
// Scroll reveal is now handled globally by app.js initGlobalScrollReveal()


