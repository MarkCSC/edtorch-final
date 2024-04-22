import React, { useState } from 'react';
import { useAuth } from '../hooks/AuthContext';

// Importing necessary styles and scripts for math rendering
import "//unpkg.com/mathlive";
import 'katex/dist/katex.min.css';

// Importing plugins for Markdown and Math rendering
import rehypeMathjax from 'rehype-mathjax';
import Markdown from 'react-markdown';
import remarkMath from 'remark-math';

import './FinishHomework.css';

function FinishHomework() {
  const [code, setCode] = useState('');
  const [questions, setQuestions] = useState([]); // Array to store questions
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [inputValues, setInputValues] = useState({}); // Object to store answers for each question

  const auth = useAuth();

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const handleInputChange = (index, value) => {
    setInputValues(prev => ({ ...prev, [index]: value }));
  };

  const fetchHomework = async () => {
    if (!code) {
      setError('Please enter a valid homework code.');
      return;
    }
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`http://localhost:8000/api/homework/get-homework/${code}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': auth.getToken()
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      setQuestions(data.question); // Setting the array of questions
      setInputValues({}); // Resetting input values for new set of questions
    } catch (error) {
      console.error('Error fetching homework:', error);
      setError('Failed to fetch homework. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const submitAnswers = async () => {
    try {
      setLoading(true);
      setError('');
  
      const response = await fetch(`http://localhost:8000/api/homework/submit-answers/${code}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': auth.getToken()
        },
        body: JSON.stringify({
          answers: inputValues
        })
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setCode('');
      setQuestions([]);
      setLoading(false);
      setError('');
      setInputValues({});
  
      //const result = await response.json();
      //console.log('Submit Success:', result);
      alert('Homework submitted successfully!');
    } catch (error) {
      console.error('Error submitting homework:', error);
      setError('Failed to submit homework. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="finish-homework">
      <h1 className="homework-title">Finish Your Homework</h1>
      <input
        className="homework-input"
        value={code}
        onChange={handleCodeChange}
        placeholder="Enter your homework code"
      />
      <button className="homework-button" onClick={fetchHomework}>Fetch Homework</button>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div>
          <h2 className="homework-title">Questions:</h2>
          {questions.map((question, index) => (
            <div key={index} className="question-container">
              <Markdown className="question" remarkPlugins={[remarkMath]} rehypePlugins={[rehypeMathjax]}>
                {question}
              </Markdown>
              <math-field
                className="math-field"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #dddddd',
                  padding: '1rem',
                  borderRadius: '4px',
                  marginBottom: '1rem',
                  width: 'calc(100% - 40px)',
                  boxSizing: 'border-box',
                  margin: 'auto',
                  display: 'block'}}
                onInput={(evt) => handleInputChange(index, evt.target.value)}
                value={inputValues[index] || ''}
              />
            </div>
          ))}
          {!loading && questions.length > 0 && (
            <button className="homework-button" onClick={submitAnswers} style={{ marginTop: '20px' }}>
              Submit Homework
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default FinishHomework;