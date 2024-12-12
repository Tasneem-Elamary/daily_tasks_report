import { Router } from 'express';
import { addEmployee } from '../controller/employee.controller';
import { isAuth } from '../middleware/auth.middleware';

const router = Router();

router.post('/', addEmployee);


export default router;