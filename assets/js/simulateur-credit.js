/* ============================================================
   SIMULATEUR-CREDIT.JS - Scripts de la page simulateur de crédit
   Community Growth Initiative | cgi-mfi.com
   ============================================================ */

/* ===================================================
   ITEMS DE RECHERCHE - page simulateur
=================================================== */
window.searchItems = [
  'Simulateur de crédit MICRO-CRÉDIT 2%',
  'Calculer ma mensualité',
  'Tableau d\'amortissement dégressif',
  'Taux dégressif 2% / mois sur capital restant dû',
  'Remboursement anticipé sans pénalité',
  'Total à rembourser',
  'Frais de dossier crédit CGI',
  'Taux nominal annuel',
  'Demander un crédit CGI',
  'Devenir membre CGI',
  'MICRO-CRÉDIT 2% - crédit en 48h garanti',
  'Transparence totale - zéro surprise'
];

/* =============================================
   ÉTAT GLOBAL DU SIMULATEUR
   ============================================= */
const state = {
  montant:      300000,
  duree:        12,
  fraisDossier: 1,
  assurance:    0,
  tauxMensuel:  0.025
};

/* =============================================
   SYNCHRONISATION SLIDER ↔ INPUT MONTANT
   ============================================= */
function syncFromRange() {
  const v = parseInt(document.getElementById('montantRange').value);
  state.montant = v;
  document.getElementById('montantInput').value = v;
  updateMontantDisplay(v);
  recalculate();
}

function syncFromInput() {
  let v = parseInt(document.getElementById('montantInput').value) || 50000;
  v = Math.max(50000, Math.min(2000000, v));
  state.montant = v;
  document.getElementById('montantRange').value = v;
  updateMontantDisplay(v);
  recalculate();
}

function updateMontantDisplay(v) {
  document.getElementById('montantDisplay').textContent = formatFCFA(v);
  const pct = ((v - 50000) / (2000000 - 50000)) * 100;
  document.getElementById('montantRange').style.background =
    `linear-gradient(to right, var(--red) ${pct}%, var(--gray-100) ${pct}%)`;
}

/* =============================================
   SÉLECTION DURÉE - A3 : aria-pressed mis à jour
   ============================================= */
function setDuree(mois) {
  state.duree = mois;
  document.querySelectorAll('.sim-dur-btn').forEach(b => {
    const active = parseInt(b.dataset.dur) === mois;
    b.classList.toggle('active', active);
    b.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
  document.getElementById('dureeDisplay').textContent = mois + ' mois';
  recalculate();
}

/* =============================================
   FORMATAGE NOMBRES
   ============================================= */
function formatFCFA(n) {
  return Math.round(n).toLocaleString('fr-FR') + ' FCFA';
}

function formatNum(n) {
  return Math.round(n).toLocaleString('fr-FR');
}

/* =============================================
   CALCUL PRINCIPAL - AMORTISSEMENT DÉGRESSIF
   Mensualité constante (actuarielle) :
   M = C × r × (1+r)^n / ((1+r)^n - 1)
   ============================================= */
function recalculate() {
  state.fraisDossier = parseFloat(document.getElementById('fraisDossier').value) || 0;
  state.assurance    = parseFloat(document.getElementById('assurance').value)    || 0;

  const C = state.montant;
  const n = state.duree;
  const r = state.tauxMensuel;

  const mensualite = (r === 0)
    ? C / n
    : C * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);

  const rows = [];
  let capitalRestant = C;
  let totalInterets  = 0;

  for (let m = 1; m <= n; m++) {
    const interet          = capitalRestant * r;
    const capitalRembourse = mensualite - interet;
    totalInterets += interet;
    rows.push({ mois: m, capitalAvant: capitalRestant, interet, capitalRembourse, mensualite });
    capitalRestant -= capitalRembourse;
    if (capitalRestant < 0.01) capitalRestant = 0;
  }

  const totalFrais  = C * (state.fraisDossier + state.assurance) / 100;
  const totalAPayer = C + totalInterets + totalFrais;

  /* B8 - Renommé en "Taux nominal annuel" (indicatif) */
  const tauxNominalAnnuel = r * 12 * 100;

  animateUpdate();

  document.getElementById('mensualiteVal').textContent   = formatNum(mensualite);
  document.getElementById('totalRembVal').textContent    = formatFCFA(totalAPayer);
  document.getElementById('totalInteretVal').textContent = formatFCFA(totalInterets);
  document.getElementById('capitalVal').textContent      = formatFCFA(C);
  document.getElementById('dureeVal').textContent        = n + ' mois';
  document.getElementById('fraisDossierVal').textContent = formatFCFA(totalFrais);
  document.getElementById('tauxNominalVal').textContent  = tauxNominalAnnuel.toFixed(1) + '% / an';

  const tot = totalAPayer;
  document.getElementById('barCapital').style.width  = ((C / tot) * 100).toFixed(1) + '%';
  document.getElementById('barInterest').style.width = ((totalInterets / tot) * 100).toFixed(1) + '%';
  document.getElementById('barFees').style.width     = ((totalFrais / tot) * 100).toFixed(1) + '%';

  buildTable(rows, totalInterets, C, totalAPayer);
}

/* =============================================
   TABLEAU D'AMORTISSEMENT
   ============================================= */
function buildTable(rows, totalInterets, capital, totalAPayer) {
  const tbody = document.getElementById('amortBody');
  if (!tbody) return;
  tbody.innerHTML = '';
  rows.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${r.mois}</td>
      <td class="capital-col">${formatNum(r.capitalAvant)} FCFA</td>
      <td class="interest-col">${formatNum(r.interet)} FCFA</td>
      <td class="amort-col">${formatNum(r.capitalRembourse)} FCFA</td>
      <td class="mensualite-col">${formatNum(r.mensualite)} FCFA</td>
    `;
    tbody.appendChild(tr);
  });
  const footInter   = document.getElementById('totalInteretFoot');
  const footCapital = document.getElementById('totalCapitalFoot');
  const footTotal   = document.getElementById('totalMensualiteFoot');
  if (footInter)   footInter.textContent   = formatFCFA(totalInterets);
  if (footCapital) footCapital.textContent = formatFCFA(capital);
  if (footTotal)   footTotal.textContent   = formatFCFA(totalAPayer);
}

/* =============================================
   ANIMATION LÉGÈRE AU RECALCUL
   ============================================= */
function animateUpdate() {
  ['mensualiteVal', 'totalRembVal', 'totalInteretVal'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('recalc-anim');
    void el.offsetWidth;
    el.classList.add('recalc-anim');
  });
}

/* =============================================
   INITIALISATION
   ============================================= */
window.addEventListener('DOMContentLoaded', () => {
  updateMontantDisplay(state.montant);
  /* A3 - initialiser aria-pressed selon l'état actif */
  document.querySelectorAll('.sim-dur-btn').forEach(b => {
    const active = parseInt(b.dataset.dur) === state.duree;
    b.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
  recalculate();
});
