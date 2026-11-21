// Gabarit e-mail commun « Lagon de verre » : liseré en dégradé, mot-symbole bicolore, carte arrondie. Aucun émoji.
const escape = (value) =>
  String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const emailLayout = ({ kicker, title, intro, body, footer }) => `<!doctype html>
<html lang="fr"><body style="margin:0;background:#eef2f7;font-family:'Plus Jakarta Sans','Segoe UI',Arial,sans-serif;color:#0b1324">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 12px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid #e2e8f0;border-radius:18px;overflow:hidden">
<tr><td style="height:4px;line-height:4px;font-size:0;background:#0a6e67;background-image:linear-gradient(90deg,#14b8a6,#0e8a98,#4f46e5)">&nbsp;</td></tr>
<tr><td style="padding:24px 32px 0">
  <div style="font-size:17px;font-weight:700;letter-spacing:-.02em;color:#0b1324">Tonga<span style="color:#3f49c9">Pass</span></div>
</td></tr>
<tr><td style="padding:24px 32px 8px">
  <div style="font-size:12px;color:#475569;letter-spacing:.02em">${escape(kicker)}</div>
  <div style="font-size:22px;font-weight:600;margin-top:6px;line-height:1.3">${escape(title)}</div>
  <p style="font-size:14px;line-height:1.6;color:#2e3a50;margin:12px 0 0">${escape(intro)}</p>
</td></tr>
<tr><td style="padding:16px 32px 28px">${body}</td></tr>
<tr><td style="padding:16px 32px;border-top:1px solid #e2e8f0;color:#6b7280;font-size:12px;line-height:1.5">${escape(footer || 'Message envoyé automatiquement par TongaPass. Merci de ne pas y répondre.')}</td></tr>
</table></td></tr></table></body></html>`;

const emailRows = (rows) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;border-collapse:collapse">${rows
    .map(
      ([key, value]) =>
        `<tr><td style="padding:9px 0;color:#475569;width:40%;border-bottom:1px solid #eef0f3;vertical-align:top">${escape(key)}</td><td style="padding:9px 0;font-weight:500;border-bottom:1px solid #eef0f3">${escape(value)}</td></tr>`,
    )
    .join('')}</table>`;
