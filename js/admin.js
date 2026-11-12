/**
 * ============================================================================
 * 29 CAPÍTULOS · COMMAND CENTER CONTROLLER (HIS ADMIN)
 * ============================================================================
 */

import {
  getBackendMode,
  isLocalhostEnv,
  setLocalPreviewOverride,
  saveCloudCreds,
  getLocalAdminPin,
  setLocalAdminPin,
  getAdminSession,
  signInGitHubAdmin,
  signInCloudAdmin,
  signOutCloudAdmin,
  getAdminSettings,
  saveAdminSettings,
  getAdminCapsules,
  saveAdminCapsule,
  getPrivateAdminSettings,
  savePrivateAdminSettings,
  uploadMediaFile,
  resolveMediaUrl,
  toSpotifyEmbedUrl,
  exportFullBackupJson,
  importFullBackupJson
} from './store.js';
import { PUBLIC_CONFIG } from './config.js';
import { IDEAS_BANK, DYNAMIC_TYPES } from './ideas-bank.js';
import { initStardust, showToast, launchGoldConfetti } from './particles.js';
import { openCinemaModal, renderAndDownloadFinaleVideo } from './cinema.js';

let state = {
  settings: null,
  privateSettings: null,
  capsules: [],
  selectedDay: 1,
  ideasActFilter: 'all',
  mediaRecorder: null,
  audioChunks: []
};

// ---------------------------------------------------------------------------
// Boot & Auth Gate
// ---------------------------------------------------------------------------
async function init() {
  initStardust();
  bindStaticEvents();
  await checkAuthGate();
}

async function checkAuthGate() {
  const mode = getBackendMode();
  const localForm = document.getElementById('local-login-form');
  const cloudForm = document.getElementById('cloud-login-form');
  const githubForm = document.getElementById('github-login-form');
  const localSwitchBtn = document.getElementById('switch-local-dev-btn');
  const gate = document.getElementById('admin-gate');
  const shell = document.getElementById('admin-shell');

  localForm.classList.add('hidden');
  cloudForm.classList.add('hidden');
  githubForm.classList.add('hidden');

  if (mode === 'local') {
    if (sessionStorage.getItem('cap29_local_unlocked') === '1') {
      await enterCommandCenter('local');
      return;
    }
    gate.classList.remove('hidden');
    shell.classList.add('hidden');
    localForm.classList.remove('hidden');
    return;
  }

  const session = await getAdminSession();
  if (session && (session.mode === 'github' || session.mode === 'supabase')) {
    await enterCommandCenter(session.mode);
    return;
  }

  gate.classList.remove('hidden');
  shell.classList.add('hidden');
  if (mode === 'github') {
    githubForm.classList.remove('hidden');
    if (isLocalhostEnv()) localSwitchBtn.classList.remove('hidden');
  } else {
    cloudForm.classList.remove('hidden');
  }
}

async function enterCommandCenter(mode) {
  const badge = document.getElementById('mode-badge');
  const logoutBtn = document.getElementById('cloud-logout-btn');
  if (mode === 'github') {
    badge.textContent = '☁️ Nube GitHub 24/7 (Activo)';
    badge.className = 'status-pill is-cloud';
    logoutBtn.classList.remove('hidden');
  } else if (mode === 'supabase') {
    badge.textContent = '☁️ Nube En Vivo (Supabase)';
    badge.className = 'status-pill is-cloud';
    logoutBtn.classList.remove('hidden');
  } else {
    badge.textContent = '💻 Modo Local (Pruebas)';
    badge.className = 'status-pill is-local';
    logoutBtn.classList.add('hidden');
  }

  await refreshAdminData();
  document.getElementById('admin-gate').classList.add('hidden');
  document.getElementById('admin-shell').classList.remove('hidden');
}

async function refreshAdminData() {
  const [settings, capsules, priv] = await Promise.all([
    getAdminSettings(),
    getAdminCapsules(),
    getPrivateAdminSettings()
  ]);
  state.settings = settings;
  state.capsules = capsules;
  state.privateSettings = priv;

  renderStats();
  renderDaysGrid();
  loadDayIntoEditor(state.selectedDay);
  renderIdeasGrid();
  populateSettingsForms();
  renderQrPreview();
}

// ---------------------------------------------------------------------------
// Stats & 30-Day Grid
// ---------------------------------------------------------------------------
function renderStats() {
  const authCount = state.capsules.filter((c) => c.isAuthorized).length;
  const openCount = state.capsules.filter((c) => c.isAuthorized && c.isOpenedByHer).length;
  const replyCount = state.capsules.filter((c) => c.herReply && c.herReply.trim()).length;
  const favCount = state.capsules.filter((c) => c.isFavorite).length;

  document.getElementById('stat-authorized').textContent = `${authCount} / 30`;
  document.getElementById('stat-opened').textContent = String(openCount);
  document.getElementById('stat-replies').textContent = String(replyCount);
  document.getElementById('stat-favorites').textContent = String(favCount);
}

function renderDaysGrid() {
  const grid = document.getElementById('days-selector-grid');
  grid.innerHTML = '';

  for (const cap of state.capsules) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'day-tile';
    if (cap.dayNumber === state.selectedDay) btn.classList.add('is-selected');
    if (cap.isAuthorized && cap.isOpenedByHer) btn.classList.add('state-opened');
    else if (cap.isAuthorized) btn.classList.add('state-authorized');

    const num = document.createElement('span');
    num.textContent = String(cap.dayNumber).padStart(2, '0');
    const icon = document.createElement('span');
    icon.style.fontSize = '0.78rem';
    icon.textContent = !cap.isAuthorized ? '🔒' : cap.isOpenedByHer ? '💖' : '✨';

    btn.appendChild(num);
    btn.appendChild(icon);

    if (cap.herReply && cap.herReply.trim()) {
      const dot = document.createElement('span');
      dot.className = 'day-tile-dot';
      dot.textContent = '💬';
      btn.appendChild(dot);
    }

    btn.addEventListener('click', () => {
      state.selectedDay = cap.dayNumber;
      renderDaysGrid();
      loadDayIntoEditor(cap.dayNumber);
    });

    grid.appendChild(btn);
  }
}

// ---------------------------------------------------------------------------
// Day Editor
// ---------------------------------------------------------------------------
function getCurrentCapsule() {
  return state.capsules.find((c) => c.dayNumber === state.selectedDay);
}

function loadDayIntoEditor(dayNumber) {
  const cap = state.capsules.find((c) => c.dayNumber === dayNumber);
  if (!cap) return;

  const idea = IDEAS_BANK.find((i) => i.day === dayNumber);
  document.getElementById('ed-act-badge').textContent = idea ? idea.act : 'Capítulo';
  document.getElementById('ed-day-heading').textContent = `Capítulo ${String(dayNumber).padStart(2, '0')}`;

  updateAuthorizeButtonUI(cap);

  // Show her interaction if any
  const actBox = document.getElementById('ed-her-activity');
  const actText = document.getElementById('ed-her-activity-text');
  const lines = [];
  if (cap.isOpenedByHer) lines.push('✓ Ella ya rompió el sello y abrió esta cápsula.');
  if (cap.isFavorite) lines.push('❤️ La marcó como favorita.');
  if (cap.dynamicDone && cap.dynamicAnswer) {
    lines.push(`✨ Dinámica completada: "${cap.dynamicAnswer}"`);
  }
  if (cap.herReply) lines.push(`💬 Su mensaje para ti: "${cap.herReply}"`);

  if (lines.length > 0) {
    actBox.classList.remove('hidden');
    actText.textContent = lines.join('\n');
  } else {
    actBox.classList.add('hidden');
  }

  document.getElementById('ed-teaser').value = cap.teaserTitle || '';
  document.getElementById('ed-title').value = cap.unlockedTitle || '';
  document.getElementById('ed-message').value = cap.message || '';
  document.getElementById('ed-allow-reply').checked = Boolean(cap.allowReply);
  document.getElementById('ed-sunflowers').checked = Boolean(cap.hasSunflowers);
  document.getElementById('ed-dynamic-type').value = cap.dynamicType || 'classic';

  renderDynamicFieldsEditor(cap.dynamicType || 'classic', cap.dynamicPayload || {});
  renderAdminMediaList(cap.mediaItems || []);
}

function updateAuthorizeButtonUI(cap) {
  const btn = document.getElementById('ed-toggle-auth-btn');
  if (cap.isAuthorized) {
    btn.className = 'btn btn-danger btn-sm';
    btn.textContent = '🔒 Volver a Sellar (Ocultar)';
  } else {
    btn.className = 'btn btn-gold btn-sm';
    btn.textContent = '🔓 Autorizar Apertura Ahora';
  }
}

function renderDynamicFieldsEditor(type, payload = {}) {
  const container = document.getElementById('ed-dynamic-fields');
  container.innerHTML = '';

  if (type === 'classic') {
    const p = document.createElement('p');
    p.style.fontSize = '0.86rem';
    p.style.color = 'var(--text-muted)';
    p.textContent = '💌 Modalidad clásica: muestra la carta, fotos, videos y notas de voz de forma elegante.';
    container.appendChild(p);
    return;
  }

  if (type === 'scratch') {
    container.innerHTML = `
      <div class="form-grid">
        <div>
          <label class="field-label">Texto sobre la tarjeta dorada</label>
          <input id="dyn-prompt" type="text" class="input" placeholder="Ej: Raspa el oro con tu dedo" />
        </div>
        <div>
          <label class="field-label">Sorpresa / Premio oculto debajo del oro</label>
          <input id="dyn-reward" type="text" class="input" placeholder="Ej: Vale por una cena donde tú quieras" />
        </div>
      </div>
    `;
    container.querySelector('#dyn-prompt').value = payload.prompt || '';
    container.querySelector('#dyn-reward').value = payload.secretReward || '';
    return;
  }

  if (type === 'trivia') {
    const opts = Array.isArray(payload.options) ? payload.options : ['', '', '', ''];
    container.innerHTML = `
      <div class="form-grid">
        <div>
          <label class="field-label">Pregunta para ella</label>
          <input id="dyn-question" type="text" class="input" />
        </div>
        <div class="form-row-2">
          <div><label class="field-label">Opción 1</label><input id="dyn-opt-0" type="text" class="input" /></div>
          <div><label class="field-label">Opción 2</label><input id="dyn-opt-1" type="text" class="input" /></div>
          <div><label class="field-label">Opción 3</label><input id="dyn-opt-2" type="text" class="input" /></div>
          <div><label class="field-label">Opción 4</label><input id="dyn-opt-3" type="text" class="input" /></div>
        </div>
        <div class="form-row-2">
          <div>
            <label class="field-label">Opción Correcta</label>
            <select id="dyn-correct" class="select">
              <option value="0">Opción 1</option>
              <option value="1">Opción 2</option>
              <option value="2">Opción 3</option>
              <option value="3">Opción 4</option>
            </select>
          </div>
          <div>
            <label class="field-label">Pista si falla</label>
            <input id="dyn-hint" type="text" class="input" />
          </div>
        </div>
        <div>
          <label class="field-label">Recompensa al acertar</label>
          <input id="dyn-reward" type="text" class="input" />
        </div>
      </div>
    `;
    container.querySelector('#dyn-question').value = payload.question || '';
    for (let i = 0; i < 4; i++) container.querySelector(`#dyn-opt-${i}`).value = opts[i] || '';
    container.querySelector('#dyn-correct').value = String(payload.correctIndex ?? 0);
    container.querySelector('#dyn-hint').value = payload.hint || '';
    container.querySelector('#dyn-reward').value = payload.rewardText || '';
    return;
  }

  if (type === 'clue') {
    container.innerHTML = `
      <div class="form-grid">
        <div>
          <label class="field-label">Acertijo o Pista Física (dónde buscar)</label>
          <textarea id="dyn-riddle" class="textarea" style="min-height:80px;"></textarea>
        </div>
        <div class="form-row-2">
          <div>
            <label class="field-label">Palabra Clave Secreta</label>
            <input id="dyn-code" type="text" class="input" placeholder="Ej: SIEMPRE" />
          </div>
          <div>
            <label class="field-label">Mensaje / Premio al descifrar</label>
            <input id="dyn-reward" type="text" class="input" />
          </div>
        </div>
      </div>
    `;
    container.querySelector('#dyn-riddle').value = payload.riddle || '';
    container.querySelector('#dyn-code').value = payload.secretCode || '';
    container.querySelector('#dyn-reward').value = payload.rewardText || '';
    return;
  }

  if (type === 'coupon') {
    container.innerHTML = `
      <div class="form-grid">
        <div>
          <label class="field-label">Título del Cupón VIP</label>
          <input id="dyn-coupon-title" type="text" class="input" placeholder="Ej: MASAJE RELAX + CENA PRIVADA" />
        </div>
        <div>
          <label class="field-label">Descripción / Condiciones del Vale</label>
          <input id="dyn-coupon-desc" type="text" class="input" />
        </div>
      </div>
    `;
    container.querySelector('#dyn-coupon-title').value = payload.couponTitle || '';
    container.querySelector('#dyn-coupon-desc').value = payload.couponDesc || '';
    return;
  }

  if (type === 'challenge') {
    const ch = Array.isArray(payload.choices) ? payload.choices : ['', '', ''];
    container.innerHTML = `
      <div class="form-grid">
        <div>
          <label class="field-label">Pregunta o Elección del Día</label>
          <input id="dyn-prompt" type="text" class="input" />
        </div>
        <div><label class="field-label">Opción A</label><input id="dyn-ch-0" type="text" class="input" /></div>
        <div><label class="field-label">Opción B</label><input id="dyn-ch-1" type="text" class="input" /></div>
        <div><label class="field-label">Opción C (Opcional)</label><input id="dyn-ch-2" type="text" class="input" /></div>
      </div>
    `;
    container.querySelector('#dyn-prompt').value = payload.prompt || '';
    for (let i = 0; i < 3; i++) container.querySelector(`#dyn-ch-${i}`).value = ch[i] || '';
  }
}

function collectDynamicPayloadFromEditor(type) {
  const c = document.getElementById('ed-dynamic-fields');
  if (type === 'scratch') {
    return {
      prompt: c.querySelector('#dyn-prompt')?.value.trim() || '',
      secretReward: c.querySelector('#dyn-reward')?.value.trim() || ''
    };
  }
  if (type === 'trivia') {
    return {
      question: c.querySelector('#dyn-question')?.value.trim() || '',
      options: [0, 1, 2, 3]
        .map((i) => c.querySelector(`#dyn-opt-${i}`)?.value.trim() || '')
        .filter(Boolean),
      correctIndex: Number(c.querySelector('#dyn-correct')?.value || 0),
      hint: c.querySelector('#dyn-hint')?.value.trim() || '',
      rewardText: c.querySelector('#dyn-reward')?.value.trim() || ''
    };
  }
  if (type === 'clue') {
    return {
      riddle: c.querySelector('#dyn-riddle')?.value.trim() || '',
      secretCode: c.querySelector('#dyn-code')?.value.trim() || '',
      rewardText: c.querySelector('#dyn-reward')?.value.trim() || ''
    };
  }
  if (type === 'coupon') {
    return {
      couponTitle: c.querySelector('#dyn-coupon-title')?.value.trim() || '',
      couponDesc: c.querySelector('#dyn-coupon-desc')?.value.trim() || ''
    };
  }
  if (type === 'challenge') {
    return {
      prompt: c.querySelector('#dyn-prompt')?.value.trim() || '',
      choices: [0, 1, 2]
        .map((i) => c.querySelector(`#dyn-ch-${i}`)?.value.trim() || '')
        .filter(Boolean)
    };
  }
  return {};
}

async function renderAdminMediaList(mediaItems) {
  const list = document.getElementById('ed-media-list');
  list.innerHTML = '';

  for (let i = 0; i < mediaItems.length; i++) {
    const item = mediaItems[i];
    const card = document.createElement('div');
    card.className = 'admin-media-card';

    const resolved = await resolveMediaUrl(item.url);

    if (item.type === 'image') {
      const img = document.createElement('img');
      img.src = resolved;
      card.appendChild(img);
    } else if (item.type === 'video') {
      const vid = document.createElement('video');
      vid.src = resolved;
      vid.controls = true;
      card.appendChild(vid);
    } else if (item.type === 'spotify') {
      const embedUrl = toSpotifyEmbedUrl(resolved);
      if (embedUrl) {
        const iframe = document.createElement('iframe');
        iframe.className = 'spotify-embed-frame';
        iframe.src = embedUrl;
        iframe.height = '80';
        iframe.loading = 'lazy';
        card.appendChild(iframe);
      } else {
        const box = document.createElement('div');
        box.style.padding = '12px';
        box.style.fontSize = '0.78rem';
        box.textContent = '🎵 Enlace Spotify inválido';
        card.appendChild(box);
      }
    } else {
      const box = document.createElement('div');
      box.style.padding = '14px 8px';
      box.innerHTML = '<div style="font-size:0.75rem;color:var(--gold-light);margin-bottom:6px;">🎙️ Audio</div>';
      const aud = document.createElement('audio');
      aud.src = resolved;
      aud.controls = true;
      aud.style.width = '100%';
      box.appendChild(aud);
      card.appendChild(box);
    }

    const meta = document.createElement('div');
    meta.className = 'admin-media-meta';

    const capInput = document.createElement('input');
    capInput.type = 'text';
    capInput.className = 'input';
    capInput.style.padding = '6px 8px';
    capInput.style.fontSize = '0.78rem';
    capInput.placeholder = 'Pie de foto/nota...';
    capInput.value = item.caption || '';
    capInput.addEventListener('input', () => {
      item.caption = capInput.value;
    });

    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.className = 'btn btn-danger btn-sm';
    delBtn.style.padding = '5px 10px';
    delBtn.textContent = 'Eliminar';
    delBtn.addEventListener('click', () => {
      const cap = getCurrentCapsule();
      cap.mediaItems.splice(i, 1);
      renderAdminMediaList(cap.mediaItems);
    });

    meta.appendChild(capInput);
    meta.appendChild(delBtn);
    card.appendChild(meta);
    list.appendChild(card);
  }
}

async function saveCurrentDayFromEditor() {
  const cap = getCurrentCapsule();
  if (!cap) return;

  cap.teaserTitle = document.getElementById('ed-teaser').value.trim();
  cap.unlockedTitle = document.getElementById('ed-title').value.trim();
  cap.message = document.getElementById('ed-message').value;
  cap.allowReply = document.getElementById('ed-allow-reply').checked;
  cap.hasSunflowers = document.getElementById('ed-sunflowers').checked;
  cap.dynamicType = document.getElementById('ed-dynamic-type').value;
  cap.dynamicPayload = collectDynamicPayloadFromEditor(cap.dynamicType);

  await saveAdminCapsule(cap);
  renderStats();
  renderDaysGrid();
  showToast(`💾 Capítulo ${String(cap.dayNumber).padStart(2, '0')} guardado`);
}

// ---------------------------------------------------------------------------
// Ideas Assistant
// ---------------------------------------------------------------------------
function renderIdeasGrid() {
  const grid = document.getElementById('ideas-grid');
  grid.innerHTML = '';

  const items = IDEAS_BANK.filter(
    (item) => state.ideasActFilter === 'all' || item.act === state.ideasActFilter
  );

  for (const idea of items) {
    const dynMeta = DYNAMIC_TYPES[idea.dynamicType] || DYNAMIC_TYPES.classic;
    const card = document.createElement('article');
    card.className = 'idea-card';

    const top = document.createElement('div');
    top.innerHTML = `
      <span class="idea-act-badge">${idea.act} · Día ${String(idea.day).padStart(2, '0')}</span>
      <h3 class="font-display gold-text" style="font-size:1.35rem;margin:4px 0 6px;">${idea.unlockedTitle}</h3>
      <span style="display:inline-block;font-size:0.74rem;color:var(--rose-champagne);margin-bottom:8px;">
        ${dynMeta.icon} ${dynMeta.label}
      </span>
      <p style="font-size:0.86rem;color:var(--text-muted);line-height:1.5;">${idea.suggestion}</p>
    `;

    const applyBtn = document.createElement('button');
    applyBtn.type = 'button';
    applyBtn.className = 'btn btn-glass btn-sm';
    applyBtn.textContent = `✨ Cargar al Día ${String(idea.day).padStart(2, '0')}`;
    applyBtn.addEventListener('click', () => {
      state.selectedDay = idea.day;
      const cap = getCurrentCapsule();
      cap.teaserTitle = idea.teaserTitle;
      cap.unlockedTitle = idea.unlockedTitle;
      cap.message = idea.message;
      cap.dynamicType = idea.dynamicType;
      cap.dynamicPayload = structuredClone(idea.dynamicPayload || {});

      switchTab('capsules');
      renderDaysGrid();
      loadDayIntoEditor(idea.day);
      showToast(`💡 Idea del Día ${idea.day} cargada en el editor (recuerda guardar).`);
    });

    card.appendChild(top);
    card.appendChild(applyBtn);
    grid.appendChild(card);
  }
}

// ---------------------------------------------------------------------------
// Settings, Finale, QR & Alerts
// ---------------------------------------------------------------------------
function populateSettingsForms() {
  const s = state.settings;
  const p = state.privateSettings;
  if (!s) return;

  document.getElementById('set-her-name').value = s.herName || '';
  document.getElementById('set-bday').value = (s.birthdayIso || '').slice(0, 16);
  document.getElementById('set-app-title').value = s.appTitle || '';
  document.getElementById('set-subtitle').value = s.appSubtitle || '';
  document.getElementById('set-music-url').value = s.musicUrl || '';

  // Finale tab
  document.getElementById('fin-title').value = s.finaleTitle || '';
  document.getElementById('fin-dedication').value = s.finaleDedication || '';
  updateFinaleToggleUI();

  // Alerts
  if (p) {
    document.getElementById('alert-wa-phone').value = p.whatsappPhone || '';
    document.getElementById('alert-wa-template').value =
      p.whatsappTemplate ||
      '✨ Hola {nombre}! Acabo de autorizar la apertura del Capítulo {capitulo} en tu universo. Entra a descubrirlo aquí: {link}';
    document.getElementById('alert-tg-token').value = p.telegramBotToken || '';
    document.getElementById('alert-tg-chat').value = p.telegramChatId || '';
  }

  // QR default URL
  const qrUrlInput = document.getElementById('qr-url-input');
  if (!qrUrlInput.value) {
    const base = window.location.href.replace(/admin\.html.*$/, 'index.html');
    qrUrlInput.value = base;
  }

  // Cloud creds fields
  const savedCreds = JSON.parse(localStorage.getItem('cap29_cloud_creds_v1') || '{}');
  document.getElementById('cloud-url-input').value = PUBLIC_CONFIG.supabaseUrl || savedCreds.url || '';
  document.getElementById('cloud-anon-input').value = PUBLIC_CONFIG.supabaseAnonKey || savedCreds.anonKey || '';
}

function updateFinaleToggleUI() {
  const btn = document.getElementById('finale-toggle-btn');
  if (state.settings?.finaleEnabled) {
    btn.className = 'btn btn-gold';
    btn.textContent = '🎬 Gran Final VISIBLE para Ella (Activo)';
  } else {
    btn.className = 'btn btn-glass';
    btn.textContent = '🎬 Gran Final OCULTO para Ella (Clic para activar)';
  }
}

// ---------------------------------------------------------------------------
// QR Code Preview & Luxury Printable Card PNG Exporter
// ---------------------------------------------------------------------------
function drawQrToCanvas(canvas, text, size = 210) {
  if (typeof window.qrcode !== 'function') return;
  const qr = window.qrcode(0, 'M');
  qr.addData(text || 'https://github.com');
  qr.make();

  const count = qr.getModuleCount();
  const ctx = canvas.getContext('2d');
  canvas.width = size;
  canvas.height = size;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);

  const cell = size / count;
  ctx.fillStyle = '#110c18';
  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; c++) {
      if (qr.isDark(r, c)) {
        ctx.fillRect(Math.floor(c * cell), Math.floor(r * cell), Math.ceil(cell), Math.ceil(cell));
      }
    }
  }
}

function renderQrPreview() {
  const url = document.getElementById('qr-url-input').value.trim() || window.location.origin;
  const msg = document.getElementById('qr-dedication-input').value.trim();

  document.getElementById('qr-preview-title').textContent = state.settings?.appTitle || '29 Capítulos';
  document.getElementById('qr-preview-her').textContent = `Para ${state.settings?.herName || 'Amor Mío'}`;
  document.getElementById('qr-preview-msg').textContent = msg;

  const canvas = document.getElementById('qr-canvas');
  drawQrToCanvas(canvas, url, 210);
}

function downloadLuxuryQrCard() {
  const url = document.getElementById('qr-url-input').value.trim();
  const msg = document.getElementById('qr-dedication-input').value.trim();
  const herName = state.settings?.herName || 'Amor Mío';
  const title = state.settings?.appTitle || '29 Capítulos';

  const w = 1080;
  const h = 1440;
  const card = document.createElement('canvas');
  card.width = w;
  card.height = h;
  const ctx = card.getContext('2d');

  // Luxury dark background
  const bg = ctx.createRadialGradient(w / 2, h * 0.3, 60, w / 2, h / 2, w * 0.9);
  bg.addColorStop(0, '#1f182d');
  bg.addColorStop(1, '#07060a');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Outer & Inner Gold Borders
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 6;
  ctx.strokeRect(48, 48, w - 96, h - 96);
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
  ctx.lineWidth = 2;
  ctx.strokeRect(70, 70, w - 140, h - 140);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#d4af37';
  ctx.font = '600 28px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('INVITACIÓN PRIVADA', w / 2, 175);

  ctx.fillStyle = '#f9ecc6';
  ctx.font = '600 84px Georgia, serif';
  ctx.fillText(title, w / 2, 280);

  ctx.fillStyle = '#e8b4b8';
  ctx.font = 'italic 46px Georgia, serif';
  ctx.fillText(`Para ${herName}`, w / 2, 355);

  // White QR frame
  const qrSize = 520;
  const qrBox = 580;
  const qx = (w - qrBox) / 2;
  const qy = 440;

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(qx, qy, qrBox, qrBox, 36);
  ctx.fill();

  const tempQr = document.createElement('canvas');
  drawQrToCanvas(tempQr, url, qrSize);
  ctx.drawImage(tempQr, (w - qrSize) / 2, qy + 30);

  ctx.fillStyle = '#e8dfd1';
  ctx.font = '400 32px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(msg.slice(0, 56), w / 2, 1130);

  ctx.fillStyle = '#d4af37';
  ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('SOLO SE ABRIRÁ CUANDO YO DÉ LA SEÑAL ✦', w / 2, 1280);

  const link = document.createElement('a');
  link.download = `Tarjeta-QR-29-Anos-${herName.replace(/\s+/g, '-')}.png`;
  link.href = card.toDataURL('image/png');
  link.click();
  showToast('🖨️ Tarjeta QR descargada en alta resolución');
}

// ---------------------------------------------------------------------------
// WhatsApp & Telegram Notification Helpers
// ---------------------------------------------------------------------------
function sendWhatsAppAlert(dayNumber) {
  const phone = (state.privateSettings?.whatsappPhone || '').replace(/\D/g, '');
  const appUrl = document.getElementById('qr-url-input').value.trim() || window.location.origin;
  const her = state.settings?.herName || 'Amor Mío';
  const tpl =
    state.privateSettings?.whatsappTemplate ||
    '✨ Hola {nombre}! Acabo de autorizar la apertura del Capítulo {capitulo} en tu universo. Entra a descubrirlo aquí: {link}';
  const text = tpl
    .replace(/\{nombre\}/gi, her)
    .replace(/\{capitulo\}/gi, String(dayNumber).padStart(2, '0'))
    .replace(/\{link\}/gi, appUrl);
  const waUrl = phone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
    : `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(waUrl, '_blank');
}

async function sendTelegramAlert(messageText) {
  const token = state.privateSettings?.telegramBotToken?.trim();
  const chatId = state.privateSettings?.telegramChatId?.trim();
  if (!token || !chatId) {
    showToast('Configura primero el Token y Chat ID de Telegram en la pestaña QR & Alertas.');
    return;
  }
  const resp = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: messageText })
  });
  if (!resp.ok) throw new Error('Error enviando Telegram');
  showToast('✈️ Alerta enviada por Telegram a su celular!');
}

// ---------------------------------------------------------------------------
// Voice Recorder
// ---------------------------------------------------------------------------
async function toggleVoiceRecording() {
  const btn = document.getElementById('ed-record-voice-btn');
  if (state.mediaRecorder && state.mediaRecorder.state === 'recording') {
    state.mediaRecorder.stop();
    btn.textContent = '🎙️ Grabar Nota de Voz';
    btn.className = 'btn btn-rose btn-sm';
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    state.audioChunks = [];
    const mr = new MediaRecorder(stream);
    state.mediaRecorder = mr;

    mr.ondataavailable = (e) => {
      if (e.data.size > 0) state.audioChunks.push(e.data);
    };
    mr.onstop = async () => {
      stream.getTracks().forEach((t) => t.stop());
      const blob = new Blob(state.audioChunks, { type: 'audio/webm' });
      showToast('Subiendo nota de voz...');
      const url = await uploadMediaFile(state.selectedDay, blob, `nota-voz-dia-${state.selectedDay}.webm`);
      const cap = getCurrentCapsule();
      cap.mediaItems.push({ type: 'audio', url, caption: 'Nota de voz para ti ❤️' });
      await renderAdminMediaList(cap.mediaItems);
      showToast('🎙️ Nota de voz añadida (recuerda Guardar Capítulo)');
    };

    mr.start();
    btn.textContent = '⏹️ Detener Grabación...';
    btn.className = 'btn btn-danger btn-sm';
  } catch {
    showToast('No pudimos acceder al micrófono. Verifica permisos del navegador.');
  }
}

// ---------------------------------------------------------------------------
// Tabs & All Static Events
// ---------------------------------------------------------------------------
function switchTab(tabName) {
  document.querySelectorAll('.tab-btn').forEach((b) => {
    b.classList.toggle('is-active', b.dataset.tab === tabName);
  });
  document.querySelectorAll('.tab-pane').forEach((p) => {
    p.classList.toggle('hidden', p.id !== `tab-${tabName}`);
  });
}

function bindStaticEvents() {
  // GitHub Cloud login
  document.getElementById('github-login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const orig = btn.textContent;
    btn.disabled = true;
    btn.textContent = '⏳ Conectando a tu bóveda...';
    const token = document.getElementById('gh-token-input').value.trim();
    const remember = document.getElementById('gh-remember-check').checked;
    try {
      await signInGitHubAdmin(token, remember);
      await enterCommandCenter('github');
    } catch (err) {
      showToast('Error GitHub: ' + (err.message || 'Verifica tu token'));
    } finally {
      btn.disabled = false;
      btn.textContent = orig;
    }
  });

  // Optional local preview toggle (localhost only)
  document.getElementById('switch-local-dev-btn').addEventListener('click', () => {
    setLocalPreviewOverride(true);
    window.location.reload();
  });

  // Local PIN login
  document.getElementById('local-login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const entered = document.getElementById('pin-input').value.trim();
    if (entered === getLocalAdminPin()) {
      sessionStorage.setItem('cap29_local_unlocked', '1');
      await enterCommandCenter('local');
    } else {
      showToast('PIN incorrecto.');
    }
  });

  // Cloud login (Supabase)
  document.getElementById('cloud-login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      await signInCloudAdmin(
        document.getElementById('cloud-email').value.trim(),
        document.getElementById('cloud-password').value
      );
      await enterCommandCenter('supabase');
    } catch (err) {
      showToast('Error al iniciar sesión: ' + (err.message || 'Verifica credenciales'));
    }
  });

  document.getElementById('cloud-logout-btn').addEventListener('click', async () => {
    await signOutCloudAdmin();
    window.location.reload();
  });

  // Tabs
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // Authorize / Seal Toggle
  document.getElementById('ed-toggle-auth-btn').addEventListener('click', async () => {
    const cap = getCurrentCapsule();
    const prev = cap.isAuthorized;
    cap.isAuthorized = !prev;
    try {
      await saveCurrentDayFromEditor();
      updateAuthorizeButtonUI(cap);
      if (cap.isAuthorized) {
        launchGoldConfetti();
        showToast(`🔓 ¡Capítulo ${cap.dayNumber} AUTORIZADO! Ya es visible para ella.`);
      } else {
        showToast(`🔒 Capítulo ${cap.dayNumber} vuelto a sellar.`);
      }
    } catch (err) {
      cap.isAuthorized = prev;
      updateAuthorizeButtonUI(cap);
      showToast('Error al guardar en la nube: ' + (err.message || 'Verifica conexión/sesión'));
    }
  });

  // Load idea for current day
  document.getElementById('ed-load-idea-btn').addEventListener('click', () => {
    const idea = IDEAS_BANK.find((i) => i.day === state.selectedDay);
    if (!idea) return;
    const cap = getCurrentCapsule();
    cap.teaserTitle = idea.teaserTitle;
    cap.unlockedTitle = idea.unlockedTitle;
    cap.message = idea.message;
    cap.dynamicType = idea.dynamicType;
    cap.dynamicPayload = structuredClone(idea.dynamicPayload || {});
    loadDayIntoEditor(state.selectedDay);
    showToast('💡 Idea cargada. Personalízala y pulsa Guardar.');
  });

  // Dynamic type switcher
  document.getElementById('ed-dynamic-type').addEventListener('change', (e) => {
    const cap = getCurrentCapsule();
    renderDynamicFieldsEditor(e.target.value, cap?.dynamicPayload || {});
  });

  // File upload
  document.getElementById('ed-file-input').addEventListener('change', async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const cap = getCurrentCapsule();
    try {
      for (const file of files) {
        const type = file.type.startsWith('video/')
          ? 'video'
          : file.type.startsWith('audio/')
          ? 'audio'
          : 'image';
        showToast(`Subiendo ${file.name}...`);
        const url = await uploadMediaFile(cap.dayNumber, file);
        cap.mediaItems.push({ type, url, caption: '' });
      }
      await renderAdminMediaList(cap.mediaItems);
      showToast('Archivo añadido (pulsa Guardar Capítulo para publicar)');
    } catch (err) {
      showToast(err.message || 'Error al subir archivo');
    } finally {
      e.target.value = '';
    }
  });

  // Add external media URL (auto-detects Spotify tracks/playlists)
  document.getElementById('ed-add-url-btn').addEventListener('click', async () => {
    const url = document.getElementById('ed-url-input').value.trim();
    let type = document.getElementById('ed-url-type').value;
    if (!url) return;
    if (toSpotifyEmbedUrl(url)) {
      type = 'spotify';
    } else if (type === 'spotify') {
      showToast('Pega un enlace válido de canción o playlist de Spotify (open.spotify.com/track/...)');
      return;
    }
    const cap = getCurrentCapsule();
    cap.mediaItems.push({ type, url, caption: '' });
    document.getElementById('ed-url-input').value = '';
    await renderAdminMediaList(cap.mediaItems);
  });

  document.getElementById('ed-record-voice-btn').addEventListener('click', toggleVoiceRecording);
  document.getElementById('ed-save-btn').addEventListener('click', async () => {
    const btn = document.getElementById('ed-save-btn');
    btn.disabled = true;
    btn.textContent = '⏳ Guardando...';
    try {
      await saveCurrentDayFromEditor();
    } catch (err) {
      showToast('Error al guardar: ' + (err.message || 'Verifica conexión'));
    } finally {
      btn.disabled = false;
      btn.textContent = '💾 Guardar Capítulo';
    }
  });

  document.getElementById('ed-whatsapp-alert-btn').addEventListener('click', () => {
    sendWhatsAppAlert(state.selectedDay);
  });
  document.getElementById('ed-telegram-alert-btn').addEventListener('click', async () => {
    const appUrl = document.getElementById('qr-url-input').value.trim() || window.location.origin;
    const her = state.settings?.herName || 'mi amor';
    try {
      await sendTelegramAlert(
        `✨ ¡Hola ${her}! Se acaba de desbloquear el Capítulo ${String(state.selectedDay).padStart(2, '0')} en tu universo. Entra aquí: ${appUrl}`
      );
    } catch {
      showToast('No se pudo enviar por Telegram. Verifica el Token y Chat ID.');
    }
  });

  // Ideas filter pills
  document.getElementById('ideas-act-filters').addEventListener('click', (e) => {
    const pill = e.target.closest('.filter-pill');
    if (!pill) return;
    document.querySelectorAll('#ideas-act-filters .filter-pill').forEach((p) => p.classList.remove('is-active'));
    pill.classList.add('is-active');
    state.ideasActFilter = pill.dataset.act;
    renderIdeasGrid();
  });

  // Finale controls
  document.getElementById('finale-toggle-btn').addEventListener('click', async () => {
    state.settings.finaleEnabled = !state.settings.finaleEnabled;
    await saveAdminSettings(state.settings);
    updateFinaleToggleUI();
    showToast(
      state.settings.finaleEnabled
        ? '🎬 ¡Gran Final activado en la plataforma de ella!'
        : '🎬 Gran Final ocultado nuevamente.'
    );
  });

  document.getElementById('fin-save-btn').addEventListener('click', async () => {
    state.settings.finaleTitle = document.getElementById('fin-title').value.trim();
    state.settings.finaleDedication = document.getElementById('fin-dedication').value.trim();
    await saveAdminSettings(state.settings);
    showToast('💾 Textos del Gran Final guardados');
  });

  document.getElementById('fin-preview-btn').addEventListener('click', () => {
    openCinemaModal(state.capsules, state.settings);
  });

  document.getElementById('generate-video-btn').addEventListener('click', async () => {
    const statusEl = document.getElementById('video-render-status');
    const btn = document.getElementById('generate-video-btn');
    const format = document.getElementById('video-format-select').value;
    btn.disabled = true;
    try {
      await renderAndDownloadFinaleVideo(state.capsules, state.settings, format, (msg) => {
        statusEl.textContent = msg;
      });
      showToast('🎥 ¡Video descargado con éxito!');
    } catch (err) {
      statusEl.textContent = err.message || 'Error al generar video.';
    } finally {
      btn.disabled = false;
    }
  });

  // QR & Alerts
  document.getElementById('qr-url-input').addEventListener('input', renderQrPreview);
  document.getElementById('qr-dedication-input').addEventListener('input', renderQrPreview);
  document.getElementById('download-qr-card-btn').addEventListener('click', downloadLuxuryQrCard);

  document.getElementById('save-alerts-btn').addEventListener('click', async () => {
    state.privateSettings = {
      whatsappPhone: document.getElementById('alert-wa-phone').value.trim(),
      whatsappTemplate: document.getElementById('alert-wa-template').value.trim(),
      telegramBotToken: document.getElementById('alert-tg-token').value.trim(),
      telegramChatId: document.getElementById('alert-tg-chat').value.trim()
    };
    await savePrivateAdminSettings(state.privateSettings);
    showToast('🔔 Alertas guardadas con seguridad');
  });

  document.getElementById('test-tg-btn').addEventListener('click', async () => {
    try {
      await sendTelegramAlert('✨ Prueba de conexión exitosa · 29 Capítulos está listo para avisarle!');
    } catch {
      showToast('Error al enviar prueba de Telegram.');
    }
  });

  // General Settings
  document.getElementById('save-general-btn').addEventListener('click', async () => {
    state.settings.herName = document.getElementById('set-her-name').value.trim() || 'Amor Mío';
    state.settings.birthdayIso = document.getElementById('set-bday').value || '2026-12-12T00:00:00';
    state.settings.appTitle = document.getElementById('set-app-title').value.trim() || '29 Capítulos';
    state.settings.appSubtitle = document.getElementById('set-subtitle').value.trim();
    state.settings.musicUrl = document.getElementById('set-music-url').value.trim();

    const newPin = document.getElementById('set-local-pin').value.trim();
    if (newPin) setLocalAdminPin(newPin);

    await saveAdminSettings(state.settings);
    renderQrPreview();
    showToast('✨ Configuración general guardada');
  });

  // Cloud Config
  document.getElementById('connect-cloud-btn').addEventListener('click', () => {
    const url = document.getElementById('cloud-url-input').value.trim();
    const anon = document.getElementById('cloud-anon-input').value.trim();
    if (!url || !anon) {
      showToast('Pega la URL y la Anon Key de Supabase primero.');
      return;
    }
    saveCloudCreds(url, anon);
    showToast('☁️ Credenciales guardadas. Recargando para iniciar sesión en la nube...');
    setTimeout(() => window.location.reload(), 900);
  });

  document.getElementById('disconnect-cloud-btn').addEventListener('click', () => {
    saveCloudCreds('', '');
    setLocalPreviewOverride(true);
    showToast('Volviendo a Modo Local...');
    setTimeout(() => window.location.reload(), 700);
  });

  document.getElementById('download-configjs-btn').addEventListener('click', () => {
    const url = document.getElementById('cloud-url-input').value.trim();
    const anon = document.getElementById('cloud-anon-input').value.trim();
    const s = state.settings;
    const content = `export const PUBLIC_CONFIG = {
  herName: ${JSON.stringify(s?.herName || 'Amor Mío')},
  birthdayIso: ${JSON.stringify(s?.birthdayIso || '2026-12-12T00:00:00')},
  appTitle: ${JSON.stringify(s?.appTitle || 'Rumbo a tus 29')},
  appSubtitle: ${JSON.stringify(s?.appSubtitle || '')},
  musicUrl: ${JSON.stringify(s?.musicUrl || '')},
  githubOwner: ${JSON.stringify(PUBLIC_CONFIG.githubOwner || '')},
  githubPublicRepo: ${JSON.stringify(PUBLIC_CONFIG.githubPublicRepo || '')},
  githubVaultRepo: ${JSON.stringify(PUBLIC_CONFIG.githubVaultRepo || '')},
  supabaseUrl: ${JSON.stringify(url)},
  supabaseAnonKey: ${JSON.stringify(anon)}
};

export const DEFAULT_LOCAL_PIN = '2929';
`;
    const blob = new Blob([content], { type: 'application/javascript' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'config.js';
    a.click();
    showToast('📦 config.js descargado! Reemplaza js/config.js y súbelo a GitHub.');
  });

  // Backup Export / Import
  document.getElementById('export-backup-btn').addEventListener('click', async () => {
    const json = await exportFullBackupJson();
    const blob = new Blob([json], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `respaldo-29-capitulos-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  });

  document.getElementById('import-backup-input').addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      await importFullBackupJson(text);
      await refreshAdminData();
      showToast('✅ Respaldo restaurado correctamente');
    } catch (err) {
      showToast(err.message || 'Error al importar respaldo');
    }
    e.target.value = '';
  });
}

init();

