import { Router } from 'express';
import { addTask,updateTask,getAllTasks,deleteTask } from '../controller/task.controller';
import { isAuth } from '../middleware/auth.middleware';
import { uploadImage } from '../middleware/imageUpload';

const router = Router();

router.post('/', addTask);
router.get('/', getAllTasks);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;