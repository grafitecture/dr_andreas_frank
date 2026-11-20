// Vercel Serverless Function: nimmt das Kontaktformular entgegen und versendet es per E-Mail.
// Versand über die HTTP-API von Resend (https://resend.com) – ohne zusätzliche Pakete.
// Benötigte Umgebungsvariablen in Vercel (Project Settings → Environment Variables):
//   RESEND_API_KEY   API-Schlüssel des Mailanbieters
//   CONTACT_TO       Empfänger, z. B. info@drfrank-steuer.de
//   CONTACT_FROM     Absender einer verifizierten Domain, z. B. "Website <website@drfrank-steuer.de>"
// Ohne diese Variablen antwortet die Funktion mit 503 und das Formular bietet den Versand per E-Mail-Programm an.

const MAX = { name: 120, email: 160, telefon: 60, nachricht: 4000, anliegen: 40, kontaktweg: 40 };
const clean = (v, n) => String(v || '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, n);
const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Nur POST erlaubt.' });
  }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  body = body || {};

  // Honeypot: Bots füllen das versteckte Feld aus – wir tun so, als wäre alles gut.
  if (body.website) return res.status(200).json({ ok: true });

  const d = {};
  for (const k of Object.keys(MAX)) d[k] = clean(body[k], MAX[k]);

  if (!d.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email) || body.datenschutz !== 'ja') {
    return res.status(400).json({ ok: false, error: 'Bitte Name, gültige E-Mail-Adresse und Datenschutz-Bestätigung angeben.' });
  }

  const { RESEND_API_KEY, CONTACT_TO, CONTACT_FROM } = process.env;
  if (!RESEND_API_KEY || !CONTACT_TO || !CONTACT_FROM) {
    return res.status(503).json({ ok: false, error: 'Mailversand ist noch nicht eingerichtet.' });
  }

  const text = [
    `Anliegen: ${d.anliegen || '–'}`,
    `Gewünschter Kontaktweg: ${d.kontaktweg || '–'}`,
    `Name: ${d.name}`,
    `E-Mail: ${d.email}`,
    `Telefon: ${d.telefon || '–'}`,
    '',
    d.nachricht || '(keine Nachricht)'
  ].join('\n');

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: CONTACT_FROM,
        to: [CONTACT_TO],
        reply_to: d.email,
        subject: `Website-Anfrage (${d.anliegen || 'Allgemein'}): ${d.name}`,
        text,
        html: `<pre style="font-family:inherit;white-space:pre-wrap">${esc(text)}</pre>`
      })
    });
    if (!r.ok) throw new Error(`Mailversand fehlgeschlagen: ${r.status}`);
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e.message);
    return res.status(502).json({ ok: false, error: 'Versand fehlgeschlagen.' });
  }
};
