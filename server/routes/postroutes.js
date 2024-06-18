import express from "express";
import {verifyToken} from '../middleware/auth.js';
import { addPost, getFeedPosts, getUserPosts, updateLikePost } from "../controllers/post.js";
const router = express.Router();

router.post('/addpost', verifyToken, addPost);
router.get('/getfeedpost', verifyToken, getFeedPosts);
router.get('/getuserpost/:userid', verifyToken, getUserPosts);  
router.patch('/updatepost/:id', verifyToken, updateLikePost);  
export default router;