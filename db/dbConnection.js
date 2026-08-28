import mongoose from 'mongoose';

export const dbConnection = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is missing. Add it to the backend .env file.');
  await mongoose.connect(uri);
  console.log('MongoDB connected successfully');
};
