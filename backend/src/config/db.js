import mongoose from 'mongoose';
export async function connectDb(uri = process.env.MONGODB_URI) {
  if (!uri) throw new Error('MONGODB_URI is not configured');
  return mongoose.connect(uri);
}
export default connectDb;
