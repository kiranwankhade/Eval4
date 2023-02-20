const express = require("express");
const app = express();

app.use(express.json());

const {authenticate} = require("./middleware/authentication.middleware")

const { userRouters } = require("./routes/User.routes")
const { postRouters } = require("./routes/Post.routes")

require('dotenv').config();

const {connection} = require("./db");

app.get("/",(req,res)=>{
    console.log("HOME");
    res.send("WELCOME TO HOME PAGE")
})

app.use("/user",userRouters)
app.use(authenticate)
app.use("/post",postRouters)

app.listen(process.env.port,async()=>{
    try{
        await connection;
        console.log("Connected")

    }catch(err){
        console.log("NOT Connected");
        console.log(err);
    }
    console.log(`CONNECT SERVER TO ${process.env.port} PORT`)
})