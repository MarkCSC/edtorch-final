const Question = require('../models/Question'); // Import the Question model
const OpenAI = require('openai');
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