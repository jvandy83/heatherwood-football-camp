# Stripe Webhook – Fix 307 Redirect

## 1. Use the URL that does NOT redirect

In **Stripe Dashboard** → **Developers** → **Webhooks** → your endpoint:

- If your site redirects **heatherwoodfootballcamp.com** → **www.heatherwoodfootballcamp.com**, set:
  - **https://www.heatherwoodfootballcamp.com/api/webhooks/stripe**
- If it redirects **www** → **non-www**, set:
  - **https://heatherwoodfootballcamp.com/api/webhooks/stripe**

No trailing slash. To see which redirects, open both in a browser and check the address bar after load.

## 2. Confirm in Vercel

**Vercel** → your project → **Settings** → **Domains**. The “primary” or canonical domain is the one that doesn’t redirect. Use that full base URL + `/api/webhooks/stripe` in Stripe.

## 3. Resend the first payment event (optional)

After the webhook URL is fixed and returns 200:

- **Stripe Dashboard** → **Developers** → **Webhooks** → click the endpoint → **Recent deliveries**.
- Open the failed event and click **Resend**.

That will call your endpoint again so you can mark that registration as Paid in the sheet (if the customer email matches a row).

## 4. Env on Vercel

Ensure these are set in **Vercel** → **Settings** → **Environment Variables**:

- `STRIPE_WEBHOOK_SECRET` (from Stripe: Webhooks → your endpoint → “Signing secret”)
- `STRIPE_SECRET_KEY`
- `GOOGLE_SHEET_ID`, `GOOGLE_SHEET_TAB_NAME`, `GOOGLE_SERVICE_ACCOUNT_JSON`

Then redeploy if you changed env vars.
