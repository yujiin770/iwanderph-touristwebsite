import express from 'express';
import {
  getAllDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination,
} from '../controllers/destinationController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllDestinations);
router.get('/:id', getDestinationById);
router.post('/', verifyToken, createDestination);
router.put('/:id', verifyToken, updateDestination);
router.delete('/:id', verifyToken, deleteDestination);

export default router;
