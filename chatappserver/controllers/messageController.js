import { getReceiverSocketId } from "../Socket/socket.js";
import Conversation from "../model/conversationSchema.js";
import Message from '../model/messageSchema.js'
import {io} from '../Socket/socket.js'
export const messageController = {
    sendmessage : async (req,res)=>{
        try {
            const {message} = req.body;
            const {id:receiverId} = req.params;
            const senderId = req.user._id
    
            let conversation = await Conversation.findOne({
                participants : {$all: [senderId,receiverId]}
            })
    
            if(!conversation){
                conversation = await Conversation.create({
                    participants:[senderId,receiverId]
                })
            }
                const newMessage = new Message({
                    senderId,
                    receiverId,
                    message
                });
    
                if(newMessage){
                    conversation.messages.push(newMessage._id);
                }
    
                await Promise.all([conversation.save(), newMessage.save()])

                //  socket io functionality
                 const receiverSocketId = getReceiverSocketId(receiverId);
                 if(receiverSocketId){
                    io.to(receiverSocketId).emit("newMessage", newMessage);
                 }
                 
                 console.log('receiverSocketId',receiverSocketId);
                res.status(201).json(newMessage);
            
        } catch (error) {
            console.log("error in send message controller", error.message);
            res.status(500).json({error: "internal server error"})
        }
    }
}

export const getmessageController = {
    getmessage : async(req,res)=>{
        try {
            const {id:userChatId} = req.params;
            const senderId = req.user._id;

        const conversation  = await Conversation.findOne({participants:{$all : [senderId,userChatId]},}).populate("messages");

        if(!conversation) return res.status(200).json([])
        

        const message = conversation.messages; 
        res.status(200).json(message)

        } catch (error) {
            console.log("error in get message controller", error.message);
            res.status(500).json({error: "internal server error"})
        }
    }
}