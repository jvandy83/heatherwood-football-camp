# Heatherwood Football Camp

Camp info and registration site for Boulder Summer Youth Football Camp. Built with Next.js, TypeScript, and Tailwind CSS. Registration form and Stripe payment are handled on the site.

## Setup

1. Copy `.env.example` to `.env.local`.
2. Add your Stripe Payment Link URLs (Dashboard → Payment links) as `STRIPE_PAYMENT_LINK_FULL` and `STRIPE_PAYMENT_LINK_SIBLING`.
3. (Optional) Configure Google Sheets – see below.
4. Run `npm install` and `npm run dev`.

### Google Sheets integration

Each registration is appended as a row when the form is submitted (before redirecting to payment). Payment status is written as "Pending"; you can update it manually or later with a Stripe webhook.

1. **Google Cloud:** Create a project at [console.cloud.google.com](https://console.cloud.google.com), enable the **Google Sheets API**, and create a **Service Account** (Keys → Add key → JSON). Download the JSON key.
2. **Share the sheet:** Open your [Google Sheet](https://docs.google.com/spreadsheets/d/1RdxGCBVtxlXtGGhCTxMNZinyMfBMbCBo7W5z2bhwYag) and share it with the service account email (from the JSON, e.g. `xxx@xxx.iam.gserviceaccount.com`) with **Editor** access.
3. **Env vars:** Set `GOOGLE_SHEET_ID` to the spreadsheet ID (from the URL), `GOOGLE_SHEET_TAB_NAME` to the tab name (e.g. `Sheet1` or the name of the tab you use), and `GOOGLE_SERVICE_ACCOUNT_JSON` to the full contents of the JSON key file (as a single line string).

**Row format (columns A–K):** Timestamp, Parent Name, Email, Phone, Child Name, Child Age, Registration Type, Emergency Name, Emergency Phone, Medical Notes, Payment Status. Add a header row in the sheet if needed.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Register at [http://localhost:3000/register](http://localhost:3000/register).

## Build

```bash
npm run build
npm start
```

## Deploy to Vercel

1. Push the repo to GitHub and import it in [Vercel](https://vercel.com).
2. In the project settings, add Environment Variables:
   - `STRIPE_PAYMENT_LINK_FULL` (your $300 payment link URL)
   - `STRIPE_PAYMENT_LINK_SIBLING` (your $250 payment link URL)
   - (Optional) `GOOGLE_SHEET_ID`, `GOOGLE_SHEET_TAB_NAME`, `GOOGLE_SERVICE_ACCOUNT_JSON` for Sheets
3. Deploy. The API route runs on the server; no static export.
