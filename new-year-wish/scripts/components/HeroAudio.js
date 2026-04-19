/**
 * HeroAudio.js
 *
 * Attaches a looping background track to the hero section. The track
 * plays only while the hero is intersecting the viewport; as soon as
 * the visitor scrolls the hero out, the audio pauses and resumes when
 * they scroll back. Browsers block unmuted autoplay, so the audio
 * starts muted and a small sound toggle (bottom-right of the hero)
 * lets the visitor un-mute; clicking the CTA also un-mutes.
 *
 * Usage:
 *     const audio = window.HeroAudio({ src: 'assets/theme.mp3',
 *                                      volume: 0.55,
 *                                      hero: sectionElement });
 *     section.appendChild(audio.toggleButton);
 */
window.HeroAudio = function (opts) {
    opts = opts || {};
    const src = String(opts.src || '').trim();
    if (!src) return null;

    const audio = document.createElement('audio');
    audio.src = src;
    audio.loop = true;
    audio.preload = 'auto';
    audio.muted = true; // required for autoplay on most browsers
    // Use an explicit null/NaN check so the caller can legitimately pass 0
    // to mute. `Number(opts.volume) || 0.55` would treat 0 as falsy.
    const requestedVol = (opts.volume != null && !isNaN(Number(opts.volume)))
        ? Number(opts.volume)
        : 0.55;
    audio.volume = Math.max(0, Math.min(1, requestedVol));
    audio.crossOrigin = 'anonymous';
    audio.className = 'hero-audio-el';

    // Toggle button — shows the current mute state.
    const toggleButton = document.createElement('button');
    toggleButton.type = 'button';
    toggleButton.className = 'hero-audio-toggle is-muted';
    toggleButton.setAttribute('aria-label', 'Toggle background music');
    toggleButton.innerHTML = iconMuted();

    let userPaused = false;
    let heroVisible = true;
    let unlocked = false;

    function updateIcon() {
        toggleButton.classList.toggle('is-muted', audio.muted);
        toggleButton.innerHTML = audio.muted ? iconMuted() : iconSound();
    }

    function tryPlay() {
        if (userPaused || !heroVisible) return;
        const p = audio.play();
        if (p && typeof p.catch === 'function') {
            p.catch(() => {/* autoplay blocked; wait for gesture */});
        }
    }

    function unlock() {
        if (unlocked) return;
        unlocked = true;
        audio.muted = false;
        updateIcon();
        tryPlay();
    }

    toggleButton.addEventListener('click', () => {
        if (!unlocked) {
            unlock();
            userPaused = false;
            tryPlay();
            return;
        }
        if (audio.muted) {
            audio.muted = false;
            userPaused = false;
            tryPlay();
        } else {
            audio.muted = true;
            userPaused = true;
            audio.pause();
        }
        updateIcon();
    });

    // Pause / resume as the hero enters / leaves the viewport.
    if (opts.hero && 'IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                heroVisible = entry.isIntersecting && entry.intersectionRatio > 0.15;
                if (heroVisible) {
                    tryPlay();
                } else {
                    audio.pause();
                }
            });
        }, { threshold: [0, 0.15, 0.5, 1] });
        io.observe(opts.hero);
    }

    // Attach the audio element to the hero section so it lives in the DOM.
    (opts.hero || document.body).appendChild(audio);

    // Kick off a muted autoplay attempt on load.
    audio.addEventListener('loadeddata', tryPlay, { once: true });

    // If the audio file can't be loaded (missing file, wrong URL, CORS),
    // quietly hide the toggle instead of leaving a broken control on the
    // hero. No console spam — the user may simply not have set an audioUrl.
    audio.addEventListener('error', () => {
        toggleButton.style.display = 'none';
    }, { once: true });

    function iconMuted() {
        return (
            '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">' +
                '<path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/>' +
                '<path d="M16 8l5 8M21 8l-5 8" stroke="currentColor" stroke-width="2" ' +
                'stroke-linecap="round" fill="none"/>' +
            '</svg>'
        );
    }
    function iconSound() {
        return (
            '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">' +
                '<path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/>' +
                '<path d="M16 8a5 5 0 010 8M19 5a9 9 0 010 14" stroke="currentColor" ' +
                'stroke-width="2" stroke-linecap="round" fill="none"/>' +
            '</svg>'
        );
    }

    return { element: audio, toggleButton, unlock, play: tryPlay };
};
