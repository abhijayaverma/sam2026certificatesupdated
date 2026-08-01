# SAM-2026 Certificate Issuance Portal

Production-ready Next.js 15 portal for issuing on-demand PNG certificates for **SAM-2026 (National Workshop on Sustainable & Advanced Materials for Energy and Structural Applications)**.

## Features
- Public roll-number certificate lookup with rate limiting and validation.
- On-demand high-resolution PNG generation from the active template; only participant names are drawn.
- Supabase Auth admin login, PostgreSQL participants/download logs, and Storage template upload.
- Excel upload using `xlsx` with validation, duplicate rejection inside the uploaded file, and database upsert by roll number.
- Responsive glassmorphism UI with gradients, Framer Motion animations, toasts, skeleton styling, and admin navigation.

## Installation
```bash
npm install
cp .env.example .env.local
npm run dev
```

## Environment variables
```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```
Keep `SUPABASE_SERVICE_ROLE_KEY` server-side only in local and Vercel environment settings.

## Supabase setup
1. Create a Supabase project.
2. Run `database/schema.sql` in the SQL editor.
3. In Authentication, create admin users with email and password.
4. Create a Storage bucket named `certificate-templates`. It may be private because server routes read it with the service role key.
5. Upload the active certificate PNG from `/admin/template`.


## Adjusting certificate name size and position
The generated certificate writes only the participant name on top of the uploaded PNG template. You can tune the name placement without changing code by adding these optional variables to `.env.local` and restarting `npm run dev`:

```bash
CERT_NAME_X_RATIO=0.5
CERT_NAME_Y_RATIO=0.56
CERT_NAME_MAX_WIDTH_RATIO=0.68
CERT_NAME_FONT_SIZE_RATIO=0.055
# Optional exact pixel size override. Leave blank to use the ratio above.
CERT_NAME_FONT_SIZE_PX=
CERT_NAME_MIN_FONT_SIZE=16
CERT_NAME_COLOR=#1f2937
```

- Decrease `CERT_NAME_FONT_SIZE_RATIO` to make the name smaller. For example, try `0.045`, `0.04`, or `0.025` if the name overlaps text on your template.
- If changing the ratio does not appear to affect the output, set `CERT_NAME_FONT_SIZE_PX` to an exact pixel size such as `28`, `24`, or `20`; this overrides the ratio.
- Decrease `CERT_NAME_Y_RATIO` to move the name upward, or increase it to move the name downward.
- Decrease `CERT_NAME_MAX_WIDTH_RATIO` to force long names to shrink sooner.
- Keep `CERT_NAME_X_RATIO=0.5` to center the name horizontally.

For the shown SAM-2026 appreciation template, a good starting point is:

```bash
CERT_NAME_Y_RATIO=0.565
CERT_NAME_FONT_SIZE_RATIO=0.045
CERT_NAME_FONT_SIZE_PX=32
CERT_NAME_MAX_WIDTH_RATIO=0.62
```

## Excel format
The first worksheet must include these columns:

| Roll Number | Name |
| --- | --- |
| 220101001 | Rahul Sharma |
| 220101002 | Priya Singh |

## Running locally
```bash
npm run dev
npm run typecheck
npm run build
```

## Deploying to Vercel
1. Push the repository to GitHub.
2. Import it in Vercel.
3. Add the three environment variables.
4. Deploy. The app is compatible with Vercel serverless functions; `canvas` is configured as a server external package.

## API routes
- `POST /api/search`
- `GET /api/generate?rollNumber=`
- `GET /api/download?rollNumber=`
- `POST /api/upload`
- `GET /api/logs`
- `GET|POST /api/settings`
- `GET /api/admin`
