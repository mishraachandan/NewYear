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
        justifyContent: 'flex-start',
        alignItems: 'center',
        textAlign: 'center',
        background: 'transparent',
        position: 'relative',
        overflow: 'hidden',
        padding: 'clamp(5.5rem, 12vh, 9rem) 2rem 2rem 2rem',
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

    // Content wrapper — sits in the upper third so text stays above the
    // black-hole disk glare and remains readable against the cosmic scene.
    const content = document.createElement('div');
    Object.assign(content.style, {
        position: 'relative',
        zIndex: '4',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: '760px',
        margin: '0 auto'
    });

    // Small greeting label
    const greeting = document.createElement('p');
    greeting.className = 'animate-fade-in hero-greeting';
    greeting.textContent = safe(hero.greeting);
    Object.assign(greeting.style, {
        fontSize: '0.9rem',
        color: 'var(--color-primary)',
        marginBottom: '1.5rem',
        letterSpacing: '6px',
        textTransform: 'uppercase',
        fontWeight: '400',
        textShadow: '0 2px 18px rgba(0,0,0,0.75)',
        opacity: '0',
        animation: 'luxuryFadeIn 1.5s ease forwards'
    });

    // Year - Elegant serif
    const year = document.createElement('h1');
    year.textContent = safe(hero.year);
    Object.assign(year.style, {
        fontSize: 'clamp(4.2rem, 13vw, 8rem)',
        fontFamily: 'var(--font-heading)',
        fontWeight: '400',
        color: 'var(--color-text-main)',
        marginBottom: '1.25rem',
        lineHeight: '1',
        letterSpacing: '0.05em',
        textShadow: '0 4px 40px rgba(0,0,0,0.8), 0 0 80px rgba(0,0,0,0.6)',
        opacity: '0',
        animation: 'luxuryFadeIn 1.5s ease 0.3s forwards'
    });

    // Decorative line
    const decorLine = document.createElement('div');
    Object.assign(decorLine.style, {
        width: '80px',
        height: '1px',
        background: 'var(--color-primary)',
        margin: '0 auto 1.5rem auto',
        opacity: '0',
        animation: 'luxuryFadeIn 1.5s ease 0.5s forwards'
    });

    // Name — supports multi-line input (\n in customize.html textarea).
    // Each line is rendered in its own span so cursive layout is preserved.
    const name = document.createElement('h2');
    name.className = 'hero-name';
    Object.assign(name.style, {
        fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
        fontFamily: 'var(--font-heading)',
        fontWeight: '400',
        fontStyle: 'italic',
        color: '#dcdcdc',
        marginBottom: '1rem',
        textShadow: '0 2px 20px rgba(0,0,0,0.8)',
        opacity: '0',
        animation: 'luxuryFadeIn 1.5s ease 0.6s forwards',
        whiteSpace: 'pre-line',
        lineHeight: '1.35'
    });

    const nameRaw = safe(hero.name);
    if (/\n/.test(nameRaw)) {
        // Multi-line: show verbatim so the author controls the wording
        // (e.g. "To the,\nMy Friend").
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

    // Message — also supports multi-line authoring via newlines.
    const message = document.createElement('p');
    message.className = 'hero-message';
    message.textContent = safe(hero.message);
    Object.assign(message.style, {
        maxWidth: '520px',
        fontSize: '1rem',
        fontFamily: 'var(--font-body)',
        margin: '0 auto 2.25rem auto',
        lineHeight: '1.8',
        color: '#cfcfcf',
        textShadow: '0 2px 18px rgba(0,0,0,0.85)',
        opacity: '0',
        animation: 'luxuryFadeIn 1.5s ease 0.8s forwards',
        whiteSpace: 'pre-line'
    });

    // CTA Button — lives in its own lower band so it sits just above the
    // "Scroll" cue rather than being flush with the message copy. Blink
    // loop (".hero-cta" in main.css) is only applied after the fade-in
    // finishes so the first reveal doesn't feel jittery.
    const btn = document.createElement('button');
    btn.className = 'hero-cta';
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
        transition: 'color 0.4s ease, background 0.4s ease, box-shadow 0.4s ease',
        opacity: '0',
        animation: 'luxuryFadeIn 1.5s ease 1s forwards'
    });
    btn.addEventListener('animationend', function onReveal(e) {
        if (e.animationName === 'luxuryFadeIn') {
            // Clear the inline fade-in animation so the CSS class's
            // `.hero-cta.is-blinking { animation: heroCtaBlink ... }`
            // rule can take effect — inline styles would otherwise win.
            btn.style.animation = '';
            btn.style.opacity = '1';
            btn.classList.add('is-blinking');
            btn.removeEventListener('animationend', onReveal);
        }
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
        // Attempt to un-mute / play the background score on the first
        // explicit user gesture — mobile + desktop browsers require
        // interaction before audio with sound can start.
        if (section._audio && typeof section._audio.unlock === 'function') {
            section._audio.unlock();
        }
        if (typeof onStartCallback === 'function') onStartCallback();
    };

    // CTA is lifted out of the content flex column and pinned near the
    // bottom of the hero, just above the scroll cue. This matches the
    // user's request to move "Discover Your Gift" down.
    const ctaBand = document.createElement('div');
    Object.assign(ctaBand.style, {
        position: 'absolute',
        bottom: '120px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: '4'
    });
    ctaBand.appendChild(btn);

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

    content.append(greeting, year, decorLine, name, message);
    section.appendChild(content);
    section.appendChild(ctaBand);
    section.appendChild(scrollHint);

    // Background score (optional). Plays only while the hero is on-screen.
    const audioUrl = safe(hero.audioUrl).trim();
    if (audioUrl && typeof window.HeroAudio === 'function') {
        const audio = window.HeroAudio({
            src: audioUrl,
            volume: typeof hero.audioVolume === 'number' ? hero.audioVolume : 0.55,
            hero: section
        });
        if (audio) {
            section._audio = audio;
            section.appendChild(audio.toggleButton);
        }
    }

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
