// server/controllers/answers.js
import Answer from '../models/Answer.js';
import Question from '../models/Question.js';

export const createAnswer = async (req, res) => {
  try {
    const answer = await Answer.create({
      content: req.body.content,
      question: req.body.questionId,
      author: req.user.id
    });

    await Question.findByIdAndUpdate(req.body.questionId, {
      $push: { answers: answer._id }
    });

    res.status(201).json({
      ...answer._doc,
      author: { _id: req.user.id, username: req.user.username }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};