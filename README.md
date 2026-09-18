# WixPearl Website

The public website for [WixPearl](https://wixpearl.com), a Sri Lanka-based software engineering company specializing in custom software, practical AI, business automation, and software consulting.

The site is built with the Next.js App Router and includes service pages, content-driven case studies, an accessible project inquiry form, light and dark themes, SEO metadata, structured data, a sitemap, security headers, and Vercel Analytics and Speed Insights.

## Technology

- Next.js 16 and React 19
- TypeScript
- Tailwind CSS 4
- Base UI and shadcn components
- Zod for inquiry validation
- Resend for transactional email
- Cloudflare Turnstile for production bot protection
- Vitest and Playwright, including axe accessibility checks
- ESLint and Prettier

## Requirements

- Node.js 24.x (the exact development version is in `.node-version`)
- pnpm 12.x (`package.json` pins pnpm 12.4.1)

## Local development

Install dependencies:

```bash
pnpm install
```

Copy the environment template:

```bash
cp .env.example .env.local
```

On PowerShell, use:

```powershell
Copy-Item .env.example .env.local
```

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3002](http://localhost:3002).

The website can be viewed locally without service credentials. Sending the inquiry form requires valid Resend settings. Turnstile verification is bypassed in development when `TURNSTILE_SECRET_KEY` is unset.

## Environment variables

| Variable                         | Purpose                                                                                      |
| -------------------------------- | -------------------------------------------------------------------------------------------- |
| `RESEND_API_KEY`                 | Resend API key used to deliver inquiry notifications and confirmation emails.                |
| `INQUIRY_FROM_EMAIL`             | Verified sender identity for inquiry email, for example `WixPearl <inquiries@wixpearl.com>`. |
| `INQUIRY_TO_EMAIL`               | Inbox that receives new project inquiries.                                                   |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Public Cloudflare Turnstile site key rendered by the inquiry form.                           |
| `TURNSTILE_SECRET_KEY`           | Server-side Cloudflare Turnstile secret used to verify submissions.                          |

Set all five variables in production. Configure the public and secret Turnstile keys as a matching pair; setting only one will prevent the inquiry flow from working correctly.

## Commands

| Command             | Description                                                         |
| ------------------- | ------------------------------------------------------------------- |
| `pnpm dev`          | Run the development server on port 3002.                            |
| `pnpm build`        | Create a production build.                                          |
| `pnpm start`        | Serve the production build.                                         |
| `pnpm lint`         | Run ESLint with zero warnings allowed.                              |
| `pnpm typecheck`    | Check TypeScript without emitting files.                            |
| `pnpm format`       | Format the repository with Prettier.                                |
| `pnpm format:check` | Verify formatting without changing files.                           |
| `pnpm test`         | Run the Vitest unit test suite.                                     |
| `pnpm test:e2e`     | Run Playwright tests in desktop and mobile Chromium.                |
| `pnpm quality`      | Run formatting, types, linting, unit tests, and a production build. |

Before running the end-to-end suite for the first time, install Chromium:

```bash
pnpm exec playwright install chromium
```

The Playwright configuration starts or reuses the development server at `http://127.0.0.1:3002`. Continuous integration runs the quality checks first, followed by the end-to-end suite.

## Project structure

```text
app/                 Routes, layouts, metadata endpoints, and server actions
components/          Layout, shared, contact, and UI components
config/              Site identity, navigation, footer, and page content
lib/                 Metadata, inquiry validation/email, and shared utilities
public/              Brand and social-preview assets
tests/unit/           Vitest unit tests
tests/e2e/            Playwright browser and accessibility tests
```

The main routes are `/`, `/services`, `/services/[slug]`, `/case-studies`, `/case-studies/[slug]`, `/about`, `/contact`, `/privacy`, and `/terms`. Next.js also generates `/robots.txt`, `/sitemap.xml`, and the web app manifest.

## Updating content

- Edit company identity and canonical URL values in `config/site.ts`.
- Edit services, delivery steps, principles, technologies, and case studies in `config/content.ts`.
- Edit the primary navigation and footer in `config/navigation.ts` and `config/footer.ts`.
- Add a case study to `caseStudies` with `published: true` only after its content is approved. Unpublished entries are excluded from pages and the sitemap.
- Replace assets in `public/brand/` and `public/og.png` when branding changes.

## Deployment

The application is designed for a Next.js-compatible Node.js host and is ready for Vercel. Add the production environment variables to the hosting platform, ensure the Resend sender domain is verified, and configure the Turnstile widget for the production hostname before deploying.

Run the full local verification pipeline before release:

```bash
pnpm quality
pnpm test:e2e
```

Security response headers are configured in `next.config.ts`. Production builds additionally enable HSTS and upgrade insecure requests, so production deployments must use HTTPS.
