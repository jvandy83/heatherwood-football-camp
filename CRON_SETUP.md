# Pending Payment Reminder Cron

The app can send reminder emails to registrants whose payment status is still **Pending**. A cron job calls `/api/cron/remind-pending` on a schedule. After sending a reminder, the app writes the timestamp to column **Y (Last reminder sent)** so the same person is not emailed again for 72 hours.

## Google Sheet: add column Y

Add a header in **column Y** (e.g. "Last reminder sent"). The app will write an ISO date/time there when a reminder is sent. No need to fill it manually; leave it empty for new rows.

## Env

In **Vercel** (and locally if you run the cron manually), set:

- `CRON_SECRET` – A secret string (e.g. a random password). The cron request must send this in the `Authorization: Bearer <CRON_SECRET>` header or `x-cron-secret` header.

## Vercel Cron (Pro)

`vercel.json` is set to run the reminder **every 72 hours** (at 4:00 PM UTC on every 3rd day: 1st, 4th, 7th, etc.). Vercel Cron is only available on the **Pro** plan; it will automatically send the request with `Authorization: Bearer <CRON_SECRET>`.

## External cron (required on Hobby — Vercel Cron is Pro only)

On Vercel Hobby, nothing calls the reminder endpoint unless you set it up. Use an external scheduler (e.g. [cron-job.org](https://cron-job.org), GitHub Actions, or another cron service):

- **URL:** `https://www.heatherwoodfootballcamp.com/api/cron/remind-pending` (use your real domain)
- **Method:** GET or POST
- **Header:** `Authorization: Bearer YOUR_CRON_SECRET` (or `x-cron-secret: YOUR_CRON_SECRET`)

Example with curl:

```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" https://www.heatherwoodfootballcamp.com/api/cron/remind-pending
```

Suggested schedule: every 72 hours (every 3 days) so families aren’t emailed too often.
