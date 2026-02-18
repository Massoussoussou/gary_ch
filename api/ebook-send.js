/**
 * Stub API — Envoi eBook par email
 * Prêt pour intégration Resend / SendGrid
 *
 * POST /api/ebook-send
 * Body: { email?: string, source?: string }
 * Response: { success: true }
 */
export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // TODO: Intégrer Resend/SendGrid pour envoyer l'eBook
  // const { email, source } = req.body || {};
  // await resend.emails.send({
  //   from: 'GARY <noreply@gary.ch>',
  //   to: email,
  //   subject: 'Votre guide de vente GARY',
  //   html: ebookEmailTemplate,
  //   attachments: [{ filename: 'guide-gary.pdf', content: pdfBuffer }],
  // });

  return res.status(200).json({ success: true });
}
