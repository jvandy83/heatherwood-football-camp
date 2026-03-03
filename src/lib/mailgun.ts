/**
 * Send an email via Mailgun.
 * Env: MAILGUN_API_KEY, MAILGUN_DOMAIN, MAILGUN_FROM (e.g. "Heatherwood Football Camp <noreply@heatherwoodfootballcamp.com>").
 * Optional: MAILGUN_HOST for EU (e.g. api.eu.mailgun.net).
 */
export async function sendMailgunEmail(options: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}): Promise<boolean> {
  const apiKey = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;
  const from = process.env.MAILGUN_FROM;

  if (!apiKey || !domain || !from) {
    console.warn("Mailgun not configured: MAILGUN_API_KEY, MAILGUN_DOMAIN, or MAILGUN_FROM missing.");
    return false;
  }

  const host = process.env.MAILGUN_HOST || "api.mailgun.net";
  const url = `https://${host}/v3/${domain}/messages`;

  const body = new URLSearchParams({
    from,
    to: options.to,
    subject: options.subject,
    text: options.text,
    ...(options.html && { html: options.html }),
  });

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: "Basic " + Buffer.from(`api:${apiKey}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error("Mailgun send failed:", res.status, err);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Mailgun send error:", err);
    return false;
  }
}
