import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import uploadMulter from "../middlewares/multer.middleware.js";
import { createPost, deletePost, getUserPosts, getAllPosts, repostPost } from "../controllers/post.controller.js";

const router = Router();

router.route("/allPosts").get(verifyJWT, getAllPosts);
router.post("/", verifyJWT, uploadMulter.array("images", 5), createPost);
router.delete("/:id", verifyJWT, deletePost);
router.get("/", verifyJWT, getUserPosts);
router.post("/repost", verifyJWT, repostPost);

export default router;
