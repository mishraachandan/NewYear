/**
 * Hero.js - Luxury Landing Page (Audemars Piguet inspired)
 * Features:
 * - Elegant minimalist design
 * - Gold accents on dark background
 * - Subtle animations
 * - Premium typography
 */

window.Hero = function (data, onStartCallback) {
    const hero = data && typeof data === 'object' ? data : {};
    const safe = (v) => (v == null ? '' : String(v));
    const bgUrl = safe(hero.backgroundImage).trim();

    const section = document.createElement('section');
    section.className = 'hero-section';
    section.id = 'hero';
    Object.assign(section.style, {
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        background: 'transparent',
        position: 'relative',
        overflow: 'hidden',
        padding: '2rem',
        isolation: 'isolate'
    });

    // Cinematic animated black hole background (Interstellar-inspired).
    // Rendered live via WebGL behind all hero content. Skipped when a user
    // supplies a custom backgroundImage via Customize (their choice wins).
    if (!bgUrl && typeof window.BlackHole === 'function') {
        const bh = window.BlackHole();
        if (bh && bh.element) {
            section.appendChild(bh.element);
            section._blackHole = bh;
        }

        const bhVeil = document.createElement('div');
        bhVeil.className = 'hero-bh-veil';
        section.appendChild(bhVeil);
    } else if (bgUrl) {
        const bgLayer = document.createElement('div');
        bgLayer.className = 'hero-bg';
        bgLayer.style.backgroundImage = `url(${JSON.stringify(bgUrl)})`;
        const veil = document.createElement('div');
        veil.className = 'hero-bg-veil';
        section.appendChild(bgLayer);
        section.appendChild(veil);
    }

    // Subtle gold line decoration at top
    const topLine = document.createElement('div');
    Object.assign(topLine.style, {
        position: 'absolute',
        top: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '60px',
        height: '1px',
        background: 'var(--gradient-gold)',
        opacity: '0.6',
        zIndex: '2'
    });
    section.appendChild(topLine);

    // Content wrapper
    const content = document.createElement('div');
    content.style.position = 'relative';
    content.style.zIndex = '2';

    // Small greeting label
    const greeting = document.createElement('p');
    greeting.className = 'animate-fade-in';
    greeting.textContent = safe(hero.greeting);
    Object.assign(greeting.style, {
        fontSize: '0.9rem',
        color: 'var(--color-primary)',
        marginBottom: '2rem',
        letterSpacing: '6px',
        textTransform: 'uppercase',
        fontWeight: '400',
        opacity: '0',
        animation: 'luxuryFadeIn 1.5s ease forwards'
    });

    // Year - Elegant serif
    const year = document.createElement('h1');
    year.textContent = safe(hero.year);
    Object.assign(year.style, {
        fontSize: 'clamp(5rem, 18vw, 10rem)',
        fontFamily: 'var(--font-heading)',
        fontWeight: '400',
        color: 'var(--color-text-main)',
        marginBottom: '1.5rem',
        lineHeight: '1',
        letterSpacing: '0.05em',
        opacity: '0',
        animation: 'luxuryFadeIn 1.5s ease 0.3s forwards'
    });

    // Decorative line
    const decorLine = document.createElement('div');
    Object.assign(decorLine.style, {
        width: '80px',
        height: '1px',
        background: 'var(--color-primary)',
        margin: '0 auto 2rem auto',
        opacity: '0',
        animation: 'luxuryFadeIn 1.5s ease 0.5s forwards'
    });

    // Name
    const name = document.createElement('h2');
    Object.assign(name.style, {
        fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
        fontFamily: 'var(--font-heading)',
        fontWeight: '400',
        fontStyle: 'italic',
        color: 'var(--color-text-muted)',
        marginBottom: '1rem',
        opacity: '0',
        animation: 'luxuryFadeIn 1.5s ease 0.6s forwards'
    });

    const nameHighlight = document.createElement('span');
    nameHighlight.textContent = safe(hero.name);
    Object.assign(nameHighlight.style, {
        color: 'var(--color-primary)',
        fontStyle: 'normal'
    });
    name.innerHTML = 'For ';
    name.appendChild(nameHighlight);

    // Message
    const message = document.createElement('p');
    message.textContent = safe(hero.message);
    Object.assign(message.style, {
        maxWidth: '500px',
        fontSize: '1rem',
        fontFamily: 'var(--font-body)',
        margin: '0 auto 3rem auto',
        lineHeight: '1.8',
        color: 'var(--color-text-muted)',
        opacity: '0',
        animation: 'luxuryFadeIn 1.5s ease 0.8s forwards'
    });

    // CTA Button - Elegant minimal
    const btn = document.createElement('button');
    btn.textContent = safe(hero.cta) || 'Discover Your Gift';
    Object.assign(btn.style, {
        padding: '1rem 3rem',
        fontSize: '0.85rem',
        fontFamily: 'var(--font-body)',
        background: 'transparent',
        color: 'var(--color-primary)',
        fontWeight: '500',
        letterSpacing: '3px',
        textTransform: 'uppercase',
        borderRadius: '0',
        border: '1px solid var(--color-primary)',
        cursor: 'pointer',
        transition: 'all 0.4s ease',
        opacity: '0',
        animation: 'luxuryFadeIn 1.5s ease 1s forwards'
    });

    btn.onmouseenter = () => {
        btn.style.background = 'var(--color-primary)';
        btn.style.color = 'var(--color-bg)';
    };
    btn.onmouseleave = () => {
        btn.style.background = 'transparent';
        btn.style.color = 'var(--color-primary)';
    };

    btn.onclick = () => {
        if (typeof onStartCallback === 'function') onStartCallback();
    };

    // Scroll hint
    const scrollHint = document.createElement('div');
    Object.assign(scrollHint.style, {
        position: 'absolute',
        bottom: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        opacity: '0',
        animation: 'luxuryFadeIn 1.5s ease 1.2s forwards',
        zIndex: '2'
    });

    const scrollText = document.createElement('span');
    scrollText.textContent = 'Scroll';
    Object.assign(scrollText.style, {
        fontSize: '0.7rem',
        color: 'var(--color-text-muted)',
        letterSpacing: '3px',
        textTransform: 'uppercase'
    });

    const scrollLine = document.createElement('div');
    Object.assign(scrollLine.style, {
        width: '1px',
        height: '40px',
        background: 'var(--color-primary)',
        animation: 'scrollPulse 2s ease-in-out infinite'
    });

    scrollHint.appendChild(scrollText);
    scrollHint.appendChild(scrollLine);

    content.append(greeting, year, decorLine, name, message, btn);
    section.appendChild(content);
    section.appendChild(scrollHint);

    // Add luxury animations
    addLuxuryAnimations();

    return section;
};

function addLuxuryAnimations() {
    if (document.getElementById('luxury-animations')) return;

    const style = document.createElement('style');
    style.id = 'luxury-animations';
    style.textContent = `
        @keyframes luxuryFadeIn {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        @keyframes scrollPulse {
            0%, 100% {
                opacity: 0.3;
                transform: scaleY(1);
            }
            50% {
                opacity: 1;
                transform: scaleY(1.2);
            }
        }
        @keyframes revealFromBelow {
            from {
                opacity: 0;
                transform: translateY(60px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}
