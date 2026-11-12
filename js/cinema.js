/**
 * ============================================================================
 * 29 CAPÍTULOS · GRAN CINE DE RECUERDOS & GENERADOR DE VIDEO (.WEBM)
 * Compila todas las fotos, títulos y cartas del mes en una película interactiva
 * y permite renderizar/descargar un video real para el gran final.
 * ============================================================================
 */

import { resolveMediaUrl } from './store.js';
import { launchGoldConfetti } from './particles.js';

function buildSlidesFromCapsules(capsules, settings) {
  const slides = [
    {
      kind: 'intro',
      dayLabel: 'EL GRAN ESTRENO',
      title: settings.finaleTitle || 'Nuestro Viaje Hacia tus 29',
      subtitle: `Para ${settings.herName || 'Amor Mío'}`,
      caption: 'Cada capítulo, cada detalle y cada latido de estos 30 días juntos.',
      mediaType: null,
      mediaUrl: ''
    }
  ];

  const unlocked = capsules
    .filter((c) => c.isAuthorized)
    .sort((a, b) => a.dayNumber - b.dayNumber);

  for (const cap of unlocked) {
    const firstMedia = (cap.mediaItems || []).find((m) => m.type === 'image' || m.type === 'video');
    const excerpt = (cap.message || '').split('\n').filter(Boolean).slice(0, 3).join(' ');

    slides.push({
      kind: 'chapter',
      dayNumber: cap.dayNumber,
      dayLabel: `Capítulo ${String(cap.dayNumber).padStart(2, '0')}`,
      title: cap.unlockedTitle || `Día ${cap.dayNumber}`,
      subtitle: cap.herReply ? `Tu respuesta: "${cap.herReply}"` : '',
      caption: excerpt.length > 220 ? excerpt.slice(0, 217) + '...' : excerpt,
      mediaType: firstMedia ? firstMedia.type : null,
      rawMediaUrl: firstMedia ? firstMedia.url : ''
    });
  }

  slides.push({
    kind: 'outro',
    dayLabel: 'FELICES 29 AÑOS 👑',
    title: `Te amo, ${settings.herName || 'Amor Mío'}`,
    subtitle: 'Y lo mejor de nuestra historia apenas comienza.',
    caption: settings.finaleDedication || 'Gracias por hacer cada día inolvidable.',
    mediaType: null,
    mediaUrl: ''
  });

  return slides;
}

// ---------------------------------------------------------------------------
// 1. INTERACTIVE LUXURY CINEMA PLAYER
// ---------------------------------------------------------------------------
export async function openCinemaModal(capsules, settings) {
  const slides = buildSlidesFromCapsules(capsules, settings);
  for (const s of slides) {
    if (s.rawMediaUrl) {
      s.mediaUrl = await resolveMediaUrl(s.rawMediaUrl);
    }
  }

  const overlay = document.createElement('div');
  overlay.className = 'cinema-overlay';

  overlay.innerHTML = `
    <div class="cinema-topbar">
      <div style="display:flex;align-items:center;gap:10px;">
        <span class="brand-monogram">29</span>
        <span style="font-size:0.85rem;color:var(--gold-light);letter-spacing:0.12em;text-transform:uppercase;">Cine de Recuerdos</span>
      </div>
      <button type="button" class="icon-btn" id="cinema-close-btn" aria-label="Cerrar cine">✕</button>
    </div>
    <div class="cinema-stage" id="cinema-stage"></div>
    <div class="cinema-controls">
      <div class="cinema-progress-dots" id="cinema-dots"></div>
      <div style="display:flex;align-items:center;gap:12px;">
        <button type="button" class="btn btn-glass btn-sm" id="cinema-prev">◀ Anterior</button>
        <button type="button" class="btn btn-gold btn-sm" id="cinema-playpause">⏸ Pausar</button>
        <button type="button" class="btn btn-glass btn-sm" id="cinema-next">Siguiente ▶</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const stage = overlay.querySelector('#cinema-stage');
  const dotsEl = overlay.querySelector('#cinema-dots');
  const playBtn = overlay.querySelector('#cinema-playpause');
  let index = 0;
  let playing = true;
  let timer = null;

  function scheduleNext() {
    clearTimeout(timer);
    if (!playing) return;
    timer = setTimeout(() => {
      if (index < slides.length - 1) {
        goTo(index + 1);
      } else {
        playing = false;
        playBtn.textContent = '↻ Ver de nuevo';
        launchGoldConfetti();
      }
    }, 5500);
  }

  function renderSlide() {
    const s = slides[index];
    stage.innerHTML = '';

    const slideEl = document.createElement('div');
    slideEl.className = 'cinema-slide';

    const tag = document.createElement('div');
    tag.className = 'modal-day-tag';
    tag.textContent = s.dayLabel;
    slideEl.appendChild(tag);

    if (s.mediaUrl && s.mediaType === 'image') {
      const frame = document.createElement('div');
      frame.className = 'cinema-media-frame';
      const img = document.createElement('img');
      img.src = s.mediaUrl;
      img.alt = s.title;
      frame.appendChild(img);
      slideEl.appendChild(frame);
    } else if (s.mediaUrl && s.mediaType === 'video') {
      const frame = document.createElement('div');
      frame.className = 'cinema-media-frame';
      const vid = document.createElement('video');
      vid.src = s.mediaUrl;
      vid.controls = true;
      vid.autoplay = true;
      vid.muted = true;
      vid.playsInline = true;
      vid.style.maxHeight = '52vh';
      frame.appendChild(vid);
      slideEl.appendChild(frame);
    }

    const h2 = document.createElement('h2');
    h2.className = 'font-display gold-text';
    h2.style.fontSize = s.kind === 'chapter' ? 'clamp(1.8rem, 4vw, 2.7rem)' : 'clamp(2.3rem, 5.5vw, 3.6rem)';
    h2.style.marginBottom = '10px';
    h2.textContent = s.title;
    slideEl.appendChild(h2);

    if (s.caption) {
      const p = document.createElement('p');
      p.style.color = '#e7dfd3';
      p.style.maxWidth = '640px';
      p.style.margin = '0 auto 10px';
      p.style.fontSize = '1.02rem';
      p.textContent = s.caption;
      slideEl.appendChild(p);
    }

    if (s.subtitle) {
      const sub = document.createElement('p');
      sub.style.color = 'var(--rose-champagne)';
      sub.style.fontSize = '0.9rem';
      sub.style.fontStyle = 'italic';
      sub.textContent = s.subtitle;
      slideEl.appendChild(sub);
    }

    stage.appendChild(slideEl);

    dotsEl.innerHTML = '';
    slides.forEach((_, idx) => {
      const d = document.createElement('div');
      d.className = 'cinema-dot' + (idx === index ? ' is-active' : '');
      d.addEventListener('click', () => goTo(idx));
      dotsEl.appendChild(d);
    });
  }

  function goTo(newIdx) {
    index = (newIdx + slides.length) % slides.length;
    renderSlide();
    scheduleNext();
  }

  overlay.querySelector('#cinema-prev').addEventListener('click', () => goTo(index - 1));
  overlay.querySelector('#cinema-next').addEventListener('click', () => goTo(index + 1));
  playBtn.addEventListener('click', () => {
    if (index === slides.length - 1 && !playing) {
      playing = true;
      playBtn.textContent = '⏸ Pausar';
      goTo(0);
      return;
    }
    playing = !playing;
    playBtn.textContent = playing ? '⏸ Pausar' : '▶ Continuar';
    if (playing) scheduleNext();
    else clearTimeout(timer);
  });

  const closeCinema = () => {
    clearTimeout(timer);
    overlay.remove();
  };
  overlay.querySelector('#cinema-close-btn').addEventListener('click', closeCinema);

  renderSlide();
  scheduleNext();
}

// ---------------------------------------------------------------------------
// 2. EXPORTABLE HD VIDEO RENDERER (.WEBM) VIA CANVAS + MEDIARECORDER
// ---------------------------------------------------------------------------
function loadDrawableImage(url) {
  return new Promise((resolve) => {
    if (!url) return resolve(null);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 4) {
  if (!text) return;
  const words = text.split(/\s+/);
  let line = '';
  let linesDrawn = 0;

  for (let i = 0; i < words.length; i++) {
    const testLine = line ? line + ' ' + words[i] : words[i];
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, x, y + linesDrawn * lineHeight);
      linesDrawn++;
      line = words[i];
      if (linesDrawn >= maxLines - 1) {
        const remaining = words.slice(i + 1).join(' ');
        const finalLine = remaining ? line + ' ' + remaining : line;
        ctx.fillText(finalLine.slice(0, 48) + (finalLine.length > 48 ? '...' : ''), x, y + linesDrawn * lineHeight);
        return;
      }
    } else {
      line = testLine;
    }
  }
  if (line) ctx.fillText(line, x, y + linesDrawn * lineHeight);
}

export async function renderAndDownloadFinaleVideo(capsules, settings, format = 'vertical', onProgress = () => {}) {
  if (typeof MediaRecorder === 'undefined') {
    throw new Error('Tu navegador no soporta grabación de video MediaRecorder.');
  }

  const width = format === 'vertical' ? 1080 : 1280;
  const height = format === 'vertical' ? 1920 : 720;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  const rawSlides = buildSlidesFromCapsules(capsules, settings);
  const prepared = [];

  onProgress('Preparando recuerdos e imágenes...');
  for (const s of rawSlides) {
    let img = null;
    if (s.rawMediaUrl && s.mediaType === 'image') {
      const resolved = await resolveMediaUrl(s.rawMediaUrl);
      img = await loadDrawableImage(resolved);
    }
    prepared.push({ ...s, img });
  }

  const mimeCandidates = [
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm'
  ];
  const mimeType = mimeCandidates.find((m) => MediaRecorder.isTypeSupported(m)) || 'video/webm';

  const stream = canvas.captureStream(30);
  const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 3_500_000 });
  const chunks = [];
  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) chunks.push(e.data);
  };

  const stopPromise = new Promise((resolve) => {
    recorder.onstop = () => resolve(new Blob(chunks, { type: mimeType }));
  });

  recorder.start();

  const fps = 30;
  const secPerSlide = 3.2;
  const framesPerSlide = Math.round(fps * secPerSlide);

  for (let sIdx = 0; sIdx < prepared.length; sIdx++) {
    const slide = prepared[sIdx];
    onProgress(`Renderizando escena ${sIdx + 1} de ${prepared.length}...`);

    for (let f = 0; f < framesPerSlide; f++) {
      const progress = f / framesPerSlide;
      const alpha =
        progress < 0.14 ? progress / 0.14 :
        progress > 0.86 ? (1 - progress) / 0.14 : 1;

      // Obsidian luxury backdrop
      const bg = ctx.createRadialGradient(width * 0.5, height * 0.3, 60, width * 0.5, height * 0.5, width * 0.9);
      bg.addColorStop(0, '#1e172c');
      bg.addColorStop(1, '#07060a');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      // Gold frame border
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
      ctx.lineWidth = 4;
      ctx.strokeRect(36, 36, width - 72, height - 72);

      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      ctx.textAlign = 'center';

      // Day label
      ctx.fillStyle = '#d4af37';
      ctx.font = `600 ${format === 'vertical' ? 28 : 20}px "Plus Jakarta Sans", sans-serif`;
      ctx.fillText(slide.dayLabel.toUpperCase(), width / 2, format === 'vertical' ? 140 : 95);

      let textStartY = format === 'vertical' ? height * 0.52 : height * 0.44;

      if (slide.img) {
        const boxW = width - 160;
        const boxH = format === 'vertical' ? height * 0.42 : height * 0.48;
        const boxX = 80;
        const boxY = format === 'vertical' ? 200 : 125;

        ctx.save();
        ctx.beginPath();
        ctx.roundRect(boxX, boxY, boxW, boxH, 24);
        ctx.clip();

        // Cover-fit with gentle Ken Burns zoom
        const zoom = 1 + progress * 0.06;
        const imgRatio = slide.img.width / slide.img.height;
        const boxRatio = boxW / boxH;
        let dw, dh;
        if (imgRatio > boxRatio) {
          dh = boxH * zoom;
          dw = dh * imgRatio;
        } else {
          dw = boxW * zoom;
          dh = dw / imgRatio;
        }
        ctx.drawImage(slide.img, boxX + (boxW - dw) / 2, boxY + (boxH - dh) / 2, dw, dh);
        ctx.restore();

        ctx.strokeStyle = 'rgba(212, 175, 55, 0.6)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(boxX, boxY, boxW, boxH, 24);
        ctx.stroke();

        textStartY = boxY + boxH + (format === 'vertical' ? 90 : 58);
      }

      // Title
      ctx.fillStyle = '#f9ecc6';
      ctx.font = `600 ${format === 'vertical' ? 54 : 40}px Georgia, serif`;
      wrapCanvasText(ctx, slide.title, width / 2, textStartY, width - 150, format === 'vertical' ? 66 : 48, 2);

      // Caption
      if (slide.caption) {
        ctx.fillStyle = '#e3dacb';
        ctx.font = `400 ${format === 'vertical' ? 30 : 22}px "Plus Jakarta Sans", sans-serif`;
        wrapCanvasText(
          ctx,
          slide.caption,
          width / 2,
          textStartY + (format === 'vertical' ? 145 : 95),
          width - 170,
          format === 'vertical' ? 44 : 32,
          5
        );
      }

      ctx.restore();
      await new Promise((r) => setTimeout(r, 1000 / fps));
    }
  }

  recorder.stop();
  const blob = await stopPromise;
  onProgress('¡Video listo!');

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Pelicula-29-Anos-${(settings.herName || 'Amor').replace(/\s+/g, '-')}.webm`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

