window.DATA = {
    hero: {
        greeting: "Happy New Year",
        year: "2026",
        name: "My Dearest Friend", // Customizable name
        message: "Here's to another year of making memories together.",
        backgroundImage: ""
    },
    // Gallery now has memory sections, each with multiple photos
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
    game: {
        maxMoves: 25,
        winMessage: "You unlocked the surprise!",
        memoryCards: ["🎉", "🎁", "🎊", "🎈", "⭐", "💝"], // 6 pairs = 12 cards total
        giftTiers: [
            {
                minPairs: 6, gifts: [
                    { name: "Weekend Getaway 🚗", weight: 40 },
                    { name: "Fancy Dinner 🍽️", weight: 35 },
                    { name: "Concert Tickets 🎵", weight: 25 }
                ]
            },
            {
                minPairs: 4, gifts: [
                    { name: "Dinner Date Coupon 🍽️", weight: 50 },
                    { name: "Movie Night Package 🎬", weight: 30 },
                    { name: "Custom Playlist 🎵", weight: 20 }
                ]
            },
            {
                minPairs: 2, gifts: [
                    { name: "Coffee Gift Card ☕", weight: 50 },
                    { name: "Sweet Treats Box 🍫", weight: 30 },
                    { name: "Handwritten Letter 💌", weight: 20 }
                ]
            },
            {
                minPairs: 0, gifts: [
                    { name: "Better Luck Message 💭", weight: 100 }
                ]
            }
        ]
    },
    notes: [
        {
            question: "What's our favorite hangout spot?",
            answer: "cafe",
            message: "May this year bring you as much joy as you bring to everyone around you. ☕❤️"
        },
        {
            question: "What month did we first meet?",
            answer: "january",
            message: "Remember that trip we took? Let's do it again this year! 🚗✨"
        },
        {
            question: "What's my nickname for you?",
            answer: "bestie",
            message: "Wishing you health, wealth, and endless happiness. You deserve it all! 💫🎉"
        }
    ],
    gifts: [
        { name: "A Custom Playlist 🎵", weight: 50 },
        { name: "Dinner Date Coupon 🍽️", weight: 30 },
        { name: "Weekend Getaway 🚗", weight: 20 }
    ]
};
