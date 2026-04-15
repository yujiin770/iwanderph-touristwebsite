import express from 'express';
import {
  getAllGallery,
  uploadGalleryPhoto,
  deleteGalleryPhoto,
} from '../controllers/galleryController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllGallery);
router.post('/', verifyToken, uploadGalleryPhoto);
router.delete('/:id', verifyToken, deleteGalleryPhoto);

export default router;
