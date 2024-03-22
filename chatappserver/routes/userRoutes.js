import express from 'express';
import { userController, userloginController,userlogoutcontroller,usersidebarController } from '../controllers/userController.js';
import {messageController,getmessageController} from '../controllers/messageController.js'
import jwtrouteprotect from '../middleware/jwtrouteprotect.js'

const router = express.Router();

router.post('/user/register', userController.register);

router.post('/user/login',userloginController.login);

router.post('/user/logout',userlogoutcontroller.logout);

router.post('/user/send/:id',jwtrouteprotect,messageController.sendmessage)

router.get('/user/getmessage/:id',jwtrouteprotect,getmessageController.getmessage)

router.get('/user/usersidebar',jwtrouteprotect,usersidebarController.usersidebar);

export default router;
