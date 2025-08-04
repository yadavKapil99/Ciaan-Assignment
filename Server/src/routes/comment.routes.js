import { Router } from "express";
import { createComment, deleteComment, getPostComments } from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/:postId").get(verifyJWT, getPostComments);
// Create comment
router.route("/").post(verifyJWT, createComment);

// Delete comment
router.route("/:id").delete(verifyJWT, deleteComment);

export default router;
