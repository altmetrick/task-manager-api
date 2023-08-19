import mongoose from 'mongoose';

// via monogoose we can connect to our cloud data base

const connectDB = (url) =>
  mongoose
    .set({ strictQuery: true })
    .connect(url)
    .then(() => console.log('CONNECTED TO THE DB...'))
    .catch((err) => console.log(err));

export default connectDB;
