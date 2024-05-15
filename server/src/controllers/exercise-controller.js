const Question = require('../models/Question'); // Import the Question model
const User = require('../models/User'); // Import the User model
const OpenAI = require('openai');
const axios = require('axios');
require('dotenv').config();

const getExercise = async (req, res) => {
  try {
    // Fetch a random question or implement your logic for selecting a question
    // Here's an example of fetching a random question
    // console.log(req.body.username);

    const random = await Question.aggregate([{ $sample: { size: 1 } }]);
    const question = random[0];

    // console.log(question._id);

    if (question) {
      res.json({ id: question._id, question: question.question });
    } else {
      res.status(404).json({ message: "No question found" });
    }
  } catch (error) {
    console.error('Error getting the question:', error);
    res.status(500).json({ message: "Error fetching question from the database" });
  }
};

const checkExercise = async (req, res) => {

  // console.log(req.body.id);
  // console.log(req.body.answer);

  const openai = new OpenAI({
    apiKey:process.env.OPENAI_API_KEY
  });

  const question = await Question.findById(req.body.id).exec();
  // console.log(question)

  const prompt = [
    {
      role: "system", 
      content: 
      "You are a secondary school math teacher who is good at assessing answers \
      You will be given a math question and an attempt \
      the format of the input is a latex formula.\
      Determine whether the attempt is correct. If yes, no explanation needed. \
      Otherwise, give steps and answer on how you would solve the problem.\
      Format all equation in your response using inline LATEX format with dollar sign"
    },
    { 
      role: "user", 
      content: `Here is a math question: ${question}\n
      Please evaluate my answer: ${req.body.answer}.`
    }
  ]

  const stream = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: prompt,
      stream: true,
  });

  for await (const chunk of stream) {
    res.write(chunk.choices[0]?.delta?.content || "");
  }

  //check correctness
  const prompt1 = [
    {
      role: "system", 
      content: 
      "You are a mathematic exercise answer checking tool. Please return 'correct' if the answer is correct and return 'incorrect' if the answer is wrong. NO extra information, NO explanation is needed. \
      Please treat partially correct answers to correct, be nice don't be too harsh even if the format is not correct, treat it as correct. Validate your answer please no blind guessing"
    },
    { 
      role: "user", 
      content: `Question: ${question}\n
      Answer: ${req.body.answer}.`
    }
  ]

  const streamCorrectness = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: prompt1,
    //stream: true,
  });
  
  console.log(streamCorrectness.choices[0].message);
  console.log(streamCorrectness.choices[0].message.content);
  console.log(question.elo);
  console.log(req.auth.id);

  let user = null;

  if (streamCorrectness.choices[0].message.content === 'incorrect'){
    // console.log('answer equals incorrect')

    try {
      user = await User.findById(req.auth.id).select('elo'); // Using 'select' to only fetch the 'elo' field
      if (!user) {
        console.log('No user found with this ID');
        res.end();
      }
      // console.log(`Elo for user ${user.id}:`, user.elo);
    } catch (error) {
      console.error('Error fetching user elo:', error);
    }

    // console.log(`outside ${user.id}`);
    // console.log(`outside ${question.type}`);
    // console.log(`outside ${question.elo}`);
    // console.log(`outside user elo${user.elo[parseInt(question.type)]}`);

    try {

      const payload = {
        u_elo: user.elo[parseInt(question.type)], // Assuming `question.type` can be converted to an integer index.
        q_elo: question.elo,
        is_correct: 0  // Replace 'someKey' with the actual key name expected by your API.
      };

      const response = await axios.post('http://127.0.0.1:5000/update_elo', payload);

      console.log(`This is result u_elo: ${response.data.u_elo}, q_elo: ${response.data.q_elo}`);

      question.elo = response.data.q_elo;
      user.elo[parseInt(question.type)] = response.data.u_elo;
      const updatedUser = await user.save();
      const updatedQuestion = await question.save();
      console.log('Updated user:', updatedUser);
      console.log('Updated question:', updatedQuestion);

    } catch (error) {
        console.error(`Error updating ELO:, ${error.message}`);
    }

  } else if (streamCorrectness.choices[0].message.content === 'correct') {
    // console.log('answer equals correct');


    try {
      user = await User.findById(req.auth.id).select('elo'); // Using 'select' to only fetch the 'elo' field
      if (!user) {
        console.log('No user found with this ID');
        res.end();
      }
      // console.log(`Elo for user ${user.id}:`, user.elo);
    } catch (error) {
      console.error('Error fetching user elo:', error);
    }

    // console.log(`outside ${user.id}`);
    // console.log(`outside ${question.type}`);
    // console.log(`outside ${question.elo}`);
    // console.log(`outside user elo${user.elo[parseInt(question.type)]}`);

    try {

      const payload = {
        u_elo: user.elo[parseInt(question.type)], // Assuming `question.type` can be converted to an integer index.
        q_elo: question.elo,
        is_correct: 1  // Replace 'someKey' with the actual key name expected by your API.
      };

      const response = await axios.post('http://127.0.0.1:5000/update_elo', payload);

      console.log(`This is result u_elo: ${response.data.u_elo}, q_elo: ${response.data.q_elo}`);

      question.elo = response.data.q_elo;
      user.elo[parseInt(question.type)] = response.data.u_elo;
      const updatedUser = await user.save();
      const updatedQuestion = await question.save();
      console.log('Updated user:', updatedUser);
      console.log('Updated question:', updatedQuestion);

    } catch (error) {
        console.error(`Error updating ELO:, ${error.message}`);
    }
  }
  res.end()
};


const requireHint = async (req, res) => {

  // console.log(req.body.id);
  // console.log(req.body.answer);

  const openai = new OpenAI({
    apiKey:process.env.OPENAI_API_KEY
  });

  const question = await Question.findById(req.body.id).exec();
  // console.log(question)

  const prompt = [
    {
      role: "system", 
      content: 
      "You are a secondary school math tutor who is good at explaining concepts with simple words. \
      You will be given a question, however, You DO NOT discuss a particular question. \
      Instead, teach the concepts behind that needed to solve the question. \
      For example you want to discuss how to factorization, logarithm works rather than giving solid examples\
      Try to explain it with a simple manner with the help of bullet points. \
      Format all equation in your response only using inline LATEX format with default '$', do not use block format."
    },
    {
      role: "user", 
      content: `Here is a math question: ${question} \n Please teach me.`
    }
  ]

  const stream = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: prompt,
      stream: true,
  });

  for await (const chunk of stream) {
    res.write(chunk.choices[0]?.delta?.content || "");
  }

  res.end()
};
module.exports = {
  getExercise,
  checkExercise,
  requireHint
};