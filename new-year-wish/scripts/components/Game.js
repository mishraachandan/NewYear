window.Game = function (gameData) {
    const section = document.createElement('section');
    section.className = 'game-section';
    section.style.padding = '4rem 1rem';
    section.style.textAlign = 'center';

    const title = document.createElement('h2');
    title.textContent = "Memory Match Game!";
    title.style.marginBottom = '1rem';
    section.appendChild(title);

    const instructions = document.createElement('p');
    instructions.textContent = "Find all the matching pairs to win!";
    instructions.style.color = 'var(--color-text-muted)';
    instructions.style.marginBottom = '2rem';
    section.appendChild(instructions);

    // Game Container
    const gameContainer = document.createElement('div');
    gameContainer.style.width = '100%';
    gameContainer.style.maxWidth = '600px';
    gameContainer.style.minHeight = '400px';
    gameContainer.style.margin = '0 auto';
    gameContainer.style.padding = '2rem';
    gameContainer.style.background = '#1a202c';
    gameContainer.style.border = '2px solid var(--color-primary)';
    gameContainer.style.borderRadius = 'var(--radius-md)';
    gameContainer.style.position = 'relative';
    section.appendChild(gameContainer);

    // Game State
    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let isChecking = false;
    let moves = 0;
    const maxMoves = gameData.maxMoves || 25;
    const totalPairs = gameData.memoryCards.length;

    // Score Display
    const scoreDisplay = document.createElement('div');
    scoreDisplay.style.marginBottom = '1.5rem';
    scoreDisplay.style.fontSize = '1.2rem';
    scoreDisplay.style.color = 'var(--color-primary)';
    gameContainer.appendChild(scoreDisplay);

    // Cards Grid
    const cardsGrid = document.createElement('div');
    cardsGrid.style.display = 'grid';
    cardsGrid.style.gridTemplateColumns = 'repeat(4, 1fr)';
    cardsGrid.style.gap = '1rem';
    cardsGrid.style.maxWidth = '500px';
    cardsGrid.style.margin = '0 auto';
    gameContainer.appendChild(cardsGrid);

    // Start Overlay
    const startOverlay = document.createElement('div');
    startOverlay.style.position = 'absolute';
    startOverlay.style.inset = '0';
    startOverlay.style.background = 'rgba(0,0,0,0.85)';
    startOverlay.style.display = 'flex';
    startOverlay.style.flexDirection = 'column';
    startOverlay.style.justifyContent = 'center';
    startOverlay.style.alignItems = 'center';
    startOverlay.style.cursor = 'pointer';
    startOverlay.style.zIndex = '20';
    startOverlay.style.borderRadius = 'var(--radius-md)';

    const startText = document.createElement('h3');
    startText.textContent = "Click to Play";
    startText.style.color = 'var(--color-primary)';
    startText.style.fontSize = '2rem';
    startText.className = 'animate-float';

    startOverlay.appendChild(startText);
    gameContainer.appendChild(startOverlay);

    startOverlay.onclick = initGame;

    function initGame() {
        startOverlay.classList.add('hidden');

        // Create card pairs
        const cardSymbols = [...gameData.memoryCards, ...gameData.memoryCards];
        // Shuffle
        cardSymbols.sort(() => Math.random() - 0.5);

        cardsGrid.innerHTML = '';
        cards = [];
        flippedCards = [];
        matchedPairs = 0;
        moves = 0;
        isChecking = false;

        cardSymbols.forEach((symbol, index) => {
            const card = createCard(symbol, index);
            cards.push(card);
            cardsGrid.appendChild(card.element);
        });

        updateScore();
    }

    function createCard(symbol, id) {
        const cardElement = document.createElement('div');
        cardElement.className = 'memory-card';
        cardElement.style.width = '100%';
        cardElement.style.aspectRatio = '1';
        cardElement.style.background = 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dim))';
        cardElement.style.borderRadius = 'var(--radius-sm)';
        cardElement.style.display = 'flex';
        cardElement.style.justifyContent = 'center';
        cardElement.style.alignItems = 'center';
        cardElement.style.fontSize = '3rem';
        cardElement.style.cursor = 'pointer';
        cardElement.style.transition = 'transform 0.2s, box-shadow 0.2s';
        cardElement.style.position = 'relative';
        cardElement.style.transformStyle = 'preserve-3d';
        cardElement.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
        cardElement.style.userSelect = 'none';

        const card = {
            element: cardElement,
            symbol: symbol,
            id: id,
            flipped: false,
            matched: false
        };

        cardElement.textContent = '?';

        cardElement.onmouseenter = () => {
            if (!card.matched && !card.flipped && !isChecking) {
                cardElement.style.transform = 'scale(1.05)';
                cardElement.style.boxShadow = '0 6px 12px rgba(255, 215, 0, 0.4)';
            }
        };

        cardElement.onmouseleave = () => {
            if (!card.matched && !card.flipped) {
                cardElement.style.transform = 'scale(1)';
                cardElement.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
            }
        };

        cardElement.onclick = () => flipCard(card);

        return card;
    }

    function flipCard(card) {
        // More permissive click handling
        if (card.matched || card.flipped) return;
        if (isChecking && flippedCards.length >= 2) return;

        card.flipped = true;
        card.element.textContent = card.symbol;
        card.element.style.background = 'linear-gradient(135deg, var(--color-accent), #45d4b0)';
        card.element.style.transform = 'scale(1)';
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            moves++;
            updateScore();
            checkMatch();
        }
    }

    function checkMatch() {
        isChecking = true;
        const [card1, card2] = flippedCards;

        if (card1.symbol === card2.symbol) {
            // Match! - Faster feedback
            setTimeout(() => {
                card1.matched = true;
                card2.matched = true;
                card1.element.style.opacity = '0.6';
                card2.element.style.opacity = '0.6';
                card1.element.style.cursor = 'default';
                card2.element.style.cursor = 'default';

                matchedPairs++;
                updateScore();
                flippedCards = [];
                isChecking = false;

                if (matchedPairs === totalPairs) {
                    setTimeout(endGame, 300);
                }
            }, 300); // Reduced from 500ms
        } else {
            // No match - Faster flip back
            setTimeout(() => {
                card1.flipped = false;
                card2.flipped = false;
                card1.element.textContent = '?';
                card2.element.textContent = '?';
                card1.element.style.background = 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dim))';
                card2.element.style.background = 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dim))';
                flippedCards = [];
                isChecking = false;

                // Check if out of moves
                if (moves >= maxMoves && matchedPairs < totalPairs) {
                    setTimeout(endGame, 200);
                }
            }, 600); // Reduced from 1000ms
        }
    }

    function updateScore() {
        const remaining = maxMoves - moves;
        scoreDisplay.textContent = `Moves: ${moves}/${maxMoves} | Pairs: ${matchedPairs}/${totalPairs}`;

        // Color code remaining moves
        if (remaining <= 3) {
            scoreDisplay.style.color = '#ff4444'; // Red
        } else if (remaining <= 7) {
            scoreDisplay.style.color = '#ffaa00'; // Orange
        } else {
            scoreDisplay.style.color = 'var(--color-primary)';
        }
    }

    function getPerformanceRating() {
        const perfectMoves = totalPairs; // 6 moves for 6 pairs

        if (matchedPairs === totalPairs) {
            if (moves === perfectMoves) return { text: "🏆 PERFECT!", color: "#FFD700" };
            if (moves <= perfectMoves + 2) return { text: "⭐ AMAZING!", color: "#FFD700" };
            if (moves <= perfectMoves + 5) return { text: "🌟 EXCELLENT!", color: "#64ffda" };
            if (moves <= maxMoves - 5) return { text: "✨ GREAT!", color: "#64ffda" };
            return { text: "👍 GOOD!", color: "#a0aec0" };
        } else {
            // Partial completion
            const percentage = (matchedPairs / totalPairs) * 100;
            if (percentage >= 66) return { text: "💪 NICE TRY!", color: "#ffaa00" };
            if (percentage >= 33) return { text: "🎯 KEEP GOING!", color: "#ffaa00" };
            return { text: "😅 BETTER LUCK NEXT TIME!", color: "#ff6b6b" };
        }
    }

    function endGame() {
        // Disable all cards
        cards.forEach(card => {
            card.element.onclick = null;
            card.element.style.cursor = 'default';
        });

        const rating = getPerformanceRating();
        const isFullWin = matchedPairs === totalPairs;

        // End Screen
        const endScreen = document.createElement('div');
        endScreen.className = 'animate-fade-in';
        endScreen.style.position = 'absolute';
        endScreen.style.inset = '0';
        endScreen.style.background = 'rgba(10, 14, 23, 0.95)';
        endScreen.style.display = 'flex';
        endScreen.style.flexDirection = 'column';
        endScreen.style.justifyContent = 'center';
        endScreen.style.alignItems = 'center';
        endScreen.style.zIndex = '30';
        endScreen.style.borderRadius = 'var(--radius-md)';

        const emoji = document.createElement('div');
        emoji.textContent = isFullWin ? '🎉' : '🎮';
        emoji.style.fontSize = '4rem';
        emoji.className = 'animate-float';

        const ratingText = document.createElement('h2');
        ratingText.textContent = rating.text;
        ratingText.style.marginTop = '1rem';
        ratingText.style.color = rating.color;
        ratingText.style.fontSize = '2rem';
        ratingText.style.textShadow = `0 0 20px ${rating.color}`;

        const stats = document.createElement('p');
        stats.textContent = `Pairs: ${matchedPairs}/${totalPairs} | Moves: ${moves}`;
        stats.style.color = 'var(--color-text-muted)';
        stats.style.marginTop = '0.5rem';
        stats.style.marginBottom = '2rem';
        stats.style.fontSize = '1.1rem';

        const claimBtn = document.createElement('button');
        claimBtn.textContent = "🎁 Collect Your Gift 🎁";
        claimBtn.style.padding = '1rem 2rem';
        claimBtn.style.fontSize = '1.2rem';
        claimBtn.style.background = 'var(--color-accent)';
        claimBtn.style.color = 'var(--color-bg)';
        claimBtn.style.fontWeight = 'bold';
        claimBtn.style.borderRadius = 'var(--radius-md)';
        claimBtn.style.transition = 'transform 0.2s';

        claimBtn.onmouseenter = () => claimBtn.style.transform = 'scale(1.05)';
        claimBtn.onmouseleave = () => claimBtn.style.transform = 'scale(1)';
        claimBtn.onclick = () => showMysteryBoxes(endScreen);

        endScreen.append(emoji, ratingText, stats, claimBtn);
        gameContainer.appendChild(endScreen);
    }

    // --- Gift Selection Logic ---

    function showMysteryBoxes(parentScreen) {
        parentScreen.innerHTML = '';

        const title = document.createElement('h3');
        title.textContent = "Pick a Mystery Box!";
        title.style.marginBottom = '3rem';
        title.style.fontSize = '1.5rem';
        parentScreen.appendChild(title);

        const boxesContainer = document.createElement('div');
        boxesContainer.style.display = 'flex';
        boxesContainer.style.gap = '2rem';
        boxesContainer.style.justifyContent = 'center';
        boxesContainer.style.flexWrap = 'wrap';

        for (let i = 0; i < 3; i++) {
            const box = document.createElement('div');
            box.style.width = '100px';
            box.style.height = '100px';
            box.style.background = 'linear-gradient(135deg, #ffd700, #b89b00)';
            box.style.borderRadius = '10px';
            box.style.display = 'flex';
            box.style.justifyContent = 'center';
            box.style.alignItems = 'center';
            box.style.fontSize = '3rem';
            box.style.cursor = 'pointer';
            box.style.boxShadow = '0 0 15px rgba(255, 215, 0, 0.5)';
            box.style.transition = 'transform 0.2s';
            box.textContent = '❓';

            box.onmouseenter = () => box.style.transform = 'scale(1.1) rotate(5deg)';
            box.onmouseleave = () => box.style.transform = 'scale(1) rotate(0deg)';
            box.onclick = () => revealGift(parentScreen);

            boxesContainer.appendChild(box);
        }

        parentScreen.appendChild(boxesContainer);
    }

    function revealGift(container) {
        // Find appropriate gift tier based on pairs matched
        const tiers = gameData.giftTiers;
        let selectedTier = tiers[tiers.length - 1]; // Default to lowest tier

        for (const tier of tiers) {
            if (matchedPairs >= tier.minPairs) {
                selectedTier = tier;
                break;
            }
        }

        // Weighted random from selected tier
        const gifts = selectedTier.gifts;
        const totalWeight = gifts.reduce((sum, item) => sum + item.weight, 0);
        let random = Math.random() * totalWeight;

        let selectedGift = gifts[0];
        for (const gift of gifts) {
            if (random < gift.weight) {
                selectedGift = gift;
                break;
            }
            random -= gift.weight;
        }

        container.innerHTML = '';
        const resultDiv = document.createElement('div');
        resultDiv.className = 'animate-fade-in';
        resultDiv.style.textAlign = 'center';

        const icon = document.createElement('div');
        icon.textContent = '🎁';
        icon.style.fontSize = '5rem';
        icon.className = 'animate-float';

        const text = document.createElement('h3');
        text.textContent = "You won:";
        text.style.marginTop = '2rem';
        text.style.color = 'var(--color-text-muted)';

        const prizeName = document.createElement('h2');
        prizeName.textContent = selectedGift.name;
        prizeName.style.fontSize = '2.5rem';
        prizeName.style.color = 'var(--color-primary)';
        prizeName.style.marginTop = '1rem';
        prizeName.style.textShadow = '0 0 20px rgba(255, 215, 0, 0.5)';

        resultDiv.append(icon, text, prizeName);
        container.appendChild(resultDiv);
    }

    return section;
}
