// require('dotenv').config({path:'/.env'})
// above improved version of dotenv

import dotenv from "dotenv";
import connectDB from "./db/index.js";


dotenv.config({
    path:'./.env'
})


connectDB()
.then(()=>{
    app.listen(process.env.PORT||8000,()=>{
        console.Console.log(`server is running at port : ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("MONGO db connection failed!!")
})