import mongoose from 'mongoose';

export const connectDB = async () => {
  await mongoose.connect("mongodb+srv://anujpratapsingh567_db_user:nfhjvrrEc4h6p63s@cluster0.2vtmwov.mongodb.net/Expense")
  .then(() => console.log("MongoDB connected"));
}