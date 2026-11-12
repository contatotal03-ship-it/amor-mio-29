/**
 * ============================================================================
 * RUMBO A TUS 29 · INTERACTIVE DYNAMICS ENGINE
 * Pop-ups centrados en pantalla + mensajes únicos por cada respuesta.
 * ============================================================================
 */

import { launchGoldConfetti } from './particles.js';

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

/**
 * Displays a centered luxury pop-up right in front of her eyes when clicking any option.
 */
export function showDynamicPopup({
  icon = '✨',
  title = '¡Sorpresa!',
  message = '',
  isSuccess = true,
  buttonText = 'Continuar ✨'
}) {
  const existing = document.querySelector('.dynamic-popup-backdrop');
  if (existing) existing.remove();

  const backdrop = el('div', 'dynamic-popup-backdrop');
  const card = el('div', 'dynamic-popup-card' + (isSuccess ? '' : ' is-nudge'));

  card.appendChild(el('div', 'dynamic-popup-icon', icon));
  const h3 = el('h3', 'dynamic-popup-title gold-text', title);
  card.appendChild(h3);
  card.appendChild(el('p', 'dynamic-popup-msg', message));

  const btn = el('button', isSuccess ? 'btn btn-gold' : 'btn btn-rose', buttonText);
  btn.type = 'button';
  btn.addEventListener('click', () => backdrop.remove());
  card.appendChild(btn);

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) backdrop.remove();
  });

  backdrop.appendChild(card);
  document.body.appendChild(backdrop);
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
  const rewardText = payload.secretReward || '¡Sorpresa desbloqueada!';
  const reward = el('div', 'scratch-reveal-text', rewardText);
  box.appendChild(reward);

  if (!capsule.dynamicDone) {
    const canvas = document.createElement('canvas');
    canvas.className = 'scratch-canvas';
    box.appendChild(canvas);

    requestAnimationFrame(() => initGoldScratchCanvas(canvas, () => {
      canvas.style.opacity = '0';
      canvas.style.pointerEvents = 'none';
      launchGoldConfetti();
      showDynamicPopup({
        icon: '🪙',
        title: '¡Sorpresa Revelada!',
        message: rewardText,
        isSuccess: true,
        buttonText: '¡Me encanta! ✨'
      });
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
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, '#a67c1e');
  grad.addColorStop(0.28, '#f5e1a4');
  grad.addColorStop(0.55, '#d4af37');
  grad.addColorStop(0.82, '#faecc4');
  grad.addColorStop(1, '#8c6614');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

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
    const step = 16;
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
// 2. TRIVIA SECRETA (Respuesta única en pantalla por cada botón)
// ---------------------------------------------------------------------------
function renderTriviaDynamic(card, capsule, payload, onComplete) {
  card.appendChild(el('span', 'dynamic-badge', '🧠 Trivia de Nosotros'));
  card.appendChild(el('h3', 'dynamic-prompt', payload.question || '¿Cuánto nos conocemos?'));

  const list = el('div', 'options-list');
  const options = Array.isArray(payload.options) ? payload.options : [];
  const feedbacks = Array.isArray(payload.optionFeedbacks) ? payload.optionFeedbacks : [];
  const correctIdx = Number(payload.correctIndex ?? 0);

  const rewardBox = el(
    'div',
    'reward-reveal',
    feedbacks[correctIdx] || payload.rewardText || '¡Acertaste!'
  );
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
      const customMsg = (feedbacks[idx] || '').trim();

      if (idx === correctIdx) {
        btn.classList.add('is-correct');
        list.querySelectorAll('button').forEach((b) => (b.disabled = true));
        const winText = customMsg || payload.rewardText || '¡Acertaste, amor mío!';
        rewardBox.textContent = winText;
        rewardBox.classList.remove('hidden');
        launchGoldConfetti();
        showDynamicPopup({
          icon: '💖',
          title: '¡Respuesta Correcta!',
          message: winText,
          isSuccess: true,
          buttonText: '¡Me encanta! ✨'
        });
        onComplete({ dynamicDone: true, dynamicAnswer: opt });
      } else {
        btn.classList.add('is-wrong', 'shake');
        setTimeout(() => btn.classList.remove('shake'), 500);
        const nudgeText =
          customMsg || payload.hint || '¡Casi, mi princesa! Intenta con otra de las opciones 😘';
        showDynamicPopup({
          icon: '😘',
          title: 'Mmm... ¡casi!',
          message: nudgeText,
          isSuccess: false,
          buttonText: 'Seguir intentando ✨'
        });
      }
    });
    list.appendChild(btn);
  });

  card.appendChild(list);
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

  const rewardText = payload.rewardText || '¡Código correcto!';
  const rewardBox = el('div', 'reward-reveal', rewardText);

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
      showDynamicPopup({
        icon: '🗝️',
        title: '¡Tesoro Desbloqueado!',
        message: rewardText,
        isSuccess: true,
        buttonText: '¡Genial! ✨'
      });
      onComplete({ dynamicDone: true, dynamicAnswer: entered });
    } else {
      input.classList.add('shake');
      setTimeout(() => input.classList.remove('shake'), 500);
      showDynamicPopup({
        icon: '🕵️‍♀️',
        title: 'Esa no es la clave',
        message: 'Sigue buscando en la pista... ¡cuando encuentres la palabra exacta se abrirá! ✨',
        isSuccess: false,
        buttonText: 'Intentar de nuevo'
      });
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
  const titleText = payload.couponTitle || 'VALE POR UN CAPRICHO';
  const title = el('h3', 'font-display gold-text', titleText);
  title.style.fontSize = '1.65rem';
  title.style.marginBottom = '8px';

  const desc = el('p', '', payload.couponDesc || '');
  desc.style.color = 'var(--text-muted)';
  desc.style.fontSize = '0.94rem';
  desc.style.marginBottom = '18px';

  coupon.appendChild(title);
  coupon.appendChild(desc);

  if (capsule.dynamicDone) {
    coupon.appendChild(el('div', 'vip-stamp', `CANJEADO ✓ ${capsule.dynamicAnswer || ''}`));
  } else {
    const btn = el('button', 'btn btn-gold', 'Canjear este Cupón ✨');
    btn.addEventListener('click', () => {
      const stampText = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
      btn.replaceWith(el('div', 'vip-stamp', `CANJEADO ✓ ${stampText}`));
      launchGoldConfetti();
      showDynamicPopup({
        icon: '🎟️',
        title: '¡Cupón VIP Sellado!',
        message: `Has abierto "${titleText}". Todo ya está listo para consentirte como mereces, mi princesa 💖`,
        isSuccess: true,
        buttonText: '¡Qué emoción! ✨'
      });
      onComplete({ dynamicDone: true, dynamicAnswer: stampText });
    });
    coupon.appendChild(btn);
  }

  card.appendChild(coupon);
}

// ---------------------------------------------------------------------------
// 5. INVITACIÓN CON MISTERIO (Todo dispuesto con certeza; respuesta única por opción)
// ---------------------------------------------------------------------------
function renderChallengeDynamic(card, capsule, payload, onComplete) {
  card.appendChild(el('span', 'dynamic-badge', '✨ Tu Destino de Hoy'));
  card.appendChild(
    el('h3', 'dynamic-prompt', payload.prompt || 'Todo está preparado para ti… elige cuál deseas descubrir primero')
  );

  const list = el('div', 'options-list');
  const choices = Array.isArray(payload.choices) ? payload.choices : [];
  const feedbacks = Array.isArray(payload.choiceFeedbacks) ? payload.choiceFeedbacks : [];

  const chosenBox = el('div', 'reward-reveal', '');
  if (capsule.dynamicDone && capsule.dynamicAnswer) {
    const idx = choices.indexOf(capsule.dynamicAnswer);
    chosenBox.textContent = (idx >= 0 && feedbacks[idx]) || `Tu destino elegido: ${capsule.dynamicAnswer}`;
  } else {
    chosenBox.classList.add('hidden');
  }

  choices.forEach((choice, idx) => {
    const btn = el('button', 'option-btn', choice);
    if (capsule.dynamicDone && capsule.dynamicAnswer === choice) {
      btn.classList.add('is-correct');
    }
    btn.addEventListener('click', () => {
      list.querySelectorAll('.option-btn').forEach((b) => b.classList.remove('is-correct'));
      btn.classList.add('is-correct');
      const customFb =
        (feedbacks[idx] || '').trim() ||
        `Todo está dispuesto y reservado para "${choice}". Prepárate para dejarte sorprender, amor mío 💖`;
      chosenBox.textContent = customFb;
      chosenBox.classList.remove('hidden');
      launchGoldConfetti();
      showDynamicPopup({
        icon: '✨',
        title: '¡Todo Listo para Ti!',
        message: customFb,
        isSuccess: true,
        buttonText: '¡Qué ilusión! 💖'
      });
      onComplete({ dynamicDone: true, dynamicAnswer: choice });
    });
    list.appendChild(btn);
  });

  card.appendChild(list);
  card.appendChild(chosenBox);
}
