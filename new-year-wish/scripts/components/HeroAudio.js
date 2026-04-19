/**
 * HeroAudio.js
 *
 * Attaches a looping background track to the hero section. Browsers
 * block unmuted autoplay, so the audio starts muted and a small sound
 * toggle (bottom-right of the hero) lets the visitor un-mute; clicking
 * the CTA also un-mutes. The caller can optionally pause playback when
 * the hero leaves the viewport.
 *
 * Usage:
 *     const audio = window.HeroAudio({ src: 'assets/theme.mp3',
 *                                      volume: 0.55,
 *                                      pauseWhenHidden: false,
 *                                      hero: sectionElement });
 *     section.appendChild(audio.toggleButton);
 */
window.HeroAudio = function (opts) {
    opts = opts || {};
    const src = String(opts.src || '').trim();
    if (!src) return null;

    // URL-safe escaping for filenames containing spaces (very common when the
    // file is renamed from "My Song.mp3"). Only replaces raw spaces so paths
    // that already contain %20 are left alone.
    const encode = (u) => String(u || '').replace(/ /g, '%20');
    const encodedSrc = encode(src);
    const resolveUrl = (u) => {
        try {
            return new URL(u, window.location.href);
        } catch (_) {
            return null;
        }
    };
    const primaryUrl = resolveUrl(encodedSrc);
    const shouldProbeWithFetch = !!(
        primaryUrl &&
        /^https?:$/.test(primaryUrl.protocol) &&
        typeof window.fetch === 'function'
    );

    // Optional fallback URL used when the primary src errors (e.g. a stale
    // localStorage value points at a file that has been renamed or removed
    // in data.js). Only retried once, and only if it actually differs.
    const fallbackSrc = encode(String(opts.fallbackSrc || '').trim());

    const audio = document.createElement('audio');
    audio.autoplay = true;
    audio.loop = true;
    audio.preload = 'auto';
    audio.playsInline = true;
    audio.muted = true; // required for autoplay on most browsers
    // Use an explicit null/NaN check so the caller can legitimately pass 0
    // to mute. `Number(opts.volume) || 0.55` would treat 0 as falsy.
    const requestedVol = (opts.volume != null && !isNaN(Number(opts.volume)))
        ? Number(opts.volume)
        : 0.55;
    audio.volume = Math.max(0, Math.min(1, requestedVol));
    if (primaryUrl && /^https?:$/.test(primaryUrl.protocol) && primaryUrl.origin !== window.location.origin) {
        audio.crossOrigin = 'anonymous';
    }
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
    const pauseWhenHidden = opts.pauseWhenHidden === true;

    function updateIcon() {
        toggleButton.classList.toggle('is-muted', audio.muted);
        toggleButton.innerHTML = audio.muted ? iconMuted() : iconSound();
    }

    function tryPlay() {
        if (userPaused || (pauseWhenHidden && !heroVisible)) return;
        const p = audio.play();
        if (p && typeof p.catch === 'function') {
            p.catch(() => {/* autoplay blocked; wait for gesture */});
        }
        return p;
    }

    function detachUnlockListeners() {
        document.removeEventListener('pointerdown', handleFirstGesture);
        document.removeEventListener('pointermove', handleFirstGesture);
        document.removeEventListener('mousemove', handleFirstGesture);
        document.removeEventListener('keydown', handleFirstGesture);
        document.removeEventListener('touchstart', handleFirstGesture);
    }

    function unlock() {
        if (unlocked) return Promise.resolve(true);

        audio.muted = false;
        updateIcon();

        if (!audio.paused) {
            unlocked = true;
            detachUnlockListeners();
            return Promise.resolve(true);
        }

        const p = audio.play();
        if (!p || typeof p.then !== 'function') {
            unlocked = true;
            detachUnlockListeners();
            return Promise.resolve(true);
        }

        return p.then(() => {
            unlocked = true;
            detachUnlockListeners();
            return true;
        }).catch(() => {
            // Keep the component retryable on a later, browser-approved gesture.
            audio.muted = true;
            updateIcon();
            return false;
        });
    }

    toggleButton.addEventListener('click', () => {
        if (!unlocked) {
            userPaused = false;
            unlock();
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

    function handleFirstGesture() {
        if (!unlocked && !userPaused) unlock();
    }

    document.addEventListener('pointerdown', handleFirstGesture, { passive: true });
    document.addEventListener('pointermove', handleFirstGesture, { passive: true });
    document.addEventListener('mousemove', handleFirstGesture, { passive: true });
    document.addEventListener('keydown', handleFirstGesture);
    document.addEventListener('touchstart', handleFirstGesture, { passive: true });

    // Pause / resume as the hero enters / leaves the viewport when requested.
    if (pauseWhenHidden && opts.hero && 'IntersectionObserver' in window) {
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

    // --- Broken-URL detection ------------------------------------------------
    // Chromium's <audio> element does NOT fire the `error` event on plain
    // HTTP 404 — the element just stalls forever in NETWORK_LOADING. So we
    // can't rely on `error` alone to swap in the fallback. We run three
    // checks in order:
    //   1. Proactive fetch(HEAD)  — fires immediately for 404/DNS failures.
    //   2. Stall timeout          — backstop for flaky servers that return
    //                               200 but never deliver audio bytes.
    //   3. Native `error` event   — covers codec + CORS failures.
    function setSrcAndLoad(url) {
        audio.src = url;
        audio.load();
    }

    function tryFallback() {
        if (fallbackUsed) return false;
        if (!fallbackSrc || fallbackSrc === encodedSrc) return false;
        fallbackUsed = true;
        setSrcAndLoad(fallbackSrc);
        return true;
    }

    function giveUp() {
        toggleButton.style.display = 'none';
    }

    let fallbackUsed = false;
    // (1) HEAD-probe only for HTTP(S) URLs. `file://` pages and some static
    // hosts reject fetch probes even though the <audio> tag can load the file.
    if (shouldProbeWithFetch) {
        (function probePrimary() {
            const ac = ('AbortController' in window) ? new AbortController() : null;
            const timer = setTimeout(() => ac && ac.abort(), 3000);
            const finalize = (ok) => {
                clearTimeout(timer);
                if (ok) {
                    setSrcAndLoad(encodedSrc);
                } else if (!tryFallback()) {
                    giveUp();
                }
            };
            fetch(encodedSrc, { method: 'HEAD', signal: ac && ac.signal })
                .then((r) => finalize(r.ok))
                .catch(() => finalize(false));
        })();
    } else {
        setSrcAndLoad(encodedSrc);
    }

    // (2) Stall backstop: if nothing loaded within 6s, try fallback.
    const stallTimer = setTimeout(() => {
        if (audio.readyState < 2) {
            if (!tryFallback()) giveUp();
        }
    }, 6000);
    audio.addEventListener('loadeddata', () => clearTimeout(stallTimer), { once: true });

    // (3) Native error handler — codec / CORS failures.
    audio.addEventListener('error', () => {
        if (!tryFallback()) giveUp();
    });

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
