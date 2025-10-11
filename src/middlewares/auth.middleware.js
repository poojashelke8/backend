// creating custom middleware for authentication

import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import  jwt from "jsonwebtoken";

// if in case res is null we can write it as a _ for ex:(req,_,next)
export const verifyJWT = asyncHandler(async(req,res,next)=>{
    try{
        const token = req.cookies?.accessToken || 
    req.header("Authorization")?.replace("Bearer","")

    if(!token){
        throw new ApiError(401,"Unauthorized Request")
    }

    const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

    const user = await User.findById(decodedToken?._id).select(
        "-password -refreshToken"
    )

    if(!user){
        throw new ApiError(401,"Invalid Access Token")
    }

    // 
    req.user = user;
    next()
    }catch(error){
        throw new ApiError(401,"Invalid Access Token")
    }
})
