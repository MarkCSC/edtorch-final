const Homework = require('../models/Homework'); // Import the Question model
const HomeworkQuestion = require('../models/HomeworkQuestion')
const OpenAI = require('openai');

require('dotenv').config();

const generateUniqueCode = async () => {
  const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

  let unique = false;
  let newCode;

  while (!unique) {
    newCode = generateCode();
    const existingHomework = await Homework.findOne({ code: newCode });
    if (!existingHomework) {
      unique = true;
    }
  }

  return newCode;
};

const getHomeworkCodesByUserId = async (req, res) => {
  try {
    const userId = req.auth.id; // Assuming user ID is stored in req.auth after being authenticated

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const homeworks = await Homework.find({ createdBy: userId }, 'code'); // Select only the 'code' field

    res.status(200).json(homeworks.map(hw => hw.code));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


const createHomework = async (req, res) => {

//   console.log(req.body.id);
//   console.log(req.body.answer);

  const openai = new OpenAI({
    apiKey:process.env.OPENAI_API_GENQ_KEY
  });

  const prompt = [
    {
        role: "system",
        content: "You are a mathematics teacher in high school who frequently creates exercises for your students. \
        Your exercises consist of the questions for topics that the user wants in text only. \
        You should generate only one question at a time. \
        Please ensure that the math equation inside your question is in inline LATEX format with dollar sign."
    },
    {
      role: "user", 
      content: `Generate a question reagarding the topic ${req.body.topic || "on any topic"}.`
    }
  ]

  const stream = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: prompt,
      stream: true,
  });

//   res.status(200).json({data: "yoloajfghadkfj"});

  for await (const chunk of stream) {
    res.write(chunk.choices[0]?.delta?.content || "");
  }

  res.end()
};

const publish = async (req, res) => {

  const { questions } = req.body;

  console.log(questions);
  
  try {

    const code = await generateUniqueCode();

    const homework = new Homework({ createdBy: req.auth.id , code });
    await homework.save();

    // Save all questions and link to homework
    for (let content of questions) {
      const hwq = new HomeworkQuestion({ content, homeworkId: homework._id });
      await hwq.save();
      homework.questions.push(hwq._id);
    }
    await homework.save();

    res.status(200).json({ message: "Homework published successfully!", code: code });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

const getHomeworkByCode = async (req, res) => {
  const { code } = req.params;
  try {
    const homework = await Homework.findOne({ code }).populate('questions'); // Assuming you have a 'questions' field that references HomeworkQuestion
    // console.log(homework);
    if (!homework) {
      return res.status(404).json({ message: 'Homework not found' });
    }

    console.log(homework.questions.map(q => q.content));
    res.status(200).json({question: homework.questions.map(q => q.content)});
  } catch (error) {
    console.error('Error fetching homework:', error);
    res.status(500).json({ error: error.message });
  }
}

const submitHomeworkByCode = async (req, res) => {
  res.status(200).json();
}

module.exports = {
    createHomework,
    publish,
    getHomeworkByCode,
    submitHomeworkByCode,
    getHomeworkCodesByUserId
};