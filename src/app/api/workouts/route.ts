import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

interface WorkoutData {
  started_at: string;
  ended_at: string;
  duration_seconds: number;
  total_exercises: number;
  exercises?: ExerciseData[];
}

interface ExerciseData {
  exercise_name: string;
  muscle_group: string;
  sets: number;
  reps: number;
  weight: number;
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { started_at, ended_at, duration_seconds, total_exercises, exercises } = body;

    // Validate required fields
    if (!started_at || !ended_at || duration_seconds === undefined || total_exercises === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert workout record
    const { data: workout, error: workoutError } = await supabase
      .from('workouts')
      .insert({
        started_at,
        ended_at,
        duration_seconds,
        total_exercises,
      })
      .select()
      .single() as { data: any; error: any };

    if (workoutError) {
      console.error('Error saving workout:', workoutError);
      return NextResponse.json(
        { error: 'Failed to save workout', details: workoutError.message },
        { status: 500 }
      );
    }

    // Insert workout exercises if provided
    if (exercises && exercises.length > 0 && workout) {
      const exercisesData = exercises.map((exercise: ExerciseData) => ({
        workout_id: workout.id,
        exercise_name: exercise.exercise_name,
        muscle_group: exercise.muscle_group,
        sets: exercise.sets,
        reps: exercise.reps,
        weight: exercise.weight,
      }));

      const { error: exercisesError } = await supabase
        .from('workout_exercises')
        .insert(exercisesData);

      if (exercisesError) {
        console.error('Error saving exercises:', exercisesError);
        return NextResponse.json(
          { 
            success: true,
            workout,
            warning: 'Workout saved but some exercises failed to save',
            details: exercisesError.message
          },
          { status: 201 }
        );
      }
    }

    return NextResponse.json(
      { 
        success: true,
        workout,
        message: 'Workout saved successfully'
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Fetch workouts with pagination
    const { data: workouts, error: workoutsError } = await supabase
      .from('workouts')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1) as { data: any[]; error: any };

    if (workoutsError) {
      console.error('Error fetching workouts:', workoutsError);
      return NextResponse.json(
        { error: 'Failed to fetch workouts', details: workoutsError.message },
        { status: 500 }
      );
    }

    // Fetch exercises for each workout
    const workoutsWithExercises = await Promise.all(
      workouts.map(async (workout: any) => {
        const { data: exercises, error: exercisesError } = await supabase
          .from('workout_exercises')
          .select('*')
          .eq('workout_id', workout.id) as { data: any[]; error: any };

        if (exercisesError) {
          console.error('Error fetching exercises:', exercisesError);
          return { ...workout, exercises: [] };
        }

        return { ...workout, exercises };
      })
    );

    return NextResponse.json(
      { 
        success: true,
        workouts: workoutsWithExercises,
        count: workouts.length
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
