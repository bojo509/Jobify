import mongoose from "mongoose";

const dbConnection = async () => {
    try {
        const dbConnection = await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to database: " + dbConnection.connection.host);
    }
    catch (error) {
        console.log("Error in db connection: " + error);
    }
}

export default dbConnection;