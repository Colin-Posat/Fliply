import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyD7kco7ZVwxAYyFKgxOK1fUDPkONZXRXkk",
    authDomain: "fliply-f4f1b.firebaseapp.com",
    projectId: "fliply-f4f1b",
    storageBucket: "fliply-f4f1b.firebasestorage.app",
    messagingSenderId: "42472944957",
    appId: "1:42472944957:web:259686a07b8e129d144154",
    measurementId: "G-2Z46WEJE6G"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ✅ Login Form Event Listener
document.addEventListener("DOMContentLoaded", function () {

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
    
    const loginForm = document.getElementById("login-form");

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent form from submitting normally

        // ✅ Get user input
        const email = document.getElementById("login-email").value.trim();
        const password = document.getElementById("login-password").value.trim();

        try {
            // ✅ Sign in user
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            console.log("✅ Login successful:", user);

            // ✅ Redirect to dashboard
            window.location.href = "../dashboard/created_sets.html";
        } catch (error) {
            console.error("❌ Login error:", error.message);
            alert("Login failed: " + error.message);
        }
    });
});
