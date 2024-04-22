import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/AuthContext';
import "//unpkg.com/mathlive";
import 'katex/dist/katex.min.css';

import './Exercise.css';

import rehypeMathjax from 'rehype-mathjax';
import Markdown from 'react-markdown'
import remarkMath from 'remark-math'

function Exercise() {
  const [question, setQuestion] = useState(null);
  const [id, setID] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHinting, setIsHinting] = useState(false);
  const [checking, setChecking] = useState('');
  const [hint, setHint] = useState('');

  const [value, setValue] = useState("");


  const auth = useAuth();

  const handleGetQuestionClick = () => {
    const getExerciseURL = "http://localhost:8000/api/exercise/get-exercise";
    const user_credential = { 
      username: auth.user.username,
      
    };

    const header = {headers: {
      Authorization: auth.getToken()
    }};

    axios.post(getExerciseURL, user_credential, header)
      .then(response => {
        setID(response.data.id);
        setQuestion(response.data.question);
        setHint('');
        setChecking('');
        setValue('');
      })
      .catch(error => {
        console.error('Error getting the question:', error);
      });
  };

  const handleHintClick = async (event) => {
    event.preventDefault();
    setIsHinting(true);
    setHint('');

    try {
      const response = await fetch("http://localhost:8000/api/exercise/get-hint", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': auth.getToken()
        },
        body: JSON.stringify({
          id: id,
          answer: value,
        }),
      });
  
      if (!response.body) {
        throw new Error('ReadableStream not yet supported in this browser.');
      }
  
      const reader = response.body.getReader();

      while(true) {
        const {done, value} = await reader.read();
  
        if (done) {
          break;
        }
  
        // Assuming the chunk is text data
        const chunkText = new TextDecoder().decode(value);
        setHint((hint) => hint + chunkText);
      }

      setIsHinting(false);

    } catch (error) {
      console.error('Error:', error);
      setIsHinting(false);
    }
  }
  
  const handleSubmitClick = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setChecking('');
  
    try {
      const response = await fetch("http://localhost:8000/api/exercise/check-exercise", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': auth.getToken()
        },
        body: JSON.stringify({
          id: id,
          answer: value,
        }),
      });
  
      if (!response.body) {
        throw new Error('ReadableStream not yet supported in this browser.');
      }
  
      const reader = response.body.getReader();

      while(true) {
        const {done, value} = await reader.read();
  
        if (done) {
          break;
        }
  
        // Assuming the chunk is text data
        const chunkText = new TextDecoder().decode(value);
        setChecking((checking) => checking + chunkText);
      }

      setIsSubmitting(false);

    } catch (error) {
      console.error('Error:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="exercise">
      <h1 className="exercise-title">Exercise Page</h1>
      <button
        onClick={handleGetQuestionClick}
        className="exercise-button"
        disabled={isSubmitting || isHinting}
      >
        {question? "Next Question":"Get Question"}
        
      </button>
      {question && (
        <div>
          <div className="exercise-question">
            <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeMathjax]}>
              {question}
            </Markdown>
          </div>
          <form onSubmit={handleSubmitClick}>
            <div className=".exercise-keyboard">
              <math-field style={{
                backgroundColor: '#ffffff',
                border: '1px solid #dddddd',
                padding: '1rem',
                borderRadius: '4px',
                marginBottom: '1rem',
                width: 'calc(100% - 40px)',
                boxSizing: 'border-box',
                margin: 'auto',
                display: 'block'
              }}
                onInput={evt => setValue(evt.target.value)}
              >
                {value}
              </math-field>
            </div>
            <button
              type="submit"
              className="exercise-submit-button"
              disabled={isSubmitting || isHinting}
            >
              {isSubmitting ? 'Checking...' : 'Check my answer!'}
            </button>
            <button
              onClick={handleHintClick} // You will need to define this function to handle hint requests
              className="exercise-hint-button"
              disabled={isSubmitting || isHinting} // Assuming you want the hint button enabled only when a question is available
            >
              Hint!
            </button>
          </form>
        </div>
      )}
      {checking && (
        <div className="checking-container">
          <h3 className="checking-title">Feedback!</h3>
          <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeMathjax]}>
            {checking}
          </Markdown>
        </div>
      )}
      {hint && (
        <div className="hint-container">
          <h3 className="hint-title">Hint!</h3>
          <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeMathjax]}>
            {hint}
          </Markdown>
        </div>
      )}
    </div>
  );
}

export default Exercise;