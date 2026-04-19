// Imports removed for file:// compatibility
// Dependencies are loaded globally via index.html

class App {
    constructor() {
        this.appElement = document.getElementById('app');
        this.loadingScreen = document.getElementById('loading-screen');
        this.state = {
            currentView: 'hero' // hero, gallery, game, notes
        };

        // Load customized data from localStorage or use defaults
        this.data = this.loadCustomData();

        // Initialize Background
        this.bg = Stars();
        document.body.appendChild(this.bg);

        this.init();
    }

    loadCustomData() {
        const saved = localStorage.getItem('newYearWishData');
        if (saved) {
            try {
                const customData = JSON.parse(saved);
                // Merge with defaults to ensure all fields exist
                return {
                    hero: { ...DATA.hero, ...customData.hero },
                    gallery: customData.gallery || DATA.gallery,
                    galleryTitle: customData.galleryTitle || 'Our Memories',
                    game: DATA.game, // Game data stays default
                    notes: customData.notes || DATA.notes,
                    notesTitle: customData.notesTitle || 'Special Notes for You',
                    gifts: DATA.gifts
                };
            } catch (e) {
                console.warn('Failed to load custom data, using defaults');
                return DATA;
            }
        }
        return DATA;
    }

    async init() {
        // Simulate loading for effect
        setTimeout(() => {
            this.loadingScreen.remove(); // Completely remove from DOM
            this.render();
        }, 1500);
    }

    render() {
        // Clear current content
        this.appElement.innerHTML = '';


        const container = document.createElement('main');
        container.className = 'container';

        // Render Hero with custom data
        const heroSection = Hero(this.data.hero, () => this.scrollToContent());
        this.appElement.appendChild(heroSection);

        // Render Content Sections (Gallery, Game, Notes)
        // These will be revealed after the hero interaction
        this.contentWrapper = document.createElement('div');
        this.contentWrapper.id = 'main-content';
        this.contentWrapper.className = 'hidden animate-fade-in';

        // Gallery with custom data
        this.contentWrapper.appendChild(Gallery(this.data.gallery, this.data.galleryTitle));

        // Game (uses default data)
        this.contentWrapper.appendChild(Game(this.data.game));

        // Notes with custom data
        this.contentWrapper.appendChild(Notes(this.data.notes, this.data.notesTitle));

        // Footer/Credits removed

        this.appElement.appendChild(this.contentWrapper);
    }

    scrollToContent() {
        const content = document.getElementById('main-content');

        // 1. Prepare reveals - set initial state
        const revealElements = document.querySelectorAll('.reveal-on-scroll');
        revealElements.forEach(el => el.classList.remove('revealed'));

        // 2. Remove display:none
        content.classList.remove('hidden');

        // 3. Small delay then fade in container and scroll
        setTimeout(() => {
            content.classList.add('content-visible');
            content.scrollIntoView({ behavior: 'smooth' });

            // 4. Initialize observer AFTER the scroll landing is nearly finished
            // This prevents the elements we land on from revealing immediately
            setTimeout(() => {
                this.initGlobalScrollReveal();
            }, 1000);
        }, 100);
    }

    initGlobalScrollReveal() {
        const revealElements = document.querySelectorAll('.reveal-on-scroll:not(.revealed)');

        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Dramatic reveal with staggered timing handled by CSS transitionDelay
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        revealElements.forEach(el => observer.observe(el));
    }
}


// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    new App();
});  