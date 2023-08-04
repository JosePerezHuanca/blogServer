import express, {Router } from 'express';
import UserController from '../controller/userController';
const router:Router=express.Router();
const User:UserController= new UserController();

router.post('/signup', User.signup);
router.post('/signin', User.signin);

export default router;