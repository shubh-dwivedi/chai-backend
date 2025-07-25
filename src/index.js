import dotenv from 'dotenv'
import connectDB from "./db/index.js";
import { app } from './app.js';

// require('dotenv').config({path: './env'})
const server_port = process.env.PORT || 8000;
dotenv.config({
    path: './env'
})

connectDB()
.then(() => {
    app.listen(server_port, () => {
        console.log(` Server is running at port ${server_port}`);
    })
})
.catch((error) => {
    console.log(`MONGO DB CONNECTION FAILED !! `, error);
})





/*
;(async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error", (error) => {
            console.log("ERROR: ", error);
            throw error
        })

        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`);
            
        })
    } catch (error) {
        console.error("ERROR: ", error)
        throw error
    }
})()
*/