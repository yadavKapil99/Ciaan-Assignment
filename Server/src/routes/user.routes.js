import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getLatestUsers, getUserDetails, getUserProfile, loginUser, logOut, searchUsers, signUp } from "../controllers/user.controller.js";
import uploadMulter from "../middlewares/multer.middleware.js";


const router = Router()

router.route("/").post(uploadMulter.single("profilePicture"), signUp)
router.route("/search/:query").get(verifyJWT, searchUsers)
router.route("/getUser").get(verifyJWT, getUserProfile);
router.route("/getLatestUsers").get(verifyJWT, getLatestUsers)
router.route("/userId/:userId").get(verifyJWT, getUserDetails);
router.route("/").get(verifyJWT, (req, res) => {
  res.status(200).json({ success: true, message: "User is authenticated" });
});
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT, logOut)

//secured routes

export default router



//   upload.fields([
//     { name: "profilePic", maxCount: 1 },
//     { name: "driverLicenseImage", maxCount: 1 },
//     { name: "policeVerificationImage", maxCount: 1 },
//     { name: "aadharImage", maxCount: 1 },
//     { name: "rcImage", maxCount: 1 },
//   ]),
