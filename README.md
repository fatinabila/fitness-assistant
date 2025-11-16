# Fitness Assistant 💪

> ⚠️ **Work in Progress** - This application is currently under active development. Features may be incomplete or subject to change.

A modern fitness tracking application built with Next.js that helps you log and monitor your workout sessions with real-time exercise guidance.

## Screenshots

### Workout Session
![Workout Session](./public/screenshots/workout-session.png)
*Track your exercises in real-time with animated GIFs and live timer*

### Exercise Library
![Exercise Library](./public/screenshots/exercise-library.png)
*Browse exercises by muscle group with detailed animations*


## Features

- **Live Workout Sessions**: Start and track workouts in real-time with automatic duration tracking
- **Exercise Library**: Browse exercises by muscle group with animated GIF demonstrations from ExerciseDB API
- **Infinite Scrolling**: Load more exercises on-demand as you browse
- **Set & Rep Tracking**: Log multiple sets with reps and weight for each exercise
- **Visual Exercise Guides**: View animated GIFs for proper form during your workout
- **Workout History**: Save and review your past workout sessions
- **Responsive Design**: Optimized for mobile and desktop use

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org) with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **API**: [ExerciseDB API](https://exercisedb.dev) for exercise data
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun package manager
- Supabase account for database

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/fitness-assistant.git
cd fitness-assistant
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

### workouts table
```sql
- id (uuid, primary key)
- user_id (uuid, references auth.users)
- started_at (timestamp)
- ended_at (timestamp)
- duration_seconds (integer)
- total_exercises (integer)
- created_at (timestamp)
```

### workout_exercises table
```sql
- id (uuid, primary key)
- workout_id (uuid, references workouts)
- exercise_name (text)
- muscle_group (text)
- sets (integer)
- sets_detail (jsonb)
- created_at (timestamp)
```

## Project Structure

```
fitness-assistant/
├── src/
│   └── app/
│       ├── api/
│       │   └── workouts/       # API routes for workout CRUD
│       ├── components/
│       │   ├── ExerciseDialog.tsx    # Exercise selection dialog
│       │   ├── WorkoutSession.tsx    # Main workout tracking component
│       │   └── ui/                   # Reusable UI components
│       ├── layout.tsx
│       └── page.tsx
├── public/
└── package.json
```

## Key Features Explained

### Workout Session
- Start a new workout session with real-time timer
- Add exercises from the exercise library
- Track sets, reps, and weight for each exercise
- View exercise GIFs for proper form
- Save completed workouts to database

### Exercise Library
- Browse exercises by muscle group (chest, back, shoulders, biceps, triceps, abs, quads, hamstrings, glutes, calves)
- View animated GIF demonstrations
- Load more exercises with pagination
- Multi-select exercises to add to workout

### Data Persistence
- All workouts saved to Supabase PostgreSQL database
- Automatic user authentication via Supabase Auth
- Detailed exercise and set information stored

## API Endpoints

### POST /api/workouts
Save a completed workout session
```typescript
Body: {
  started_at: string (ISO datetime)
  ended_at: string (ISO datetime)
  duration_seconds: number
  total_exercises: number
  exercises: Array<{
    exercise_name: string
    muscle_group: string
    sets: number
    sets_detail: Array<{ reps: number, weight: number }>
  }>
}
```

## License

This project is licensed under the MIT License.

## Acknowledgments

- Exercise data provided by [ExerciseDB API](https://exercisedb.dev)
- Icons by [Lucide](https://lucide.dev)
- Built with [Next.js](https://nextjs.org)

## Support

For support, please open an issue in the GitHub repository.
