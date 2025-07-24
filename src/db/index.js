import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        // const db_uri = process.env.MONGODB_URI;
        const db_uri = process.env.MONGODB_URI_DEV;
        const connectionInstance = await mongoose.connect(`${db_uri}/${DB_NAME}`);
        // console.log(connectionInstance);
        console.log(`\n MongoDB CONNECTED !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB CONNECTION FAILED: ", error)
        process.exit(1)
        // throw error
    }
}

export default connectDB