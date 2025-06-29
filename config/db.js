const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const user = encodeURIComponent(process.env.MONGO_USER);
        const password = encodeURIComponent(process.env.MONGO_PASSWORD);
        const mongoURI = `mongodb+srv://${user}:${password}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`;
        const conn = await mongoose.connect(mongoURI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
