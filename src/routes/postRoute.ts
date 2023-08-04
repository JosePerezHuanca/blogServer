import express, { Router } from "express";
import { Request, Response} from "express";
import PostController from "../controller/postController";
import verifyToken from "../middleware/middlewareToken";
const router:Router=express.Router();
const Post:PostController= new PostController();


router.get('/', Post.getPosts);
router.get('/:date/:slug', Post.getPost);
router.post('/',verifyToken ,Post.newPost);
router.put('/:id',verifyToken ,Post.updatePost);
router.delete('/:id',verifyToken ,Post.deletePost);


export default router;