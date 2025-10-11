import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import path from "path"

const generateAccessAndRefreshTokens = async(userId)=>
    {
    try{
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        // add refresh token into DB
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave:false})

        return accessToken,refreshToken
    }catch(error){
        throw new ApiError(500,"Something went wrong")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    // res.status(200).json
    // ({
    //     message:"ok pooja"
    // })

    const { fullName, email, userName, password } = req.body
    console.log("email", email)

    // if(fullName === ""){
    //     throw new ApiError(400,"Fullname is required")
    // }

    if (
        [fullName, email, userName, password].some((field) =>
            field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }
    // $or --> can check multiple values in an object
    const existedUser = await User.findOne({
        $or: [{ email }, { userName }]
    })
    if (existedUser) {
        throw new ApiError(409, "User already existed")
    }
    console.log("Files received:", req.files); // ✅ Correct place
    console.log("Body received:", req.body);
    const avatarLocalPath = req.files?.avatar[0]?.path?.replace(/\\/g, '/');
    // const coverImageLocalPath = req.files?.coverImage[0]?.path?.replace(/\\/g, '/');

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length >0 ){
        coverImageLocalPath = req.files?.avatar[0]?.path?.replace(/\\/g, '/');
    }

    console.log(avatarLocalPath,"local path")
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }
    // Upload to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);


    // upload images to cloudinary bt passing the localfile path

    // console.log(avatar, "avatarrr")
    if (!avatar) {
        throw new ApiError(400, "Avatar file is required path")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,           
        coverImage: coverImage?.url || "",
        email,
        password,
        userName: userName.toLowerCase()
    })
    // .select(return the selected files - can deselect using -password or -filedname)
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "someting went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "user registered successfully..!")
    )
})

const loginUser = asyncHandler(async(req,res)=>{

     const { fullName, email, userName, password } = req.body

     if(!userName || !email){
        throw new ApiError(400,"Username or email id required")
     }

    //  can find through either using  username,email
     const user = await User.findOne({
        $or:[{userName},{email}]
     })
     
    if(!user){
        throw new ApiError(400,"No user found!")
    }

     const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401,"Invalid user credentials")
    }

    const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).
    select("-password -refreshToken")

    const options = {
        // if httpOnly,secure true then only access form server,cannot
        // modify form frontend
        httpOnly:true,
        secure:true
    }

    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(200,
            {
                user:loggedInUser,accessToken,
                refreshToken
            },
            "User Logged In Successfully!"
        )
    )

})

const logoutUser = asyncHandler(async(req,res)=>{
    // User
    User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        },
        {
            new:true
        }
    )
      const options = {
        // if httpOnly,secure true then only access form server,cannot
        // modify form frontend
        httpOnly:true,
        secure:true
    }
    return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    
})


export { registerUser ,loginUser,logoutUser}