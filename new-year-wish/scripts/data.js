/**
 * data.js - Single source of truth for every piece of copy and content on the site.
 * Every field here is editable from customize.html and persisted in localStorage
 * under the key "newYearWishData".
 */
window.DATA = {
    site: {
        title: "Maison 2026",
        tagline: "A New Year Wish",
        nav: [
            { label: "Prelude",     target: "hero" },
            { label: "Memories",    target: "gallery" },
            { label: "Chronograph", target: "chronograph" },
            { label: "Letters",     target: "notes" }
        ],
        footer: "Crafted as a personal wish. — 2026"
    },
    chapters: {
        hero:        { marker: "Prelude",      subtitle: "An overture for the year to come." },
        gallery:     { marker: "Chapter I",    subtitle: "Moments, gently framed." },
        chronograph: { marker: "Chapter II",   subtitle: "Wind the crown. Time unfolds with a wish." },
        notes:       { marker: "Chapter III",  subtitle: "A few words, sealed." }
    },
    hero: {
        greeting: "Happy New Year",
        year: "2026",
        name: "My Dearest Friend",
        message: "Here's to another year of making memories together.",
        cta: "Discover Your Gift",
        backgroundImage: "",
        // Path (relative to index.html) or full URL to a background track
        // played while the hero is on screen. Leave empty to disable music.
        // Default: Hans Zimmer's "Day One" from the Interstellar soundtrack,
        // bundled at assets/interstellar-day-one.mp3.
        audioUrl: "assets/Intersteller Music.mp3",
        audioVolume: 1.0
    },
    // Gallery has memory sections, each with multiple photos.
    galleryTitle: "Our Memories",
    gallery: [
        {
            id: 1,
            title: "Adventure Time",
            photos: [
                "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=1000",
                "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=1000",
                "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1000",
                "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1000",
                "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=1000",
                "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&q=80&w=1000"
            ]
        },
        {
            id: 2,
            title: "Celebrations",
            photos: [
                "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?auto=format&fit=crop&q=80&w=1000",
                "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1000",
                "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=1000",
                "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=1000",
                "https://images.unsplash.com/photo-1496337589254-7e19d01cec44?auto=format&fit=crop&q=80&w=1000",
                "https://images.unsplash.com/photo-1464047736614-af63643285bf?auto=format&fit=crop&q=80&w=1000"
            ]
        },
        {
            id: 3,
            title: "Good Times",
            photos: [
                "https://images.unsplash.com/photo-1472653431158-6364773b2a56?auto=format&fit=crop&q=80&w=1000",
                "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=1000",
                "https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&q=80&w=1000",
                "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6?auto=format&fit=crop&q=80&w=1000",
                "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&q=80&w=1000",
                "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=1000"
            ]
        }
    ],
    // NEW: Chronograph wishes - replaces the old memory-match game.
    // The user winds an elegant watch dial; the hand lands on a numeral
    // and reveals the matching wish card. Every numeral can eventually
    // be unlocked across multiple winds.
    chronograph: {
        dialLabel: "2026",
        windHint: "Wind the crown",
        completeMessage: "All wishes unsealed. The year is yours.",
        // Total number of winds the user may perform before the dial locks.
        // Each wind reveals one wish via the full-screen transition, then
        // returns to the clock. If 0 / missing, falls back to wishes.length.
        maxSpins: 6,
        wishes: [
            { numeral: "I",   title: "A Weekend Away",      body: "A reserved page in next year's calendar — a trip, together." },
            { numeral: "II",  title: "A Candlelit Dinner",  body: "A night for cloth napkins and a long conversation." },
            { numeral: "III", title: "A Curated Playlist",  body: "A soundtrack for the year ahead, hand-picked with care." },
            { numeral: "IV",  title: "Front-Row Seats",     body: "Tickets to something you have been wanting to see." },
            { numeral: "V",   title: "A Handwritten Letter",body: "A real letter — the kind you keep in a drawer." },
            { numeral: "VI",  title: "An Open Wish",        body: "One favor, no expiry. Name it when you need it." }
        ]
    },
    notesTitle: "Letters for You",
    notes: [
        {
            question: "What's our favorite hangout spot?",
            answer: "cafe",
            message: "May this year bring you as much joy as you bring to everyone around you."
        },
        {
            question: "What month did we first meet?",
            answer: "january",
            message: "Remember that trip we took? Let's do it again this year."
        },
        {
            question: "What's my nickname for you?",
            answer: "bestie",
            message: "Wishing you health, wealth, and endless happiness. You deserve it all."
        }
    ],
    // Legacy field kept for backward-compat with any older customize exports.
    gifts: [
        { name: "A Custom Playlist", weight: 50 },
        { name: "Dinner Date Coupon", weight: 30 },
        { name: "Weekend Getaway", weight: 20 }
    ],
    // Legacy game block kept so very old saves still load without errors.
    game: {
        maxMoves: 25,
        winMessage: "You unlocked the surprise!",
        memoryCards: ["\u2728", "\u2728", "\u2728", "\u2728", "\u2728", "\u2728"],
        giftTiers: [
            { minPairs: 0, gifts: [{ name: "Better Luck Next Time", weight: 100 }] }
        ]
    }
};
