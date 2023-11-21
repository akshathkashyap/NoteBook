import { Router } from 'express';
import { createUser, getUserByQuery, updateUserDataByParam } from '../controllers';
import { auth } from '../middleware';

const router: Router = Router();

// ROUTE /api/user
router.post('/register', createUser);
router.get('/', auth, getUserByQuery);
router.post('/update', auth, updateUserDataByParam);

export default router;
