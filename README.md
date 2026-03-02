# Heatherwood Football Camp

Static one-page site for Boulder Summer Youth Football Camp. Built with Next.js, TypeScript, and Tailwind CSS.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build (static export)

```bash
npm run build
```

Output is in the `out/` directory (static HTML/CSS/JS).

## Deploy to Vercel

1. Push this repo to GitHub (or connect your Git provider in Vercel).
2. Go to [vercel.com](https://vercel.com) and sign in.
3. **Add New Project** → Import your repository.
4. Leave build settings as default (Next.js is auto-detected).
5. Deploy. Vercel will run `next build` and serve the static export.

Or use the CLI:

```bash
npm i -g vercel
vercel
```

Follow the prompts and deploy.
