import express from "express";
import {verifyToken} from '../middleware/auth.js';
import {getUser, getUserFriends} from '../controllers/user.js';
const router = express.Router();

router.get('/:userid', verifyToken, getUser);
router.get('/:userid/friends', verifyToken, getUserFriends);

export default router;