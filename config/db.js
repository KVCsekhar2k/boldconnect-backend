const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const user = encodeURIComponent(process.env.MONGO_USER);
    const password = encodeURIComponent(process.env.MONGO_PASSWORD);
    const mongoURI = `mongodb+srv://${user}:${password}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`;

    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);

    if (process.env.NODE_ENV === 'development') {
      mongoose.set('debug', true); // Log queries in dev mode
    }
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
