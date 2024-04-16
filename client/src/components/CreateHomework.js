import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/AuthContext';
import Markdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeMathjax from 'rehype-mathjax';

import './CreateHomework.css';

function CreateHomework() {
  const [topic, setTopic] = useState('');
  const [hwID, setHwID] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [editableQuestion, setEditableQuestion] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const auth = useAuth(); // using authentication context

  const fetchQuestion = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/homework/create-homework-question", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': auth.getToken()
        },
        body: JSON.stringify({
          topic: topic,
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
        setCurrentQuestion((cur_ques) => cur_ques + chunkText);
        setEditableQuestion((cur_ques) => cur_ques + chunkText);
      }
    } catch (error) {
      console.error('Error fetching new question:', error);
      alert('Failed to fetch a new question. Please try again.');
    }
    setLoading(false);
  };

  const handleAddQuestion = () => {
    if (editableQuestion) {
      setQuestions(questions => [...questions, editableQuestion]);
      setCurrentQuestion('');
      setEditableQuestion(''); // Clear editable text area
      alert('Question added to your homework.');
    }
  };

  const handleRegenerateQuestion = () => {
    setCurrentQuestion('');
    setEditableQuestion('');
    fetchQuestion();
  };

  const handleEdit = (e) => {
    setEditableQuestion(e.target.value)
    setCurrentQuestion(e.target.value)
  }

  const publishHomework = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/homework/publish', {
        questions: questions,
      }, {
        headers: {
          'Authorization': auth.getToken(),
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        alert(`Homework published successfully! Code: ${response.data.code}`);
        setQuestions([]); // Optionally clear questions after publishing
        setHwID(response.data.code)
      } else {
        throw new Error('Failed to publish homework');
      }
    } catch (error) {
      console.error('Error publishing homework:', error);
      alert('Failed to publish homework. Please try again.');
    }
    setLoading(false);

  };

  const handleTopicChange = (e) => {
    setTopic(e.target.value);
  };

  return (
    <div className="create-homework">
      <h1>Create Homework</h1>
      <input
        type="text"
        value={topic}
        onChange={handleTopicChange}
        placeholder="Topics to generate on (e.g., polynomial)"
        className="topic-input"
      />
      {currentQuestion && (
        <div>
          <h2>Generated Question</h2>
          <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeMathjax]}>
            {currentQuestion}
          </Markdown>
          <textarea
            value={editableQuestion}
            onChange={(e) => handleEdit(e)}
            className="editable-question-textarea"
            rows="4"
            placeholder="Edit the question here..."
          />
          <button onClick={handleAddQuestion} disabled={loading}>
            Add This Question
          </button>
          <button onClick={handleRegenerateQuestion} disabled={loading}>
            Regenerate Question
          </button>
        </div>
      )}
      {!currentQuestion && (
        <button onClick={fetchQuestion} disabled={loading}>
          Generate Question
        </button>
      )}
      <form onSubmit={publishHomework}>
        {questions.length > 0 && (
          <>
            <div>
              <h2>Questions Added</h2>
              <ul>
                {questions.map((question, index) => (
                  <li key={index}>
                    <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeMathjax]}>
                      {question}
                    </Markdown>
                  </li>
                ))}
              </ul>
            </div>
            <button type="submit" disabled={loading}>
              Publish Homework
            </button>
          </>
        )}
    </form>
    </div>
  );
}

export default CreateHomework;