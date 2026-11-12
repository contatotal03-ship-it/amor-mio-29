/**
 * Luxury Stardust Ambient Background & Golden Confetti Helper
 */

export function initStardust(canvasId = 'particles-canvas') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const count = Math.min(48, Math.floor((width * height) / 26000) + 18);
  const particles = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: Math.random() * 1.8 + 0.5,
    vx: (Math.random() - 0.5) * 0.18,
    vy: -(Math.random() * 0.25 + 0.08),
    alpha: Math.random() * 0.55 + 0.2,
    phase: Math.random() * Math.PI * 2
  }));

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  function tick() {
    ctx.clearRect(0, 0, width, height);
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.phase += 0.015;
      if (p.y < -10) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      const twinkle = p.alpha * (0.65 + 0.35 * Math.sin(p.phase));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(244, 222, 155, ${twinkle.toFixed(3)})`;
      ctx.fill();
    }
    requestAnimationFrame(tick);
  }
  tick();
}

let confettiLoader = null;
export async function launchGoldConfetti() {
  try {
    if (!confettiLoader) {
      confettiLoader = import('https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/+esm')
        .then((mod) => mod.default || mod);
    }
    const confetti = await confettiLoader;
    const colors = ['#f9ecc6', '#d4af37', '#e8b4b8', '#ffffff'];
    confetti({
      particleCount: 70,
      spread: 75,
      origin: { y: 0.6 },
      colors
    });
    setTimeout(() => {
      confetti({
        particleCount: 45,
        angle: 60,
        spread: 55,
        origin: { x: 0.1, y: 0.7 },
        colors
      });
      confetti({
        particleCount: 45,
        angle: 120,
        spread: 55,
        origin: { x: 0.9, y: 0.7 },
        colors
      });
    }, 220);
  } catch {
    // Graceful no-op if offline without cached confetti
  }
}

/**
 * Simple toast notification
 */
export function showToast(message, duration = 3400) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  while (container.children.length >= 2) {
    container.firstElementChild.remove();
  }
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = message;
  container.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(10px)';
    el.style.transition = 'all 0.3s ease';
    setTimeout(() => el.remove(), 320);
  }, duration);
}

