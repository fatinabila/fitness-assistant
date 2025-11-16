'use client';

import { useState, useEffect } from 'react';
import { Dumbbell, Plus, X, Trash } from 'lucide-react';
import { ExerciseDialog } from './ExerciseDialog';

interface SetRow {
  id: string;
  reps: number;
  weight: number;
}

interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  sets: SetRow[];
  gifUrl?: string;
}

interface WorkoutSession {
  id: string;
  startTime: Date;
  exercises: Exercise[];
  isActive: boolean;
}

export function WorkoutSession() {
  const [workoutSession, setWorkoutSession] = useState<WorkoutSession | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  // tick state to force re-render every second while workout is active
  const [nowTick, setNowTick] = useState<number>(Date.now());

  useEffect(() => {
    if (!workoutSession) return;
    const id = setInterval(() => setNowTick(Date.now()), 1000);
    return () => clearInterval(id);
  }, [workoutSession]);

  // Dialog state + flat exercises list with muscle_group property
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const startWorkout = () => {
    const newSession: WorkoutSession = {
      id: Date.now().toString(),
      startTime: new Date(),
      exercises: [],
      isActive: true,
    };
    setWorkoutSession(newSession);
  };

  const endWorkout = async () => {
    if (!workoutSession) return;

    setIsSaving(true);
    
    try {
      const endTime = new Date();
      const durationSeconds = Math.floor((endTime.getTime() - workoutSession.startTime.getTime()) / 1000);

      const workoutData = {
        started_at: workoutSession.startTime.toISOString(),
        ended_at: endTime.toISOString(),
        duration_seconds: durationSeconds,
        total_exercises: workoutSession.exercises.length,
        exercises: workoutSession.exercises.map(exercise => ({
          exercise_name: exercise.name,
          muscle_group: exercise.muscleGroup,
          sets: exercise.sets.length,
          sets_detail: exercise.sets.map(s => ({ reps: s.reps, weight: s.weight })),
        })),
      };

      const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workoutData),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Error saving workout:', result);
        alert(`Failed to save workout: ${result.error || 'Unknown error'}`);
        setIsSaving(false);
        return;
      }

      if (result.warning) {
        alert(`${result.warning}\nDuration: ${Math.floor(durationSeconds / 60)}m ${durationSeconds % 60}s`);
      } else {
        alert(`Workout saved successfully! Duration: ${Math.floor(durationSeconds / 60)}m ${durationSeconds % 60}s`);
      }
      
      setWorkoutSession(null);
    } catch (error) {
      console.error('Unexpected error saving workout:', error);
      alert('An unexpected error occurred while saving the workout.');
    } finally {
      setIsSaving(false);
    }
  };

  const removeExercise = (exerciseId: string) => {
    if (!workoutSession) return;
 
    setWorkoutSession({
      ...workoutSession,
      exercises: workoutSession.exercises.filter(exercise => exercise.id !== exerciseId),
    });
  };

  // New helpers for set rows
  const addSet = (exerciseId: string) => {
    setWorkoutSession(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        exercises: prev.exercises.map(ex => ex.id === exerciseId ? {
          ...ex,
          sets: [...ex.sets, { id: Date.now().toString() + Math.random().toString(36).slice(2,8), reps: 0, weight: 0 }]
        } : ex)
      };
    });
  };

  const updateSet = (exerciseId: string, setId: string, field: 'reps' | 'weight', value: number) => {
    setWorkoutSession(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        exercises: prev.exercises.map(ex => {
          if (ex.id !== exerciseId) return ex;
          return {
            ...ex,
            sets: ex.sets.map(s => s.id === setId ? { ...s, [field]: value } : s)
          };
        })
      };
    });
  };

  const removeSet = (exerciseId: string, setId: string) => {
    setWorkoutSession(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        exercises: prev.exercises.map(ex => {
          if (ex.id !== exerciseId) return ex;
          const newSets = ex.sets.filter(s => s.id !== setId);
          return { ...ex, sets: newSets };
        })
      };
    });
  };

  const formatElapsedTime = (startTime: Date) => {
    const now = new Date();
    const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleAddExercises = (exercises: { name: string; muscle_group: string; gifUrl?: string }[]) => {
     setWorkoutSession(prev => {
       if (!prev) return prev;
       const newExercises: Exercise[] = exercises.map(item => ({
         id: Date.now().toString() + Math.random().toString(36).slice(2, 8),
         name: item.name,
         muscleGroup: item.muscle_group,
         gifUrl: item.gifUrl,
         sets: [{ id: Date.now().toString() + Math.random().toString(36).slice(2,8), reps: 0, weight: 0 }],
       }));
  
        return {
          ...prev,
          exercises: [...prev.exercises, ...newExercises],
        };
      });
   };

  if (!workoutSession) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Dumbbell className="w-16 h-16 text-slate-300 mb-4" />
        <h2 className="text-slate-400 mb-6">Ready to start your workout?</h2>
        <button
          onClick={startWorkout}
          className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Start Workout
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Workout Header */}
      <div className="bg-white rounded-lg p-4 mb-6 shadow-sm border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div>
              <div className="font-medium text-gray-900">
                {formatElapsedTime(workoutSession.startTime)}
              </div>
              <div className="text-sm text-gray-500">
                {workoutSession.exercises.length} exercises
              </div>
            </div>
          </div>
          <button
            onClick={endWorkout}
            disabled={isSaving}
            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : (
              <>
                <X className="w-4 h-4" />
                End Workout
              </>
            )}
          </button>
        </div>
      </div>

      {/* Exercises List */}
      <div className="space-y-4">
        {workoutSession.exercises.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border">
            <p className="text-gray-500 mb-6">Add your first exercise to get started!</p>
            <button
              onClick={() => setIsDialogOpen(true)}
              className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              Add Exercise
            </button>
          </div>
        ) : (
          <>
            {workoutSession.exercises.map((exercise) => (
              <div key={exercise.id} className="bg-white rounded-lg p-4 shadow-sm border">
                <div className="flex items-start justify-between mb-4 gap-4">

                  
                  <div className="flex items-start gap-4 flex-1">

                     {exercise.gifUrl && (
                      <img 
                        src={exercise.gifUrl} 
                        alt={exercise.name}
                        className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                      />
                    )}
                    <div>
                      <h3 className="font-medium text-gray-900">{exercise.name}</h3>
                      <p className="text-sm text-gray-500 capitalize">{exercise.muscleGroup}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeExercise(exercise.id)}
                    className="text-red-500 hover:text-red-700 p-1 text-center flex-shrink-0"
                  >
                    <X className="w-4 h-4 inline-block" />
                  </button>
                </div>

                {/* Sets rendered as a proper table */}
                <div className="overflow-x-auto mt-2">
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr className="text-sm text-left text-gray-700">
                        <th className="py-2 w-12">Set</th>
                        <th className="py-2">Reps</th>
                        <th className="py-2">Weight (kg)</th>
                        <th className="py-2 w-20 text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {exercise.sets.map((s, idx) => (
                        <tr key={s.id} className="bg-white">
                          <td className="py-3 align-middle text-sm text-gray-700">#{idx + 1}</td>
                          <td className="py-2 align-middle">
                            <input
                              type="number"
                              min="0"
                              value={s.reps}
                              onChange={(e) => updateSet(exercise.id, s.id, 'reps', parseInt(e.target.value) || 0)}
                              className="w-20 px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="0"
                            />
                          </td>
                          <td className="py-2 align-middle">
                            <input
                              type="number"
                              min="0"
                              step="0.5"
                              value={s.weight}
                              onChange={(e) => updateSet(exercise.id, s.id, 'weight', parseFloat(e.target.value) || 0)}
                              className="w-24 px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="0"
                            />
                          </td>
                          <td className="py-2 align-middle text-right">
                            <button
                              onClick={() => removeSet(exercise.id, s.id)}
                              className="text-red-500 hover:text-red-700 p-1"
                              title="Remove set"
                            >

                                {exercise.sets.indexOf(s) > 0 && (
                                  <Trash className="w-4 h-4 inline-block" />
                                )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-3">
                  <button
                    onClick={() => addSet(exercise.id)}
                    className="text-sm bg-gray-100 px-3 py-1 rounded-md"
                  >
                    + Add Set
                  </button>
                </div>
              </div>
            ))}
            
            <button
              onClick={() => setIsDialogOpen(true)}
              className="w-full bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-6 text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Exercise
            </button>
          </>
        )}
      </div>

      <ExerciseDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onAddExercises={handleAddExercises}
      />
    </div>
  );
}
