import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectionstring = process.env.DATABASE

mongoose.connect(connectionstring).then(() => {
  console.log('mongodb connected successfully...');
}).catch(err => {
  console.log(err, 'mongodb connection failed...');
});