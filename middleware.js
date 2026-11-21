/*
 * Zugangsschutz für den Entwurf (Vercel Routing Middleware).
 * ------------------------------------------------------------------------
 * Jede Seite verlangt zuerst das Passwort. Es steht NICHT im Code, sondern in
 * der Vercel-Umgebungsvariable SITE_PASSWORD (Production und Preview).
 * Nach der Anmeldung merkt sich der Browser den Zugang 30 Tage (Cookie, HttpOnly).
 * Abmelden: /abmelden
 *
 * Beim Livegang diese Datei löschen (und SITE_PASSWORD in Vercel entfernen).
 * Wird aus src/middleware.js gebaut (build.py setzt /assets/css/style.css?v=62d04c94 ein).
 */

export const config = {
  // Frei bleiben nur Dinge, die die Anmeldeseite selbst braucht.
  matcher: ['/((?!assets/css/|assets/fonts/|favicon\\.svg|favicon\\.ico|apple-touch-icon\\.png|robots\\.txt).*)'],
};

const COOKIE = 'drf_zugang';
const MAX_AGE = 60 * 60 * 24 * 30;

const enc = new TextEncoder();

async function token(password) {
  const key = await crypto.subtle.importKey('raw', enc.encode(password), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode('drfrank-zugang-v1'));
  return btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function same(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function readCookie(request, name) {
  const raw = request.headers.get('cookie') || '';
  for (const part of raw.split(';')) {
    const i = part.indexOf('=');
    if (i > -1 && part.slice(0, i).trim() === name) return part.slice(i + 1).trim();
  }
  return '';
}

const SECURITY = {
  'Content-Security-Policy': "default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; font-src 'self'; connect-src 'self'; form-action 'self'; frame-ancestors 'none'; base-uri 'self'; object-src 'none'",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Robots-Tag': 'noindex, nofollow',
  'Cache-Control': 'no-store',
};

function page(error) {
  const msg = error
    ? '<p class="gate__error" role="alert">Das Passwort stimmt nicht. Bitte versuchen Sie es noch einmal.</p>'
    : '';
  return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Anmelden | Dr. Andreas Frank, Steuerberater</title>
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#FCF7F8">
<link rel="stylesheet" href="/assets/css/style.css?v=62d04c94">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon.ico" sizes="32x32">
</head>
<body class="gate-page">
<main class="gate">
  <p class="gate__brand"><span class="brand__name">Dr. Andreas Frank</span><span class="brand__sub">Steuerberatung</span></p>
  <h1 class="gate__title">Willkommen.</h1>
  <p class="gate__text">Diese Website ist ein Entwurf und noch nicht öffentlich. Bitte geben Sie das Passwort ein.</p>
  ${msg}
  <form class="gate__form" method="post" action="">
    <div class="field">
      <label for="passwort">Passwort</label>
      <input id="passwort" name="passwort" type="password" autocomplete="current-password" required autofocus>
    </div>
    <button class="btn btn--primary" type="submit">Anmelden</button>
  </form>
</main>
</body>
</html>`;
}

function html(body, status, extra = {}) {
  return new Response(body, { status, headers: { 'Content-Type': 'text/html; charset=utf-8', ...SECURITY, ...extra } });
}

function pass() {
  // Anfrage unverändert weiterreichen (entspricht next() aus @vercel/functions)
  return new Response(null, { headers: { 'x-middleware-next': '1' } });
}

export default async function middleware(request) {
  const password = process.env.SITE_PASSWORD;
  if (!password) {
    return new Response('Zugang ist noch nicht eingerichtet (SITE_PASSWORD fehlt).', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8', ...SECURITY } });
  }
  const url = new URL(request.url);
  const expected = await token(password);

  if (url.pathname === '/abmelden') {
    return new Response(null, {
      status: 303,
      headers: { Location: '/', 'Set-Cookie': `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`, ...SECURITY },
    });
  }

  if (same(readCookie(request, COOKIE), expected)) return pass();

  if (request.method === 'POST') {
    const type = request.headers.get('content-type') || '';
    if (type.includes('application/x-www-form-urlencoded') || type.includes('multipart/form-data')) {
      const form = await request.formData();
      const given = String(form.get('passwort') || '');
      if (same(await token(given), expected)) {
        // Zurück auf dieselbe Adresse, jetzt mit Zugang
        return new Response(null, {
          status: 303,
          headers: {
            Location: url.pathname + url.search,
            'Set-Cookie': `${COOKIE}=${expected}; Path=/; Max-Age=${MAX_AGE}; HttpOnly; Secure; SameSite=Lax`,
            ...SECURITY,
          },
        });
      }
      await new Promise((r) => setTimeout(r, 700)); // Raten bremsen
      return html(page(true), 401);
    }
    return new Response('Bitte zuerst anmelden.', { status: 401, headers: { 'Content-Type': 'text/plain; charset=utf-8', ...SECURITY } });
  }

  return html(request.method === 'HEAD' ? null : page(false), 200);
}
