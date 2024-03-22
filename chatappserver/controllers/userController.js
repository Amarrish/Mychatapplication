import { users } from '../model/userSchema.js';
import bcrypt from 'bcrypt'
import generateTokenAndCookie from '../middleware/jwtmiddleware.js'
const saltRounds = 10;

// register
export const userController = {
    register: async (req, res) => {
        const {username,email,password,picture} = req.body; 

    try{
        const existinguser = await users.findOne({email});
        if(existinguser){
            res.status(406).json('user already exist')
        }
        else{
            bcrypt.hash(password,saltRounds, async function(err, hash) {
                if (err) {
                    throw err
                }
                const newuser = new users({
                    username,
                    email,
                    password: hash,
                    picture,
                })
                // generate token
              generateTokenAndCookie(newuser._id,res)
                await newuser.save()
                res.status(200).json(newuser)
            });
        }
    }catch(err){
        res.status(401).json(`error transaction failed:  ${err}`)
    }
    }
};

// login
export const userloginController = {
    login: async (req, res) => {
      const { email, password } = req.body;

      try {
        const existingUser = await users.findOne({ email })

        if (existingUser) {
          bcrypt.compare(password, existingUser.password, function (err, result) {
            if (err) {
              throw err;
            }
          
            console.log('bcrypt.compare result:', result);
          
            if (result) {
            const token = generateTokenAndCookie(existingUser._id,res)
              // console.log("generated token in controller",token);
              res.status(200).json({existingUser,token})
            } else {
              res.status(404).json('Incorrect email or password');
            }
          }
         );
        } else {
          res.status(404).json('Incorrect email or password');
        }
      } catch (err) {
        res.status(401).json('Error: Transaction failed', err);
      }
    },
  };

  // logout
export const userlogoutcontroller = {
    logout: async(req,res)=>{
      try {
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message:'logged out successfully'})
      } catch (err) {
        console.log('Error in logout controller', err.message);
        res.status(500).json({err:"internal Server error"})
      }
    }
}

// get all users for sidebar (login person filtered)

export const usersidebarController ={
  usersidebar: async(req,res)=>{
    console.log('usercontoller');
    try {
      const myloginId = req.user._id;

    const filterloginId = await users.find({_id:{$ne:myloginId}}).select('-password')
    res.status(200).json(filterloginId)
    } catch (error) {
      console.log('Error in usersidebar controller', error.message);
        res.status(500).json({err:"usersidebar internal Server error"})
    }
  }
}