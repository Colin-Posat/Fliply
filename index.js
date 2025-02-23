document.addEventListener("DOMContentLoaded", function () {
    // Initialize Lucide icons
    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }

    // Get canvas element
    const canvas = document.getElementById("particles");

    if (!canvas) {
        console.error("Canvas with ID 'particles' not found.");
        return; // Exit if no canvas is found
    }

    const ctx = canvas.getContext("2d");

    // Set canvas size dynamically
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas(); // Set initial size
    window.addEventListener("resize", resizeCanvas); // Resize on window change

    let particlesArray = [];
    const numParticles = 100;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
            if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
        }
        draw() {
            ctx.fillStyle = "rgba(227, 243, 255, 0.7)";
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
    }

    function initParticles() {
        particlesArray = [];
        for (let i = 0; i < numParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particlesArray.forEach((particle) => {
            particle.update();
            particle.draw();
        });
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();
});
