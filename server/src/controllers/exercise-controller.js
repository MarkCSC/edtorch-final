const Question = require('../models/Question'); // Import the Question model

const getExercise = async (req, res) => {
  try {
    // Fetch a random question or implement your logic for selecting a question
    // Here's an example of fetching a random question
    // console.log(req.body.username);

    const random = await Question.aggregate([{ $sample: { size: 1 } }]);
    const question = random[0];

    console.log(question._id);

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

  console.log(req.body.id);
  console.log(req.body.answer);

  res.status(200).json({message: "eys"})
};

module.exports = {
  getExercise,
  checkExercise
};