import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/AuthContext';
import './Exercise.css';

import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

function Exercise() {
  const [question, setQuestion] = useState(null);
  const [id, setID] = useState(null);
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const auth = useAuth();

  const handleGetQuestionClick = () => {
    const getExerciseURL = "http://localhost:8000/api/exercise/get-exercise";
    const user_credential = { username: auth.user.username };

    axios.post(getExerciseURL, user_credential)
      .then(response => {
        setID(response.data.id);
        setQuestion(response.data.question);
      })
      .catch(error => {
        console.error('Error getting the question:', error);
      });
  };

  const handleAnswerChange = (event) => {
    setAnswer(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSubmitting(true); // Disable the submit button
    const checkAnswerURL = "http://localhost:8000/api/exercise/check-exercise";
    
    axios.post(checkAnswerURL, { id: id, answer: answer })
      .then(response => {
        console.log('Answer submitted:', response.data);
        setIsSubmitting(false); // Enable the submit button
        setAnswer(''); // Optionally clear the answer after submission
      })
      .catch(error => {
        console.error('Error submitting the answer:', error);
        setIsSubmitting(false); // Enable the submit button
      });
  };

  const renderLatexText = (latex) => {
    // Split the text into parts and render LaTeX parts with InlineMath
    return latex.split('$').map((part, index) => 
      index % 2 === 1 ? <InlineMath key={index} math={part} /> : part
    );
  };

  return (
    <div className="exercise">
      <h1 className="exercise-title">Exercise Page</h1>
      <button
        onClick={handleGetQuestionClick}
        className="exercise-button"
        disabled={isSubmitting}
      >
        {question? "Next Question":"Get Question"}
        
      </button>
      {question && (
        <div>
          <p className="exercise-question">
            {renderLatexText(question)}
          </p>
          <form onSubmit={handleSubmit}>
            <label htmlFor="answerBox" className="sr-only">Your Answer:</label>
            <textarea
              id="answerBox"
              className="exercise-textarea"
              value={answer}
              onChange={handleAnswerChange}
              rows="4"
              aria-label="Your Answer"
            ></textarea>
            <button
              type="submit"
              className="exercise-submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Answer'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Exercise;