import Question from '../models/Question.js';
import Answer from '../models/Answer.js';

export const createQuestion = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    
    const question = await Question.create({
      title,
      content,
      category,
      author: req.user.id
    });

    res.status(201).json({
      ...question._doc,
      author: { _id: req.user.id, username: req.user.username }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getQuestionsByCategory = async (req, res) => {
    try {
      const category = decodeURIComponent(req.params.category);
      const questions = await Question.find({ category })
        .populate('author', 'username')
        .sort({ createdAt: -1 });
  
      res.json(questions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

export const getQuestionDetails = async (req, res) => {
  try {
    const question = await Question.findById(req.params.questionId)
      .populate('author', 'username')
      .populate({
        path: 'answers',
        populate: { path: 'author', select: 'username' }
      });

    if (!question) return res.status(404).json({ error: 'Question not found' });
    
    res.json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};