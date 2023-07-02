import express from "express";
import {getFeedPost, getUserPost, likePost} from "../controllers/posts.js"
import { verifyToken } from "../middleWare/auth.js";

const router = express.Router();

// Read
router.get("/",verifyToken, getFeedPost);
router.get("/:userId",verifyToken, getUserPost);


// update
router.patch("/:id/like",verifyToken, likePost );

export default router;