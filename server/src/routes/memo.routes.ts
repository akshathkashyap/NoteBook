import { Router } from 'express';
import { auth } from '../middleware';
import {
  createMemo,
  getAuthorsMemos,
  getMemosSentToAuthor,
  updateMemo,
  sendMemo,
  deleteMemo
} from '../controllers';

const router: Router = Router();

// ROUTE /api/memo
router.post('/create', auth, createMemo);
router.get('/', auth, getAuthorsMemos);
router.get('/received', auth, getMemosSentToAuthor);
router.post('/update', auth, updateMemo);
router.post('/send', auth, sendMemo);
router.delete('/', auth, deleteMemo);

export default router;