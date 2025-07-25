import { Router } from "express";
import { registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentUserPassword, getCurrenttUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)

router.route("/login").post(loginUser);

// secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/update-password").post(verifyJWT, changeCurrentUserPassword);
router.route("/get-user").post(verifyJWT, getCurrenttUser);
router.route("/update-user").post(verifyJWT, updateAccountDetails);
router.route("/update-avatar").post(
    verifyJWT,
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }
    ]),
    updateUserAvatar
);
router.route("/update-cover-image").post(
    verifyJWT,
    upload.fields([
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    updateUserCoverImage
);

export default router