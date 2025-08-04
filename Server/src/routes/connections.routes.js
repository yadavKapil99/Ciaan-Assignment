import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { makeConnection, getUserConnections } from "../controllers/connections.controller.js";

const router = Router();

router.route("/").post(verifyJWT, makeConnection);
router.route("/:userId").get(verifyJWT, getUserConnections);

export default router;
