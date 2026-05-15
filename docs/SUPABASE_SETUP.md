# Supabase Setup

## 1. Create Project

Create a Supabase project and copy these values into `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 2. Apply Schema

Open the Supabase SQL editor and run:

```sql
-- paste supabase/schema.sql
```

Optionally run starter artworks:

```sql
-- paste supabase/seed.sql
```

The schema creates normalized tables for admins, collections, artworks, homepage content, about content, contact info, site settings, social links, inquiries, and optional orders.

## 3. Create Admin User

In Supabase Auth, create a user with email/password. Then add the user to `public.admins`:

```sql
insert into public.admins (user_id, role)
values ('AUTH_USER_UUID_HERE', 'admin');
```

Only rows in `public.admins` can access CMS pages or perform CMS server actions.

## 4. RLS Model

- Public users can read published artworks, collections, page content, site settings, and social links.
- Public users can create inquiries.
- Authenticated admins can manage all CMS tables.
- Orders are admin-only and ready for a future Stripe Checkout flow.

## 5. Auth Notes

The admin login uses Supabase email/password authentication. For production, keep email confirmations enabled unless your team has a controlled provisioning process.
