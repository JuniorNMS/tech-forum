// server/routes/answers.js
import express from 'express';
import { createAnswer } from '../controllers/answers.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createAnswer);

export default router;