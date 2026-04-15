import express from 'express';
import {
  getContactInfo,
  updateContactInfo,
  sendContactMessage,
} from '../controllers/contactController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getContactInfo);
router.put('/', verifyToken, updateContactInfo);
router.post('/send', sendContactMessage);

export default router;
