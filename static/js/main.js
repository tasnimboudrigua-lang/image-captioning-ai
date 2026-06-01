/**
 * VisionAI — Image Caption
 * Logique frontend : upload, drag-drop, appel API, résultat
 */

const fi  = document.getElementById('fileInput');
const dz  = document.getElementById('dropZone');
const pz  = document.getElementById('previewZone');
const pi  = document.getElementById('previewImg');
const bb  = document.getElementById('btnBrowse');
const bc  = document.getElementById('btnChange');
const bg  = document.getElementById('btnGen');
const bt  = document.getElementById('bText');
const ba  = document.getElementById('bArrow');
const bl  = document.getElementById('bLoad');
const rc  = document.getElementById('resCard');
const ct  = document.getElementById('capText');
const rm  = document.getElementById('resMeta');
const ec  = document.getElementById('errCard');
const et  = document.getElementById('errText');
const bcp = document.getElementById('btnCopy');
const bdl = document.getElementById('btnDl');
const brs = document.getElementById('btnReset');

let currentFile = null;

/* ── Gestion du fichier ── */
function handleFile(file) {
  if (!file || !file.type.startsWith('image/')) { showErr('Format invalide. Utilisez PNG, JPG ou WEBP.'); return; }
  if (file.size > 10 * 1024 * 1024)             { showErr('Fichier trop volumineux. Maximum 10 MB.');     return; }
  currentFile = file;
  hideErr(); hideRes();
  const reader = new FileReader();
  reader.onload = e => {
    pi.src = e.target.result;
    dz.classList.add('hidden');
    pz.classList.remove('hidden');
    bg.disabled = false;
  };
  reader.readAsDataURL(file);
}

bb.addEventListener('click', () => fi.click());
bc.addEventListener('click', () => fi.click());
fi.addEventListener('change', e => { if (e.target.files[0]) handleFile(e.target.files[0]); });
dz.addEventListener('click',  e => { if (e.target !== bb) fi.click(); });

/* ── Drag & Drop ── */
['dragenter','dragover','dragleave','drop'].forEach(ev => document.addEventListener(ev, e => e.preventDefault()));
dz.addEventListener('dragover',  () => dz.classList.add('drag-over'));
dz.addEventListener('dragleave', () => dz.classList.remove('drag-over'));
dz.addEventListener('drop', e => { dz.classList.remove('drag-over'); handleFile(e.dataTransfer.files[0]); });

/* ── Appel API ── */
bg.addEventListener('click', async () => {
  if (!currentFile) return;
  setLoading(true); hideRes(); hideErr();
  const fd = new FormData();
  fd.append('file', currentFile);
  try {
    const res  = await fetch('/caption', { method: 'POST', body: fd });
    const data = await res.json();
    if (!res.ok) { showErr(data.detail || `Erreur serveur (${res.status}).`); return; }
    showRes(data);
  } catch (e) {
    showErr("Impossible de joindre le serveur. Vérifiez que l'application est lancée.");
  } finally {
    setLoading(false);
  }
});

/* ── Helpers UI ── */
function setLoading(on) {
  bg.disabled = on;
  bt.classList.toggle('hidden', on);
  ba.classList.toggle('hidden', on);
  bl.classList.toggle('hidden', !on);
}

function showRes(data) {
  ct.textContent = data.caption;
  rm.textContent = `${data.filename} · ${(data.device || 'cpu').toUpperCase()}`;
  rc.classList.remove('hidden');
  rc.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideRes() { rc.classList.add('hidden'); }
function showErr(msg) { et.textContent = msg; ec.classList.remove('hidden'); }
function hideErr() { ec.classList.add('hidden'); }

/* ── Actions légende ── */
bcp.addEventListener('click', async () => {
  await navigator.clipboard.writeText(ct.textContent).catch(() => {});
  const orig = bcp.innerHTML;
  bcp.textContent = '✓ Copié !';
  setTimeout(() => bcp.innerHTML = orig, 1800);
});

bdl.addEventListener('click', () => {
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(new Blob([ct.textContent], { type: 'text/plain' })),
    download: 'legende.txt'
  });
  a.click();
});

brs.addEventListener('click', () => {
  currentFile = null; fi.value = ''; pi.src = '';
  pz.classList.add('hidden');
  dz.classList.remove('hidden');
  bg.disabled = true;
  hideRes(); hideErr();
});