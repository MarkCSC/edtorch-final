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

  const prompt = { 
    role: "user", 
    content: `Here is a math question: ${question}\nPlease evaluate my answer and teach me like a professional math tutor\n ${req.body.answer}\nnote that all math notations must be in latex format`
  }

  const stream = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [prompt],
      stream: true,
  });
  for await (const chunk of stream) {
    res.write(chunk.choices[0]?.delta?.content || "");
  }

  res.end()
};

module.exports = {
  getExercise,
  checkExercise
};