import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});


const uploadOnCloudinary = async (localFilePath)=>{
    try{
        if (!localFilePath) return null
        // upload on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })

        // file uploaded success
        console.log("file is uploaded!!",response.url)
        return response
    }catch(error){
        // remove the locally saved file as upload failed
        fs.unlink(localFilePath)
        return null
    }
}

export {uploadOnCloudinary}