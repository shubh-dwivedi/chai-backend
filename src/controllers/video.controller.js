import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary, deleteFromCloudinary } from "../services/cloudinary.service.js"
import jwt from "jsonwebtoken";

const publishVideo = asyncHandler( async (requestAnimationFrame, res) => {
    // To upload a new video to channel
})

const updateVideo = asyncHandler( async (requestAnimationFrame, res) => {
    // To upload a new video to channel
})

const getVideoById = asyncHandler( async (requestAnimationFrame, res) => {
    // To upload a new video to channel
})

const getAllVideos = asyncHandler( async (requestAnimationFrame, res) => {
    // To upload a new video to channel
})

const deleteVideo = asyncHandler( async (requestAnimationFrame, res) => {
    // To upload a new video to channel
})

const togglePublishStatus = asyncHandler( async (requestAnimationFrame, res) => {
    // To upload a new video to channel
})

export { 
    publishVideo,
    updateVideo,
    getVideoById,
    togglePublishStatus,
    getAllVideos,
    deleteVideo,
}