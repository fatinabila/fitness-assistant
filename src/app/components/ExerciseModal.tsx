'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddExercise: (exerciseName: string, muscleGroup: string) => void;
}

const exercisesByMuscleGroup = {
  Chest: [
    'Bench Press',
    'Incline Bench Press', 
    'Decline Bench Press',
    'Dumbbell Fly',
    'Push-ups',
    'Cable Crossover'
  ],
  Back: [
    'Pull-ups',
    'Lat Pulldown',
    'Barbell Row',
    'Dumbbell Row',
    'Deadlift',
    'Cable Row'
  ],
  Legs: [
    'Squats',
    'Leg Press',
    'Lunges',
    'Leg Curls',
    'Calf Raises',
    'Romanian Deadlift'
  ],
  Shoulders: [
    'Shoulder Press',
    'Lateral Raises',
    'Front Raises',
    'Rear Delt Fly',
    'Upright Row',
    'Shrugs'
  ],
  Arms: [
    'Bicep Curls',
    'Tricep Dips',
    'Hammer Curls',
    'Tricep Extension',
    'Preacher Curls',
    'Close-Grip Bench Press'
  ],
  Core: [
    'Plank',
    'Crunches',
    'Russian Twists',
    'Mountain Climbers',
    'Bicycle Crunches',
    'Dead Bug'
  ]
};

export function ExerciseModal({ isOpen, onClose, onAddExercise }: ExerciseModalProps) {
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>('Chest');
  const [customExerciseName, setCustomExerciseName] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      // Focus the modal for accessibility
      modalRef.current.focus();
    }
  }, [isOpen]);

  // Add/remove bootstrap modal-open class on body to prevent background scroll
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  const handleAddCustomExercise = () => {
    if (customExerciseName.trim()) {
      onAddExercise(customExerciseName.trim(), selectedMuscleGroup);
      setCustomExerciseName('');
    }
  };

  const handleAddPresetExercise = (exerciseName: string) => {
    onAddExercise(exerciseName, selectedMuscleGroup);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddCustomExercise();
    }
  };

  if (!isOpen) return null;

  const modalMarkup = (
    <>
      <div className="modal-backdrop fade show"></div>
      <div className="modal fade show d-block" tabIndex={-1} role="dialog" style={{ backgroundColor: 'transparent' }}>
        <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
          <div className="modal-content" ref={modalRef} tabIndex={-1}>
            <div className="modal-header">
              <h5 className="modal-title">Add Exercise</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <p className="text-secondary mb-3">Enter a custom exercise name or select by muscle group.</p>
              <div className="mb-4">
                <label className="form-label">Custom Exercise Name</label>
                <div className="input-group">
                  <input
                    type="text"
                    value={customExerciseName}
                    onChange={(e) => setCustomExerciseName(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="e.g., Bench Press"
                    className="form-control"
                  />
                  <button
                    className="btn btn-primary"
                    onClick={handleAddCustomExercise}
                    disabled={!customExerciseName.trim()}
                  >
                    Add
                  </button>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Browse by Muscle Group</label>
                <div className="btn-group mb-3 flex-wrap" role="group">
                  {Object.keys(exercisesByMuscleGroup).map((muscleGroup) => (
                    <button
                      key={muscleGroup}
                      type="button"
                      className={`btn btn-sm me-2 mb-2 ${selectedMuscleGroup === muscleGroup ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setSelectedMuscleGroup(muscleGroup)}
                    >
                      {muscleGroup}
                    </button>
                  ))}
                </div>
                <div className="row g-2">
                  {exercisesByMuscleGroup[selectedMuscleGroup as keyof typeof exercisesByMuscleGroup].map((exercise) => (
                    <div className="col-12 col-sm-6" key={exercise}>
                      <button
                        type="button"
                        className="btn btn-outline-secondary w-100 text-start"
                        onClick={() => handleAddPresetExercise(exercise)}
                      >
                        {exercise}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  if (typeof document !== 'undefined') {
    return createPortal(modalMarkup, document.body);
  }

  return null;
}