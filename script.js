// --- Page Navigation ---
function nextPage(pageNum) {
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  document.getElementById('page' + pageNum).classList.add('active');
}

// --- Live Counter Logic ---
let counterInterval;

function startCounter() {
  const dateInput = document.getElementById('specialDate').value;
  
  // Validation: User must choose a date
  if (!dateInput) {
    alert("Pehle humari special date choose toh karo! ❤️");
    return;
  }

  const specialDate = new Date(dateInput);
  
  if (counterInterval) clearInterval(counterInterval);

  function updateCounter() {
    const now = new Date();
    let diff = now - specialDate;
    
    if (diff < 0) diff = 0;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('days').innerText = String(days).padStart(2, '0');
    document.getElementById('hours').innerText = String(hours).padStart(2, '0');
    document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
    document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');
  }

  updateCounter();
  counterInterval = setInterval(updateCounter, 1000);
  nextPage(3); // Move to counter page
}

// --- Photo Slider Logic ---
let currentSlide = 0;

function changeSlide(direction) {
  const slides = document.querySelectorAll('#page5 .slide');
  if (slides.length === 0) return;
  
  slides[currentSlide].classList.remove('active');
  currentSlide = (currentSlide + direction + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
}

// Mobile Touch Swipe Support
let touchstartX = 0;
let touchendX = 0;

document.addEventListener('DOMContentLoaded', () => {
  const sliderZone = document.querySelector('.slider-container');
  if (sliderZone) {
    sliderZone.addEventListener('touchstart', e => { 
      touchstartX = e.changedTouches[0].screenX; 
    });
    sliderZone.addEventListener('touchend', e => { 
      touchendX = e.changedTouches[0].screenX; 
      handleSwipe();
    });
  }
});

function handleSwipe() {
  if (touchendX < touchstartX - 50) changeSlide(1);  // Swipe left -> next
  if (touchendX > touchstartX + 50) changeSlide(-1); // Swipe right -> prev
}

// --- Final Screen & Fireworks ---
function finalScreen() {
  nextPage(6);
  initFireworks();
}

// --- Fireworks Animation Code ---
function initFireworks() {
  const canvas = document.getElementById('fireworksCanvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const fireworks = [];
  const particles = [];

  class Firework {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height;
      this.sx = Math.random() * 3 - 1.5;
      this.sy = Math.random() * -3 - 3;
      this.size = Math.random() * 2 + 1;
      this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
      this.exploded = false;
    }
    update() {
      this.x += this.sx;
      this.y += this.sy;
      this.sy += 0.02;
      if (this.sy >= 0 && !this.exploded) {
        this.explode();
        this.exploded = true;
      }
    }
    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
    explode() {
      for (let i = 0; i < 50; i++) {
        particles.push(new Particle(this.x, this.y, this.color));
      }
    }
  }

  class Particle {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.sx = Math.random() * 4 - 2;
      this.sy = Math.random() * 4 - 2;
      this.size = Math.random() * 1.5;
      this.color = color;
      this.life = 100;
    }
    update() {
      this.x += this.sx;
      this.y += this.sy;
      this.sy += 0.03;
      this.life -= 1;
    }
    draw() {
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.life / 100;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  function animate() {
    if (!document.getElementById('page6').classList.contains('active')) return;
    ctx.fillStyle = 'rgba(13, 1, 17, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (Math.random() < 0.05) fireworks.push(new Firework());
    
    fireworks.forEach((firework, index) => {
      firework.update();
      firework.draw();
      if (firework.exploded && particles.length === 0) fireworks.splice(index, 1);
    });
    
    particles.forEach((particle, index) => {
      particle.update();
      particle.draw();
      if (particle.life <= 0) particles.splice(index, 1);
    });
    
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  animate();
              }
