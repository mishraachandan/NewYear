/**
 * Chronograph.js - The "game" section, reimagined as an elegant watch dial.
 *
 * The user clicks the gold crown on the right of a luxury chronograph dial.
 * The hand spins up, decelerates, and lands on one of the numbered markers
 * (I through VI by default). The matching wish card below reveals with a
 * cinematic fade-in. Repeated winds eventually unlock every wish.
 *
 * This is a full replacement for the old Memory Match game. It is built with
 * inline SVG for the dial + CSS for the reveal animations, so it scales and
 * stays crisp at any size.
 *
 * Expected data shape (also editable via customize.html):
 *   {
 *     dialLabel: "2026",
 *     windHint: "Wind the crown",
 *     completeMessage: "All wishes unsealed. The year is yours.",
 *     wishes: [{ numeral: "I", title: "...", body: "..." }, ...]
 *   }
 */
window.Chronograph = function Chronograph(chronoData) {
    const data = chronoData && typeof chronoData === 'object' ? chronoData : {};
    const wishes = Array.isArray(data.wishes) && data.wishes.length
        ? data.wishes
        : [
            { numeral: 'I',   title: 'A Wish',          body: 'Configure wishes in customize.html.' },
            { numeral: 'II',  title: 'A Wish',          body: 'Configure wishes in customize.html.' },
            { numeral: 'III', title: 'A Wish',          body: 'Configure wishes in customize.html.' },
            { numeral: 'IV',  title: 'A Wish',          body: 'Configure wishes in customize.html.' },
            { numeral: 'V',   title: 'A Wish',          body: 'Configure wishes in customize.html.' },
            { numeral: 'VI',  title: 'A Wish',          body: 'Configure wishes in customize.html.' }
        ];
    const dialLabel = data.dialLabel || '2026';
    const windHint  = data.windHint  || 'Wind the crown';
    const completeMessage = data.completeMessage || 'All wishes unsealed.';

    const N = wishes.length;
    const SVG_NS = 'http://www.w3.org/2000/svg';
    const SIZE = 500;
    const CENTER = SIZE / 2;

    const section = document.createElement('section');
    section.className = 'chronograph-section';

    // ------- Dial SVG ------------------------------------------------------
    const stage = document.createElement('div');
    stage.className = 'chronograph-stage';
    section.appendChild(stage);

    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + SIZE + ' ' + SIZE);
    stage.appendChild(svg);

    // Dial face — concentric rings for luxury depth.
    function circle(cx, cy, r, attrs) {
        const c = document.createElementNS(SVG_NS, 'circle');
        c.setAttribute('cx', cx);
        c.setAttribute('cy', cy);
        c.setAttribute('r', r);
        Object.keys(attrs).forEach(function (k) { c.setAttribute(k, attrs[k]); });
        return c;
    }

    // Outer bezel ring
    svg.appendChild(circle(CENTER, CENTER, 240, {
        fill: 'none',
        stroke: 'rgba(201,169,98,0.6)',
        'stroke-width': '2'
    }));
    // Slightly inset ring
    svg.appendChild(circle(CENTER, CENTER, 228, {
        fill: '#0c0c0c',
        stroke: 'rgba(201,169,98,0.18)',
        'stroke-width': '1'
    }));
    // Inner face with subtle radial fill
    const grad = document.createElementNS(SVG_NS, 'radialGradient');
    grad.setAttribute('id', 'chrono-face-grad');
    grad.innerHTML =
        '<stop offset="0%"  stop-color="#181615"/>' +
        '<stop offset="70%" stop-color="#0c0b0a"/>' +
        '<stop offset="100%" stop-color="#050403"/>';
    const defs = document.createElementNS(SVG_NS, 'defs');
    defs.appendChild(grad);
    svg.appendChild(defs);
    svg.appendChild(circle(CENTER, CENTER, 218, { fill: 'url(#chrono-face-grad)' }));

    // Minute ticks
    for (let i = 0; i < 60; i++) {
        const angle = (i / 60) * Math.PI * 2 - Math.PI / 2;
        const isHour = i % 5 === 0;
        const r1 = 212;
        const r2 = isHour ? 196 : 204;
        const tick = document.createElementNS(SVG_NS, 'line');
        tick.setAttribute('x1', CENTER + Math.cos(angle) * r1);
        tick.setAttribute('y1', CENTER + Math.sin(angle) * r1);
        tick.setAttribute('x2', CENTER + Math.cos(angle) * r2);
        tick.setAttribute('y2', CENTER + Math.sin(angle) * r2);
        tick.setAttribute('stroke', isHour ? 'rgba(201,169,98,0.9)' : 'rgba(245,245,245,0.35)');
        tick.setAttribute('stroke-width', isHour ? '2' : '1');
        tick.setAttribute('stroke-linecap', 'round');
        svg.appendChild(tick);
    }

    // Numeral markers around the dial — positioned at N equal angular slots
    const markerRadius = 170;
    const slotAngles = [];
    for (let i = 0; i < N; i++) {
        // Start at top (-90deg) and go clockwise.
        const angle = -Math.PI / 2 + (i / N) * Math.PI * 2;
        slotAngles.push(angle);
        const x = CENTER + Math.cos(angle) * markerRadius;
        const y = CENTER + Math.sin(angle) * markerRadius;

        const markerRing = circle(x, y, 26, {
            fill: '#0c0c0c',
            stroke: 'rgba(201,169,98,0.7)',
            'stroke-width': '1.5'
        });
        markerRing.setAttribute('data-marker', String(i));
        svg.appendChild(markerRing);

        const txt = document.createElementNS(SVG_NS, 'text');
        txt.setAttribute('x', x);
        txt.setAttribute('y', y + 1);
        txt.setAttribute('text-anchor', 'middle');
        txt.setAttribute('dominant-baseline', 'middle');
        txt.setAttribute('fill', '#c9a962');
        txt.setAttribute('font-family', "'Playfair Display', Georgia, serif");
        txt.setAttribute('font-size', '18');
        txt.textContent = wishes[i].numeral || String(i + 1);
        svg.appendChild(txt);
    }

    // Dial label (year) at 6 o'clock
    const label = document.createElementNS(SVG_NS, 'text');
    label.setAttribute('x', CENTER);
    label.setAttribute('y', CENTER + 80);
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('fill', 'rgba(245,245,245,0.55)');
    label.setAttribute('font-family', "'Inter', sans-serif");
    label.setAttribute('font-size', '12');
    label.setAttribute('letter-spacing', '6');
    label.textContent = String(dialLabel).toUpperCase();
    svg.appendChild(label);

    // Hand (rotatable). Start pointing up at -90deg visual; we use CSS transforms.
    const hand = document.createElementNS(SVG_NS, 'g');
    hand.setAttribute('class', 'chronograph-hand');
    hand.setAttribute('transform', 'rotate(0 ' + CENTER + ' ' + CENTER + ')');
    // Tail
    const tail = document.createElementNS(SVG_NS, 'rect');
    tail.setAttribute('x', CENTER - 2);
    tail.setAttribute('y', CENTER - 40);
    tail.setAttribute('width', '4');
    tail.setAttribute('height', '40');
    tail.setAttribute('fill', 'rgba(201,169,98,0.55)');
    hand.appendChild(tail);
    // Main shaft pointing "up" (toward -Y / -90deg)
    const shaft = document.createElementNS(SVG_NS, 'polygon');
    shaft.setAttribute('points',
        (CENTER - 3) + ',' + CENTER + ' ' +
        (CENTER + 3) + ',' + CENTER + ' ' +
        (CENTER + 1.5) + ',' + (CENTER - 180) + ' ' +
        (CENTER - 1.5) + ',' + (CENTER - 180)
    );
    shaft.setAttribute('fill', '#f0d98a');
    hand.appendChild(shaft);
    // Center pin
    const pin = circle(CENTER, CENTER, 10, {
        fill: '#c9a962',
        stroke: '#7a6224',
        'stroke-width': '1.5'
    });
    hand.appendChild(pin);
    const pinInner = circle(CENTER, CENTER, 4, { fill: '#1a1a1a' });
    hand.appendChild(pinInner);
    svg.appendChild(hand);

    // Crown (outside the SVG, on the right)
    const crown = document.createElement('button');
    crown.className = 'chronograph-crown';
    crown.type = 'button';
    crown.setAttribute('aria-label', windHint);
    stage.appendChild(crown);

    // ------- Hint + wishes grid -------------------------------------------
    const hint = document.createElement('p');
    hint.className = 'chronograph-hint';
    hint.textContent = windHint;
    section.appendChild(hint);

    const wishesGrid = document.createElement('div');
    wishesGrid.className = 'chronograph-wishes';
    section.appendChild(wishesGrid);

    const cardEls = wishes.map(function (w) {
        const card = document.createElement('article');
        card.className = 'wish-card';
        const seal = document.createElement('span');
        seal.className = 'wish-seal';
        card.appendChild(seal);

        const numeral = document.createElement('div');
        numeral.className = 'wish-numeral';
        numeral.textContent = w.numeral || '';
        card.appendChild(numeral);

        const title = document.createElement('h4');
        title.className = 'wish-title';
        title.textContent = w.title || '';
        card.appendChild(title);

        const body = document.createElement('p');
        body.className = 'wish-body';
        body.textContent = w.body || '';
        card.appendChild(body);

        wishesGrid.appendChild(card);
        return card;
    });

    const complete = document.createElement('div');
    complete.className = 'chronograph-complete';
    complete.textContent = completeMessage;
    section.appendChild(complete);

    // ------- Spin logic ----------------------------------------------------
    let currentRotation = 0; // in degrees, can grow without bound
    let spinning = false;
    const revealed = new Array(N).fill(false);

    function pickNextSlot() {
        // Prefer unrevealed; if all revealed, random.
        const unrevealed = revealed.map(function (v, i) { return v ? -1 : i; }).filter(function (i) { return i >= 0; });
        if (unrevealed.length === 0) {
            return Math.floor(Math.random() * N);
        }
        return unrevealed[Math.floor(Math.random() * unrevealed.length)];
    }

    function spin() {
        if (spinning) return;
        spinning = true;
        crown.classList.add('is-winding');

        const slot = pickNextSlot();
        // Slot angle in radians, measured from +X axis (SVG), with -90deg at top.
        const slotAngleRad = slotAngles[slot];
        // Convert to degrees where "hand pointing up" is 0deg of rotation.
        // The hand initially points to -90deg (up). Target degree = slotAngleRad + 90.
        const targetDeg = (slotAngleRad * 180) / Math.PI + 90;

        const spins = 4 + Math.floor(Math.random() * 3); // 4-6 full revolutions
        const base = spins * 360;
        // Figure out incremental rotation needed from current to base+target (mod 360).
        const currentMod = ((currentRotation % 360) + 360) % 360;
        let delta = base + ((targetDeg - currentMod) + 360) % 360;
        // If delta is very small, add an extra full turn to make the spin feel substantial.
        if (delta < 360) delta += 360;

        currentRotation += delta;
        hand.setAttribute(
            'transform',
            'rotate(' + currentRotation + ' ' + CENTER + ' ' + CENTER + ')'
        );
        // Animate via CSS transition on a transform-origin fallback: we use SVG's rotate
        // attribute, so we animate with Web Animations API for smoothness.
        hand.animate(
            [
                { transform: 'rotate(0deg)' },
                { transform: 'rotate(' + delta + 'deg)' }
            ],
            {
                duration: 3200,
                easing: 'cubic-bezier(0.15, 0.85, 0.2, 1.0)',
                iterations: 1
            }
        );

        setTimeout(function () {
            revealed[slot] = true;
            const card = cardEls[slot];
            if (card) card.classList.add('is-revealed');
            crown.classList.remove('is-winding');
            spinning = false;
            if (revealed.every(Boolean)) {
                complete.classList.add('is-visible');
            }
        }, 3300);
    }

    crown.addEventListener('click', spin);

    return section;
};
