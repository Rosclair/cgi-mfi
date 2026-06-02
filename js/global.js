/* ============================================================
   GLOBAL.JS - Scripts partagés par toutes les pages CGI
   Community Growth Initiative | cgi-mfi.com
   ============================================================ */

/* ===================================================
   LANGUAGE SWITCH (top-bar uniquement)
   Pour les pages bilingues utiliser switchPageLang()
=================================================== */
function switchLang(lang, btn) {
  document.querySelectorAll('.top-lang button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

/* ===================================================
   C3 - HAMBURGER MENU
=================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.getElementById('nav-menu-id');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }
});

/* ===================================================
   LOADING BAR + SCROLL PROGRESS + NAVBAR ACTIVE
=================================================== */
window.addEventListener('load', () => {
  const bar = document.getElementById('loadingBar');
  if (!bar) return;
  bar.style.width = '100%';
  setTimeout(() => { bar.style.opacity = '0'; }, 400);
});

window.addEventListener('scroll', () => {
  const bar = document.getElementById('loadingBar');
  if (bar) {
    const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    bar.style.width = scrolled + '%';
    bar.style.opacity = '1';
  }

  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) current = s.getAttribute('id');
  });
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.remove('active');
    if (l.getAttribute('href') === '#' + current) l.classList.add('active');
  });
});

/* ===================================================
   REVEAL ON SCROLL (IntersectionObserver)
=================================================== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      if (e.target.closest && e.target.closest('#impact')) animateCounters();
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ===================================================
   COUNTER ANIMATION - B10 : data-animated sur l'élément
=================================================== */
function animateCounters() {
  document.querySelectorAll('.impact-num[data-target]').forEach(el => {
    if (el.dataset.animated === 'true') return;
    el.dataset.animated = 'true';
    const target = parseInt(el.getAttribute('data-target'));
    let current = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { el.textContent = target; clearInterval(timer); }
      else { el.textContent = Math.floor(current); }
    }, 25);
  });
}

/* ===================================================
   SEARCH OVERLAY
=================================================== */
window.searchItems = window.searchItems || [];

function openSearch() {
  document.getElementById('searchOverlay').classList.add('open');
  setTimeout(() => {
    const input = document.getElementById('searchInput');
    if (input) input.focus();
  }, 100);
}

function closeSearch() {
  document.getElementById('searchOverlay').classList.remove('open');
}

/* B12 - Construction sécurisée sans innerHTML + template literals */
function updateSearch(val) {
  const suggs = document.getElementById('searchSuggs');
  if (!suggs) return;
  suggs.innerHTML = '';
  if (!val.trim()) return;
  const items = window.searchItems || [];
  const filtered = items.filter(i => i.toLowerCase().includes(val.toLowerCase())).slice(0, 6);
  filtered.forEach(s => {
    const div = document.createElement('div');
    div.className = 'search-sugg';
    div.setAttribute('role', 'option');
    div.textContent = s;
    div.addEventListener('click', closeSearch);
    suggs.appendChild(div);
  });
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSearch(); });

/* ===================================================
   MODAL - fermeture générique
=================================================== */
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
  }
});

/* ===================================================
   BASCULE DE LANGUE PAR PAGE (pages bilingues)
=================================================== */
function switchPageLang(lang, btn) {
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  document.querySelectorAll('[data-lang]').forEach(el => {
    el.classList.toggle('show', el.getAttribute('data-lang') === lang);
  });

  document.querySelectorAll('.top-lang button').forEach(b => {
    b.classList.toggle('active', b.textContent.trim().toLowerCase() === lang);
  });

  localStorage.setItem('cgi_lang', lang);
}

document.addEventListener('DOMContentLoaded', () => {
  if (!document.querySelector('[data-lang]')) return;
  const saved = localStorage.getItem('cgi_lang') || 'fr';
  document.querySelectorAll('[data-lang]').forEach(el => {
    el.classList.toggle('show', el.getAttribute('data-lang') === saved);
  });
  document.querySelectorAll('.lang-btn').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-lv') === saved);
  });
});

/* ===================================================
   FAQ - bascule accordéon
=================================================== */
function toggleFaq(el) {
  const answer = el.nextElementSibling;
  const isOpen = el.classList.contains('open');
  document.querySelectorAll('.faq-q').forEach(q => {
    q.classList.remove('open');
    q.setAttribute('aria-expanded', 'false');
    if (q.nextElementSibling) q.nextElementSibling.classList.remove('open');
  });
  if (!isOpen) {
    el.classList.add('open');
    el.setAttribute('aria-expanded', 'true');
    answer.classList.add('open');
  }
}

/* ===================================================
   I12 - Navigation clavier dans les dropdowns nav
=================================================== */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-item').forEach(item => {
    const trigger = item.querySelector('.nav-link[aria-haspopup="menu"]');
    const dropdown = item.querySelector('.nav-dropdown');
    if (!trigger || !dropdown) return;

    const menuItems = () => Array.from(dropdown.querySelectorAll('[role="menuitem"]'));

    trigger.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        dropdown.classList.add('open');
        const first = menuItems()[0];
        if (first) first.focus();
      }
    });

    dropdown.addEventListener('keydown', e => {
      const items = menuItems();
      const idx = items.indexOf(document.activeElement);
      if (e.key === 'Escape') {
        e.preventDefault();
        dropdown.classList.remove('open');
        trigger.focus();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = items[idx + 1] || items[0];
        if (next) next.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = items[idx - 1] || items[items.length - 1];
        if (prev) prev.focus();
      } else if (e.key === 'Tab' && idx === items.length - 1) {
        dropdown.classList.remove('open');
      }
    });

    item.addEventListener('mouseleave', () => {
      dropdown.classList.remove('open');
    });
  });
});
