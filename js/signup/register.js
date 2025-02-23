import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyD7kco7ZVwxAYyFKgxOK1fUDPkONZXRXkk",
    authDomain: "fliply-f4f1b.firebaseapp.com",
    projectId: "fliply-f4f1b",
    storageBucket: "fliply-f4f1b.firebasestorage.app",
    messagingSenderId: "42472944957",
    appId: "1:42472944957:web:259686a07b8e129d144154",
    measurementId: "G-2Z46WEJE6G"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

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
    const submit = document.getElementById("submit-signup");

    submit.addEventListener("click", async function (event) {
        event.preventDefault();  // ✅ Prevents form from reloading

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const username = document.getElementById("username").value.trim();
        const confirmPassword = document.getElementById("confirm-password").value.trim();

        if(confirmPassword != password){
            alert("Passwords do not match. Please try again.");
            return;
        }

        if (!isValidEmail(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        if(password.length < 6){
            alert("Please make sure your password is at least six characters.")
            return;
        }



        console.log("Signing up with:", email, password, username);

        try {
            // ✅ Create user in Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            console.log("✅ User created:", user);

            // ✅ Ensure user is authenticated before writing to Firestore
            if (user && user.uid) {
                await setDoc(doc(db, "fliplyUsers", user.uid), {
                    username: username,
                    email: email,
                    createdAt: new Date().toISOString()
                });

                console.log("✅ User data stored in Firestore.");

                window.location.href = "details.html"; // Redirect after signup
            } else {
                throw new Error("User authentication failed.");
            }
        } catch (error) {
            console.error("❌ Signup error:", error.message);
            alert(error.message);

        }
    });
});
