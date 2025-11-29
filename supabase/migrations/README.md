# Supabase Database Migrations

This directory contains SQL migration files for setting up the Bangalore Fun Finder database in Supabase.

## Quick Start Guide

### Option 1: Using Supabase Dashboard (Recommended for beginners)

1. **Create a new Supabase project**
   - Go to [https://supabase.com](https://supabase.com)
   - Click "New Project"
   - Fill in your project details (name, database password, region)

2. **Open SQL Editor**
   - In your Supabase dashboard, navigate to "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the migration**
   - Copy the entire contents of `001_initial_schema.sql`
   - Paste it into the SQL Editor
   - Click "Run" button

4. **Verify installation**
   - Navigate to "Table Editor" in the sidebar
   - You should see tables: `activities`, `categories`, `tags`, `users`, `contact_submissions`

### Option 2: Using Supabase CLI

1. **Install Supabase CLI**
   ```bash
   npm install -g supabase
   ```

2. **Initialize Supabase locally (optional for development)**
   ```bash
   supabase init
   ```

3. **Link to your remote project**
   ```bash
   supabase link --project-ref your-project-ref
   ```

4. **Push the migration**
   ```bash
   supabase db push
   ```

## Migration Details

### Tables Created

1. **activities**
   - Stores all events and activities
   - Fields: title, description, image, price_range, location, date, time, etc.
   - Includes arrays for category_ids and tags

2. **categories**
   - Stores activity categories (Food, Music, Art, etc.)
   - Pre-populated with 10 default categories

3. **tags**
   - Stores activity tags (trending, ourpick, etc.)
   - Pre-populated with common tags

4. **users**
   - Stores newsletter subscribers
   - Fields: email, phone, created_at

5. **contact_submissions**
   - Stores contact form submissions
   - Fields: name, email_or_phone, message

### Security Features

- **Row Level Security (RLS)** enabled on all tables
- Public read access for activities, categories, and tags
- Authenticated-only write access for activities
- Anonymous insert access for users (subscriptions) and contact_submissions

### Indexes

Optimized indexes for:
- Section type filtering
- Date sorting
- Category and tag array searches
- Email lookups

## Environment Setup

After running the migration, update your `.env` file:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Find these values in your Supabase dashboard under "Settings" → "API"

## Sample Data

The migration includes 3 sample activities to help you get started:
- Weekend Market (Free, Indiranagar)
- Live Music Night (₹500-₹1000, Koramangala)
- Yoga in the Park (Free, Cubbon Park)

## Next Steps

1. **Verify the migration**
   ```sql
   SELECT * FROM activities;
   SELECT * FROM categories;
   ```

2. **Add your own activities**
   - Use the admin interface (if built)
   - Or insert directly via SQL:
   ```sql
   INSERT INTO activities (title, description, price_range, location, category_ids, tags)
   VALUES (
     'Your Event',
     'Description',
     'Free',
     'Location',
     ARRAY['food', 'music']::TEXT[],
     ARRAY['trending']::TEXT[]
   );
   ```

3. **Customize categories**
   ```sql
   INSERT INTO categories (name) VALUES ('your-category');
   ```

## Troubleshooting

### Permission Errors
If you encounter permission errors, ensure:
- You're logged in to Supabase
- You have owner/admin access to the project
- RLS policies are properly configured

### Migration Already Run
If tables already exist:
- The migration uses `IF NOT EXISTS` clauses, so it's safe to re-run
- Use `ON CONFLICT` clauses to avoid duplicate seed data

### Need to Reset Database
⚠️ **Warning: This will delete all data**
```sql
DROP TABLE IF EXISTS activities CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS contact_submissions CASCADE;
```

Then re-run the migration file.

## Support

For issues specific to:
- **Supabase**: Check [Supabase Documentation](https://supabase.com/docs)
- **This Project**: Open an issue in the repository

## Migration History

- **001_initial_schema.sql** - Initial database setup with all tables, indexes, and RLS policies
