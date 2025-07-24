import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../services/cloudinary.service.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById({userId})
        if(user) {
            const accessToken = user.generateAccessToken();
            const refreshToken = user.generateRefreshToken();

            user.refreshToken = refreshToken;
            await user.save({validateBeforeSave: false});

            return { accessToken, refreshToken }
        }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}

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

    let fieldsArr = [username, email, fullName, password]
    let emptyFieldError = fieldsArr.some((field) => field?.trim() === "")
    if(emptyFieldError) {
        throw new ApiError(400, "all fields are required")
    }

    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if(existingUser) {
        throw new ApiError(409, "User with same email or username already exists")
    }

    // const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage ? req.files?.coverImage[0]?.path : "";
    let avatarLocalPath = "";
    let coverImageLocalPath = "";

    if(req.files) {
        if(Array.isArray(req.files.avatar) && req.files.avatar.length > 0) {
            avatarLocalPath = req.files.avatar[0].path;
        }
        if(Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
            coverImageLocalPath = req.files.coverImage[0].path;
        }
    }

    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar) {
        throw new ApiError(500, "Avatar file upload failed, please try again")
    }

    const newUser = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        username: username.toLowerCase(),
        email,
        password
    });

    const createdUser = await User.findById(newUser._id).select("-password -refreshToken");

    if(!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successfully")
    );
})

const loginUser = asyncHandler( async (req, res) => {
    // get user creds - req.body -> data
    // check - username, email
    // find user in db
    // generate access and refresh token
    // send response in cookie


    const { email, username, password } = req.body;

    if(!username && !email) {
        throw new ApiError(400, "Username or password is required")
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })
    
    if(!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid) {
        throw new ApiError(401, "Passwrod is incorrect")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    if(!accessToken || !refreshToken) {
        throw new ApiError(500, "Access and refresh token cannot be generated")
    }

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            }, 
            "User Logged In Successfully"
        )
    )
})

const logoutUser = asyncHandler( async (req, res) => {
    const userId = req.user._id

    const existingUser = await User.findByIdAndUpdate(
        userId,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options ={
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(200, {}, "User Logged Out Successfully")
    )

})

export { registerUser, loginUser, logoutUser }