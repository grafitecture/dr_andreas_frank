/* Dr. Frank Steuerberatung – kleine Helfer, keine Abhängigkeiten, kein Tracking. */
(function () {
  'use strict';

  /* Kopfzeile: Wortmarke schrumpft beim Scrollen auf ihre Endgröße, Linie erscheint */
  var header = document.querySelector('[data-header]');
  if (header) {
    var RANGE = 140;  /* Scrollweg in px, bis die Endgröße erreicht ist */
    var ticking = false;
    var update = function () {
      ticking = false;
      var y = window.scrollY;
      header.style.setProperty('--p', Math.min(1, Math.max(0, y / RANGE)).toFixed(3));
      header.classList.toggle('is-scrolled', y > 8);
    };
    update();
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
  }

  /* Mobile Navigation */
  var toggle = document.querySelector('[data-nav-toggle]');
  if (toggle && header) {
    var label = toggle.querySelector('.visually-hidden');
    var icon = toggle.querySelector('use');
    var setOpen = function (open) {
      header.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      if (label) label.textContent = open ? 'Menü schließen' : 'Menü öffnen';
      if (icon) icon.setAttribute('href', open ? '#i-close' : '#i-menu');
    };
    toggle.addEventListener('click', function () { setOpen(toggle.getAttribute('aria-expanded') !== 'true'); });
    header.querySelectorAll('.nav a').forEach(function (a) { a.addEventListener('click', function () { setOpen(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
  }

  /* Kontaktformular: Versand über /api/contact, sonst E-Mail-Programm als Ausweg */
  var form = document.querySelector('[data-contact-form]');
  if (!form) return;
  var status = form.querySelector('[data-form-status]');
  var submit = form.querySelector('button[type="submit"]');
  var MAIL = 'info@drfrank-steuer.de';

  var say = function (text, state, html) {
    status.dataset.state = state || '';
    if (html) { status.innerHTML = html; } else { status.textContent = text; }
  };

  var mailtoFrom = function (d) {
    var body = 'Anliegen: ' + d.anliegen + '\nGewünschter Kontaktweg: ' + d.kontaktweg +
      '\nName: ' + d.name + '\nE-Mail: ' + d.email + '\nTelefon: ' + (d.telefon || '–') +
      '\n\n' + (d.nachricht || '');
    return 'mailto:' + MAIL + '?subject=' + encodeURIComponent('Anfrage über die Website: ' + d.anliegen) +
      '&body=' + encodeURIComponent(body);
  };

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var fd = new FormData(form);
    var d = {};
    fd.forEach(function (v, k) { d[k] = String(v).trim(); });

    if (!d.name) { say('Bitte geben Sie Ihren Namen an.', 'error'); form.querySelector('#f-name').focus(); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email || '')) { say('Bitte prüfen Sie Ihre E-Mail-Adresse.', 'error'); form.querySelector('#f-mail').focus(); return; }
    if (!form.querySelector('[name="datenschutz"]').checked) { say('Bitte bestätigen Sie die Datenschutzhinweise.', 'error'); return; }

    submit.disabled = true;
    say('Wird gesendet …', '');

    fetch(form.getAttribute('action'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(d)
    }).then(function (r) {
      if (r.ok) {
        form.reset();
        say('Danke! Ihre Anfrage ist bei uns angekommen. Wir melden uns so schnell wie möglich.', 'ok');
      } else {
        throw new Error('Status ' + r.status);
      }
    }).catch(function () {
      say('', 'error', 'Die Anfrage konnte gerade nicht direkt gesendet werden. <a href="' + mailtoFrom(d) +
        '">Per E-Mail-Programm senden</a> oder rufen Sie uns an: <a href="tel:+496218415299">0621 84 15 299</a>.');
    }).finally(function () { submit.disabled = false; });
  });
})();
