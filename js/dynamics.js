/**
 * ============================================================================
 * 29 CAPÍTULOS · INTERACTIVE DYNAMICS ENGINE
 * Renderiza Raspa y Gana, Trivia, Búsqueda del Tesoro, Cupones VIP y Elecciones.
 * ============================================================================
 */

import { launchGoldConfetti, showToast } from './particles.js';

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function renderDynamicSection(container, capsule, onComplete) {
  container.innerHTML = '';
  const type = capsule.dynamicType || 'classic';
  const payload = capsule.dynamicPayload || {};

  if (type === 'classic') return;

  const card = el('div', 'dynamic-card');

  if (type === 'scratch') {
    renderScratchDynamic(card, capsule, payload, onComplete);
  } else if (type === 'trivia') {
    renderTriviaDynamic(card, capsule, payload, onComplete);
  } else if (type === 'clue') {
    renderClueDynamic(card, capsule, payload, onComplete);
  } else if (type === 'coupon') {
    renderCouponDynamic(card, capsule, payload, onComplete);
  } else if (type === 'challenge') {
    renderChallengeDynamic(card, capsule, payload, onComplete);
  }

  container.appendChild(card);
}

// ---------------------------------------------------------------------------
// 1. RASPA Y GANA DORADO (HTML5 Canvas Gold Foil)
// ---------------------------------------------------------------------------
function renderScratchDynamic(card, capsule, payload, onComplete) {
  card.appendChild(el('span', 'dynamic-badge', '🪙 Raspa y Gana Dorado'));
  card.appendChild(el('h3', 'dynamic-prompt', payload.prompt || 'Raspa el oro con tu dedo para revelar tu sorpresa'));

  const box = el('div', 'scratch-container');
  const reward = el('div', 'scratch-reveal-text', payload.secretReward || '¡Sorpresa desbloqueada!');
  box.appendChild(reward);

  if (!capsule.dynamicDone) {
    const canvas = document.createElement('canvas');
    canvas.className = 'scratch-canvas';
    box.appendChild(canvas);

    requestAnimationFrame(() => initGoldScratchCanvas(canvas, () => {
      canvas.style.opacity = '0';
      canvas.style.pointerEvents = 'none';
      launchGoldConfetti();
      showToast('✨ ¡Sorpresa revelada!');
      onComplete({ dynamicDone: true, dynamicAnswer: 'Raspado' });
    }));
  }

  card.appendChild(box);
}

function initGoldScratchCanvas(canvas, onRevealed) {
  const rect = canvas.parentElement.getBoundingClientRect();
  const w = Math.max(280, Math.floor(rect.width));
  const h = Math.max(175, Math.floor(rect.height));
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext('2d');
  // Draw luxury champagne gold metallic gradient
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, '#a67c1e');
  grad.addColorStop(0.28, '#f5e1a4');
  grad.addColorStop(0.55, '#d4af37');
  grad.addColorStop(0.82, '#faecc4');
  grad.addColorStop(1, '#8c6614');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Delicate sparkle dots on foil
  for (let i = 0; i < 65; i++) {
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.32})`;
    ctx.beginPath();
    ctx.arc(Math.random() * w, Math.random() * h, Math.random() * 2 + 0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = '#2d1f05';
  ctx.font = '600 16px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('✨ RASPA AQUÍ CON TU DEDO ✨', w / 2, h / 2);

  let drawing = false;
  let done = false;
  let strokes = 0;

  function scratchAt(clientX, clientY) {
    if (done) return;
    const r = canvas.getBoundingClientRect();
    const x = ((clientX - r.left) / r.width) * w;
    const y = ((clientY - r.top) / r.height) * h;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 26, 0, Math.PI * 2);
    ctx.fill();

    strokes++;
    if (strokes % 10 === 0) checkPercent();
  }

  function checkPercent() {
    if (done) return;
    const pixels = ctx.getImageData(0, 0, w, h).data;
    let cleared = 0;
    const step = 16; // fast sampling
    let total = 0;
    for (let i = 3; i < pixels.length; i += 4 * step) {
      total++;
      if (pixels[i] < 128) cleared++;
    }
    if (cleared / total >= 0.48) {
      done = true;
      onRevealed();
    }
  }

  canvas.addEventListener('pointerdown', (e) => {
    drawing = true;
    canvas.setPointerCapture(e.pointerId);
    scratchAt(e.clientX, e.clientY);
  });
  canvas.addEventListener('pointermove', (e) => {
    if (drawing) scratchAt(e.clientX, e.clientY);
  });
  canvas.addEventListener('pointerup', () => {
    drawing = false;
    checkPercent();
  });
}

// ---------------------------------------------------------------------------
// 2. TRIVIA SECRETA DE NOSOTROS
// ---------------------------------------------------------------------------
function renderTriviaDynamic(card, capsule, payload, onComplete) {
  card.appendChild(el('span', 'dynamic-badge', '🧠 Trivia de Nosotros'));
  card.appendChild(el('h3', 'dynamic-prompt', payload.question || '¿Cuánto nos conocemos?'));

  const list = el('div', 'options-list');
  const options = Array.isArray(payload.options) ? payload.options : [];
  const correctIdx = Number(payload.correctIndex ?? 0);

  const hintBox = el('p', '', '');
  hintBox.style.marginTop = '12px';
  hintBox.style.fontSize = '0.88rem';
  hintBox.style.color = 'var(--rose-champagne)';
  hintBox.classList.add('hidden');

  const rewardBox = el('div', 'reward-reveal', payload.rewardText || '¡Acertaste!');
  if (!capsule.dynamicDone) rewardBox.classList.add('hidden');

  options.forEach((opt, idx) => {
    const btn = el('button', 'option-btn', opt);
    if (capsule.dynamicDone && idx === correctIdx) {
      btn.classList.add('is-correct');
      btn.disabled = true;
    } else if (capsule.dynamicDone) {
      btn.disabled = true;
    }

    btn.addEventListener('click', () => {
      if (capsule.dynamicDone) return;
      if (idx === correctIdx) {
        btn.classList.add('is-correct');
        list.querySelectorAll('button').forEach((b) => (b.disabled = true));
        hintBox.classList.add('hidden');
        rewardBox.classList.remove('hidden');
        launchGoldConfetti();
        showToast('💖 ¡Respuesta correcta!');
        onComplete({ dynamicDone: true, dynamicAnswer: opt });
      } else {
        btn.classList.add('is-wrong', 'shake');
        setTimeout(() => btn.classList.remove('shake'), 500);
        if (payload.hint) {
          hintBox.textContent = payload.hint;
          hintBox.classList.remove('hidden');
        } else {
          showToast('¡Casi! Intenta otra opción 😘');
        }
      }
    });
    list.appendChild(btn);
  });

  card.appendChild(list);
  card.appendChild(hintBox);
  card.appendChild(rewardBox);
}

// ---------------------------------------------------------------------------
// 3. BÚSQUEDA DEL TESORO / PALABRA SECRETA
// ---------------------------------------------------------------------------
function renderClueDynamic(card, capsule, payload, onComplete) {
  card.appendChild(el('span', 'dynamic-badge', '🕵️‍♀️ Búsqueda del Tesoro'));
  card.appendChild(el('h3', 'dynamic-prompt', 'Sigue la pista y escribe la palabra secreta'));

  const riddle = el('p', '', payload.riddle || '');
  riddle.style.marginBottom = '16px';
  riddle.style.color = 'var(--text-muted)';
  card.appendChild(riddle);

  const rewardBox = el('div', 'reward-reveal', payload.rewardText || '¡Código correcto!');

  if (capsule.dynamicDone) {
    card.appendChild(rewardBox);
    return;
  }

  const row = el('div', '');
  row.style.display = 'flex';
  row.style.gap = '10px';
  row.style.flexWrap = 'wrap';

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'input';
  input.placeholder = 'Escribe aquí la palabra clave...';
  input.style.flex = '1 1 200px';

  const submitBtn = el('button', 'btn btn-gold', 'Abrir Cofre ✨');

  rewardBox.classList.add('hidden');

  const checkCode = () => {
    const expected = (payload.secretCode || '').trim().toUpperCase();
    const entered = input.value.trim().toUpperCase();
    if (!entered) return;

    if (!expected || entered === expected) {
      row.classList.add('hidden');
      rewardBox.classList.remove('hidden');
      launchGoldConfetti();
      showToast('🗝️ ¡Tesoro desbloqueado!');
      onComplete({ dynamicDone: true, dynamicAnswer: entered });
    } else {
      input.classList.add('shake');
      setTimeout(() => input.classList.remove('shake'), 500);
      showToast('Mmm... esa no es la clave. ¡Sigue buscando! ✨');
    }
  };

  submitBtn.addEventListener('click', checkCode);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') checkCode();
  });

  row.appendChild(input);
  row.appendChild(submitBtn);
  card.appendChild(row);
  card.appendChild(rewardBox);
}

// ---------------------------------------------------------------------------
// 4. CUPÓN VIP DORADO CANJEABLE
// ---------------------------------------------------------------------------
function renderCouponDynamic(card, capsule, payload, onComplete) {
  card.appendChild(el('span', 'dynamic-badge', '🎟️ Pase VIP Exclusivo'));

  const coupon = el('div', 'vip-coupon');
  const title = el('h3', 'font-display gold-text', payload.couponTitle || 'VALE POR UN CAPRICHO');
  title.style.fontSize = '1.65rem';
  title.style.marginBottom = '8px';

  const desc = el('p', '', payload.couponDesc || '');
  desc.style.color = 'var(--text-muted)';
  desc.style.fontSize = '0.94rem';
  desc.style.marginBottom = '18px';

  coupon.appendChild(title);
  coupon.appendChild(desc);

  if (capsule.dynamicDone) {
    const stamp = el('div', 'vip-stamp', `CANJEADO ✓ ${capsule.dynamicAnswer || ''}`);
    coupon.appendChild(stamp);
  } else {
    const btn = el('button', 'btn btn-gold', 'Canjear este Cupón ✨');
    btn.addEventListener('click', () => {
      const stampText = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
      btn.replaceWith(el('div', 'vip-stamp', `CANJEADO ✓ ${stampText}`));
      launchGoldConfetti();
      showToast('🎟️ ¡Cupón canjeado! Ya quedó registrado.');
      onComplete({ dynamicDone: true, dynamicAnswer: stampText });
    });
    coupon.appendChild(btn);
  }

  card.appendChild(coupon);
}

// ---------------------------------------------------------------------------
// 5. ELECCIÓN / MISIÓN DEL DÍA
// ---------------------------------------------------------------------------
function renderChallengeDynamic(card, capsule, payload, onComplete) {
  card.appendChild(el('span', 'dynamic-badge', '✨ Tú Eliges Hoy'));
  card.appendChild(el('h3', 'dynamic-prompt', payload.prompt || '¿Qué prefieres hoy?'));

  const list = el('div', 'options-list');
  const choices = Array.isArray(payload.choices) ? payload.choices : [];

  choices.forEach((choice) => {
    const btn = el('button', 'option-btn', choice);
    if (capsule.dynamicDone && capsule.dynamicAnswer === choice) {
      btn.classList.add('is-correct');
    }
    btn.addEventListener('click', () => {
      list.querySelectorAll('.option-btn').forEach((b) => b.classList.remove('is-correct'));
      btn.classList.add('is-correct');
      launchGoldConfetti();
      showToast('💖 ¡Elección guardada para él!');
      onComplete({ dynamicDone: true, dynamicAnswer: choice });
    });
    list.appendChild(btn);
  });

  card.appendChild(list);
}

