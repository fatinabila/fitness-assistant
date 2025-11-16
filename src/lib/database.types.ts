export interface Database {
  public: {
    Tables: {
      workouts: {
        Row: {
          id: string;
          created_at: string;
          started_at: string;
          ended_at: string;
          duration_seconds: number;
          total_exercises: number;
        };
        Insert: {
          id?: string;
          created_at?: string;
          started_at: string;
          ended_at: string;
          duration_seconds: number;
          total_exercises: number;
        };
        Update: {
          id?: string;
          created_at?: string;
          started_at?: string;
          ended_at?: string;
          duration_seconds?: number;
          total_exercises?: number;
        };
      };
      workout_exercises: {
        Row: {
          id: string;
          workout_id: string;
          exercise_name: string;
          muscle_group: string;
          sets: number;
          reps: number;
          weight: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          workout_id: string;
          exercise_name: string;
          muscle_group: string;
          sets: number;
          reps: number;
          weight: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          workout_id?: string;
          exercise_name?: string;
          muscle_group?: string;
          sets?: number;
          reps?: number;
          weight?: number;
          created_at?: string;
        };
      };
    };
  };
}
