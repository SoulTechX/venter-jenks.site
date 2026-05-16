(function() {
    const initParticles = () => {
        const hero = document.querySelector('.hero');
        if (!hero) {
            // Si no encuentra el elemento, intentar de nuevo en un momento
            setTimeout(initParticles, 500);
            return;
        }

        // Ensure hero is relative so the absolute canvas stays inside it
        if (window.getComputedStyle(hero).position === 'static') {
            hero.style.position = 'relative';
        }

        // Create and setup the canvas
        const canvas = document.createElement('canvas');
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '0';
        canvas.style.pointerEvents = 'none'; // so it doesn't block clicks

        // Bring hero content to front
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.position = 'relative';
            heroContent.style.zIndex = '1';
        }

        hero.insertBefore(canvas, hero.firstChild);
        const ctx = canvas.getContext('2d');

        let width, height;
        let particles = [];
        const maxParticles = 150; // Reducido para mayor elegancia y menor saturación
        let mouse = { x: -100, y: -100, active: false };

        const resize = () => {
            width = hero.clientWidth;
            height = hero.clientHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor(x, y) {
                // Nace ligeramente alrededor del cursor
                this.x = x + (Math.random() * 30 - 15);
                this.y = y + (Math.random() * 30 - 15);
                
                // Movimiento ascendente muy suave (efecto polvo de hadas/bokeh)
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = -(Math.random() * 0.6 + 0.2);
                
                // Tamaño mucho más sutil y delicado
                this.size = Math.random() * 1.5 + 0.5;
                
                // Opacidad inicial más baja para que no sature
                this.life = Math.random() * 0.5 + 0.3; 
                this.decay = Math.random() * 0.005 + 0.005; // Desaparece lentamente
                
                // Oscilación horizontal
                this.angle = Math.random() * Math.PI * 2;
                
                this.color = Math.random() > 0.5 ? '255, 255, 255' : '200, 255, 220';
            }

            update() {
                this.angle += 0.02;
                this.x += this.vx + Math.sin(this.angle) * 0.3; // Oscilación natural
                this.y += this.vy;
                this.life -= this.decay;
            }

            draw(ctx) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color}, ${this.life})`;
                // Leve brillo exterior simulado dibujando otro círculo suave
                ctx.fill();
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color}, ${this.life * 0.2})`;
                ctx.fill();
            }
        }

        const updateMousePos = (e) => {
            const rect = canvas.getBoundingClientRect();
            let clientX = e.clientX;
            let clientY = e.clientY;

            if (e.touches && e.touches.length > 0) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            }

            mouse.x = clientX - rect.left;
            mouse.y = clientY - rect.top;
        };

        const handleMove = (e) => {
            mouse.active = true;
            updateMousePos(e);
        };

        const handleLeave = () => {
            mouse.active = false;
        };

        hero.addEventListener('mousemove', handleMove);
        hero.addEventListener('touchmove', handleMove, { passive: true });
        hero.addEventListener('mouseleave', handleLeave);
        hero.addEventListener('touchend', handleLeave);

        const loop = () => {
            ctx.clearRect(0, 0, width, height);

            if (mouse.active && particles.length < maxParticles) {
                // Generar solo 1 partícula por frame de manera intermitente (más minimalista)
                if (Math.random() > 0.4) {
                    particles.push(new Particle(mouse.x, mouse.y));
                }
            }

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.update();
                p.draw(ctx);
                if (p.life <= 0) {
                    particles.splice(i, 1);
                    i--; // adjust index since we removed an element
                }
            }

            requestAnimationFrame(loop);
        };

        loop();
    };

    // Initialize as soon as possible, or wait for DOM if not ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initParticles);
    } else {
        initParticles();
    }
})();
