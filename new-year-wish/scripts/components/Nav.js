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
window.Nav = function Nav(siteData, heroData) {
    const data = siteData && typeof siteData === 'object' ? siteData : {};
    const hero = heroData && typeof heroData === 'object' ? heroData : {};
    const safe = (v) => (v == null ? '' : String(v));
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

    // Chapter labels are intentionally NOT rendered in the top bar — the user
    // preferred the editorial layout to rely on scrolling + chapter markers
    // for wayfinding rather than a chatty top nav. The `navItems` data is kept
    // on the site config (customize.html) for potential future use.
    void navItems;

    const actions = document.createElement('div');
    actions.className = 'nav-actions';

    // Customize link
    const customize = document.createElement('a');
    customize.className = 'nav-customize';
    customize.href = 'customize.html';
    customize.textContent = 'Customize';

    const nameRaw = safe(hero.name).trim();
    const messageRaw = safe(hero.message).trim();
    if (nameRaw || messageRaw) {
        const note = document.createElement('div');
        note.className = 'hero-floating-note';

        if (nameRaw) {
            const name = document.createElement('h2');
            name.className = 'hero-name';

            if (/\n/.test(nameRaw)) {
                const nameHighlight = document.createElement('span');
                nameHighlight.textContent = nameRaw;
                Object.assign(nameHighlight.style, {
                    color: 'var(--color-primary)',
                    fontStyle: 'normal'
                });
                name.appendChild(nameHighlight);
            } else {
                const nameHighlight = document.createElement('span');
                nameHighlight.textContent = nameRaw;
                Object.assign(nameHighlight.style, {
                    color: 'var(--color-primary)',
                    fontStyle: 'normal'
                });
                name.appendChild(document.createTextNode('For '));
                name.appendChild(nameHighlight);
            }

            note.appendChild(name);
        }

        if (messageRaw) {
            const message = document.createElement('p');
            message.className = 'hero-message';
            message.textContent = messageRaw;
            note.appendChild(message);
        }

        actions.append(customize, note);
    } else {
        actions.appendChild(customize);
    }

    nav.appendChild(brand);
    nav.appendChild(actions);

    function onScroll() {
        if (window.scrollY > 40) nav.classList.add('is-scrolled');
        else nav.classList.remove('is-scrolled');
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    return nav;
};
