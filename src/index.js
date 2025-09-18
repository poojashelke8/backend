// require('dotenv').config({path:'/.env'})
// above improved version of dotenv

import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
    path:'./.env'
})


connectDB()