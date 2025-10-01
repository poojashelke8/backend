// const asyncHandler = (fn)=>()=>{} used for if want to pass the received fn in further code(higher order function)
// const asyncHandler = (fn)=>async(req,res,next)=>{
//     try{
//         await fn(req,req,next)
//     }catch(error){
//        res.status(error.code || 500).json({
//         success:false,
//         message:error.message
//        })
//     }
// }

// ------------using promises

const asyncHandler = (requestHandler) =>{
(req,res,next)=>{
    Promise.resolve(requestHandler(req,res,next)).
    catch((err)=>next(err))
}
}

export {asyncHandler}