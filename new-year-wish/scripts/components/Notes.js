/**
 * Notes.js — "Letters for You" section, reimagined as a vintage desk.
 *
 * Design brief (from user):
 *   Scattered antique letters and envelopes on a desk, viewed from above.
 *   Handwritten cursive notes, vintage stamps, wax seals, magnifying glass,
 *   warm cinematic lighting, sepia palette, ultra-detailed textures, elegant
 *   shadows, nostalgic mood. Clean enough for text readability while still
 *   rich in detail. Realistic photography style.
 *
 * We render a full-bleed desk backdrop using CSS layers + a sepia-tinted
 * photograph, and each note card is a piece of aged parchment bearing a wax
 * seal that breaks open once the question is answered. All copy still comes
 * from `data.notes` / `data.notesTitle` so customize.html continues to drive
 * content end-to-end.
 */

window.Notes = function (notesList, sectionTitle) {
    // Title is rendered by the editorial chapter-header in app.js; the legacy
    // argument stays for back-compat with older callers/customize exports.
    void sectionTitle;

    const section = document.createElement('section');
    section.className = 'notes-section letters-section';

    // Decorative desk props: stamp corner, magnifying glass, sealing wax stick.
    // Pure SVG so they scale crisply and feel tactile without a big download.
    section.appendChild(letterProp('stamp',     'letters-prop letters-prop--stamp'));
    section.appendChild(letterProp('magnifier', 'letters-prop letters-prop--magnifier'));
    section.appendChild(letterProp('feather',   'letters-prop letters-prop--feather'));

    // Instruction line — sits below the editorial chapter header, right above
    // the grid of letters. Uses a handwritten-feeling italic serif.
    const instruction = document.createElement('p');
    instruction.className = 'letters-instruction reveal-on-scroll';
    instruction.textContent = 'Answer the secret question to break each seal.';
    section.appendChild(instruction);

    const container = document.createElement('div');
    container.className = 'letters-grid';

    (notesList || []).forEach(function (note, index) {
        container.appendChild(createLetterCard(note, index));
    });

    section.appendChild(container);
    return section;
};

function createLetterCard(note, index) {
    const card = document.createElement('article');
    card.className = 'letter-card reveal-on-scroll';
    card.style.transitionDelay = (index * 160) + 'ms';
    // Subtle per-card rotation so the stack feels hand-placed on the desk
    // rather than perfectly aligned on a grid.
    const rotations = ['-2.5deg', '1.8deg', '-1.2deg', '2.4deg', '-1.6deg', '1.3deg'];
    const rot = rotations[index % rotations.length];
    card.style.setProperty('--letter-rot', rot);

    // --- Sealed (front) face ---------------------------------------------
    const front = document.createElement('div');
    front.className = 'letter-face letter-front';

    const stampStrip = document.createElement('div');
    stampStrip.className = 'letter-stamp-strip';
    stampStrip.innerHTML = [
        '<span class="letter-stamp">POSTA</span>',
        '<span class="letter-postmark">\u25cb 2026</span>'
    ].join('');
    front.appendChild(stampStrip);

    const toLine = document.createElement('p');
    toLine.className = 'letter-address';
    toLine.innerHTML = '<span class="letter-hand">To —</span> <em>a dear friend</em>';
    front.appendChild(toLine);

    const question = document.createElement('p');
    question.className = 'letter-question';
    question.textContent = (note && note.question) || 'A question to be answered.';
    front.appendChild(question);

    const form = document.createElement('form');
    form.className = 'letter-form';
    form.addEventListener('submit', function (e) { e.preventDefault(); });

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'letter-input';
    input.placeholder = 'Your answer\u2026';
    input.setAttribute('aria-label', 'Answer');
    form.appendChild(input);

    const submit = document.createElement('button');
    submit.type = 'submit';
    submit.className = 'letter-submit';
    submit.textContent = 'Break Seal';
    form.appendChild(submit);

    front.appendChild(form);

    // Wax seal — the central decorative element; rotates + shatters on unlock
    const seal = document.createElement('div');
    seal.className = 'letter-seal';
    seal.innerHTML = '<span>&#x2741;</span>';
    front.appendChild(seal);

    const feedback = document.createElement('p');
    feedback.className = 'letter-feedback';
    front.appendChild(feedback);

    // --- Unsealed (back) face --------------------------------------------
    const back = document.createElement('div');
    back.className = 'letter-face letter-back';

    const backHeader = document.createElement('p');
    backHeader.className = 'letter-back-header';
    backHeader.textContent = 'A note, unsealed.';
    back.appendChild(backHeader);

    const msg = document.createElement('p');
    msg.className = 'letter-message';
    msg.textContent = (note && note.message) || '';
    back.appendChild(msg);

    const signoff = document.createElement('p');
    signoff.className = 'letter-signoff';
    signoff.textContent = '— yours, always';
    back.appendChild(signoff);

    card.appendChild(front);
    card.appendChild(back);

    // Interaction: correct answer triggers the unseal animation.
    function tryUnseal() {
        const expected = String((note && note.answer) || '').trim().toLowerCase();
        const given    = String(input.value || '').trim().toLowerCase();
        if (!expected) return;
        if (given && given === expected) {
            card.classList.add('is-unsealed');
            feedback.textContent = '';
        } else {
            feedback.textContent = 'Not quite. Try another answer.';
            card.classList.add('is-wrong');
            setTimeout(function () { card.classList.remove('is-wrong'); }, 600);
        }
    }
    submit.addEventListener('click', tryUnseal);
    input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); tryUnseal(); }
    });

    return card;
}

/**
 * Decorative SVG props scattered on the desk.
 * Keyed by name; each returns a positioned wrapper ready to attach.
 */
function letterProp(kind, className) {
    const wrap = document.createElement('div');
    wrap.className = className;
    wrap.setAttribute('aria-hidden', 'true');

    if (kind === 'stamp') {
        wrap.innerHTML = [
            '<svg viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg">',
                '<rect x="4" y="4" width="112" height="142" rx="3"',
                    ' fill="#b4812c" stroke="#f3deb1" stroke-width="3" stroke-dasharray="4 3"/>',
                '<circle cx="60" cy="62" r="30" fill="none" stroke="#f3deb1" stroke-width="2"/>',
                '<text x="60" y="68" text-anchor="middle" fill="#f3deb1"',
                    ' font-family="Playfair Display, serif" font-size="18">2026</text>',
                '<text x="60" y="120" text-anchor="middle" fill="#f3deb1"',
                    ' font-family="Playfair Display, serif" font-size="10" letter-spacing="2">POSTAL</text>',
            '</svg>'
        ].join('');
    } else if (kind === 'magnifier') {
        wrap.innerHTML = [
            '<svg viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">',
                '<circle cx="78" cy="78" r="54" fill="rgba(255,245,220,0.08)"',
                    ' stroke="#8b6914" stroke-width="6"/>',
                '<circle cx="78" cy="78" r="48" fill="none"',
                    ' stroke="rgba(255,245,220,0.35)" stroke-width="1"/>',
                '<rect x="120" y="120" width="60" height="12" rx="6"',
                    ' transform="rotate(40 120 120)" fill="#5a3a12"/>',
                '<rect x="124" y="124" width="52" height="4" rx="2"',
                    ' transform="rotate(40 124 124)" fill="#8b6914"/>',
            '</svg>'
        ].join('');
    } else if (kind === 'feather') {
        wrap.innerHTML = [
            '<svg viewBox="0 0 160 280" xmlns="http://www.w3.org/2000/svg">',
                '<path d="M80 20 C 20 120, 20 220, 80 260 C 140 220, 140 120, 80 20 Z"',
                    ' fill="rgba(245,220,170,0.22)" stroke="#8b6914" stroke-width="1.5"/>',
                '<path d="M80 20 L 80 260" stroke="#8b6914" stroke-width="1.5"/>',
                '<path d="M80 60 L 50 95 M80 90 L 45 130 M80 120 L 42 160',
                    ' M80 150 L 45 190 M80 180 L 52 215 M80 60 L 110 95',
                    ' M80 90 L 115 130 M80 120 L 118 160 M80 150 L 115 190',
                    ' M80 180 L 108 215" stroke="#8b6914" stroke-width="1" opacity="0.7"/>',
            '</svg>'
        ].join('');
    }
    return wrap;
}
