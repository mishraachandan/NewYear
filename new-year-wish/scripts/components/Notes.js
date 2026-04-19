/**
 * Notes.js - Luxury Locked Envelopes
 * Features:
 * - Scroll-reveal "appear from nothing" effect
 * - Elegant envelope design
 * - Luxury styling
 */

window.Notes = function (notesList, sectionTitle) {
    const section = document.createElement('section');
    section.className = 'notes-section';

    Object.assign(section.style, {
        padding: '8rem 2rem',
        background: 'var(--color-surface)'
    });

    // Section header - starts hidden
    const header = document.createElement('div');
    header.className = 'reveal-on-scroll';
    Object.assign(header.style, {
        textAlign: 'center',
        marginBottom: '5rem'
    });

    const subtitle = document.createElement('p');
    subtitle.textContent = 'Personal Messages';
    Object.assign(subtitle.style, {
        fontSize: '0.9rem',
        color: 'var(--color-primary)',
        letterSpacing: '4px',
        textTransform: 'uppercase',
        marginBottom: '1rem'
    });

    const title = document.createElement('h2');
    title.textContent = sectionTitle || 'Special Notes for You';
    Object.assign(title.style, {
        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
        fontFamily: 'var(--font-heading)',
        fontWeight: '400',
        color: 'var(--color-text-main)',
        marginBottom: '1rem'
    });

    const instruction = document.createElement('p');
    instruction.textContent = 'Unlock each note by answering the secret question';
    Object.assign(instruction.style, {
        fontSize: '0.9rem',
        color: 'var(--color-text-muted)'
    });

    header.appendChild(subtitle);
    header.appendChild(title);
    header.appendChild(instruction);

    // Envelopes Container
    const container = document.createElement('div');
    Object.assign(container.style, {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2.5rem',
        maxWidth: '1000px',
        margin: '0 auto'
    });

    notesList.forEach((note, index) => {
        const envelope = createEnvelope(note, index);
        container.appendChild(envelope);
    });

    section.appendChild(header);
    section.appendChild(container);

    // Scroll reveal is now handled globally by app.js

    return section;
};

function createEnvelope(note, index) {
    const envelope = document.createElement('div');
    envelope.className = 'envelope-card reveal-on-scroll';
    // Staggered delay
    envelope.style.transitionDelay = `${index * 200}ms`;

    Object.assign(envelope.style, {
        position: 'relative',
        background: 'var(--color-bg)',
        border: '1px solid rgba(201, 169, 98, 0.2)',
        padding: '0',
        overflow: 'hidden'
    });

    // Envelope flap
    const flap = document.createElement('div');
    Object.assign(flap.style, {
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        height: '70px',
        background: 'linear-gradient(135deg, var(--color-surface) 0%, var(--color-bg) 100%)',
        clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
        zIndex: '2',
        transition: 'transform 0.6s ease',
        borderBottom: '1px solid rgba(201, 169, 98, 0.1)'
    });
    envelope.appendChild(flap);

    // Lock icon
    const lockContainer = document.createElement('div');
    Object.assign(lockContainer.style, {
        position: 'absolute',
        top: '45px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: '3',
        fontSize: '1.5rem',
        transition: 'all 0.5s ease'
    });
    lockContainer.textContent = '🔒';
    envelope.appendChild(lockContainer);

    // Body
    const body = document.createElement('div');
    Object.assign(body.style, {
        padding: '100px 2rem 2rem 2rem',
        minHeight: '280px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    });

    // Question
    const question = document.createElement('p');
    question.textContent = note.question;
    Object.assign(question.style, {
        color: 'var(--color-text-main)',
        fontSize: '1rem',
        fontFamily: 'var(--font-heading)',
        fontStyle: 'italic',
        textAlign: 'center',
        marginBottom: '1.5rem'
    });

    // Input
    const inputContainer = document.createElement('div');
    Object.assign(inputContainer.style, {
        display: 'flex',
        gap: '10px',
        width: '100%',
        maxWidth: '260px'
    });

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Your answer';
    Object.assign(input.style, {
        flex: '1',
        padding: '12px 16px',
        background: 'transparent',
        border: '1px solid rgba(201, 169, 98, 0.3)',
        color: 'var(--color-text-main)',
        fontSize: '0.9rem',
        fontFamily: 'var(--font-body)',
        outline: 'none',
        transition: 'border-color 0.3s'
    });
    input.addEventListener('focus', () => input.style.borderColor = 'var(--color-primary)');
    input.addEventListener('blur', () => input.style.borderColor = 'rgba(201, 169, 98, 0.3)');

    const unlockBtn = document.createElement('button');
    unlockBtn.textContent = '→';
    Object.assign(unlockBtn.style, {
        padding: '12px 18px',
        background: 'var(--color-primary)',
        color: 'var(--color-bg)',
        border: 'none',
        fontSize: '1rem',
        cursor: 'pointer',
        transition: 'background 0.3s'
    });
    unlockBtn.addEventListener('mouseenter', () => unlockBtn.style.background = 'var(--color-accent)');
    unlockBtn.addEventListener('mouseleave', () => unlockBtn.style.background = 'var(--color-primary)');

    inputContainer.appendChild(input);
    inputContainer.appendChild(unlockBtn);

    // Error
    const errorMsg = document.createElement('p');
    errorMsg.textContent = 'Incorrect answer';
    Object.assign(errorMsg.style, {
        color: '#c9a962',
        fontSize: '0.8rem',
        marginTop: '1rem',
        opacity: '0',
        transition: 'opacity 0.3s'
    });

    // Hidden message
    const messageContainer = document.createElement('div');
    Object.assign(messageContainer.style, {
        display: 'none',
        textAlign: 'center',
        padding: '1rem'
    });

    const messageText = document.createElement('p');
    messageText.textContent = note.message;
    Object.assign(messageText.style, {
        color: 'var(--color-text-main)',
        fontSize: '1.1rem',
        fontFamily: 'var(--font-heading)',
        fontStyle: 'italic',
        lineHeight: '1.8'
    });
    messageContainer.appendChild(messageText);

    // Unlock logic
    const checkAnswer = () => {
        const userAnswer = input.value.trim().toLowerCase();
        const correctAnswer = note.answer.toLowerCase();

        if (userAnswer === correctAnswer) {
            lockContainer.textContent = '🔓';
            flap.style.transform = 'rotateX(180deg)';
            flap.style.transformOrigin = 'top';

            setTimeout(() => {
                question.style.display = 'none';
                inputContainer.style.display = 'none';
                errorMsg.style.display = 'none';
                lockContainer.style.opacity = '0';

                messageContainer.style.display = 'block';
                messageContainer.style.animation = 'luxuryFadeIn 0.6s ease forwards';

                envelope.style.borderColor = 'var(--color-primary)';
            }, 300);
        } else {
            errorMsg.style.opacity = '1';
            input.style.borderColor = 'var(--color-primary)';
            envelope.style.animation = 'shake 0.4s ease';
            setTimeout(() => envelope.style.animation = '', 400);
        }
    };

    unlockBtn.addEventListener('click', checkAnswer);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkAnswer();
    });

    body.appendChild(question);
    body.appendChild(inputContainer);
    body.appendChild(errorMsg);
    body.appendChild(messageContainer);
    envelope.appendChild(body);

    // Hover
    envelope.addEventListener('mouseenter', () => {
        if (messageContainer.style.display !== 'block') {
            envelope.style.borderColor = 'rgba(201, 169, 98, 0.4)';
        }
    });
    envelope.addEventListener('mouseleave', () => {
        if (messageContainer.style.display !== 'block') {
            envelope.style.borderColor = 'rgba(201, 169, 98, 0.2)';
        }
    });

    // Add shake animation
    if (!document.getElementById('envelope-shake')) {
        const style = document.createElement('style');
        style.id = 'envelope-shake';
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                20% { transform: translateX(-8px); }
                40% { transform: translateX(8px); }
                60% { transform: translateX(-8px); }
                80% { transform: translateX(8px); }
            }
        `;
        document.head.appendChild(style);
    }

    return envelope;
}

// Scroll reveal is now handled globally by app.js initGlobalScrollReveal()
