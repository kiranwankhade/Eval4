const express =  require("express");

const postRouters = express.Router();

const {PostModel} =  require("../model/Post.model");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken")

postRouters.get("/",async (req,res)=>{
    const {device} = req.query;

    let query = {}
    try{
         if(device){
            let deviceData = await PostModel.find({device:device})
            res.send(deviceData);
        }else{
            let post = await PostModel.find(query);
            res.send({"UsersPost":post})
        }
    }catch(err){
        res.send({"msg":"can not get data\n","error":err.message})
    }
});

postRouters.get("/top",async(req,res)=>{
    let post = await PostModel.find().sort({no_if_comments:-1}).limit(1)
    res.send(post)
})

postRouters.post("/addpost",async(req,res)=>{
    const { title,body,device,no_if_comments}=req.body
    try{
        const post=new PostModel({title,body,device,no_if_comments})
        await post.save()
        res.send("Post Added")    
    }catch(err){
        res.send("Error in registering the user")
        console.log(err)
    }
    
});


postRouters.patch("/update/:id",async(req,res)=>{
    let postID = req.params['id'];
    const payload = req.body;
    try{
        const query = await PostModel.findByIdAndUpdate({_id:postID},payload);
        console.log('query:', query)
        res.send({"msg":"User has been Updated"})
    }catch(err){
        console.log('err:', err)
        res.send({"msg":"Something Went wrong"});
    }
})

postRouters.delete("/delete/:id",async(req,res)=>{
    const postID=req.params['id']
    try{
        await PostModel.findByIdAndDelete({_id:postID})
        res.send(`User with user id ${postID} has been deleted from the database`)
    }catch(err){
        console.log(err)
        res.send({"err":"something went wrong"})
    }
})

module.exports={
    postRouters
}

