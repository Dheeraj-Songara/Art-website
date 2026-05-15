# VOID.GALLERY

Luxury animated digital art gallery with a Supabase-backed admin CMS, Cloudinary image pipeline, and Vercel-ready Next.js 15 app.

The public website works immediately with built-in fallback artwork data. To unlock the editable CMS, image uploads, and stored inquiries, connect Supabase and Cloudinary using the steps below.

## Tech Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Framer Motion and GSAP
- Supabase Auth, Postgres, and Row Level Security
- Cloudinary image upload, WebP/AVIF transforms, and optimized delivery
- Vercel deployment

## Quick Start

1. Install Node.js 20 or newer.

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a local environment file:

   Windows PowerShell:

   ```powershell
   Copy-Item .env.example .env.local
   ```

   macOS/Linux:

   ```bash
   cp .env.example .env.local
   ```

4. Start the local dev server:

   ```bash
   npm run dev
   ```

5. Open the site:

   ```text
   http://127.0.0.1:3000
   ```

Without environment variables, the public site renders from fallback data and `/admin` shows a setup-required message.

## Environment Variables

Copy `.env.example` to `.env.local`, then fill in:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000

NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_UPLOAD_FOLDER=void-gallery/artworks
```

Do not expose `CLOUDINARY_API_SECRET` or any Supabase service-role key in browser code.

## Supabase Setup

1. Create a Supabase project.

2. Copy the project URL and anon key into `.env.local`.

3. Open Supabase SQL Editor and run:

   ```text
   supabase/schema.sql
   ```

4. Optional: add starter artwork rows by running:

   ```text
   supabase/seed.sql
   ```

5. Create an admin user in Supabase Auth.

6. Add that Auth user to the admin table:

   ```sql
   insert into public.admins (user_id, role)
   values ('AUTH_USER_UUID_HERE', 'admin');
   ```

7. Restart the dev server and sign in at:

   ```text
   http://127.0.0.1:3000/admin/login
   ```

## Cloudinary Setup

1. Create a Cloudinary account.

2. Copy your cloud name, API key, and API secret into `.env.local`.

3. Keep `CLOUDINARY_UPLOAD_FOLDER=void-gallery/artworks` or change it to your preferred folder.

4. Sign in as an admin and upload artwork from:

   ```text
   http://127.0.0.1:3000/admin/artworks
   ```

The upload API requires an authenticated admin, stores Cloudinary URLs in Supabase, and uses `f_auto,q_auto` delivery for optimized WebP/AVIF output.

## CMS Features

The protected admin dashboard supports:

- Upload, create, edit, delete, publish, and reorder artworks.
- Toggle featured and homepage-featured artworks.
- Manage title, description, category, tags, price, dimensions, availability, buy link, and SEO metadata.
- Manage collections/categories.
- Edit homepage hero copy and featured section text.
- Edit About page content and metrics.
- Edit Contact info and social links.
- Manage global site settings and SEO defaults.
- Review and update inquiry status.

## Public Website Features

- Cinematic floating artwork hero.
- Smooth motion and pointer parallax.
- Responsive mobile-first layout.
- Collections page with search, category filters, and availability filters.
- Artwork detail pages with SEO metadata.
- Artwork detail modal from the homepage.
- Inquiry-based buy flow, with optional external buy links.
- Lazy-loaded and optimized artwork imagery.

## Useful Commands

```bash
npm run dev
npm run typecheck
npm run lint
npm run build
npm audit --audit-level=moderate
```

## Deploy To Vercel

1. Push this repository to GitHub.

2. Import the repository in Vercel.

3. Add the same environment variables from `.env.local` to Vercel Project Settings.

4. Set `NEXT_PUBLIC_SITE_URL` to the production domain.

5. Deploy.

6. After deployment, test:

   ```text
   /
   /collections
   /contact
   /admin/login
   /admin/artworks
   ```

## Project Structure

```text
src/app/                         Next.js App Router routes
src/app/admin/(dashboard)/        Protected admin CMS pages
src/app/api/admin/upload/         Secure Cloudinary upload route
src/components/site/              Public gallery UI components
src/components/admin/             CMS UI components
src/features/admin/actions.ts     Authenticated server actions for CMS writes
src/features/inquiries/actions.ts Inquiry server action
src/lib/cms/                      Queries, mappers, fallback seed data
src/lib/supabase/                 Supabase browser/server/middleware clients
src/types/cms.ts                  Domain types
supabase/schema.sql               Normalized database schema and RLS policies
supabase/seed.sql                 Optional starter artwork rows
docs/                             Additional setup, deployment, and security notes
```

## Troubleshooting

If the page looks unstyled during local development, stop the dev server, delete `.next`, and restart:

```powershell
Remove-Item .next -Recurse -Force
npm run dev
```

If `/admin` says setup is required, check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set and that your signed-in user exists in `public.admins`.

If uploads fail, check Cloudinary variables and confirm you are signed in as an admin.

## More Detailed Guides

- Supabase: `docs/SUPABASE_SETUP.md`
- Cloudinary: `docs/CLOUDINARY_SETUP.md`
- Deployment: `docs/DEPLOYMENT.md`
- Production checklist: `docs/PRODUCTION_CHECKLIST.md`
