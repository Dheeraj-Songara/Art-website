# Cloudinary Setup

## Environment Variables

Add these to `.env.local` and Vercel:

```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_UPLOAD_FOLDER=void-gallery/artworks
```

## Upload Flow

The admin image picker sends files to `src/app/api/admin/upload/route.ts`.

That route:

- Requires a signed-in Supabase admin.
- Uploads to Cloudinary with `resource_type: image`.
- Requests eager WebP and AVIF thumbnail transformations.
- Returns optimized `f_auto,q_auto` delivery URLs.
- Stores `image_url`, `thumbnail_url`, and `image_public_id` in Supabase through the artwork save action.

## Delivery

`next.config.ts` allows `res.cloudinary.com` and Next Image requests WebP/AVIF where supported. Cloudinary delivery URLs use automatic format and quality transformations.
