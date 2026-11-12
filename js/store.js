/**
 * ============================================================================
 * RUMBO A TUS 29 · UNIFIED CLOUD STORE (GITHUB CLOUD + SUPABASE + LOCAL)
 * ============================================================================
 */

import { PUBLIC_CONFIG, DEFAULT_LOCAL_PIN } from './config.js';
import { IDEAS_BANK } from './ideas-bank.js';

const LS_CAPSULES_KEY = 'cap29_capsules_v1';
const LS_SETTINGS_KEY = 'cap29_settings_v1';
const LS_HER_PROGRESS_KEY = 'cap29_her_progress_v1';
const LS_CLOUD_CREDS_KEY = 'cap29_cloud_creds_v1';
const LS_ADMIN_PIN_KEY = 'cap29_admin_pin_v1';
const LS_PRIVATE_KEY = 'cap29_private_settings_v1';
const LS_GH_TOKEN_KEY = 'cap29_gh_token_v1';
const LS_FORCE_LOCAL_KEY = 'cap29_force_local_v1';

const IDB_NAME = 'cap29_media_db';
const IDB_STORE = 'blobs';

let supabaseClientPromise = null;
let cachedSupabaseUrl = null;
let cachedSupabaseKey = null;
const blobUrlCache = new Map();

let ghPublicCache = { ts: 0, promise: null, data: null };
let ghVaultCache = null;
let ghVaultPromise = null;

// ---------------------------------------------------------------------------
// UTF-8 & Base64 Helpers
// ---------------------------------------------------------------------------

function utf8ToBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

function base64ToUtf8(b64) {
  const clean = b64.replace(/\s/g, '');
  const bin = atob(clean);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder('utf-8').decode(bytes);
}

function arrayBufferToBase64(buf) {
  const bytes = new Uint8Array(buf);
  let bin = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  }
  return btoa(bin);
}

function base64ToUint8Array(b64) {
  const clean = b64.replace(/\s/g, '');
  const bin = atob(clean);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

// ---------------------------------------------------------------------------
// Spotify & Mode Helpers
// ---------------------------------------------------------------------------

export function toSpotifyEmbedUrl(rawUrl) {
  if (!rawUrl) return null;
  try {
    const u = new URL(rawUrl.trim());
    if (!u.hostname.includes('spotify.com')) return null;
    const cleanPath = u.pathname.replace(/^\/intl-[a-z-]+/i, '');
    const match = cleanPath.match(/^\/(track|playlist|album|episode)\/([A-Za-z0-9]+)/);
    if (!match) return null;
    return `https://open.spotify.com/embed/${match[1]}/${match[2]}?utm_source=generator&theme=0`;
  } catch {
    return null;
  }
}

export function isLocalhostEnv() {
  return (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.protocol === 'file:'
  );
}

export function setLocalPreviewOverride(enabled) {
  if (!isLocalhostEnv()) return;
  if (enabled) localStorage.setItem(LS_FORCE_LOCAL_KEY, '1');
  else localStorage.removeItem(LS_FORCE_LOCAL_KEY);
}

export function isLocalPreviewOverride() {
  return isLocalhostEnv() && localStorage.getItem(LS_FORCE_LOCAL_KEY) === '1';
}

function getCloudCreds() {
  try {
    const saved = JSON.parse(localStorage.getItem(LS_CLOUD_CREDS_KEY) || '{}');
    return {
      url: (PUBLIC_CONFIG.supabaseUrl || saved.url || '').trim(),
      anonKey: (PUBLIC_CONFIG.supabaseAnonKey || saved.anonKey || '').trim()
    };
  } catch {
    return {
      url: (PUBLIC_CONFIG.supabaseUrl || '').trim(),
      anonKey: (PUBLIC_CONFIG.supabaseAnonKey || '').trim()
    };
  }
}

export function saveCloudCreds(url, anonKey) {
  localStorage.setItem(
    LS_CLOUD_CREDS_KEY,
    JSON.stringify({ url: (url || '').trim(), anonKey: (anonKey || '').trim() })
  );
  supabaseClientPromise = null;
  cachedSupabaseUrl = null;
  cachedSupabaseKey = null;
}

export function isCloudConfigured() {
  const { url, anonKey } = getCloudCreds();
  return Boolean(url && anonKey && url.startsWith('http'));
}

export function isGitHubConfigured() {
  return Boolean(
    PUBLIC_CONFIG.githubOwner &&
      PUBLIC_CONFIG.githubPublicRepo &&
      PUBLIC_CONFIG.githubVaultRepo
  );
}

export function getBackendMode() {
  if (isLocalPreviewOverride()) return 'local';
  if (isCloudConfigured()) return 'supabase';
  if (isGitHubConfigured()) return 'github';
  return 'local';
}

export async function getSupabase() {
  const { url, anonKey } = getCloudCreds();
  if (!url || !anonKey) return null;

  if (!supabaseClientPromise || cachedSupabaseUrl !== url || cachedSupabaseKey !== anonKey) {
    cachedSupabaseUrl = url;
    cachedSupabaseKey = anonKey;
    supabaseClientPromise = import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm').then(
      ({ createClient }) => createClient(url, anonKey)
    );
  }
  return supabaseClientPromise;
}

// ---------------------------------------------------------------------------
// Defaults & Mappers
// ---------------------------------------------------------------------------

function defaultSettings() {
  return {
    herName: PUBLIC_CONFIG.herName || 'Amor Mío',
    birthdayIso: PUBLIC_CONFIG.birthdayIso || '2026-12-12T00:00:00',
    appTitle: PUBLIC_CONFIG.appTitle || 'Rumbo a tus 29',
    appSubtitle:
      PUBLIC_CONFIG.appSubtitle ||
      'Treinta días para recordarte por qué eres mi princesa y lo más hermoso de mi vida.',
    musicUrl: PUBLIC_CONFIG.musicUrl || '',
    finaleEnabled: false,
    finaleTitle: 'Nuestro Viaje Hacia tus 29',
    finaleDedication: 'Cada día contigo ha sido mi capítulo favorito. ¡Feliz cumpleaños, mi princesa!'
  };
}

function defaultCapsules() {
  return Array.from({ length: 30 }, (_, idx) => {
    const day = idx + 1;
    const idea = IDEAS_BANK[idx];
    return {
      dayNumber: day,
      isAuthorized: false,
      isOpenedByHer: false,
      isFavorite: false,
      teaserTitle: idea ? idea.teaserTitle : `Capítulo ${day} · Un secreto te espera...`,
      unlockedTitle: idea ? idea.unlockedTitle : `Capítulo ${day}`,
      message: idea ? idea.message : '',
      dynamicType: idea ? idea.dynamicType : 'classic',
      dynamicPayload: idea ? structuredClone(idea.dynamicPayload || {}) : {},
      dynamicDone: false,
      dynamicAnswer: '',
      mediaItems: [],
      herReply: '',
      allowReply: false,
      hasSunflowers: [3, 14, 22, 30].includes(day),
      openedAt: null
    };
  });
}

function mapDbCapsuleToModel(row) {
  return {
    dayNumber: row.day_number,
    isAuthorized: Boolean(row.is_authorized),
    isOpenedByHer: Boolean(row.is_opened_by_her),
    isFavorite: Boolean(row.is_favorite),
    teaserTitle: row.teaser_title || '',
    unlockedTitle: row.unlocked_title || '',
    message: row.message || '',
    dynamicType: row.dynamic_type || 'classic',
    dynamicPayload: row.dynamic_payload || {},
    dynamicDone: Boolean(row.dynamic_done),
    dynamicAnswer: row.dynamic_answer || '',
    mediaItems: Array.isArray(row.media_items) ? row.media_items : [],
    herReply: row.her_reply || '',
    openedAt: row.opened_at || null
  };
}

function mapModelToDbRow(c) {
  return {
    day_number: c.dayNumber,
    is_authorized: Boolean(c.isAuthorized),
    is_opened_by_her: Boolean(c.isOpenedByHer),
    is_favorite: Boolean(c.isFavorite),
    teaser_title: c.teaserTitle || '',
    unlocked_title: c.unlockedTitle || '',
    message: c.message || '',
    dynamic_type: c.dynamicType || 'classic',
    dynamic_payload: c.dynamicPayload || {},
    dynamic_done: Boolean(c.dynamicDone),
    dynamic_answer: c.dynamicAnswer || '',
    media_items: Array.isArray(c.mediaItems) ? c.mediaItems : [],
    her_reply: c.herReply || '',
    opened_at: c.openedAt || null,
    updated_at: new Date().toISOString()
  };
}

// ---------------------------------------------------------------------------
// GitHub Cloud API Helpers
// ---------------------------------------------------------------------------

export function getStoredGitHubToken() {
  return localStorage.getItem(LS_GH_TOKEN_KEY) || sessionStorage.getItem(LS_GH_TOKEN_KEY) || '';
}

function saveGitHubToken(token, remember = true) {
  if (remember) {
    localStorage.setItem(LS_GH_TOKEN_KEY, token);
    sessionStorage.removeItem(LS_GH_TOKEN_KEY);
  } else {
    sessionStorage.setItem(LS_GH_TOKEN_KEY, token);
    localStorage.removeItem(LS_GH_TOKEN_KEY);
  }
}

export function clearGitHubToken() {
  localStorage.removeItem(LS_GH_TOKEN_KEY);
  sessionStorage.removeItem(LS_GH_TOKEN_KEY);
  ghVaultCache = null;
  ghVaultPromise = null;
}

async function ghApiRequest(path, { method = 'GET', token = '', body = null, raw = false } = {}) {
  const headers = {
    Accept: raw ? 'application/vnd.github.raw' : 'application/vnd.github+json'
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body) headers['Content-Type'] = 'application/json';

  const res = await fetch(`https://api.github.com${path}`, {
    method,
    headers,
    cache: 'no-store',
    body: body ? JSON.stringify(body) : undefined
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    const err = new Error(`GitHub ${res.status}: ${errText.slice(0, 140)}`);
    err.status = res.status;
    throw err;
  }
  return raw ? res.text() : res.json();
}

async function ghGetJsonFile(owner, repo, filePath, token) {
  try {
    const file = await ghApiRequest(`/repos/${owner}/${repo}/contents/${filePath}?ref=main`, { token });
    const parsed = JSON.parse(base64ToUtf8(file.content));
    return { sha: file.sha, data: parsed };
  } catch (err) {
    if (err.status === 404) return { sha: null, data: null };
    throw err;
  }
}

async function ghPutBase64File(owner, repo, filePath, base64Content, commitMsg, token) {
  let existingSha = null;
  try {
    const existing = await ghApiRequest(`/repos/${owner}/${repo}/contents/${filePath}?ref=main`, { token });
    existingSha = existing.sha;
  } catch (err) {
    if (err.status !== 404) throw err;
  }

  return ghApiRequest(`/repos/${owner}/${repo}/contents/${filePath}`, {
    method: 'PUT',
    token,
    body: {
      message: commitMsg,
      content: base64Content,
      branch: 'main',
      ...(existingSha ? { sha: existingSha } : {})
    }
  });
}

let lastApiCheckTs = 0;

export function forceInstantPublicRefresh() {
  ghPublicCache.ts = 0;
}

async function fetchPublicGitHubSnapshot({ preferApi = true } = {}) {
  const now = Date.now();
  if (ghPublicCache.data && now - ghPublicCache.ts < 2000) {
    return ghPublicCache.data;
  }
  if (ghPublicCache.promise) return ghPublicCache.promise;

  ghPublicCache.promise = (async () => {
    const { githubOwner, githubPublicRepo } = PUBLIC_CONFIG;
    let payload = null;

    // 1. Instant GitHub API raw read (bypasses edge cache via timestamp, <1s live!)
    const canTryApi = preferApi && (now - lastApiCheckTs > 3500);
    if (canTryApi && githubOwner && githubPublicRepo && !isLocalhostEnv()) {
      lastApiCheckTs = Date.now();
      try {
        const rawText = await ghApiRequest(
          `/repos/${githubOwner}/${githubPublicRepo}/contents/data/public.json?ref=main&_=${Date.now()}`,
          { raw: true }
        );
        payload = JSON.parse(rawText);
      } catch {
        // Fallback to Pages CDN below
      }
    }

    // 2. Same-origin ./data/public.json (unlimited requests, cache-busted)
    if (!payload) {
      try {
        const resp = await fetch(`./data/public.json?t=${Date.now()}`, { cache: 'no-store' });
        if (resp.ok) payload = await resp.json();
      } catch {
        // Offline fallback
      }
    }

    if (!payload) {
      payload = ghPublicCache.data || { settings: defaultSettings(), capsules: defaultCapsules() };
    }

    // Never overwrite a newer API snapshot with an older Pages build
    const prevUpdated = ghPublicCache.data?.updatedAt || '';
    const nextUpdated = payload?.updatedAt || '';
    if (ghPublicCache.data && prevUpdated && nextUpdated && nextUpdated < prevUpdated) {
      payload = ghPublicCache.data;
    }

    ghPublicCache.data = payload;
    ghPublicCache.ts = Date.now();
    ghPublicCache.promise = null;
    return payload;
  })();

  return ghPublicCache.promise;
}

export function getHerLocalProgress() {
  try {
    return JSON.parse(localStorage.getItem(LS_HER_PROGRESS_KEY) || '{}');
  } catch {
    return {};
  }
}

export function saveHerLocalProgress(map) {
  localStorage.setItem(LS_HER_PROGRESS_KEY, JSON.stringify(map));
}

export function resetAllHerLocalProgress() {
  try {
    localStorage.removeItem(LS_HER_PROGRESS_KEY);
  } catch (e) {
    console.warn('Could not reset local progress', e);
  }
}

export function resealSingleCapsule(dayNumber) {
  try {
    const progress = getHerLocalProgress();
    const key = String(dayNumber);
    if (progress[key]) {
      delete progress[key];
      saveHerLocalProgress(progress);
    }
  } catch (e) {
    console.warn('Could not reseal single capsule', e);
  }
}

async function ensureGhVaultLoaded() {
  if (ghVaultCache) return ghVaultCache;
  if (ghVaultPromise) return ghVaultPromise;

  ghVaultPromise = (async () => {
    try {
      const token = getStoredGitHubToken();
      const { githubOwner, githubVaultRepo } = PUBLIC_CONFIG;
      const { data } = await ghGetJsonFile(githubOwner, githubVaultRepo, 'vault.json', token);
      if (data && Array.isArray(data.capsules)) {
        ghVaultCache = {
          settings: { ...defaultSettings(), ...(data.settings || {}) },
          capsules: data.capsules
        };
      } else {
        ghVaultCache = {
          settings: defaultSettings(),
          capsules: defaultCapsules()
        };
        await ghPutBase64File(
          githubOwner,
          githubVaultRepo,
          'vault.json',
          utf8ToBase64(JSON.stringify(ghVaultCache, null, 2)),
          'Inicializar boveda privada de 30 capitulos',
          token
        );
      }
      return ghVaultCache;
    } finally {
      ghVaultPromise = null;
    }
  })();

  return ghVaultPromise;
}

async function ghReadFileBase64(owner, repo, relPath, token) {
  const fileObj = await ghApiRequest(`/repos/${owner}/${repo}/contents/${relPath}?ref=main`, { token });
  const inlineContent = (fileObj.content || '').replace(/\s/g, '');
  if (inlineContent) return inlineContent;
  // Files > 1 MB return empty inline content in Contents API; read via Git Blobs API
  const blobObj = await ghApiRequest(`/repos/${owner}/${repo}/git/blobs/${fileObj.sha}`, { token });
  return (blobObj.content || '').replace(/\s/g, '');
}

async function syncGitHubVaultAndPublic(vaultData) {
  const token = getStoredGitHubToken();
  const { githubOwner, githubPublicRepo, githubVaultRepo } = PUBLIC_CONFIG;

  // 1. Publish any newly authorized private vault media to public repo
  for (const cap of vaultData.capsules) {
    if (!cap.isAuthorized || !Array.isArray(cap.mediaItems)) continue;
    for (const item of cap.mediaItems) {
      if (item.url && item.url.startsWith('gh-vault://') && !item.publicUrl) {
        const vaultRelPath = item.url.slice('gh-vault://'.length);
        const b64 = await ghReadFileBase64(githubOwner, githubVaultRepo, vaultRelPath, token);
        const pubRelPath = `data/${vaultRelPath}`;
        await ghPutBase64File(
          githubOwner,
          githubPublicRepo,
          pubRelPath,
          b64,
          `Publicar media autorizada del Capitulo ${cap.dayNumber}`,
          token
        );
        item.publicUrl = `./${pubRelPath}`;
      }
    }
  }

  // 2. Save complete vault (including locked drafts & media) to PRIVATE repo
  await ghPutBase64File(
    githubOwner,
    githubVaultRepo,
    'vault.json',
    utf8ToBase64(JSON.stringify(vaultData, null, 2)),
    `Actualizar boveda (${new Date().toISOString()})`,
    token
  );

  // 3. Build strictly sanitized public.json (ZERO spoilers for locked capsules)
  const sanitizedCapsules = vaultData.capsules.map((c) => {
    if (!c.isAuthorized) {
      return {
        dayNumber: c.dayNumber,
        isAuthorized: false,
        teaserTitle: c.teaserTitle || 'Un secreto espera tu momento...'
      };
    }
    return {
      dayNumber: c.dayNumber,
      isAuthorized: true,
      teaserTitle: c.teaserTitle || '',
      unlockedTitle: c.unlockedTitle || `Capítulo ${c.dayNumber}`,
      message: c.message || '',
      dynamicType: c.dynamicType || 'classic',
      dynamicPayload: c.dynamicPayload || {},
      allowReply: Boolean(c.allowReply),
      hasSunflowers: Boolean(c.hasSunflowers),
      mediaItems: (c.mediaItems || []).map((m) => ({
        type: m.type,
        url: m.publicUrl || m.url,
        caption: m.caption || ''
      }))
    };
  });

  const publicSnapshot = {
    updatedAt: new Date().toISOString(),
    settings: vaultData.settings,
    capsules: sanitizedCapsules
  };

  await ghPutBase64File(
    githubOwner,
    githubPublicRepo,
    'data/public.json',
    utf8ToBase64(JSON.stringify(publicSnapshot, null, 2)),
    `Sincronizar capitulos autorizados`,
    token
  );

  ghPublicCache = { ts: Date.now(), promise: null, data: publicSnapshot };
}

// ---------------------------------------------------------------------------
// IndexedDB Local Media Storage
// ---------------------------------------------------------------------------

function openMediaDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function saveLocalBlob(key, blob) {
  const db = await openMediaDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, 'readwrite');
    tx.objectStore(IDB_STORE).put(blob, key);
    tx.oncomplete = () => resolve(`idb://${key}`);
    tx.onerror = () => reject(tx.error);
  });
}

async function getLocalBlob(key) {
  const db = await openMediaDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, 'readonly');
    const req = tx.objectStore(IDB_STORE).get(key);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

export async function resolveMediaUrl(url) {
  if (!url) return '';
  if (url.startsWith('idb://')) {
    if (blobUrlCache.has(url)) return blobUrlCache.get(url);
    const key = url.slice(6);
    const blob = await getLocalBlob(key);
    if (!blob) return '';
    const objUrl = URL.createObjectURL(blob);
    blobUrlCache.set(url, objUrl);
    return objUrl;
  }
  if (url.startsWith('gh-vault://')) {
    if (blobUrlCache.has(url)) return blobUrlCache.get(url);
    const token = getStoredGitHubToken();
    if (!token) return '';
    const relPath = url.slice('gh-vault://'.length);
    const { githubOwner, githubVaultRepo } = PUBLIC_CONFIG;
    try {
      const b64 = await ghReadFileBase64(githubOwner, githubVaultRepo, relPath, token);
      const bytes = base64ToUint8Array(b64);
      const ext = relPath.split('.').pop()?.toLowerCase() || '';
      const mime =
        ext === 'mp4' ? 'video/mp4' :
        ext === 'webm' ? 'video/webm' :
        ext === 'mp3' ? 'audio/mpeg' :
        ext === 'png' ? 'image/png' :
        'image/jpeg';
      const blob = new Blob([bytes], { type: mime });
      const objUrl = URL.createObjectURL(blob);
      blobUrlCache.set(url, objUrl);
      return objUrl;
    } catch {
      return '';
    }
  }
  if (
    PUBLIC_CONFIG.githubOwner &&
    PUBLIC_CONFIG.githubPublicRepo &&
    url.startsWith(`https://raw.githubusercontent.com/${PUBLIC_CONFIG.githubOwner}/${PUBLIC_CONFIG.githubPublicRepo}/main/data/`)
  ) {
    const rel = url.split('/main/')[1];
    return `./${rel}`;
  }
  return url;
}

export function getRawFallbackUrl(resolvedUrl) {
  if (
    resolvedUrl &&
    resolvedUrl.startsWith('./data/') &&
    PUBLIC_CONFIG.githubOwner &&
    PUBLIC_CONFIG.githubPublicRepo
  ) {
    return `https://raw.githubusercontent.com/${PUBLIC_CONFIG.githubOwner}/${PUBLIC_CONFIG.githubPublicRepo}/main/${resolvedUrl.slice(2)}`;
  }
  return '';
}

// ---------------------------------------------------------------------------
// Local State Read/Write Helpers
// ---------------------------------------------------------------------------

function loadLocalSettings() {
  try {
    const raw = localStorage.getItem(LS_SETTINGS_KEY);
    if (!raw) {
      const def = defaultSettings();
      localStorage.setItem(LS_SETTINGS_KEY, JSON.stringify(def));
      return def;
    }
    return { ...defaultSettings(), ...JSON.parse(raw) };
  } catch {
    return defaultSettings();
  }
}

function loadLocalCapsules() {
  try {
    const raw = localStorage.getItem(LS_CAPSULES_KEY);
    if (!raw) {
      const def = defaultCapsules();
      localStorage.setItem(LS_CAPSULES_KEY, JSON.stringify(def));
      return def;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length !== 30) {
      const def = defaultCapsules();
      localStorage.setItem(LS_CAPSULES_KEY, JSON.stringify(def));
      return def;
    }
    return parsed;
  } catch {
    return defaultCapsules();
  }
}

function saveLocalCapsules(list) {
  localStorage.setItem(LS_CAPSULES_KEY, JSON.stringify(list));
}

// ---------------------------------------------------------------------------
// PUBLIC (HER PLATFORM) API — STRICT ZERO-SPOILER ISOLATION
// ---------------------------------------------------------------------------

export async function getPublicSettings() {
  const mode = getBackendMode();

  if (mode === 'supabase') {
    try {
      const sb = await getSupabase();
      const { data, error } = await sb.from('app_settings').select('*').eq('id', 1).single();
      if (!error && data) {
        return {
          herName: data.her_name || PUBLIC_CONFIG.herName,
          birthdayIso: data.birthday_iso || PUBLIC_CONFIG.birthdayIso,
          appTitle: data.app_title || PUBLIC_CONFIG.appTitle,
          appSubtitle: data.app_subtitle || PUBLIC_CONFIG.appSubtitle,
          musicUrl: data.music_url || '',
          finaleEnabled: Boolean(data.finale_enabled),
          finaleTitle: data.finale_title || 'Nuestro Viaje Hacia tus 29',
          finaleDedication: data.finale_dedication || ''
        };
      }
    } catch {
      // Fallback
    }
  }

  if (mode === 'github') {
    const snap = await fetchPublicGitHubSnapshot();
    return { ...defaultSettings(), ...(snap.settings || {}) };
  }

  return loadLocalSettings();
}

export async function getHerCapsules() {
  const mode = getBackendMode();

  if (mode === 'supabase') {
    const sb = await getSupabase();
    const { data, error } = await sb.rpc('get_her_capsules');
    if (!error && Array.isArray(data)) {
      return data.map((row) => {
        if (!row.is_authorized) {
          return {
            dayNumber: row.day_number,
            isAuthorized: false,
            isOpenedByHer: false,
            isFavorite: false,
            teaserTitle: row.teaser_title || 'Esperando autorización...',
            unlockedTitle: '',
            message: '',
            dynamicType: 'classic',
            dynamicPayload: null,
            dynamicDone: false,
            dynamicAnswer: '',
            mediaItems: [],
            herReply: '',
      allowReply: false,
      hasSunflowers: false,
            openedAt: null
          };
        }
        return mapDbCapsuleToModel(row);
      });
    }
  }

  if (mode === 'github') {
    const snap = await fetchPublicGitHubSnapshot();
    const progress = getHerLocalProgress();
    return (snap.capsules || defaultCapsules()).map((c) => {
      if (!c.isAuthorized) {
        return {
          dayNumber: c.dayNumber,
          isAuthorized: false,
          isOpenedByHer: false,
          isFavorite: false,
          teaserTitle: c.teaserTitle || 'Esperando autorización...',
          unlockedTitle: '',
          message: '',
          dynamicType: 'classic',
          dynamicPayload: null,
          dynamicDone: false,
          dynamicAnswer: '',
          mediaItems: [],
          herReply: '',
      allowReply: false,
      hasSunflowers: false,
          openedAt: null
        };
      }
      const p = progress[String(c.dayNumber)] || {};
      return {
        dayNumber: c.dayNumber,
        isAuthorized: true,
        isOpenedByHer: Boolean(p.isOpenedByHer),
        openedAt: p.openedAt || null,
        isFavorite: Boolean(p.isFavorite),
        teaserTitle: c.teaserTitle || '',
        unlockedTitle: c.unlockedTitle || `Capítulo ${c.dayNumber}`,
        message: c.message || '',
        dynamicType: c.dynamicType || 'classic',
        dynamicPayload: c.dynamicPayload || {},
      allowReply: Boolean(c.allowReply),
      hasSunflowers: Boolean(c.hasSunflowers),
        dynamicDone: Boolean(p.dynamicDone),
        dynamicAnswer: p.dynamicAnswer || '',
        mediaItems: Array.isArray(c.mediaItems) ? c.mediaItems : [],
        herReply: p.herReply || ''
      };
    });
  }

  const all = loadLocalCapsules();
  return all.map((c) => {
    if (!c.isAuthorized) {
      return {
        dayNumber: c.dayNumber,
        isAuthorized: false,
        isOpenedByHer: false,
        isFavorite: false,
        teaserTitle: c.teaserTitle || 'Esperando autorización...',
        unlockedTitle: '',
        message: '',
        dynamicType: 'classic',
        dynamicPayload: null,
        dynamicDone: false,
        dynamicAnswer: '',
        mediaItems: [],
        herReply: '',
      allowReply: false,
      hasSunflowers: false,
        openedAt: null
      };
    }
    return c;
  });
}

export async function herInteractCapsule(dayNumber, changes) {
  const mode = getBackendMode();

  if (mode === 'supabase') {
    const sb = await getSupabase();
    const { data, error } = await sb.rpc('her_interact_capsule', {
      p_day: dayNumber,
      p_opened: changes.isOpenedByHer ?? null,
      p_favorite: changes.isFavorite ?? null,
      p_dynamic_done: changes.dynamicDone ?? null,
      p_dynamic_answer: changes.dynamicAnswer ?? null,
      p_her_reply: changes.herReply ?? null
    });
    if (error) throw error;
    return Boolean(data);
  }

  if (mode === 'github') {
    const progress = getHerLocalProgress();
    const key = String(dayNumber);
    const cur = progress[key] || {};
    if (changes.isOpenedByHer !== undefined) {
      cur.isOpenedByHer = Boolean(changes.isOpenedByHer);
      if (cur.isOpenedByHer && !cur.openedAt) cur.openedAt = new Date().toISOString();
      if (!cur.isOpenedByHer) cur.openedAt = null;
    }
    if (changes.isFavorite !== undefined) cur.isFavorite = Boolean(changes.isFavorite);
    if (changes.dynamicDone !== undefined) cur.dynamicDone = Boolean(changes.dynamicDone);
    if (changes.dynamicAnswer !== undefined) cur.dynamicAnswer = changes.dynamicAnswer;
    if (changes.herReply !== undefined) cur.herReply = changes.herReply;
    if (!cur.isOpenedByHer && !cur.isFavorite && !cur.dynamicDone && !cur.herReply && !cur.dynamicAnswer) {
      delete progress[key];
    } else {
      progress[key] = cur;
    }
    saveHerLocalProgress(progress);
    return true;
  }

  const all = loadLocalCapsules();
  const target = all.find((c) => c.dayNumber === dayNumber);
  if (!target || !target.isAuthorized) return false;

  if (changes.isOpenedByHer !== undefined) {
    target.isOpenedByHer = Boolean(changes.isOpenedByHer);
    if (target.isOpenedByHer && !target.openedAt) {
      target.openedAt = new Date().toISOString();
    }
    if (!target.isOpenedByHer) {
      target.openedAt = null;
    }
  }
  if (changes.isFavorite !== undefined) target.isFavorite = Boolean(changes.isFavorite);
  if (changes.dynamicDone !== undefined) target.dynamicDone = Boolean(changes.dynamicDone);
  if (changes.dynamicAnswer !== undefined) target.dynamicAnswer = changes.dynamicAnswer;
  if (changes.herReply !== undefined) target.herReply = changes.herReply;

  saveLocalCapsules(all);
  return true;
}

export async function subscribeHerLiveUpdates(onChange) {
  const mode = getBackendMode();

  if (mode === 'local') {
    const handler = (e) => {
      if (e.key === LS_CAPSULES_KEY || e.key === LS_SETTINGS_KEY) onChange();
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }

  if (mode === 'github') {
    let tick = 0;
    const timer = setInterval(async () => {
      if (document.visibilityState !== 'visible') return;
      tick++;
      ghPublicCache.ts = 0;
      // Every 10s check unlimited GitHub Pages CDN; every 60s also hit instant GitHub API
      await fetchPublicGitHubSnapshot({ preferApi: tick % 6 === 0 });
      onChange();
    }, 10000);
    return () => clearInterval(timer);
  }

  const sb = await getSupabase();
  const channel = sb
    .channel('cap29-live')
    .on('broadcast', { event: 'refresh' }, () => onChange())
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'app_settings' },
      () => onChange()
    )
    .subscribe();

  return () => {
    sb.removeChannel(channel);
  };
}

// ---------------------------------------------------------------------------
// ADMIN (HIS COMMAND CENTER) API
// ---------------------------------------------------------------------------

export function getLocalAdminPin() {
  return localStorage.getItem(LS_ADMIN_PIN_KEY) || DEFAULT_LOCAL_PIN;
}

export function setLocalAdminPin(newPin) {
  if (newPin && newPin.trim().length >= 4) {
    localStorage.setItem(LS_ADMIN_PIN_KEY, newPin.trim());
  }
}

export async function getAdminSession() {
  const mode = getBackendMode();
  if (mode === 'local') return { mode: 'local', user: { email: 'modo-local' } };

  if (mode === 'github') {
    const token = getStoredGitHubToken();
    if (!token) return null;
    try {
      const user = await ghApiRequest('/user', { token });
      if (user.login?.toLowerCase() === PUBLIC_CONFIG.githubOwner.toLowerCase()) {
        return { mode: 'github', user };
      }
    } catch {
      clearGitHubToken();
      return null;
    }
    return null;
  }

  const sb = await getSupabase();
  const { data } = await sb.auth.getSession();
  return data.session ? { mode: 'supabase', user: data.session.user } : null;
}

export async function signInGitHubAdmin(token, remember = true) {
  const clean = (token || '').trim();
  if (!clean) throw new Error('Ingresa tu token de GitHub.');
  const user = await ghApiRequest('/user', { token: clean });
  if (user.login?.toLowerCase() !== PUBLIC_CONFIG.githubOwner.toLowerCase()) {
    throw new Error(`Este token pertenece a "${user.login}", no al propietario "${PUBLIC_CONFIG.githubOwner}".`);
  }
  saveGitHubToken(clean, remember);
  ghVaultCache = null;
  return user;
}

export async function signInCloudAdmin(email, password) {
  const sb = await getSupabase();
  if (!sb) throw new Error('Supabase no está configurado todavía.');
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOutCloudAdmin() {
  const mode = getBackendMode();
  if (mode === 'github') {
    clearGitHubToken();
    return;
  }
  if (mode === 'supabase') {
    const sb = await getSupabase();
    await sb.auth.signOut();
  }
}

export async function getAdminCapsules() {
  const mode = getBackendMode();

  if (mode === 'supabase') {
    const sb = await getSupabase();
    const { data, error } = await sb
      .from('capsules')
      .select('*')
      .order('day_number', { ascending: true });
    if (error) throw error;
    return data.map(mapDbCapsuleToModel);
  }

  if (mode === 'github') {
    const vault = await ensureGhVaultLoaded();
    return vault.capsules;
  }

  return loadLocalCapsules();
}

export async function getAdminSettings() {
  if (getBackendMode() === 'github') {
    const vault = await ensureGhVaultLoaded();
    return vault.settings;
  }
  return getPublicSettings();
}

async function broadcastRefreshSignal() {
  if (getBackendMode() !== 'supabase') return;
  try {
    const sb = await getSupabase();
    const ch = sb.channel('cap29-live');
    await ch.subscribe();
    await ch.send({ type: 'broadcast', event: 'refresh', payload: { ts: Date.now() } });
    sb.removeChannel(ch);
  } catch {
    // Non-fatal
  }
}

export async function saveAdminCapsule(capsule) {
  const mode = getBackendMode();

  if (mode === 'supabase') {
    const sb = await getSupabase();
    const row = mapModelToDbRow(capsule);
    const { error } = await sb.from('capsules').upsert(row, { onConflict: 'day_number' });
    if (error) throw error;
    await broadcastRefreshSignal();
    return;
  }

  if (mode === 'github') {
    const vault = await ensureGhVaultLoaded();
    const idx = vault.capsules.findIndex((c) => c.dayNumber === capsule.dayNumber);
    if (idx >= 0) vault.capsules[idx] = capsule;
    else vault.capsules.push(capsule);
    await syncGitHubVaultAndPublic(vault);
    return;
  }

  const all = loadLocalCapsules();
  const idx = all.findIndex((c) => c.dayNumber === capsule.dayNumber);
  if (idx >= 0) all[idx] = capsule;
  else all.push(capsule);
  saveLocalCapsules(all);
}

export async function saveAdminSettings(settings) {
  const mode = getBackendMode();

  if (mode === 'supabase') {
    const sb = await getSupabase();
    const { error } = await sb
      .from('app_settings')
      .upsert(
        {
          id: 1,
          her_name: settings.herName,
          birthday_iso: settings.birthdayIso,
          app_title: settings.appTitle,
          app_subtitle: settings.appSubtitle,
          music_url: settings.musicUrl,
          finale_enabled: Boolean(settings.finaleEnabled),
          finale_title: settings.finaleTitle,
          finale_dedication: settings.finaleDedication,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'id' }
      );
    if (error) throw error;
    await broadcastRefreshSignal();
    return;
  }

  if (mode === 'github') {
    const vault = await ensureGhVaultLoaded();
    vault.settings = settings;
    await syncGitHubVaultAndPublic(vault);
    return;
  }

  localStorage.setItem(LS_SETTINGS_KEY, JSON.stringify(settings));
}

export async function getPrivateAdminSettings() {
  const defaults = {
    telegramBotToken: '',
    telegramChatId: '',
    whatsappPhone: '',
    whatsappTemplate:
      '✨ Hola {nombre}! Acabo de autorizar la apertura del Capítulo {capitulo} en tu universo. Entra a descubrirlo aquí: {link}'
  };
  const mode = getBackendMode();

  if (mode === 'supabase') {
    try {
      const sb = await getSupabase();
      const { data } = await sb.from('private_admin_settings').select('*').eq('id', 1).single();
      if (data) {
        return {
          telegramBotToken: data.telegram_bot_token || '',
          telegramChatId: data.telegram_chat_id || '',
          whatsappPhone: data.whatsapp_phone || ''
        };
      }
    } catch {
      return defaults;
    }
  }

  if (mode === 'github') {
    try {
      const token = getStoredGitHubToken();
      const { githubOwner, githubVaultRepo } = PUBLIC_CONFIG;
      const { data } = await ghGetJsonFile(githubOwner, githubVaultRepo, 'private-settings.json', token);
      if (data) return { ...defaults, ...data };
    } catch {
      return defaults;
    }
  }

  try {
    return { ...defaults, ...JSON.parse(localStorage.getItem(LS_PRIVATE_KEY) || '{}') };
  } catch {
    return defaults;
  }
}

export async function savePrivateAdminSettings(priv) {
  const mode = getBackendMode();

  if (mode === 'supabase') {
    const sb = await getSupabase();
    const { error } = await sb
      .from('private_admin_settings')
      .upsert(
        {
          id: 1,
          telegram_bot_token: priv.telegramBotToken || '',
          telegram_chat_id: priv.telegramChatId || '',
          whatsapp_phone: priv.whatsappPhone || '',
          updated_at: new Date().toISOString()
        },
        { onConflict: 'id' }
      );
    if (error) throw error;
    return;
  }

  if (mode === 'github') {
    const token = getStoredGitHubToken();
    const { githubOwner, githubVaultRepo } = PUBLIC_CONFIG;
    await ghPutBase64File(
      githubOwner,
      githubVaultRepo,
      'private-settings.json',
      utf8ToBase64(JSON.stringify(priv, null, 2)),
      'Actualizar configuracion privada de alertas',
      token
    );
    return;
  }

  localStorage.setItem(LS_PRIVATE_KEY, JSON.stringify(priv));
}

export async function uploadMediaFile(dayNumber, fileOrBlob, customFileName = '') {
  const origName = customFileName || fileOrBlob.name || `recuerdo-${Date.now()}.webm`;
  const cleanName = origName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const mode = getBackendMode();

  if (mode === 'supabase') {
    const sb = await getSupabase();
    const path = `day-${String(dayNumber).padStart(2, '0')}/${Date.now()}-${cleanName}`;
    const { error } = await sb.storage
      .from('memories')
      .upload(path, fileOrBlob, { upsert: true, contentType: fileOrBlob.type || undefined });
    if (error) throw error;

    const { data } = sb.storage.from('memories').getPublicUrl(path);
    return data.publicUrl;
  }

  if (mode === 'github') {
    if (fileOrBlob.size > 24 * 1024 * 1024) {
      throw new Error(
        'Este archivo supera 24 MB para subida directa a GitHub. Comprímelo o pega el enlace externo (Drive/YouTube/Cloudinary).'
      );
    }
    const token = getStoredGitHubToken();
    const { githubOwner, githubVaultRepo } = PUBLIC_CONFIG;
    const relPath = `media/day-${String(dayNumber).padStart(2, '0')}/${Date.now()}-${cleanName}`;
    const buf = await fileOrBlob.arrayBuffer();
    const b64 = arrayBufferToBase64(buf);
    await ghPutBase64File(
      githubOwner,
      githubVaultRepo,
      relPath,
      b64,
      `Subir recuerdo privado del Capitulo ${dayNumber}`,
      token
    );
    return `gh-vault://${relPath}`;
  }

  const key = `day_${dayNumber}_${Date.now()}_${cleanName}`;
  return saveLocalBlob(key, fileOrBlob);
}

export async function exportFullBackupJson() {
  const settings = await getAdminSettings();
  const capsules = await getAdminCapsules();
  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      version: 1,
      settings,
      capsules
    },
    null,
    2
  );
}

export async function importFullBackupJson(jsonText) {
  const parsed = JSON.parse(jsonText);
  if (!parsed || !Array.isArray(parsed.capsules)) {
    throw new Error('El archivo no tiene el formato válido de respaldo.');
  }
  if (parsed.settings) {
    await saveAdminSettings({ ...defaultSettings(), ...parsed.settings });
  }
  for (const cap of parsed.capsules) {
    await saveAdminCapsule(cap);
  }
}
