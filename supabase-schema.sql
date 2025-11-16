--Create workouts table
CREATE TABLE IF NOT EXISTS workouts(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ended_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_seconds INTEGER NOT NULL,
  total_exercises INTEGER NOT NULL
);

--Create workout_exercises table
CREATE TABLE IF NOT EXISTS workout_exercises(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_name TEXT NOT NULL,
  muscle_group TEXT NOT NULL,
  sets INTEGER NOT NULL DEFAULT 0,
  reps INTEGER NOT NULL DEFAULT 0,
  weight NUMERIC(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

--Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_workouts_created_at ON workouts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_workout_exercises_workout_id ON workout_exercises(workout_id);

--Enable Row Level Security(RLS)
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;

--Create policies to allow anonymous access(you can modify these later for authenticated users)
CREATE POLICY "Allow anonymous insert on workouts" ON workouts
FOR INSERT TO anon
WITH CHECK(true);

CREATE POLICY "Allow anonymous select on workouts" ON workouts
FOR SELECT TO anon
USING(true);

CREATE POLICY "Allow anonymous insert on workout_exercises" ON workout_exercises
FOR INSERT TO anon
WITH CHECK(true);

CREATE POLICY "Allow anonymous select on workout_exercises" ON workout_exercises
FOR SELECT TO anon
USING(true);
