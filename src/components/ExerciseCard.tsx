import { useState } from 'react';
import type { Exercise } from '../data/types';
import { recordExerciseAttempt, useProgress } from '../lib/progress';

function isCorrectFor(exercise: Exercise, selected: number | null, numericValue: string): boolean {
  if (exercise.kind === 'multiple-choice') return selected === exercise.correctIndex;
  const parsed = Number.parseFloat(numericValue);
  if (Number.isNaN(parsed)) return false;
  return Math.abs(parsed - exercise.answer) <= exercise.tolerance;
}

export function ExerciseCard({ exercise, index }: { exercise: Exercise; index: number }) {
  const progress = useProgress();
  const [selected, setSelected] = useState<number | null>(null);
  const [numericValue, setNumericValue] = useState('');
  const [revealed, setRevealed] = useState(false);

  const result = progress.exerciseResults[exercise.id];
  const hasInput = exercise.kind === 'multiple-choice' ? selected !== null : numericValue.trim() !== '';

  function checkAnswer() {
    if (!hasInput) return;
    recordExerciseAttempt(exercise.id, isCorrectFor(exercise, selected, numericValue));
    setRevealed(true);
  }

  function tryAgain() {
    setSelected(null);
    setNumericValue('');
    setRevealed(false);
  }

  const correct = isCorrectFor(exercise, selected, numericValue);

  return (
    <div className="exercise-card">
      <p className="exercise-question">
        <span className="exercise-index">
          {exercise.role === 'challenge' ? 'Challenge' : 'Exercise'} {index + 1}
        </span>
        {exercise.question}
      </p>

      {exercise.kind === 'multiple-choice' ? (
        <div className="exercise-choices">
          {exercise.choices.map((choice, choiceIndex) => {
            const isSelected = selected === choiceIndex;
            const isCorrectChoice = choiceIndex === exercise.correctIndex;
            let choiceClass = 'exercise-choice';
            if (isSelected) choiceClass += ' exercise-choice-selected';
            if (revealed && isCorrectChoice) choiceClass += ' exercise-choice-correct';
            if (revealed && isSelected && !isCorrectChoice) choiceClass += ' exercise-choice-incorrect';

            return (
              <button
                key={choiceIndex}
                type="button"
                className={choiceClass}
                disabled={revealed}
                onClick={() => setSelected(choiceIndex)}
              >
                {choice}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="exercise-numeric">
          <input
            type="number"
            className="exercise-numeric-input"
            value={numericValue}
            disabled={revealed}
            placeholder="Your answer"
            onChange={(e) => setNumericValue(e.target.value)}
          />
          {exercise.unit && <span className="exercise-numeric-unit">{exercise.unit}</span>}
        </div>
      )}

      {!revealed && (
        <div className="exercise-actions">
          <button type="button" className="btn btn-primary" disabled={!hasInput} onClick={checkAnswer}>
            Check Answer
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => setRevealed(true)}>
            Reveal Answer
          </button>
        </div>
      )}

      {revealed && (
        <div className="exercise-feedback">
          <p className={correct ? 'feedback-correct' : 'feedback-incorrect'}>
            {correct ? 'Correct.' : !hasInput ? 'Here is the answer:' : 'Not quite.'} The correct answer is:{' '}
            <strong>
              {exercise.kind === 'multiple-choice'
                ? exercise.choices[exercise.correctIndex]
                : `${exercise.answer}${exercise.unit ? ` ${exercise.unit}` : ''}`}
            </strong>
          </p>
          <p className="exercise-explanation">{exercise.explanation}</p>
          <button type="button" className="btn btn-ghost" onClick={tryAgain}>
            Try Again
          </button>
        </div>
      )}

      {result?.attempted && !revealed && (
        <p className="exercise-history">Last attempt: {result.correct ? 'correct' : 'incorrect'}</p>
      )}
    </div>
  );
}
