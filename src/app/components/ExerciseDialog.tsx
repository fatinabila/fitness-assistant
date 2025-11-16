'use client';

import { useState, useEffect } from 'react';
import { Check, ArrowLeft } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogClose } from './ui/dialog';

interface ExerciseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddExercises: (exercises: { name: string; muscle_group: string; gifUrl?: string }[]) => void;
}

export function ExerciseDialog({ isOpen, onClose, onAddExercises }: ExerciseDialogProps) {
  const [dialogView, setDialogView] = useState<'muscleGroups' | 'exercises'>('muscleGroups');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [filterMuscle, setFilterMuscle] = useState<string>('All');
  const [exercisesList, setExercisesList] = useState<{ name: string; muscle_group: string; gifUrl: string }[]>([]);
  const [isLoadingExercises, setIsLoadingExercises] = useState(false);
  const [exercisesError, setExercisesError] = useState<string | null>(null);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);

  const muscleGroups = [
    'chest',
    'back',
    'shoulders',
    'biceps',
    'triceps',
    'abs',
    'quads',
    'hamstrings',
    'glutes',
    'calves'
  ];

  // Fetch exercises from API based on selected muscle group
  useEffect(() => {
    if (dialogView !== 'exercises' || filterMuscle === 'All') return;
    
    const fetchExercises = async () => {
      setIsLoadingExercises(true);
      setExercisesError(null);
      try {
        const response = await fetch(`https://www.exercisedb.dev/api/v1/muscles/${filterMuscle}/exercises?offset=0&limit=10`);
        const result = await response.json();
        
        if (!response.ok || !result.success) {
          throw new Error(result.error || 'Failed to fetch exercises');
        }
        
        const mapped = result.data.map((ex: any) => ({
          name: ex.name,
          muscle_group: ex.targetMuscles?.[0] || filterMuscle,
          gifUrl: ex.gifUrl || ''
        }));
        
        setExercisesList(mapped);
        setNextPageUrl(result.metadata?.nextPage || null);
      } catch (error) {
        console.error('Error fetching exercises:', error);
        setExercisesError('Failed to load exercises. Please try again later.');
      } finally {
        setIsLoadingExercises(false);
      }
    };
    
    fetchExercises();
  }, [filterMuscle, dialogView]);

  const loadMoreExercises = async () => {
    if (!nextPageUrl || isLoadingExercises) return;
    
    setIsLoadingExercises(true);
    setExercisesError(null);
    try {
      const response = await fetch(nextPageUrl);
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to fetch exercises');
      }
      
      const mapped = result.data.map((ex: any) => ({
        name: ex.name,
        muscle_group: ex.targetMuscles?.[0] || filterMuscle,
        gifUrl: ex.gifUrl || ''
      }));
      
      setExercisesList(prev => [...prev, ...mapped]);
      setNextPageUrl(result.metadata?.nextPage || null);
    } catch (error) {
      console.error('Error fetching exercises:', error);
      setExercisesError('Failed to load more exercises. Please try again later.');
    } finally {
      setIsLoadingExercises(false);
    }
  };

  const selectMuscleGroup = (muscle: string) => {
    setFilterMuscle(muscle);
    setDialogView('exercises');
  };
  
  const backToMuscleGroups = () => {
    setDialogView('muscleGroups');
    setFilterMuscle('All');
    setNextPageUrl(null);
  };

  const toggleSelect = (name: string) => {
    setSelectedItems(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);
  };

  const handleAddSelected = () => {
    const selected = selectedItems.map(name => {
      const item = exercisesList.find(i => i.name === name);
      return item ? { name: item.name, muscle_group: item.muscle_group, gifUrl: item.gifUrl } : null;
    }).filter(Boolean) as { name: string; muscle_group: string; gifUrl?: string }[];
    
    onAddExercises(selected);
    setSelectedItems([]);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedItems([]);
      setDialogView('muscleGroups');
      setFilterMuscle('All');
      setNextPageUrl(null);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        {dialogView === 'muscleGroups' ? (
          <>
            <DialogTitle>Select Muscle Group</DialogTitle>
            <DialogDescription className="mb-4">Choose a muscle group to view exercises.</DialogDescription>

            <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2">
              {muscleGroups.map((muscle) => (
                <button
                  key={muscle}
                  onClick={() => selectMuscleGroup(muscle)}
                  className="p-4 border-2 border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-center"
                >
                  <div className="font-medium text-gray-900 capitalize">{muscle}</div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={backToMuscleGroups}
                className="p-1 hover:bg-gray-100 rounded-md"
                title="Back to muscle groups"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <DialogTitle>Choose exercises</DialogTitle>
                <DialogDescription className="capitalize">{filterMuscle} exercises</DialogDescription>
              </div>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
              {isLoadingExercises && exercisesList.length === 0 ? (
                <div className="text-sm text-gray-500 p-2 text-center">Loading exercises...</div>
              ) : exercisesError ? (
                <div className="text-sm text-red-500 p-2 text-center">{exercisesError}</div>
              ) : exercisesList.length === 0 ? (
                <div className="text-sm text-gray-500 p-2 text-center">No exercises found.</div>
              ) : (
                <>
                  {exercisesList.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => toggleSelect(item.name)}
                      className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 border flex items-center gap-3 ${selectedItems.includes(item.name) ? 'bg-blue-50 border-blue-300' : ''}`}
                    >
                      {item.gifUrl && (
                        <img 
                          src={item.gifUrl} 
                          alt={item.name}
                          className="w-16 h-16 rounded-md object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-gray-500 mt-1 capitalize">{item.muscle_group}</div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {selectedItems.includes(item.name) && <Check className="w-4 h-4 text-blue-500" />}
                      </div>
                    </button>
                  ))}
                  {nextPageUrl && (
                    <button
                      onClick={loadMoreExercises}
                      disabled={isLoadingExercises}
                      className="w-full py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoadingExercises ? 'Loading...' : 'Load More Exercises'}
                    </button>
                  )}
                </>
              )}
            </div>
          </>
        )}

        <DialogFooter>
          {dialogView === 'exercises' ? (
            <div className="flex gap-2 w-full">
              <button
                onClick={handleAddSelected}
                disabled={selectedItems.length === 0 || isLoadingExercises}
                className="flex-1 bg-black text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Selected ({selectedItems.length})
              </button>
              <DialogClose asChild>
                <button className="bg-gray-200 px-4 py-2 rounded-md">Close</button>
              </DialogClose>
            </div>
          ) : (
            <DialogClose asChild>
              <button className="w-full bg-gray-200 px-4 py-2 rounded-md">Close</button>
            </DialogClose>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
