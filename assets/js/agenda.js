/* ============================================================
   AGENDA.JS - Scripts de la page Agenda CGI
   Community Growth Initiative | cgi-mfi.com

   Dépend de global.js (switchPageLang, openSearch, closeSearch,
   updateSearch, loadingBar, revealObserver).
   ============================================================ */

/* ===================================================
   ITEMS DE RECHERCHE - page Agenda
=================================================== */
window.searchItems = [
  'Agenda CGI 2026',
  'Lancement officiel CGI Novembre 2026',
  'Dépôt dossier agrément COBAC Avril 2026',
  'Assemblée Générale Constitutive Septembre 2026',
  'AG Ordinaire - Bilan & Plan 2027',
  'AG Fin d\'Année - Distribution Intérêts',
  'Formation Éducation Financière - Session 1',
  'Formation Entrepreneuriat - Rédiger son Plan d\'Affaires',
  'Coaching Individuel Emprunteurs',
  'Partenariat MTN Mobile Money & Orange Money',
  'CGI CROISSANCE - Crédit 48h',
  'CGI DJANGUI+ - Tontine Digitale',
  'CGI AVENIR - Épargne 8%/an',
  'Devenir membre CGI',
  'Investir dans CGI'
];

/* ===================================================
   ONGLETS AGENDA (Événements / Actualités / Formations)
=================================================== */
function switchAgendaTab(tab, el) {
  document.querySelectorAll('.ag-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.ag-panel').forEach(p => {
    p.classList.remove('active');
    p.style.display = 'none';
  });

  el.classList.add('active');

  const panel = document.getElementById('agpanel-' + tab);
  if (panel) {
    panel.classList.add('active');
    panel.style.display = 'flex';
  }
}

/* ===================================================
   MINI CALENDRIER INTERACTIF
=================================================== */
const MONTH_NAMES_FR = [
  'Janvier','Février','Mars','Avril','Mai','Juin',
  'Juillet','Août','Septembre','Octobre','Novembre','Décembre'
];

/* Événements par date - format 'YYYY-M-D' → type */
const CGI_EVENTS = {
  '2026-4-15': 'event',
  '2026-6-20': 'formation',
  '2026-7-15': 'formation',
  '2026-9-10': 'ag',
  '2026-10-15': 'ag',
  '2026-11-5': 'event',
  '2026-12-15': 'event',
  '2026-12-18': 'formation'
};

let calDate = new Date(2026, 3, 1); // Démarre en Avril 2026

function renderCalendar() {
  const calDays = document.getElementById('calDays');
  const calLabel = document.getElementById('calMonthLabel');
  if (!calDays || !calLabel) return;

  const y = calDate.getFullYear();
  const m = calDate.getMonth();
  calLabel.textContent = MONTH_NAMES_FR[m] + ' ' + y;

  const firstDayOfWeek = new Date(y, m, 1).getDay(); // 0=dim
  const daysInMonth    = new Date(y, m + 1, 0).getDate();
  const prevMonthDays  = new Date(y, m, 0).getDate();
  const startOffset    = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // Lundi = 0

  const today = new Date();
  let html = '';

  /* Jours du mois précédent */
  for (let i = startOffset; i > 0; i--) {
    html += `<div class="cal-day other-month" aria-hidden="true">${prevMonthDays - i + 1}</div>`;
  }

  /* Jours du mois courant */
  for (let d = 1; d <= daysInMonth; d++) {
    const key    = `${y}-${m + 1}-${d}`;
    const evType = CGI_EVENTS[key];
    const isToday = (d === today.getDate() && m === today.getMonth() && y === today.getFullYear());

    const classes = [
      'cal-day',
      isToday ? 'today' : '',
      evType ? `has-event type-${evType}` : ''
    ].filter(Boolean).join(' ');

    const ariaLabel = evType
      ? `${d} ${MONTH_NAMES_FR[m]} - événement CGI`
      : `${d} ${MONTH_NAMES_FR[m]}`;

    html += `<div class="${classes}" onclick="selectCalDay(this)" aria-label="${ariaLabel}" role="button" tabindex="0">${d}</div>`;
  }

  /* Jours du mois suivant (compléter jusqu'à 42 cellules) */
  const totalCells = startOffset + daysInMonth;
  const remainder  = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  for (let d = 1; d <= remainder; d++) {
    html += `<div class="cal-day other-month" aria-hidden="true">${d}</div>`;
  }

  calDays.innerHTML = html;
}

function changeMonth(dir) {
  calDate.setMonth(calDate.getMonth() + dir);
  renderCalendar();
}

function selectCalDay(el) {
  document.querySelectorAll('.cal-day').forEach(d => d.classList.remove('selected'));
  el.classList.add('selected');
}

/* ===================================================
   INITIALISATION AU CHARGEMENT
=================================================== */
document.addEventListener('DOMContentLoaded', () => {
  renderCalendar();

  /* Accessibilité : activer les jours au clavier */
  document.addEventListener('keydown', e => {
    if (e.target.classList.contains('cal-day') && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      selectCalDay(e.target);
    }
  });
});
