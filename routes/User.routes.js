const express =  require("express");

const userRouters = express.Router();

const {UserModel} =  require("../model/User.model");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken")

userRouters.get("/",async (req,res)=>{
    console.log("Home");
    let user = await UserModel.find();
    res.send({"Users":user})
});

userRouters.post("/register",async(req,res)=>{
    const {name,email,gender,password,age,city}=req.body

    let userModel = await UserModel.find();
    // console.log('userModel:', userModel)
    try{
        userModel.map((el)=>{
            if(el.email != email){
                bcrypt.hash(password, 8, async (err, hash)=>{
                    const user=new UserModel({name,email,gender,password:hash,age,city})
                    await user.save()
                    res.send({"Registered": user})
                });
            }else{
                res.send("User already exist, please login")
            }
        })
        
    }catch(err){
        res.send("Error in registering the user")
        console.log(err)
    }
    
});

userRouters.post("/login",async(req,res)=>{
    const {email, password} = req.body;
    try{
        const user=await UserModel.find({email});
        if(user.length>0){
            bcrypt.compare(password, user[0].password, function(err, result) {
                if(result){
                const token = jwt.sign({userID:user[0]._id}, 'masai');
                res.send({"msg":"Login Successfully","token":token})
                } else {res.send("Wrong Credentials")}
            });
        } else {
            res.send("Wrong Credentials")
        }
    } catch(err){
        res.send("Something went wrong")
        console.log(err)
    }        

})

module.exports={
    userRouters
}

