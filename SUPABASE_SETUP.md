# Supabase Setup Guide for Fitness Assistant

## Quick Setup Steps

### 1. Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in your project details and wait for it to initialize

### 2. Create Database Tables
1. In your Supabase project, go to **SQL Editor**
2. Copy and paste the contents of `supabase-schema.sql` from this project
3. Click "Run" to create the tables

### 3. Get Your API Keys
1. Go to **Project Settings** > **API**
2. Copy your:
   - `Project URL`
   - `anon` `public` key

### 4. Configure Environment Variables
1. Create a `.env.local` file in the project root (copy from `.env.local.example`)
2. Add your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 5. Restart the Development Server
```bash
npm run dev
```

## Database Schema

### `workouts` table
- `id` (UUID, primary key)
- `created_at` (timestamp)
- `started_at` (timestamp)
- `ended_at` (timestamp)
- `duration_seconds` (integer)
- `total_exercises` (integer)

### `workout_exercises` table
- `id` (UUID, primary key)
- `workout_id` (UUID, foreign key to workouts)
- `exercise_name` (text)
- `muscle_group` (text)
- `sets` (integer)
- `reps` (integer)
- `weight` (numeric)
- `created_at` (timestamp)

## How It Works

1. User starts a workout and adds exercises
2. When clicking "End Workout", the app:
   - Saves the workout session to the `workouts` table
   - Saves all exercises to the `workout_exercises` table
   - Shows a success message with workout duration
3. All data is stored in your Supabase database for future reference

## Viewing Your Data

You can view saved workouts in Supabase:
1. Go to **Table Editor** in your Supabase dashboard
2. Select `workouts` or `workout_exercises` table
3. Browse all saved workout data

## Optional: Add User Authentication

To associate workouts with specific users:
1. Enable Supabase Auth in your project
2. Update the RLS policies in the SQL schema
3. Add `user_id` column to the `workouts` table
4. Modify the app to include authentication

## Troubleshooting

- **"Failed to save workout"**: Check that your `.env.local` file has correct credentials
- **Connection errors**: Ensure your Supabase project is active and the URL is correct
- **Table not found**: Run the SQL schema in Supabase SQL Editor
- **Permission denied**: Check that RLS policies are properly set up
