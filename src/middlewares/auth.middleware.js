import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler( async (req, _, next) => { // res is unused here hence replaced with _ (underscore)
    try {
        const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if(!accessToken) {
            throw new ApiError(401, "Unauthorised request");
        }
        
        const decodedTokenInfo = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedTokenInfo._id).select("-password -refreshToken");
        
        if(!user) {
            throw new ApiError(401, "User Not Found")
        }
    
        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token")
    }
});