# Deploy checklist – Heatherwood Football Camp

## Environment variables (Vercel)

Set these in **Vercel** → your project → **Settings** → **Environment Variables** (Production, and Preview if you use it).

### Required for registration + payments

| Variable | Description |
|----------|-------------|
| `GOOGLE_SHEET_ID` | Spreadsheet ID from the sheet URL (`/d/<this part>/edit`) |
| `GOOGLE_SHEET_TAB_NAME` | Exact tab name (e.g. `Registration` or `Heatherwood Summer Football Camp Registration Form (Ages 7-11)`) |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Full JSON key for the service account (single line; strip real newlines if you paste multi-line) |
| `STRIPE_SECRET_KEY` | Stripe secret key (live or test) |
| `STRIPE_PAYMENT_LINK_FULL` | Stripe Payment Link URL for full-price registration |
| `STRIPE_PAYMENT_LINK_SIBLING` | Stripe Payment Link URL for sibling registration |
| `STRIPE_WEBHOOK_SECRET` | Signing secret from Stripe → Developers → Webhooks → your endpoint |

### Required for emails (registration + payment + reminder)

| Variable | Description |
|----------|-------------|
| `MAILGUN_API_KEY` | Mailgun API key |
| `MAILGUN_DOMAIN` | Sending domain (e.g. `mg.yourdomain.com`) |
| `MAILGUN_FROM` | From address (e.g. `Heatherwood Football Camp <noreply@yourdomain.com>`) |

### Required for pending-payment reminder cron

| Variable | Description |
|----------|-------------|
| `CRON_SECRET` | Any string you choose (e.g. a long random password). Cron requests must send it as `Authorization: Bearer <CRON_SECRET>` or `x-cron-secret: <CRON_SECRET>`. |

### Optional

| Variable | Description |
|----------|-------------|
| `MAILGUN_HOST` | Default `api.mailgun.net`; use `api.eu.mailgun.net` for EU domain |
| `REGISTRATION_NOTIFY_EMAIL` | Email to receive a copy of each new registration (admin notification) |
| `RESERVED_SPOTS_WEEK1` | Reserved spots for week 1 not in sheet (default 3) |
| `RESERVED_SPOTS_WEEK2` | Reserved spots for week 2 (default 0) |
| `RESERVED_SPOTS_WEEK3` | Reserved spots for week 3 (default 0) |

---

## Before you deploy

1. **Google Sheet**
   - Column **Y** has a header (e.g. "Last reminder sent") for the reminder cron.
   - Tab name in the sheet matches `GOOGLE_SHEET_TAB_NAME` exactly.
   - Sheet is shared with the service account email (from the JSON key) as Editor.

2. **Stripe**
   - Webhook endpoint URL uses your **canonical** domain (the URL that does not redirect).  
     Example: `https://www.heatherwoodfootballcamp.com/api/webhooks/stripe`  
     See `WEBHOOK_SETUP.md` if you had 307 issues.
   - Payment Links are created and URLs set in env.

3. **Vercel**
   - All required env vars above are set for Production (and Preview if needed).
   - **Pending reminders (Hobby plan):** Vercel Cron does not run on Hobby. To send reminder emails, you must set up an **external cron** (e.g. [cron-job.org](https://cron-job.org)) to call your site every 72 hours:  
     **URL:** `https://www.heatherwoodfootballcamp.com/api/cron/remind-pending`  
     **Header:** `Authorization: Bearer <your CRON_SECRET>`  
     Full steps in `CRON_SETUP.md`. Without this, no reminder emails are sent.

4. **Deploy**
   - Push to your connected Git branch or run `vercel --prod`.
   - After deploy, trigger the webhook once from Stripe (or complete a test payment) to confirm the endpoint works.

That’s it. The app uses env variables for all secrets and config; nothing is hardcoded for deploy.
