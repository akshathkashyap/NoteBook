import { Router } from 'express';
import { login } from '../controllers';

const router: Router = Router();

// ROUTE /api/login
router.post('/', login);

export default router;
