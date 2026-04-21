/**
 * Gallery.js - Luxury Memory Gallery
 * Features:
 * - Curated 3-card highlight stage
 * - Scroll-reveal "appear from nothing" effect
 * - Elegant hover states
 * - Minimal luxury design
 */

window.Gallery = function (memorySections, sectionTitle) {
    // eslint-disable-line no-unused-vars -- sectionTitle is rendered by the
    // editorial chapter-header in app.js; kept in the signature for back-compat.
    void sectionTitle;
    const memories = Array.isArray(memorySections) ? memorySections : [];

    const section = document.createElement('section');
    section.className = 'gallery-section';
    Object.assign(section.style, {
        padding: '2rem 2rem 6rem 2rem',
        background: 'var(--color-bg)'
    });

    const highlights = createMemoryHighlights(memories, section);
    if (highlights) {
        section.appendChild(highlights);
    }

    const grid = document.createElement('div');
    grid.className = 'gallery-memory-grid';
    Object.assign(grid.style, {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '3rem',
        maxWidth: '1200px',
        margin: '0 auto'
    });

    memories.forEach((memory, index) => {
        const card = createMemoryCard(memory, index, section);
        grid.appendChild(card);
    });

    section.appendChild(grid);

    const slideshowContainer = document.createElement('div');
    slideshowContainer.id = 'slideshow-container';
    slideshowContainer.style.display = 'none';
    section.appendChild(slideshowContainer);

    return section;
};

function createMemoryHighlights(memories, parentSection) {
    const curated = memories.filter(hasPhotos).slice(0, 3);
    if (!curated.length) return null;

    const wrap = document.createElement('div');
    wrap.className = 'memory-highlights';

    const intro = document.createElement('div');
    intro.className = 'memory-highlights-intro reveal-on-scroll';
    intro.style.transitionDelay = '60ms';

    const eyebrow = document.createElement('p');
    eyebrow.className = 'memory-highlights-eyebrow';
    eyebrow.textContent = 'Curated Frames';

    const title = document.createElement('h3');
    title.className = 'memory-highlights-title';
    title.textContent = 'One featured memory, with two companion moments.';

    const copy = document.createElement('p');
    copy.className = 'memory-highlights-copy';
    copy.textContent = 'A small editorial spread from your gallery, designed to spotlight the chapter before the full archive unfolds.';

    intro.append(eyebrow, title, copy);
    wrap.appendChild(intro);

    const stage = document.createElement('div');
    stage.className = 'memory-highlights-stage';

    stage.appendChild(createHighlightCard(curated[0], 0, parentSection, true));

    if (curated.length > 1) {
        const rail = document.createElement('div');
        rail.className = 'memory-highlights-rail';

        curated.slice(1).forEach((memory, index) => {
            rail.appendChild(createHighlightCard(memory, index + 1, parentSection, false));
        });

        stage.appendChild(rail);
    }

    wrap.appendChild(stage);
    return wrap;
}

function createHighlightCard(memory, index, parentSection, isFeatured) {
    const card = document.createElement('article');
    card.className = 'memory-highlight-card reveal-on-scroll';
    if (isFeatured) card.classList.add('memory-highlight-card--featured');
    else card.classList.add('memory-highlight-card--secondary');
    card.style.transitionDelay = `${150 + index * 120}ms`;

    const image = document.createElement('img');
    image.className = 'memory-highlight-image';
    image.src = memory.photos[0];
    image.alt = `${memory.title} highlight`;

    const overlay = document.createElement('div');
    overlay.className = 'memory-highlight-overlay';

    const topRow = document.createElement('div');
    topRow.className = 'memory-highlight-toprow';

    const kicker = document.createElement('span');
    kicker.className = 'memory-highlight-kicker';
    kicker.textContent = isFeatured ? 'Featured Memory' : 'Companion Frame';

    const indexMark = document.createElement('span');
    indexMark.className = 'memory-highlight-index';
    indexMark.textContent = String(index + 1).padStart(2, '0');

    topRow.append(kicker, indexMark);

    const title = document.createElement('h4');
    title.className = 'memory-highlight-title';
    title.textContent = memory.title;

    const meta = document.createElement('p');
    meta.className = 'memory-highlight-meta';
    meta.textContent = `${memory.photos.length} photographs in this chapter`;

    const action = document.createElement('button');
    action.type = 'button';
    action.className = 'memory-highlight-action';
    action.textContent = isFeatured ? 'Open Featured Memory' : 'Open Memory';
    action.setAttribute('aria-label', `Open ${memory.title}`);
    action.addEventListener('click', (e) => {
        e.stopPropagation();
        openSlideshow(memory, 0, parentSection);
    });

    overlay.append(topRow, title, meta, action);
    card.append(image, overlay);

    card.addEventListener('click', () => openSlideshow(memory, 0, parentSection));

    return card;
}

function createMemoryCard(memory, index, parentSection) {
    const card = document.createElement('div');
    card.className = 'memory-card reveal-on-scroll';
    card.style.transitionDelay = `${index * 200}ms`;

    Object.assign(card.style, {
        background: 'var(--color-surface)',
        overflow: 'hidden',
        cursor: 'pointer'
    });

    const imgContainer = document.createElement('div');
    Object.assign(imgContainer.style, {
        position: 'relative',
        height: '320px',
        overflow: 'hidden'
    });

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

    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'X';
    Object.assign(closeBtn.style, {
        position: 'absolute',
        top: '20px',
        right: '20px',
        background: 'transparent',
        color: 'var(--color-text-muted)',
        border: 'none',
        fontSize: '1.2rem',
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

    const mainImage = document.createElement('img');
    mainImage.src = memory.photos[startIndex];
    mainImage.alt = `${memory.title} full view`;
    Object.assign(mainImage.style, {
        display: 'block',
        maxWidth: '100%',
        maxHeight: '500px',
        margin: '0 auto',
        transition: 'opacity 0.4s ease'
    });
    container.appendChild(mainImage);

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

    const prevBtn = createNavBtn('Prev');
    const nextBtn = createNavBtn('Next');
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

function hasPhotos(memory) {
    return memory && Array.isArray(memory.photos) && memory.photos.length > 0;
}
