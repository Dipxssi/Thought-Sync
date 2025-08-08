import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import {z} from "zod"
import bcrypt from "bcrypt"
import { ContentModel, UserModel } from "./db";
import { userMiddleware } from "./middleware";
import { JWT_SECRET } from "./config"; 
const app = express();
app.use(express.json())

app.post("/api/v1/signup", async function(req,res){
    // zod validation
    const requiredBody = z.object({
      username : z.string(),
      password : z.string().min(8, "Passwords must be at least 8 characters long")
    })
    //parse the data
    const parsedDataWithSuccess = requiredBody.safeParse(req.body);
    //check
    if(!parsedDataWithSuccess.success){
      res.status(401).json({
        mssg: "incorrect format",
        error : parsedDataWithSuccess.error
      })
      return
    }
    //inputs
    const username = req.body.username;
    const password = req.body.password;
    //hashed password
    const hashedPassword = await bcrypt.hash(password,2);
    // create db
    try{
    await UserModel.create({
        username : username,
        password : hashedPassword
    })
    //res mssg
    res.json({
      mssg : "You are signed up"
    })} catch (e){
      res.status(411).json({
        mssg : "User already e"
      })
    }
});

app.post("/api/v1/signin", async function(req,res){
  //get the info
  const {username,password} = req.body
  //find the usernsme
  const existingUser = await UserModel.findOne({
    username
  })
  //check
  if(!existingUser){
    return res.status(403).json({mssg : "Incorrect creds"})
  }
  // check the hashed pswd
  const isPasswordValid = await bcrypt.compare(password , (existingUser as any).password);
  //check
  if(!isPasswordValid){
    return res.status(403).json({mssg: "Incorrect creds"});
  }
  //generating jwt
  const token = jwt.sign({
    id : existingUser._id
  },JWT_SECRET);
  res.json({
    token
  })
});

app.post("/api/v1/content",userMiddleware, async function(req,res){
   const link = req.body.link;
   const type = req.body.type;
  await ContentModel.create({
    link,
    type,
    //@ts-ignore
    userId : req.userId,
    tags:[]
   })

   return res.json({
    mssg : "Content added"
   })

});

app.get("/api/v1/content",userMiddleware, async function(req,res){
  //@ts-ignore
   const userId = req.userId
   const content = ContentModel.find({
    userId : userId
   }).populate("userId", "username")
   res.json({
    content
   })
});

app.delete("api/v1/content", async function(req,res){

});

app.post("api/v1/share", async function(req,res){

});

app.get("api/v1/:shareLink", async function(req,res){

});


app.listen(3000);