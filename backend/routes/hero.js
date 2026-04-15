import express from 'express';
import {
  getHeroContent,
  updateHeroContent,
} from '../controllers/heroController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getHeroContent);
router.put('/', verifyToken, updateHeroContent);

export default router;
