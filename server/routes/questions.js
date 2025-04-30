// server/routes/questions.js
import express from 'express';
import {
  createQuestion,
  getQuestionsByCategory,
  getQuestionDetails
} from '../controllers/questions.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// Correct order
router.post('/', protect, createQuestion);
router.get('/category/:category', getQuestionsByCategory); // Valid parameter
router.get('/:questionId', getQuestionDetails); // Valid parameter

export default router;