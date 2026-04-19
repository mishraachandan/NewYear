/**
 * Nav.js - Slim editorial top navigation (Audemars Piguet-inspired).
 *
 * Renders a fixed, semi-transparent top bar with:
 *   - The "Maison" / site brand title
 *   - Chapter links that smooth-scroll to anchored sections
 *   - A "Customize" link to customize.html so every piece of copy is editable
 *
 * A scroll listener adds a `.is-scrolled` class once the user has moved past
 * the hero, which the CSS can use for a denser background if desired.
 */
window.Nav = function Nav(siteData) {
    const data = siteData && typeof siteData === 'object' ? siteData : {};
    const title = typeof data.title === 'string' && data.title.trim() ? data.title : 'Maison 2026';
    const navItems = Array.isArray(data.nav) ? data.nav : [];

    const nav = document.createElement('nav');
    nav.className = 'site-nav';

    // Brand
    const brand = document.createElement('a');
    brand.className = 'nav-brand';
    brand.href = '#hero';
    // Split first word as accent so the color shift feels editorial.
    const parts = title.split(' ');
    if (parts.length > 1) {
        const first = parts.shift();
        brand.textContent = first + ' ';
        const accent = document.createElement('span');
        accent.className = 'brand-accent';
        accent.textContent = parts.join(' ');
        brand.appendChild(accent);
    } else {
        brand.textContent = title;
    }

    // Links
    const links = document.createElement('div');
    links.className = 'nav-links';
    navItems.forEach(function (item) {
        if (!item || !item.label) return;
        const a = document.createElement('a');
        a.textContent = String(item.label);
        const target = item.target ? String(item.target) : '';
        a.href = target ? '#' + target : '#';
        a.addEventListener('click', function (e) {
            if (!target) return;
            const el = document.getElementById(target);
            if (el) {
                e.preventDefault();
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
        links.appendChild(a);
    });

    // Customize link
    const customize = document.createElement('a');
    customize.className = 'nav-customize';
    customize.href = 'customize.html';
    customize.textContent = 'Customize';

    nav.appendChild(brand);
    nav.appendChild(links);
    nav.appendChild(customize);

    // Scrollspy-ish: mark the nearest section active.
    function onScroll() {
        if (window.scrollY > 40) nav.classList.add('is-scrolled');
        else nav.classList.remove('is-scrolled');

        const anchors = links.querySelectorAll('a');
        let best = null;
        let bestDist = Infinity;
        anchors.forEach(function (a) {
            const id = (a.getAttribute('href') || '').replace('#', '');
            if (!id) return;
            const el = document.getElementById(id);
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const dist = Math.abs(rect.top - 80);
            if (rect.top < window.innerHeight * 0.4 && dist < bestDist) {
                bestDist = dist;
                best = a;
            }
        });
        anchors.forEach(function (a) { a.classList.remove('is-active'); });
        if (best) best.classList.add('is-active');
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    return nav;
};
