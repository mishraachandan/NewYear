// Imports removed for file:// compatibility
// Dependencies are loaded globally via index.html

class App {
    constructor() {
        this.appElement = document.getElementById('app');
        this.loadingScreen = document.getElementById('loading-screen');
        this.parallax = {
            enabled: false,
            starsCurrent: 0,
            starsTarget: 0,
            heroCurrent: 0,
            heroTarget: 0,
            rafId: 0
        };
        this.state = {
            currentView: 'hero' // hero, gallery, chronograph, notes
        };

        // Load customized data from localStorage or use defaults
        this.data = this.loadCustomData();

        // Initialize Background
        this.bg = Stars();
        document.body.appendChild(this.bg);

        this.init();
    }

    loadCustomData() {
        const defaults = (typeof DATA !== 'undefined' && DATA) || {};
        const saved = localStorage.getItem('newYearWishData');
        if (!saved) return defaults;

        try {
            const c = JSON.parse(saved);
            // Deep-merge with defaults so older saves still get new fields.
            return {
                site:        { ...(defaults.site || {}),        ...(c.site || {}) },
                chapters:    { ...(defaults.chapters || {}),    ...(c.chapters || {}) },
                hero:        { ...(defaults.hero || {}),        ...(c.hero || {}) },
                galleryTitle: c.galleryTitle || defaults.galleryTitle || 'Our Memories',
                gallery:      Array.isArray(c.gallery) ? c.gallery : (defaults.gallery || []),
                chronograph: { ...(defaults.chronograph || {}), ...(c.chronograph || {}) },
                notesTitle:   c.notesTitle || defaults.notesTitle || 'Letters for You',
                notes:        Array.isArray(c.notes) ? c.notes : (defaults.notes || []),
                gifts:        c.gifts || defaults.gifts,
                game:         c.game || defaults.game
            };
        } catch (e) {
            console.warn('Failed to load custom data, using defaults');
            return defaults;
        }
    }

    async init() {
        setTimeout(() => {
            this.loadingScreen.remove();
            this.render();
            this.initParallax();
        }, 1200);
    }

    decorateReveal(node, delay, variantClass) {
        if (!node) return;
        node.classList.add('reveal-on-scroll');
        if (variantClass) node.classList.add(variantClass);
        node.style.transitionDelay = `${delay}ms`;
    }

    // Build the <header> chapter marker shown above every editorial section.
    chapterHeader(meta, title, revealDelay) {
        const header = document.createElement('header');
        header.className = 'chapter-header';
        this.decorateReveal(header, revealDelay, 'reveal-on-scroll--chapter');

        const marker = document.createElement('div');
        marker.className = 'chapter-marker';
        marker.textContent = (meta && meta.marker) || '';
        header.appendChild(marker);

        const rule = document.createElement('div');
        rule.className = 'chapter-rule';
        header.appendChild(rule);

        if (title) {
            const h = document.createElement('h2');
            h.className = 'chapter-title';
            h.textContent = title;
            header.appendChild(h);
        }
        if (meta && meta.subtitle) {
            const sub = document.createElement('p');
            sub.className = 'chapter-subtitle';
            sub.textContent = meta.subtitle;
            header.appendChild(sub);
        }
        return header;
    }

    // Wrap an existing section node with an anchored id + chapter header above it.
    wrapChapter(anchorId, meta, title, bodyNode, order) {
        const baseDelay = 40 + order * 80;
        const wrap = document.createElement('section');
        wrap.id = anchorId;
        wrap.className = 'chapter-wrap';
        wrap.appendChild(this.chapterHeader(meta, title, baseDelay));
        if (bodyNode) {
            this.decorateReveal(bodyNode, baseDelay + 120, 'reveal-on-scroll--section');
            wrap.appendChild(bodyNode);
        }

        const rule = document.createElement('hr');
        rule.className = 'editorial-rule';
        this.decorateReveal(rule, baseDelay + 260, 'reveal-on-scroll--divider');
        wrap.appendChild(rule);
        return wrap;
    }

    render() {
        this.appElement.innerHTML = '';

        // Slim top navigation (AP-inspired).
        if (typeof window.Nav === 'function') {
            const nav = window.Nav(this.data.site || {}, this.data.hero || {});
            this.appElement.appendChild(nav);
        }

        // Hero
        const heroSection = Hero(this.data.hero, () => this.scrollToContent());
        this.appElement.appendChild(heroSection);

        // Editorial content sections
        this.contentWrapper = document.createElement('div');
        this.contentWrapper.id = 'main-content';
        this.contentWrapper.className = 'hidden animate-fade-in';

        const chapters = (this.data.chapters || {});

        // Chapter I - Memories (Gallery)
        const galleryNode = Gallery(this.data.gallery, this.data.galleryTitle);
        this.contentWrapper.appendChild(
            this.wrapChapter('gallery', chapters.gallery, this.data.galleryTitle, galleryNode, 0)
        );

        // Chapter II - Chronograph (replaces the old Memory Match game)
        if (typeof window.Chronograph === 'function') {
            const chronoNode = window.Chronograph(this.data.chronograph || {});
            this.contentWrapper.appendChild(
                this.wrapChapter('chronograph', chapters.chronograph, 'The Chronograph', chronoNode, 1)
            );
        }

        // Chapter III - Letters (Notes)
        const notesNode = Notes(this.data.notes, this.data.notesTitle);
        this.contentWrapper.appendChild(
            this.wrapChapter('notes', chapters.notes, this.data.notesTitle, notesNode, 2)
        );

        // Site footer
        const footer = document.createElement('footer');
        footer.className = 'site-footer';
        const footerRule = document.createElement('span');
        footerRule.className = 'site-footer-rule';
        footer.appendChild(footerRule);
        const footerText = document.createElement('p');
        footerText.textContent = (this.data.site && this.data.site.footer) || '';
        footer.appendChild(footerText);
        this.contentWrapper.appendChild(footer);

        this.appElement.appendChild(this.contentWrapper);
    }

    scrollToContent() {
        const content = document.getElementById('main-content');

        const revealElements = document.querySelectorAll('.reveal-on-scroll');
        revealElements.forEach(el => el.classList.remove('revealed'));

        content.classList.remove('hidden');

        setTimeout(() => {
            content.classList.add('content-visible');
            content.scrollIntoView({ behavior: 'smooth' });

            setTimeout(() => {
                this.initGlobalScrollReveal();
            }, 1000);
        }, 100);
    }

    initGlobalScrollReveal() {
        const revealElements = document.querySelectorAll('.reveal-on-scroll:not(.revealed)');
        const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -100px 0px' };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        revealElements.forEach(el => observer.observe(el));
    }

    initParallax() {
        if (this.parallax.enabled) return;
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        this.parallax.enabled = true;

        const root = document.documentElement;
        const tick = () => {
            this.parallax.starsCurrent += (this.parallax.starsTarget - this.parallax.starsCurrent) * 0.1;
            this.parallax.heroCurrent += (this.parallax.heroTarget - this.parallax.heroCurrent) * 0.12;

            root.style.setProperty('--stars-parallax-y', `${this.parallax.starsCurrent.toFixed(2)}px`);
            root.style.setProperty('--hero-parallax-y', `${this.parallax.heroCurrent.toFixed(2)}px`);

            const starsDelta = Math.abs(this.parallax.starsTarget - this.parallax.starsCurrent);
            const heroDelta = Math.abs(this.parallax.heroTarget - this.parallax.heroCurrent);
            if (starsDelta > 0.12 || heroDelta > 0.12) {
                this.parallax.rafId = requestAnimationFrame(tick);
                return;
            }

            this.parallax.starsCurrent = this.parallax.starsTarget;
            this.parallax.heroCurrent = this.parallax.heroTarget;
            root.style.setProperty('--stars-parallax-y', `${this.parallax.starsCurrent.toFixed(2)}px`);
            root.style.setProperty('--hero-parallax-y', `${this.parallax.heroCurrent.toFixed(2)}px`);
            this.parallax.rafId = 0;
        };

        const updateTargets = () => {
            this.parallax.starsTarget = window.scrollY * -0.02;

            const hero = document.getElementById('hero');
            if (hero) {
                const rect = hero.getBoundingClientRect();
                const progress = Math.min(Math.max((-rect.top) / Math.max(rect.height, 1), 0), 1.25);
                this.parallax.heroTarget = progress * -42;
            } else {
                this.parallax.heroTarget = 0;
            }

            if (!this.parallax.rafId) {
                this.parallax.rafId = requestAnimationFrame(tick);
            }
        };

        window.addEventListener('scroll', updateTargets, { passive: true });
        window.addEventListener('resize', updateTargets);
        updateTargets();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new App();
});
