import express from "express";
import {getUser, getUserFriends, addRemoveFriend} from "../controllers/users.js"
import {verifyToken} from "../middleWare/auth.js"

const router = express.Router();

// get

router.get("/:id", verifyToken, getUser)
router.get("/:id/friends", verifyToken, getUserFriends)

router.patch("/:id/:friendId", verifyToken, addRemoveFriend );

export default router;