const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const mongoUrl =
            process.env.MONGO_URI || "mongodb://mongo:27017/cryptoxchange";

        await mongoose.connect(mongoUrl);

        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;