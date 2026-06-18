/* ============================================================
   INDEX.JS - Scripts spécifiques à la page d'accueil CGI
   Community Growth Initiative | cgi-mfi.com
   ============================================================ */

/* ===================================================
   ITEMS DE RECHERCHE - page d'accueil
=================================================== */
window.searchItems = [
  'Ouvrir un compte épargne CGI',
  'MICRO-CRÉDIT 2,5% - Crédit en 48h',
  'CGI DJANGUI+ - Tontine formalisée',
  'CGI BUILD - Épargne 8%/an',
  'Simulateur de crédit CGI',
  'Espace membre CGI',
  'Devenir membre fondateur CGI - à partir de 4 900 FCFA',
  'Crédit Agricole Hauts-Plateaux',
  'Programme formation entrepreneuriale CGI',
  'Impact RSE CGI - ODD 1, 5, 8',
  'Dossier investisseur CGI',
  'Assemblée Générale Constitutive',
  'Mobile Money MTN Orange CGI',
  'Gouvernance COBAC OHADA',
  'Contact CGI'
];

/* ===================================================
   HERO SLIDER
=================================================== */
let currentSlide = 0;
const totalSlides = 3;
let heroInterval;
let heroPaused = false;

function goSlide(n) {
  const dots = document.querySelectorAll('.hero-dot');
  dots[currentSlide].classList.remove('active');
  dots[currentSlide].setAttribute('aria-selected', 'false');
  document.getElementById('slide-' + currentSlide).classList.remove('active');

  currentSlide = ((n % totalSlides) + totalSlides) % totalSlides;

  dots[currentSlide].classList.add('active');
  dots[currentSlide].setAttribute('aria-selected', 'true');
  document.getElementById('slide-' + currentSlide).classList.add('active');
}

function slideHero(dir) {
  clearInterval(heroInterval);
  goSlide(currentSlide + dir);
  if (!heroPaused) heroInterval = setInterval(() => goSlide(currentSlide + 1), 5000);
}

/* I11 - Bouton pause/play du slider */
const ICON_PAUSE = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/></svg>';
const ICON_PLAY  = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3"/></svg>';

function toggleSliderPause() {
  const btn = document.getElementById('slider-pause');
  heroPaused = !heroPaused;
  if (heroPaused) {
    clearInterval(heroInterval);
    if (btn) {
      btn.setAttribute('aria-pressed', 'true');
      btn.innerHTML = ICON_PLAY;
      btn.setAttribute('aria-label', 'Reprendre le slider');
    }
  } else {
    heroInterval = setInterval(() => goSlide(currentSlide + 1), 5000);
    if (btn) {
      btn.setAttribute('aria-pressed', 'false');
      btn.innerHTML = ICON_PAUSE;
      btn.setAttribute('aria-label', 'Mettre en pause le slider');
    }
  }
}

/* ===================================================
   TÉMOIGNAGES SLIDER
=================================================== */
let testiIndex = 0;

function slideTesti(dir) {
  const track = document.getElementById('testiTrack');
  if (!track) return;
  const cards = track.querySelectorAll('.testimonial-card');
  const visible = window.innerWidth > 900 ? 3 : 1;
  const max = cards.length - visible;
  testiIndex = Math.max(0, Math.min(max, testiIndex + dir));
  const cardW = cards[0].offsetWidth + 24;
  track.style.transform = 'translateX(-' + (testiIndex * cardW) + 'px)';
}

/* ===================================================
   ONGLETS PRODUITS - A4 : hidden synchronisé
=================================================== */
function switchProd(tab, el) {
  document.querySelectorAll('.prod-tab').forEach(t => {
    t.classList.remove('active');
    t.setAttribute('aria-selected', 'false');
  });
  document.querySelectorAll('.prod-panel').forEach(p => {
    p.classList.remove('active');
    p.hidden = true;
  });
  el.classList.add('active');
  el.setAttribute('aria-selected', 'true');
  const panel = document.getElementById('prod-' + tab);
  if (panel) { panel.classList.add('active'); panel.hidden = false; }
}

/* ===================================================
   ONGLETS AGENDA
=================================================== */
function switchAgenda(tab, el) {
  document.querySelectorAll('.agenda-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.agenda-panel').forEach(p => { p.classList.remove('active'); p.hidden = true; });
  el.classList.add('active');
  const panel = document.getElementById('panel-' + tab);
  if (panel) { panel.classList.add('active'); panel.hidden = false; }
}

/* ===================================================
   ONGLETS ESPACE MEMBRE
=================================================== */
function switchEspace(tab, el) {
  document.querySelectorAll('.espace-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  const conn = document.getElementById('esp-connexion');
  const insc = document.getElementById('esp-inscription');
  if (conn) conn.style.display = tab === 'connexion' ? 'block' : 'none';
  if (insc) insc.style.display = tab === 'inscription' ? 'block' : 'none';
}

function espaceLogin() {
  document.getElementById('espaceModal').classList.add('open');
}

/* ===================================================
   SIMULATEUR DE CRÉDIT (mini, page d'accueil)
=================================================== */
let simDuree = 12;

function selectDur(mois, el) {
  simDuree = mois;
  document.querySelectorAll('.sim-dur-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
}

function updateSlider() {
  const val = parseInt(document.getElementById('simMontant').value) || 0;
  const range = document.getElementById('simRange');
  if (range) range.value = Math.min(Math.max(val, 50000), 5000000);
  updateRangeStyle();
}

function syncMontant() {
  const range = document.getElementById('simRange');
  const input = document.getElementById('simMontant');
  if (range && input) input.value = range.value;
  updateRangeStyle();
}

function updateRangeStyle() {
  const range = document.getElementById('simRange');
  if (!range) return;
  const pct = ((range.value - range.min) / (range.max - range.min)) * 100;
  range.style.background =
    'linear-gradient(to right, var(--red) ' + pct + '%, rgba(255,255,255,0.2) ' + pct + '%)';
}

/* B6 - Erreurs inline (remplace alert()) */
function showSimError(msg) {
  let err = document.getElementById('simErrorMsg');
  if (!err) {
    err = document.createElement('p');
    err.id = 'simErrorMsg';
    err.className = 'field-error';
    err.setAttribute('aria-live', 'polite');
    const btn = document.querySelector('.sim-btn');
    if (btn) btn.parentNode.insertBefore(err, btn);
  }
  err.textContent = msg;
}

function clearSimError() {
  const err = document.getElementById('simErrorMsg');
  if (err) err.textContent = '';
}

function calculerCredit() {
  clearSimError();
  const montant = parseFloat(document.getElementById('simMontant').value) || 0;
  const duree = simDuree;
  const tauxMensuel = parseFloat(document.getElementById('simType').value) / 100;

  if (montant < 50000)   { showSimError('Le montant minimum est de 50 000 FCFA.'); return; }
  if (montant > 5000000) { showSimError('Le montant maximum est de 5 000 000 FCFA.'); return; }

  const capitalParMois = montant / duree;
  let totalInterets = 0;
  let totalRemboursement = 0;

  for (let i = 1; i <= duree; i++) {
    const capitalRestant = montant - (capitalParMois * (i - 1));
    const interet = capitalRestant * tauxMensuel;
    totalInterets += interet;
    totalRemboursement += capitalParMois + interet;
  }

  const premiereMensualite = capitalParMois + (montant * tauxMensuel);
  const derniereMensualite = capitalParMois + (capitalParMois * tauxMensuel);

  const fmt = n => Math.round(n).toLocaleString('fr-FR') + ' FCFA';

  document.getElementById('resMensualite').textContent =
    fmt(premiereMensualite) + ' → ' + fmt(derniereMensualite);
  document.getElementById('resDuree').textContent    = duree + ' mois';
  document.getElementById('resCapital').textContent  = fmt(montant);
  document.getElementById('resInterets').textContent = fmt(totalInterets);
  document.getElementById('resTotal').textContent    = fmt(totalRemboursement);

  const result = document.getElementById('simResult');
  if (result) { result.classList.add('visible'); result.style.display = 'block'; }
}

/* ===================================================
   CALENDRIER - B9 initialisé au mois courant
=================================================== */
let calDate = new Date();

const calEvents = {
  '2026-4-15':  'cobac',
  '2026-5-5':   'launch',
  '2026-6-20':  'formation',
  '2026-7-15':  'coaching',
  '2026-9-10':  'ag',
  '2026-10-15': 'ag',
  '2026-11-5':  'launch',
  '2026-12-15': 'clot'
};

const monthNames = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

/* B16 - Mise à jour des deux labels en une seule passe */
function updateCalDisplay() {
  const y = calDate.getFullYear();
  const m = calDate.getMonth();
  const label = monthNames[m] + ' ' + y;
  const el1 = document.getElementById('calMonth');
  const el2 = document.getElementById('calMonth2');
  if (el1) el1.textContent = label;
  if (el2) el2.textContent = label;
}

function renderCalendar() {
  updateCalDisplay();
  const y = calDate.getFullYear();
  const m = calDate.getMonth();

  const firstDay    = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const prevDays    = new Date(y, m, 0).getDate();
  const startDay    = firstDay === 0 ? 6 : firstDay - 1;
  const today       = new Date();

  let html = '';
  for (let i = startDay; i > 0; i--)
    html += `<div class="cal-day other-month">${prevDays - i + 1}</div>`;

  for (let d = 1; d <= daysInMonth; d++) {
    const key = y + '-' + (m + 1) + '-' + d;
    const isToday = (d === today.getDate() && m === today.getMonth() && y === today.getFullYear());
    html += `<div class="cal-day ${isToday ? 'today' : ''} ${calEvents[key] ? 'has-event' : ''}" onclick="selectDay(this)">${d}</div>`;
  }

  const rem = 42 - (startDay + daysInMonth);
  for (let d = 1; d <= rem; d++)
    html += `<div class="cal-day other-month">${d}</div>`;

  const calDays = document.getElementById('calDays');
  if (calDays) calDays.innerHTML = html;
}

function changeMonth(dir) {
  calDate.setMonth(calDate.getMonth() + dir);
  renderCalendar();
}

function selectDay(el) {
  document.querySelectorAll('.cal-day').forEach(d => d.classList.remove('selected'));
  el.classList.add('selected');
}

/* ===================================================
   VALIDATION FORMULAIRE (I2)
=================================================== */
function showFieldError(fieldId, msg) {
  let err = document.getElementById(fieldId + '-error');
  if (!err) {
    err = document.createElement('p');
    err.id = fieldId + '-error';
    err.className = 'field-error';
    err.setAttribute('aria-live', 'polite');
    const field = document.getElementById(fieldId);
    if (field && field.parentNode) field.parentNode.appendChild(err);
  }
  err.textContent = msg;
}

function clearFieldError(fieldId) {
  const err = document.getElementById(fieldId + '-error');
  if (err) err.textContent = '';
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
  return /\d{8,}/.test(phone.replace(/[\s\-\+\(\)]/g, ''));
}

/* ===================================================
   SOUMISSIONS FORMULAIRES
=================================================== */
function submitJoin() {
  let valid = true;
  const fields = ['joinPrenom', 'joinNom', 'joinTel', 'joinEmail', 'joinQuartier', 'joinActivite', 'cgTerms'];
  fields.forEach(id => clearFieldError(id));

  const prenom   = document.getElementById('joinPrenom');
  const nom      = document.getElementById('joinNom');
  const tel      = document.getElementById('joinTel');
  const email    = document.getElementById('joinEmail');
  const quartier = document.getElementById('joinQuartier');
  const activite = document.getElementById('joinActivite');
  const terms    = document.getElementById('cgTerms');

  if (!prenom || !prenom.value.trim())   { showFieldError('joinPrenom', 'Le prénom est requis.'); valid = false; }
  if (!nom    || !nom.value.trim())      { showFieldError('joinNom', 'Le nom est requis.'); valid = false; }
  if (!tel    || !tel.value.trim())      { showFieldError('joinTel', 'Le téléphone est requis.'); valid = false; }
  else if (!validatePhone(tel.value))    { showFieldError('joinTel', 'Numéro invalide (min. 8 chiffres).'); valid = false; }
  if (email && email.value.trim() && !validateEmail(email.value)) {
    showFieldError('joinEmail', 'Adresse email invalide.'); valid = false;
  }
  if (!quartier || !quartier.value) { showFieldError('joinQuartier', 'Sélectionnez votre quartier.'); valid = false; }
  if (!activite || !activite.value) { showFieldError('joinActivite', 'Sélectionnez votre activité.'); valid = false; }
  if (!terms    || !terms.checked)  { showFieldError('cgTerms', 'Vous devez accepter les conditions.'); valid = false; }

  if (!valid) return;

  document.getElementById('modalMsg').textContent =
    "Merci pour votre demande d'adhésion ! Notre équipe CGI vous contactera dans les 24 heures pour finaliser votre dossier. Bienvenue dans la famille CGI !";
  document.getElementById('successModal').classList.add('open');
}

function submitInvestor() {
  let valid = true;
  ['invPrenom', 'invNom', 'invEmail'].forEach(id => clearFieldError(id));

  const prenom = document.getElementById('invPrenom');
  const nom    = document.getElementById('invNom');
  const email  = document.getElementById('invEmail');

  if (!prenom || !prenom.value.trim()) { showFieldError('invPrenom', 'Le prénom est requis.'); valid = false; }
  if (!nom    || !nom.value.trim())    { showFieldError('invNom', 'Le nom est requis.'); valid = false; }
  if (!email  || !email.value.trim())  { showFieldError('invEmail', 'L\'email est requis.'); valid = false; }
  else if (!validateEmail(email.value))  { showFieldError('invEmail', 'Adresse email invalide.'); valid = false; }

  if (!valid) return;

  document.getElementById('modalMsg').textContent =
    "Votre demande d'information investisseur a été transmise. Notre équipe vous enverra le dossier complet (Business Plan, projections financières, rapport terrain, dossier COBAC) sous 24h ouvrables.";
  document.getElementById('successModal').classList.add('open');
}

/* ===================================================
   INIT DOM READY
=================================================== */
document.addEventListener('DOMContentLoaded', () => {
  updateRangeStyle();
  renderCalendar();

  /* B7 - heroInterval lancé dans DOMContentLoaded */
  heroInterval = setInterval(() => goSlide(currentSlide + 1), 5000);

  /* A8 - Clavier pour .cal-nav[role="button"] */
  document.querySelectorAll('.cal-nav[role="button"]').forEach(btn => {
    btn.setAttribute('tabindex', '0');
    btn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); }
    });
  });

  /* I2 - Effacer les erreurs à la saisie */
  ['joinPrenom', 'joinNom', 'joinTel', 'joinEmail', 'joinQuartier', 'joinActivite'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => clearFieldError(id));
  });
  ['invPrenom', 'invNom', 'invEmail'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => clearFieldError(id));
  });
});
