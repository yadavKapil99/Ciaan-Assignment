import { Router } from "express";
import { likePost } from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/:postId/like").post(verifyJWT, likePost);

export default router;
