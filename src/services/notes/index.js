import express from 'express';
import {
  getAll,
  getOne,
  remove,
  update,
} from './notes.js';
import authMiddleware from '../../core/middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getAll);
router.get('/:id', getOne);
router.delete('/:id', remove);
router.patch('/:id', update);

export default router;
