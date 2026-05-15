# Deployment

## Vercel

1. Push the repository to GitHub.
2. Import it into Vercel.
3. Set the framework preset to Next.js.
4. Add environment variables from `.env.example`.
5. Deploy.

Required production variables:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_UPLOAD_FOLDER=void-gallery/artworks
```

## Build Command

```bash
npm run build
```

## Post-Deploy Checks

- Visit `/` and verify artwork cards render.
- Visit `/collections` and test search/filter controls.
- Sign in at `/admin/login`.
- Upload an artwork and confirm the Cloudinary URL is stored in Supabase.
- Drag an artwork row in `/admin/artworks` and confirm the order persists after refresh.
- Submit a detail-page inquiry and confirm it appears in `/admin/inquiries`.
