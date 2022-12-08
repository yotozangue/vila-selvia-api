import mongoose from 'mongoose';
const { DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_NAME } = process.env;

const URI = `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`;

const connectDB = async () => {
    const DB = await mongoose.connect(URI);
    console.log(`database is ${DB.connection.db.databaseName}`);
    return DB.connection.db;
}

export default connectDB;
