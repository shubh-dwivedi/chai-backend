import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../services/cloudinary.service.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const registerUser = asyncHandler( async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: usrname, email
    // check for images and check for avatar
    // upload images to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token (sensitive data) from response
    // check for user creation
    // return response or error


    const { username, email, fullName, password } = req.body;
    console.log("\n~ Testing || Email: ", email);

    let fieldsArr = [username, email, fullName, password]
    let emptyFieldError = fieldsArr.some((field) => field?.trim() === "")
    if(emptyFieldError) {
        throw new ApiError(400, "all fields are required")
    }

    const existedUser = User.findOne({
        $or: [{ username }, { email }]
    })

    if(existedUser) {
        throw new ApiError(409, "User with same email or username already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar) {
        throw new ApiError(500, "Avatar file upload failed, please try again")
    }

    const newUser = User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        username: username.toLowerCase(),
        email,
        password
    })

    const createdUser = User.findById(newUser._id)?.select("-password -refreshToken")

    if(!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successfully")
    );
})

export { registerUser }