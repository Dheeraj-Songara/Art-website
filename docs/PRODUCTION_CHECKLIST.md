# Production Checklist

## Security

- Keep `CLOUDINARY_API_SECRET` server-only.
- Never expose Supabase service-role keys to the browser.
- Use the `admins` table for CMS authorization.
- Keep Supabase RLS enabled on every table.
- Restrict Cloudinary upload presets if you add unsigned uploads later.
- Review Vercel environment variables before promoting to production.

## Performance

- Use Cloudinary `f_auto,q_auto` transformations.
- Prefer uploaded images at high source quality and let Cloudinary generate delivery formats.
- Keep `next/image` remote patterns restricted to Cloudinary and Supabase.
- Use server rendering for indexable public pages.
- Keep admin pages dynamic and uncached.
- Audit large Cloudinary originals and remove unused assets periodically.

## SEO

- Fill site settings, page metadata, and per-artwork SEO fields in the CMS.
- Set `NEXT_PUBLIC_SITE_URL` to the canonical production domain.
- Use descriptive artwork titles, tags, and collection descriptions.

## Admin Usability

- Use drag-and-drop ordering for homepage and collections rhythm.
- Keep `homepage_featured` distinct from `featured` so public curation can be controlled independently.
- Use `buy_link` only when an artwork has a real external checkout or payment link.
- Leave `buy_link` empty to use the built-in inquiry flow.
