import { Router } from 'express';
import { auth } from '../middleware';
import { createTopic, getAuthorsTopics, updateTopicName, deleteTopic } from '../controllers';

const router: Router = Router();

// ROUTE /api/topic
router.post('/create', auth, createTopic);
router.get('/', auth, getAuthorsTopics);
router.post('/update/name', auth, updateTopicName);
router.delete('/', auth, deleteTopic);

export default router;