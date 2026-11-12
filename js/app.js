/**
 * ============================================================================
 * 29 CAPÍTULOS · HER SANCTUARY CONTROLLER
 * Muestra ESTRICTAMENTE solo las cápsulas autorizadas por él.
 * ============================================================================
 */

import {
  getPublicSettings,
  getHerCapsules,
  herInteractCapsule,
  subscribeHerLiveUpdates,
  resolveMediaUrl,
  getRawFallbackUrl,
  forceInstantPublicRefresh,
  toSpotifyEmbedUrl,
  resetAllHerLocalProgress,
  resealSingleCapsule
} from './store.js';
import { DYNAMIC_TYPES } from './ideas-bank.js';
import { initStardust, launchGoldConfetti, showToast } from './particles.js';
import { renderDynamicSection } from './dynamics.js';
import { openCinemaModal } from './cinema.js';

let state = {
  settings: null,
  capsules: [],
  lastSnapshotSig: '',
  filter: 'all',
  musicPlaying: false,
  audioEl: null,
  synthTimer: null,
  synthCtx: null
};

const PADLOCK_SVG = `
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <rect x="4" y="11" width="16" height="10" rx="2.5"></rect>
    <path d="M8 11V7a4 4 0 0 1 8 0v4"></path>
  </svg>
`;

const WAX_SVG = `
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 2l2.6 5.3 5.9.8-4.3 4.1 1 5.8L12 15.2 6.8 18l1-5.8-4.3-4.1 5.9-.8L12 2z"></path>
  </svg>
`;

const SPARKLE_HEART_SVG = `
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
`;

function createSunflowerSvg(cls) {
  const wrap = document.createElement('div');
  wrap.className = `sunflower-ornament ${cls}`;
  wrap.innerHTML = `
    <svg viewBox="0 0 120 120" width="100%" height="100%" fill="none">
      <g transform="translate(60 60)">
        ${Array.from({ length: 14 }, (_, i) =>
          `<ellipse cx="0" cy="-36" rx="9" ry="22" transform="rotate(${(i * 360) / 14})" fill="#f5c542" opacity="0.92"/>`
        ).join('')}
        ${Array.from({ length: 14 }, (_, i) =>
          `<ellipse cx="0" cy="-32" rx="6" ry="17" transform="rotate(${(i * 360) / 14 + 13})" fill="#d4af37" opacity="0.88"/>`
        ).join('')}
        <circle r="21" fill="#3a200a" stroke="#b99124" stroke-width="2.5"/>
        <circle r="14" fill="#241305"/>
      </g>
    </svg>
  `;
  return wrap;
}

// ---------------------------------------------------------------------------
// Initialization
// ---------------------------------------------------------------------------
async function init() {
  // Secret shortcut via URL parameter ?portal=director
  const params = new URLSearchParams(window.location.search);
  if (params.get('portal') === 'director') {
    window.location.replace('./admin.html');
    return;
  }

  // Reset test progress if ?reset=1 is present
  if (params.get('reset') === '1' || params.has('reset')) {
    localStorage.removeItem('cap29_her_progress_v1');
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, '', cleanUrl);
  }

  initStardust();
  registerServiceWorker();
  await loadData();
  bindEvents();
  startCountdownTicker();

  // Mobile preview mode if ?preview=X is passed
  const previewDay = parseInt(params.get('preview') || '0', 10);
  if (previewDay >= 1 && previewDay <= 30) {
    const target = state.capsules.find((c) => c.dayNumber === previewDay);
    if (target) {
      setTimeout(() => openCapsuleModal({ ...target, isOpenedByHer: true }), 400);
    }
  }

  // Live updates when he unlocks a capsule from Admin
  await subscribeHerLiveUpdates(async () => {
    const prevReadyCount = state.capsules.filter((c) => c.isAuthorized).length;
    await loadData();
    const newReadyCount = state.capsules.filter((c) => c.isAuthorized).length;
    if (newReadyCount > prevReadyCount) {
      launchGoldConfetti();
      showToast('✨ ¡Acaba de desbloquearse un nuevo capítulo para ti!');
    }
  });

  // Safety refresh on visibility change
  document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState === 'visible') {
      const prevCount = state.capsules.filter((c) => c.isAuthorized).length;
      forceInstantPublicRefresh();
      await loadData();
      const nextCount = state.capsules.filter((c) => c.isAuthorized).length;
      if (nextCount > prevCount) {
        launchGoldConfetti();
        showToast('✨ ¡Acaba de desbloquearse un nuevo capítulo para ti!');
      }
    }
  });
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
}

async function loadData(forceRender = false) {
  const [settings, capsules] = await Promise.all([getPublicSettings(), getHerCapsules()]);
  const sig = JSON.stringify({ settings, capsules });
  state.settings = settings;
  state.capsules = capsules;
  if (forceRender || sig !== state.lastSnapshotSig) {
    state.lastSnapshotSig = sig;
    renderAll();
  }
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------
function renderAll() {
  const { settings, capsules } = state;
  if (!settings) return;

  document.title = `${settings.appTitle} · Para ${settings.herName}`;
  document.getElementById('curtain-her-name').textContent = `Para ${settings.herName}`;
  document.getElementById('hero-title').textContent = settings.appTitle || '29 Capítulos';
  document.getElementById('hero-her-name').textContent = `Para ti, ${settings.herName}`;
  document.getElementById('hero-subtitle').textContent = settings.appSubtitle || '';
  document.getElementById('brand-title-mini').textContent = settings.appTitle || '29 Capítulos';

  const authorizedCount = capsules.filter((c) => c.isAuthorized).length;
  const openedCount = capsules.filter((c) => c.isAuthorized && c.isOpenedByHer).length;

  document.getElementById('progress-label').textContent =
    `${openedCount} de 30 descubiertos · ${authorizedCount} autorizados`;
  document.getElementById('progress-fill').style.width = `${Math.round((openedCount / 30) * 100)}%`;

  // Grand Finale Banner (STRICTLY hidden unless HE enables it)
  const finaleBanner = document.getElementById('finale-banner');
  if (settings.finaleEnabled) {
    finaleBanner.classList.remove('hidden');
    document.getElementById('finale-banner-title').textContent =
      settings.finaleTitle || 'Nuestro Viaje Hacia tus 29';
  } else {
    finaleBanner.classList.add('hidden');
  }

  renderGrid();
}

async function renderGrid() {
  const grid = document.getElementById('capsule-grid');
  grid.innerHTML = '';

  const filtered = state.capsules.filter((c) => {
    if (state.filter === 'ready') return c.isAuthorized && !c.isOpenedByHer;
    if (state.filter === 'opened') return c.isAuthorized && c.isOpenedByHer;
    if (state.filter === 'favorites') return c.isAuthorized && c.isFavorite;
    return true;
  });

  if (filtered.length === 0) {
    const empty = document.createElement('div');
    empty.style.gridColumn = '1 / -1';
    empty.style.textAlign = 'center';
    empty.style.padding = '48px 16px';
    empty.style.color = 'var(--text-muted)';
    empty.textContent = 'Aún no hay capítulos en esta categoría ✨';
    grid.appendChild(empty);
    return;
  }

  for (const cap of filtered) {
    const card = document.createElement('article');
    const isLocked = !cap.isAuthorized;
    const isReady = cap.isAuthorized && !cap.isOpenedByHer;
    const isOpened = cap.isAuthorized && cap.isOpenedByHer;

    card.className = 'capsule-card ' + (isLocked ? 'is-locked' : isReady ? 'is-ready' : 'is-opened');

    // Optional photo background on ALREADY OPENED cards
    if (isOpened && cap.mediaItems && cap.mediaItems.length > 0) {
      const firstImg = cap.mediaItems.find((m) => m.type === 'image');
      if (firstImg) {
        const bg = document.createElement('div');
        bg.className = 'cap-thumb-bg';
        resolveMediaUrl(firstImg.url).then((resolved) => {
          if (resolved) bg.style.backgroundImage = `url("${resolved}")`;
        });
        card.appendChild(bg);
      }
    }

    const top = document.createElement('div');
    top.className = 'cap-top';

    const dayNum = document.createElement('div');
    dayNum.className = 'cap-day-num';
    const small = document.createElement('small');
    small.textContent = 'Capítulo';
    dayNum.appendChild(small);
    dayNum.appendChild(document.createTextNode(String(cap.dayNumber).padStart(2, '0')));
    top.appendChild(dayNum);

    if (isOpened && (cap.isFavorite || cap.hasSunflowers)) {
      const badges = document.createElement('span');
      badges.className = 'cap-fav-heart';
      badges.textContent = `${cap.hasSunflowers ? '🌻' : ''}${cap.isFavorite ? '❤️' : ''}`;
      top.appendChild(badges);
    }

    const center = document.createElement('div');
    center.className = 'cap-center';

    const ring = document.createElement('div');
    ring.className = 'cap-icon-ring';
    if (isLocked) {
      ring.innerHTML = PADLOCK_SVG;
    } else if (isReady) {
      ring.innerHTML = WAX_SVG;
    } else {
      ring.innerHTML = SPARKLE_HEART_SVG;
    }

    const title = document.createElement('h3');
    title.className = 'cap-title';
    if (isLocked) {
      title.textContent = cap.teaserTitle || 'Esperando autorización...';
    } else if (isReady) {
      title.textContent = cap.teaserTitle || '¡Lista para abrir!';
    } else {
      title.textContent = cap.unlockedTitle || `Capítulo ${cap.dayNumber}`;
    }

    center.appendChild(ring);
    center.appendChild(title);

    const bottom = document.createElement('div');
    bottom.className = 'cap-bottom';
    const badge = document.createElement('span');
    badge.className = 'cap-status-badge';
    if (isLocked) {
      badge.textContent = '🔒 Sellado';
    } else if (isReady) {
      badge.textContent = '✨ ¡Toca para abrir!';
    } else {
      badge.innerHTML = `✨ Capítulo Revelado <button type="button" class="reseal-mini-btn" title="Volver a sellar para pruebas" style="margin-left:6px;background:rgba(212,175,55,0.22);border:1px solid rgba(212,175,55,0.5);border-radius:999px;padding:2px 8px;font-size:0.72rem;color:var(--gold-light);cursor:pointer;line-height:1.2;">🔒 Sellar</button>`;
      badge.querySelector('.reseal-mini-btn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        cap.isOpenedByHer = false;
        cap.openedAt = null;
        resealSingleCapsule(cap.dayNumber);
        renderAll();
        showToast(`🔒 Capítulo ${String(cap.dayNumber).padStart(2, '0')} vuelto a sellar.`);
      });
    }
    bottom.appendChild(badge);

    card.appendChild(top);
    card.appendChild(center);
    card.appendChild(bottom);

    card.addEventListener('click', () => handleCardClick(cap, card));
    grid.appendChild(card);
  }
}

// ---------------------------------------------------------------------------
// Capsule Interaction & Wax Seal Ritual
// ---------------------------------------------------------------------------
async function handleCardClick(cap, cardEl) {
  if (!cap.isAuthorized) {
    forceInstantPublicRefresh();
    await loadData();
    const fresh = state.capsules.find((c) => c.dayNumber === cap.dayNumber);
    if (fresh && fresh.isAuthorized) {
      launchGoldConfetti();
      showToast('✨ ¡Capítulo recién desbloqueado!');
      openWaxSealRitual(fresh);
      return;
    }
    cardEl.classList.add('shake');
    setTimeout(() => cardEl.classList.remove('shake'), 500);
    showToast('🔒 Este capítulo aún está sellado. Solo se abrirá cuando él dé la señal.');
    return;
  }

  if (!cap.isOpenedByHer) {
    openWaxSealRitual(cap);
  } else {
    openCapsuleModal(cap);
  }
}

function openWaxSealRitual(cap) {
  const overlay = document.createElement('div');
  overlay.className = 'ritual-overlay';

  const kicker = document.createElement('p');
  kicker.className = 'curtain-eyebrow';
  kicker.textContent = `Capítulo ${String(cap.dayNumber).padStart(2, '0')} Desbloqueado`;

  const sealBtn = document.createElement('button');
  sealBtn.type = 'button';
  sealBtn.className = 'wax-seal-btn';
  sealBtn.innerHTML = `
    <span style="font-family:var(--font-display);font-size:2.4rem;font-weight:700;line-height:1;">${String(cap.dayNumber).padStart(2, '0')}</span>
    <span style="font-size:0.68rem;letter-spacing:0.2em;text-transform:uppercase;margin-top:4px;">Romper sello</span>
  `;

  const hint = document.createElement('p');
  hint.style.color = 'var(--text-muted)';
  hint.style.maxWidth = '340px';
  hint.textContent = cap.teaserTitle || 'Toca el sello real para descubrir la sorpresa de hoy.';

  const cancel = document.createElement('button');
  cancel.type = 'button';
  cancel.className = 'btn btn-glass btn-sm';
  cancel.style.marginTop = '26px';
  cancel.textContent = 'Volver';
  cancel.addEventListener('click', () => overlay.remove());

  sealBtn.addEventListener('click', async () => {
    sealBtn.classList.add('is-breaking');
    launchGoldConfetti();
    cap.isOpenedByHer = true;
    cap.openedAt = new Date().toISOString();
    try {
      await herInteractCapsule(cap.dayNumber, { isOpenedByHer: true });
    } catch {
      // Keep UI fluid
    }
    setTimeout(() => {
      overlay.remove();
      renderAll();
      openCapsuleModal(cap);
    }, 520);
  });

  overlay.appendChild(kicker);
  overlay.appendChild(sealBtn);
  overlay.appendChild(hint);
  overlay.appendChild(cancel);
  document.body.appendChild(overlay);
}

async function openCapsuleModal(cap) {
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';

  const card = document.createElement('div');
  card.className = 'modal-card' + (cap.hasSunflowers ? ' has-sunflowers' : '');
  if (cap.hasSunflowers) {
    card.appendChild(createSunflowerSvg('sunflower-tr'));
    card.appendChild(createSunflowerSvg('sunflower-bl'));
  }

  // Header
  const header = document.createElement('div');
  header.className = 'modal-header';

  const titleWrap = document.createElement('div');
  const tag = document.createElement('span');
  tag.className = 'modal-day-tag';
  tag.textContent = `Capítulo ${String(cap.dayNumber).padStart(2, '0')} · ${
    (DYNAMIC_TYPES[cap.dynamicType] || DYNAMIC_TYPES.classic).label
  }`;
  if (cap.hasSunflowers) {
    const sf = document.createElement('span');
    sf.className = 'sunflower-pill';
    sf.textContent = '🌻 Girasoles para ti';
    tag.appendChild(sf);
  }

  const h2 = document.createElement('h2');
  h2.className = 'modal-title gold-text';
  h2.textContent = cap.unlockedTitle || `Capítulo ${cap.dayNumber}`;

  titleWrap.appendChild(tag);
  titleWrap.appendChild(h2);

  const actions = document.createElement('div');
  actions.className = 'modal-header-actions';

  const favBtn = document.createElement('button');
  favBtn.type = 'button';
  favBtn.className = 'icon-btn' + (cap.isFavorite ? ' is-fav' : '');
  favBtn.title = 'Guardar en Favoritos';
  favBtn.textContent = cap.isFavorite ? '❤️' : '🤍';
  favBtn.addEventListener('click', async () => {
    cap.isFavorite = !cap.isFavorite;
    favBtn.className = 'icon-btn' + (cap.isFavorite ? ' is-fav' : '');
    favBtn.textContent = cap.isFavorite ? '❤️' : '🤍';
    await herInteractCapsule(cap.dayNumber, { isFavorite: cap.isFavorite });
    renderGrid();
    showToast(cap.isFavorite ? '❤️ Guardado en tus recuerdos favoritos' : 'Quitado de favoritos');
  });

  const resealBtn = document.createElement('button');
  resealBtn.type = 'button';
  resealBtn.className = 'icon-btn';
  resealBtn.title = 'Volver a sellar este capítulo (probar desde cero)';
  resealBtn.setAttribute('aria-label', 'Volver a sellar este capítulo');
  resealBtn.innerHTML = '🔒';
  resealBtn.addEventListener('click', () => {
    cap.isOpenedByHer = false;
    cap.openedAt = null;
    resealSingleCapsule(cap.dayNumber);
    backdrop.remove();
    renderAll();
    showToast(`🔒 Capítulo ${String(cap.dayNumber).padStart(2, '0')} vuelto a sellar.`);
  });

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'icon-btn';
  closeBtn.textContent = '✕';
  closeBtn.addEventListener('click', () => backdrop.remove());

  actions.appendChild(resealBtn);
  actions.appendChild(favBtn);
  actions.appendChild(closeBtn);
  header.appendChild(titleWrap);
  header.appendChild(actions);
  card.appendChild(header);

  // Media Gallery
  if (Array.isArray(cap.mediaItems) && cap.mediaItems.length > 0) {
    const gallery = document.createElement('div');
    gallery.className = 'media-gallery';

    for (const m of cap.mediaItems) {
      const item = document.createElement('div');
      item.className = 'media-item';
      const resolvedUrl = await resolveMediaUrl(m.url);
      if (!resolvedUrl) continue;

      const attachRawFallback = (el) => {
        el.addEventListener('error', () => {
          const fb = getRawFallbackUrl(resolvedUrl);
          if (fb && !el.dataset.retried) {
            el.dataset.retried = '1';
            el.src = fb;
          }
        });
      };

      if (m.type === 'image') {
        const img = document.createElement('img');
        img.src = resolvedUrl;
        img.alt = m.caption || cap.unlockedTitle;
        img.loading = 'lazy';
        attachRawFallback(img);
        item.appendChild(img);
      } else if (m.type === 'video') {
        const vid = document.createElement('video');
        vid.src = resolvedUrl;
        vid.controls = true;
        vid.playsInline = true;
        attachRawFallback(vid);
        item.appendChild(vid);
      } else if (m.type === 'audio') {
        const wrap = document.createElement('div');
        wrap.className = 'media-audio-wrap';
        const lbl = document.createElement('span');
        lbl.style.fontSize = '0.84rem';
        lbl.style.color = 'var(--gold-light)';
        lbl.textContent = '🎙️ Nota de voz especial para ti';
        const aud = document.createElement('audio');
        aud.src = resolvedUrl;
        aud.controls = true;
        attachRawFallback(aud);
        wrap.appendChild(lbl);
        wrap.appendChild(aud);
        item.appendChild(wrap);
      } else if (m.type === 'spotify') {
        const embedUrl = toSpotifyEmbedUrl(resolvedUrl);
        if (embedUrl) {
          item.classList.add('is-spotify');
          const iframe = document.createElement('iframe');
          iframe.className = 'spotify-embed-frame';
          iframe.src = embedUrl;
          iframe.height = embedUrl.includes('/playlist/') || embedUrl.includes('/album/') ? '180' : '80';
          iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
          iframe.loading = 'lazy';
          item.appendChild(iframe);
        }
      }

      if (m.caption) {
        const capEl = document.createElement('div');
        capEl.className = 'media-caption';
        capEl.textContent = m.caption;
        item.appendChild(capEl);
      }

      gallery.appendChild(item);
    }

    if (gallery.children.length > 0) card.appendChild(gallery);
  }

  // Letter Message
  if (cap.message) {
    const letter = document.createElement('div');
    letter.className = 'letter-box';
    letter.textContent = cap.message;
    card.appendChild(letter);
  }

  // Interactive Dynamic
  const dynSlot = document.createElement('div');
  renderDynamicSection(dynSlot, cap, async (result) => {
    cap.dynamicDone = result.dynamicDone;
    cap.dynamicAnswer = result.dynamicAnswer || '';
    await herInteractCapsule(cap.dayNumber, {
      dynamicDone: cap.dynamicDone,
      dynamicAnswer: cap.dynamicAnswer
    });
  });
  card.appendChild(dynSlot);

  // Her Reply Form (ONLY shown when HE enables allowReply for this chapter)
  if (cap.allowReply) {
    const replySec = document.createElement('div');
    replySec.className = 'reply-section';

    const replyLbl = document.createElement('label');
    replyLbl.className = 'field-label';
    replyLbl.textContent = '💌 Déjale una respuesta o lo que sentiste hoy';

    const replyRow = document.createElement('div');
    replyRow.className = 'reply-row';

    const textarea = document.createElement('textarea');
    textarea.className = 'textarea';
    textarea.style.minHeight = '76px';
    textarea.placeholder = 'Escribe aquí algo bonito para él...';
    textarea.value = cap.herReply || '';

    const btnRow = document.createElement('div');
    btnRow.style.display = 'flex';
    btnRow.style.flexWrap = 'wrap';
    btnRow.style.gap = '8px';
    btnRow.style.justifyContent = 'flex-end';

    const saveReplyBtn = document.createElement('button');
    saveReplyBtn.type = 'button';
    saveReplyBtn.className = 'btn btn-glass btn-sm';
    saveReplyBtn.textContent = cap.herReply ? 'Guardar en mi diario ✨' : 'Guardar respuesta ✨';

    const waReplyBtn = document.createElement('button');
    waReplyBtn.type = 'button';
    waReplyBtn.className = 'btn btn-gold btn-sm';
    waReplyBtn.textContent = '📲 Enviársela por WhatsApp';

    saveReplyBtn.addEventListener('click', async () => {
      cap.herReply = textarea.value.trim();
      saveReplyBtn.disabled = true;
      try {
        await herInteractCapsule(cap.dayNumber, { herReply: cap.herReply });
        showToast('💖 ¡Tu nota se guardó! Si quieres que la vea al instante, pulsa "Enviársela por WhatsApp".');
      } catch {
        showToast('No se pudo guardar en este momento.');
      } finally {
        saveReplyBtn.disabled = false;
      }
    });

    waReplyBtn.addEventListener('click', async () => {
      const msg = textarea.value.trim();
      if (!msg) {
        showToast('Escribe primero tu respuesta 💖');
        return;
      }
      cap.herReply = msg;
      await herInteractCapsule(cap.dayNumber, { herReply: msg }).catch(() => {});
      const waText = `💌 Respuesta sobre el Capítulo ${String(cap.dayNumber).padStart(2, '0')} (${cap.unlockedTitle}):\n\n"${msg}"`;
      const phone = (state.settings?.myWhatsappPhone || '').replace(/\D/g, '');
      const waUrl = phone
        ? `https://wa.me/${phone}?text=${encodeURIComponent(waText)}`
        : `https://wa.me/?text=${encodeURIComponent(waText)}`;
      window.open(waUrl, '_blank');
    });

    btnRow.appendChild(saveReplyBtn);
    btnRow.appendChild(waReplyBtn);
    replyRow.appendChild(textarea);
    replyRow.appendChild(btnRow);
    replySec.appendChild(replyLbl);
    replySec.appendChild(replyRow);
    card.appendChild(replySec);
  }

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) backdrop.remove();
  });

  backdrop.appendChild(card);
  document.body.appendChild(backdrop);
}

// ---------------------------------------------------------------------------
// Countdown Timer & Music Player
// ---------------------------------------------------------------------------
function startCountdownTicker() {
  const update = () => {
    if (!state.settings) return;
    const target = new Date(state.settings.birthdayIso).getTime();
    const now = Date.now();
    const diff = Math.max(0, target - now);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    document.getElementById('cd-days').textContent = String(days).padStart(2, '0');
    document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('cd-mins').textContent = String(mins).padStart(2, '0');
    document.getElementById('cd-secs').textContent = String(secs).padStart(2, '0');

    const titleEl = document.getElementById('countdown-kicker');
    if (diff === 0) {
      titleEl.textContent = '👑 ¡HOY CELEBRAMOS TUS 29 AÑOS! 👑';
    } else {
      titleEl.textContent = 'Cuenta regresiva hacia tus 29';
    }
  };
  update();
  setInterval(update, 1000);
}

function ensureSpotifyDrawer(embedUrl) {
  let drawer = document.getElementById('spotify-drawer');
  if (!drawer) {
    drawer = document.createElement('aside');
    drawer.id = 'spotify-drawer';
    drawer.className = 'spotify-drawer hidden';
    drawer.innerHTML = `
      <div class="spotify-drawer-head">
        <span>🎧 Día especial 29</span>
        <button type="button" class="icon-btn" style="width:28px;height:28px;font-size:0.85rem;" id="spotify-drawer-close">✕</button>
      </div>
      <iframe class="spotify-embed-frame" id="spotify-drawer-iframe" height="180" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
    `;
    document.body.appendChild(drawer);
    drawer.querySelector('#spotify-drawer-close').addEventListener('click', () => {
      drawer.classList.add('hidden');
      state.musicPlaying = false;
      document.getElementById('music-toggle-btn').classList.remove('is-playing');
      document.getElementById('music-label').textContent = 'Playlist';
    });
  }
  const iframe = drawer.querySelector('#spotify-drawer-iframe');
  if (iframe.src !== embedUrl) iframe.src = embedUrl;
  return drawer;
}

function toggleAmbientMusic(forcePlay = null) {
  const btn = document.getElementById('music-toggle-btn');
  const label = document.getElementById('music-label');
  const url = state.settings?.musicUrl || '';
  const spotifyEmbed = toSpotifyEmbedUrl(url);
  const shouldPlay = forcePlay !== null ? forcePlay : !state.musicPlaying;

  if (spotifyEmbed) {
    const drawer = ensureSpotifyDrawer(spotifyEmbed);
    if (shouldPlay) {
      drawer.classList.remove('hidden');
      state.musicPlaying = true;
      btn.classList.add('is-playing');
      label.textContent = 'Playlist';
    } else {
      drawer.classList.add('hidden');
      state.musicPlaying = false;
      btn.classList.remove('is-playing');
      label.textContent = 'Playlist';
    }
    return;
  }

  if (shouldPlay) {
    if (url) {
      if (!state.audioEl || state.audioEl.src !== url) {
        state.audioEl = new Audio(url);
        state.audioEl.loop = true;
        state.audioEl.volume = 0.45;
      }
      state.audioEl.play().catch(() => {});
    } else {
      startGentleAmbientPad();
    }
    state.musicPlaying = true;
    btn.classList.add('is-playing');
    label.textContent = 'Sonando';
  } else {
    if (state.audioEl) state.audioEl.pause();
    stopGentleAmbientPad();
    state.musicPlaying = false;
    btn.classList.remove('is-playing');
    label.textContent = 'Música';
  }
}

/**
 * Dreamy zero-dependency ambient harp/chime pad when no custom MP3 URL is set
 */
function startGentleAmbientPad() {
  try {
    if (!state.synthCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      state.synthCtx = new AC();
    }
    if (state.synthCtx.state === 'suspended') state.synthCtx.resume();
    if (state.synthTimer) return;

    const notes = [261.63, 329.63, 392.0, 493.88, 523.25, 440.0, 349.23];
    let step = 0;
    const playNote = () => {
      if (!state.synthCtx) return;
      const ctx = state.synthCtx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = notes[step % notes.length];
      step++;

      const now = ctx.currentTime;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.032, now + 0.35);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 3.3);
    };

    playNote();
    state.synthTimer = setInterval(playNote, 2400);
  } catch {
    // Browser blocked audio
  }
}

function stopGentleAmbientPad() {
  if (state.synthTimer) {
    clearInterval(state.synthTimer);
    state.synthTimer = null;
  }
}

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------
function bindEvents() {
  // Welcome curtain enter button
  document.getElementById('enter-universe-btn').addEventListener('click', () => {
    document.getElementById('welcome-curtain').classList.add('is-dismissed');
    toggleAmbientMusic(true);
  });

  document.getElementById('music-toggle-btn').addEventListener('click', () => {
    toggleAmbientMusic();
  });

  // Filters
  document.querySelectorAll('.filter-pill[data-filter]').forEach((pill) => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.filter-pill[data-filter]').forEach((p) => p.classList.remove('is-active'));
      pill.classList.add('is-active');
      state.filter = pill.dataset.filter;
      renderGrid();
    });
  });

  // Quick Reseal All button in filter bar
  document.getElementById('quick-reseal-all-btn')?.addEventListener('click', () => {
    resetAllHerLocalProgress();
    state.capsules.forEach((c) => {
      c.isOpenedByHer = false;
      c.openedAt = null;
    });
    renderAll();
    showToast('✨ Todas las cápsulas vuelven a estar selladas con su cera dorada.');
  });

  // Reset test progress button in footer
  const resetBtn = document.getElementById('reset-test-progress-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      localStorage.removeItem('cap29_her_progress_v1');
      showToast('✨ Todas las cápsulas vuelven a estar selladas en este navegador.');
      setTimeout(() => window.location.reload(), 500);
    });
  }

  // Finale Cinema Button
  document.getElementById('open-cinema-btn').addEventListener('click', () => {
    openCinemaModal(state.capsules, state.settings);
  });

  // Discreet 5-tap secret entry on footer crest (no visible Admin link for her!)
  let taps = 0;
  let tapResetTimer = null;
  document.getElementById('secret-crest-tap').addEventListener('click', () => {
    taps++;
    clearTimeout(tapResetTimer);
    tapResetTimer = setTimeout(() => (taps = 0), 1800);
    if (taps >= 5) {
      taps = 0;
      window.location.href = './admin.html';
    }
  });
}

init();

