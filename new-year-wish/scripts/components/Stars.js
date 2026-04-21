/**
 * Stars.js - Dynamic Galaxy Background
 * Creates an immersive space experience with stars, nebula, shooting stars,
 * and a subtle cosmic dust pass so the backdrop feels less flat.
 */

const Stars = () => {
    const canvas = document.createElement('canvas');
    canvas.id = 'galaxy-bg';

    Object.assign(canvas.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        zIndex: '-1',
        pointerEvents: 'none'
    });

    const ctx = canvas.getContext('2d');
    let width, height;
    let stars = [];
    let shootingStars = [];
    let dustMotes = [];
    let grainPattern = null;

    const CONFIG = {
        starCount: 500,
        dustCount: 22,
        shootingStarInterval: 3000,
        baseSpeed: 0.18,
        driftSpeedX: 0.06,
        orbitSpeed: 0.00018
    };

    const init = () => {
        resize();
        createStars();
        createDustMotes();
        buildGrainPattern();
        scheduleShootingStar();
        animate();
    };

    const resize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        if (stars.length > 0) {
            createStars();
            createDustMotes();
            buildGrainPattern();
        }
    };

    const createStars = () => {
        stars = [];
        for (let i = 0; i < CONFIG.starCount; i++) {
            const layer = Math.random();
            const originX = Math.random() * width;
            const originY = Math.random() * height;
            stars.push({
                x: originX,
                y: originY,
                originX,
                originY,
                size: layer * 2 + 0.5,
                baseOpacity: 0.3 + layer * 0.7,
                opacity: Math.random(),
                speed: CONFIG.baseSpeed * (0.5 + layer * 0.5),
                driftX: CONFIG.driftSpeedX * (0.35 + layer * 0.9) * (Math.random() > 0.5 ? 1 : -1),
                orbitRadius: 6 + layer * 28 + Math.random() * 20,
                orbitAngle: Math.random() * Math.PI * 2,
                orbitSpeed: CONFIG.orbitSpeed * (0.6 + layer * 2.2),
                twinkleSpeed: 0.01 + Math.random() * 0.02,
                twinklePhase: Math.random() * Math.PI * 2,
                hue: [0, 45, 180, 200][Math.floor(Math.random() * 4)]
            });
        }
    };

    const createDustMotes = () => {
        dustMotes = [];
        for (let i = 0; i < CONFIG.dustCount; i++) {
            dustMotes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: 14 + Math.random() * 30,
                opacity: 0.006 + Math.random() * 0.014,
                speedX: 0.018 + Math.random() * 0.028,
                speedY: -0.008 - Math.random() * 0.02,
                pulse: Math.random() * Math.PI * 2,
                pulseSpeed: 0.003 + Math.random() * 0.006,
                tint: Math.random() > 0.55 ? 'warm' : 'cool'
            });
        }
    };

    const buildGrainPattern = () => {
        const tile = document.createElement('canvas');
        tile.width = 128;
        tile.height = 128;
        const tileCtx = tile.getContext('2d');
        const image = tileCtx.createImageData(tile.width, tile.height);

        for (let i = 0; i < image.data.length; i += 4) {
            const tone = 190 + Math.random() * 55;
            image.data[i] = tone;
            image.data[i + 1] = tone * 0.96;
            image.data[i + 2] = tone * 0.88;
            image.data[i + 3] = 3 + Math.random() * 10;
        }

        tileCtx.putImageData(image, 0, 0);
        grainPattern = ctx.createPattern(tile, 'repeat');
    };

    const createShootingStar = () => {
        shootingStars.push({
            x: Math.random() * width,
            y: 0,
            length: 80 + Math.random() * 80,
            speed: 15 + Math.random() * 10,
            opacity: 1,
            angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3
        });
    };

    const scheduleShootingStar = () => {
        setInterval(() => {
            if (shootingStars.length < 2) {
                createShootingStar();
            }
        }, CONFIG.shootingStarInterval);
    };

    const drawNebula = () => {
        const bgGradient = ctx.createRadialGradient(
            width * 0.3, height * 0.7, 0,
            width * 0.5, height * 0.5, Math.max(width, height)
        );
        bgGradient.addColorStop(0, '#1a1a2e');
        bgGradient.addColorStop(0.5, '#0f0f1a');
        bgGradient.addColorStop(1, '#050510');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, width, height);

        const nebulaColors = [
            { x: 0.2, y: 0.3, color: 'rgba(100, 255, 218, 0.03)', size: 0.4 },
            { x: 0.8, y: 0.6, color: 'rgba(255, 215, 0, 0.02)', size: 0.3 },
            { x: 0.5, y: 0.8, color: 'rgba(138, 43, 226, 0.02)', size: 0.35 }
        ];

        nebulaColors.forEach(nebula => {
            const gradient = ctx.createRadialGradient(
                width * nebula.x, height * nebula.y, 0,
                width * nebula.x, height * nebula.y, width * nebula.size
            );
            gradient.addColorStop(0, nebula.color);
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
        });
    };

    const drawDustMotes = () => {
        dustMotes.forEach(mote => {
            mote.pulse += mote.pulseSpeed;
            const glow = 0.65 + Math.sin(mote.pulse) * 0.35;
            const gradient = ctx.createRadialGradient(
                mote.x, mote.y, 0,
                mote.x, mote.y, mote.size
            );
            const tint = mote.tint === 'warm'
                ? [235, 210, 150]
                : [176, 202, 255];

            gradient.addColorStop(0, `rgba(${tint[0]}, ${tint[1]}, ${tint[2]}, ${mote.opacity * glow})`);
            gradient.addColorStop(0.45, `rgba(${tint[0]}, ${tint[1]}, ${tint[2]}, ${mote.opacity * 0.4})`);
            gradient.addColorStop(1, 'transparent');

            ctx.beginPath();
            ctx.arc(mote.x, mote.y, mote.size, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();

            mote.x += mote.speedX;
            mote.y += mote.speedY;

            if (mote.x > width + mote.size) mote.x = -mote.size;
            if (mote.y < -mote.size) {
                mote.y = height + mote.size;
                mote.x = Math.random() * width;
            }
        });
    };

    const drawGrain = (time) => {
        if (!grainPattern) return;

        ctx.save();
        ctx.globalAlpha = 0.026;
        ctx.translate((time * 6) % 128, (time * 4) % 128);
        ctx.fillStyle = grainPattern;
        ctx.fillRect(-128, -128, width + 256, height + 256);
        ctx.restore();
    };

    const animate = () => {
        drawNebula();

        drawDustMotes();

        stars.forEach(star => {
            star.twinklePhase += star.twinkleSpeed;
            star.orbitAngle += star.orbitSpeed;
            const twinkle = (Math.sin(star.twinklePhase) + 1) / 2;
            star.opacity = star.baseOpacity * (0.5 + twinkle * 0.5);

            star.originY -= star.speed;
            star.originX += star.driftX;
            star.x = star.originX + Math.cos(star.orbitAngle) * star.orbitRadius;
            star.y = star.originY + Math.sin(star.orbitAngle * 0.85) * (star.orbitRadius * 0.55);

            const gradient = ctx.createRadialGradient(
                star.x, star.y, 0,
                star.x, star.y, star.size * 2
            );

            gradient.addColorStop(0, `hsla(${star.hue}, 100%, 100%, ${star.opacity})`);
            gradient.addColorStop(0.5, `hsla(${star.hue}, 100%, 80%, ${star.opacity * 0.5})`);
            gradient.addColorStop(1, 'transparent');

            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size * 0.5, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${star.hue}, 100%, 100%, ${star.opacity})`;
            ctx.fill();

            if (star.y < -40 || star.x < -40 || star.x > width + 40) {
                star.originX = Math.random() * width;
                star.originY = height + 30 + Math.random() * 40;
                star.orbitAngle = Math.random() * Math.PI * 2;
                star.x = star.originX;
                star.y = star.originY;
            }
        });

        shootingStars = shootingStars.filter(ss => {
            const tailX = ss.x - Math.cos(ss.angle) * ss.length;
            const tailY = ss.y - Math.sin(ss.angle) * ss.length;

            const gradient = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
            gradient.addColorStop(0, 'transparent');
            gradient.addColorStop(0.8, `rgba(255, 255, 255, ${ss.opacity * 0.5})`);
            gradient.addColorStop(1, `rgba(255, 255, 255, ${ss.opacity})`);

            ctx.beginPath();
            ctx.moveTo(tailX, tailY);
            ctx.lineTo(ss.x, ss.y);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(ss.x, ss.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${ss.opacity})`;
            ctx.fill();

            ss.x += Math.cos(ss.angle) * ss.speed;
            ss.y += Math.sin(ss.angle) * ss.speed;
            ss.opacity -= 0.008;

            return ss.opacity > 0 && ss.x < width + 100 && ss.y < height + 100;
        });

        drawGrain(performance.now() * 0.001);

        requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);

    setTimeout(init, 100);

    return canvas;
};
