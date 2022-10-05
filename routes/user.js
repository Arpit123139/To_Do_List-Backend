const express=require('express')
const router=express.Router();

const User=require('../models/user')
const bcryptjs=require('bcryptjs')
const user_jwt=require('../middleware/user_jwt');
const jwt = require('jsonwebtoken');

// After registering retrieving the user
router.get('/',user_jwt , async function(req,res){

    try {
        const user=await User.findById(req.user.id).select('-password')
        res.status(200).json({
            success:true,
            user:user
        })
        
    } catch (err) {
        console.log("error ",err)
        res.status(500).json({
            success:false,
            msg:"Server error "
        })
        next()
    }
})


router.post('/register',async function(req,res,next){

    console.log(req.body)
    const {username,email,password}=req.body

    try {
        let user_exsist=await User.findOne({email:email})
        if(user_exsist){
            res.json({
                success:false,
                msg:"User Already exsist"
            })
        }

        //Creating the user in the database
        let size=200;
        let user=new User()
        user.avatar="https://gravatar.com/avatar/?s="+size+'&d=retro'
        user.username=username
        user.email=email

        //encrypting the password using bcrypt
        const salt=await bcryptjs.genSalt(10)
        user.password=await bcryptjs.hash(password,salt)
        await user.save()

        // when a new User is created we generate a token 
        const payload={
            user:{
                id:user._id
            }
        }
        
        //creating a token witha payLoad Generation of a Token
        jwt.sign(payload,process.env.jwtUserSecret,{
            expiresIn:360000

        },(err,token)=>{
            if(err){
                throw err;
            }
            res.status(200).json({
                success:true,
                token:token
            })
        })
       
        // let newUser=await User.create({
        //     username:username,                                the above functionality can be perform by this
        //     email:email,
        //     avatar:"https://gravatar.com/avatar/?s="+size+'&d=retro',
        //     password:passwordCreate
        // })

    } catch (err) {

        console.log("error ",err)
        
    }
    

    
})

// we are logging in the user and genearating the token 
router.post('/login',async(req,res,next)=>{

    const email=req.body.email
    const password=req.body.password

    try {

        let user=await User.findOne({email:email})
        if(!user){
            res.status(400).json({
                success:false,
                msg:"User is not register"
            })
        }else{
            const isMatch=await bcryptjs.compare(password,user.password)
            if(!isMatch){
                res.status(400).json({
                    success:false,
                    mSg:"Invalid Password "
                })
            }

            //Now this means the user exsist now we willl genearate the token
            const payload={
                user:{
                    id:user._id
                }
            }

            jwt.sign(payload,process.env.jwtUserSecret,{
                expiresIn:360000
    
            },(err,token)=>{
                if(err){
                    throw err;
                }
                res.status(200).json({
                    success:true,
                    token:token,
                    msg:"User Logged In",
                    user:user
                })
            })

        }
        
    } catch (err) {
        console.lofg("error ",err)
        res.status(500).json({
            success:false,
            msg:"Server Error"
        })
        
    }

})

module.exports=router