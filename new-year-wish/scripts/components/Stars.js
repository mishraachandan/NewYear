/**
 * Stars.js - Dynamic Galaxy Background
 * Creates an immersive space experience with stars, nebula, and shooting stars.
 */

const Stars = () => {
    const canvas = document.createElement('canvas');
    canvas.id = 'galaxy-bg';

    // Critical: Set canvas styles for proper display
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

    const CONFIG = {
        starCount: 500,
        shootingStarInterval: 3000,
        baseSpeed: 0.18,
        driftSpeedX: 0.06,
        orbitSpeed: 0.00018
    };

    // Initialize
    const init = () => {
        resize();
        createStars();
        scheduleShootingStar();
        animate();
    };

    // Resize handler
    const resize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        // Recreate stars on resize
        if (stars.length > 0) {
            createStars();
        }
    };

    // Create star field
    const createStars = () => {
        stars = [];
        for (let i = 0; i < CONFIG.starCount; i++) {
            const layer = Math.random(); // 0-1, determines depth
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
                hue: [0, 45, 180, 200][Math.floor(Math.random() * 4)] // white, gold, cyan, blue
            });
        }
    };

    // Create a shooting star
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

    // Draw nebula background
    const drawNebula = () => {
        // Deep space gradient
        const bgGradient = ctx.createRadialGradient(
            width * 0.3, height * 0.7, 0,
            width * 0.5, height * 0.5, Math.max(width, height)
        );
        bgGradient.addColorStop(0, '#1a1a2e');
        bgGradient.addColorStop(0.5, '#0f0f1a');
        bgGradient.addColorStop(1, '#050510');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, width, height);

        // Nebula clouds
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

    // Main animation loop
    const animate = () => {
        // Draw nebula background
        drawNebula();

        // Draw and update stars
        stars.forEach(star => {
            // Twinkle effect using sine wave
            star.twinklePhase += star.twinkleSpeed;
            star.orbitAngle += star.orbitSpeed;
            const twinkle = (Math.sin(star.twinklePhase) + 1) / 2;
            star.opacity = star.baseOpacity * (0.5 + twinkle * 0.5);

            // Slow parallax drift plus a tiny orbit so the star field feels
            // more like a living galaxy than a fixed wallpaper.
            star.originY -= star.speed;
            star.originX += star.driftX;
            star.x = star.originX + Math.cos(star.orbitAngle) * star.orbitRadius;
            star.y = star.originY + Math.sin(star.orbitAngle * 0.85) * (star.orbitRadius * 0.55);

            // Draw star with glow
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

            // Core of star
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size * 0.5, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${star.hue}, 100%, 100%, ${star.opacity})`;
            ctx.fill();

            // Wrap around
            if (star.y < -40 || star.x < -40 || star.x > width + 40) {
                star.originX = Math.random() * width;
                star.originY = height + 30 + Math.random() * 40;
                star.orbitAngle = Math.random() * Math.PI * 2;
                star.x = star.originX;
                star.y = star.originY;
            }
        });

        // Draw shooting stars
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

            // Head glow
            ctx.beginPath();
            ctx.arc(ss.x, ss.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${ss.opacity})`;
            ctx.fill();

            // Update position
            ss.x += Math.cos(ss.angle) * ss.speed;
            ss.y += Math.sin(ss.angle) * ss.speed;
            ss.opacity -= 0.008;

            return ss.opacity > 0 && ss.x < width + 100 && ss.y < height + 100;
        });

        requestAnimationFrame(animate);
    };

    // Event listeners
    window.addEventListener('resize', resize);

    // Start animation
    setTimeout(init, 100);

    return canvas;
};
