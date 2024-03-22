import mongoose from "mongoose";
import validator from "validator";

const userschema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,'cant be blank']
    },
    email:{
        type:String,
        lowercase:true,
        unique:true,
        required:[true,'cant be blank'],
        index:true,
        validate: [validator.isEmail, 'invalid email']
    },
    password:{
        type:String,
        required:[true,'cant be blank']
    },
    picture:{
        type:String
    },
    newmessage:{
        type:Object,
        default:{}
    },
    status:{
        type:String,
        default:'online'
    }
},{minimize:false})

export const users = mongoose.model('users', userschema);

