import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import {z} from "zod"
import bcrypt from "bcrypt"
import { ContentModel, UserModel } from "./db";
import { userMiddleware } from "./middleware";
import dotenv from "dotenv"
dotenv.config(); 
import {nanoid} from "nanoid";//creates unique id
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
    const {username , password} = parsedDataWithSuccess.data
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
        mssg : "User already exists"
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
  },process.env.JWT_SECRET as string);
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
  try{
  //@ts-ignore
   const userId = req.userId
   const content = await  ContentModel.find({
    userId : userId
   }).populate("userId", "username")
   res.json({
    content
   })} catch (e){
    res.status(500).json({mssg : "Server error"})
   }
});

app.delete("/api/v1/content",userMiddleware, async function(req,res){  
  try{
  //@ts-ignore
   const userId = req.userId
   const {contentId} = req.body;
   if(!contentId){
      return res.status(400).json({mssg : "wrong creds"})
   }
   const del = await ContentModel.deleteOne({
    _id: contentId,
    userId : userId
   })
   if (del.deletedCount === 0){
    return res.status(404).json({mssg :"Content not found"})
   }
   res.json({
    mssg : "Content deleted"
   })} catch(e){
    res.status(500).json({mssg: "Server is down"})
   }
});

app.post("/api/v1/share",userMiddleware, async function(req,res){
  try{
    //@ts-ignore
    const userId = req.userId;
    const {contentId} = req.body;
    if(!contentId){
      return res.status(400).json({mssg : "wrong creds"})
   }
   //Finding the content and check ownership
   const content = await ContentModel.findOne({
    _id : contentId,
    userId
   })
   if(!content){
     return res.status(404).json({ mssg: "Content not found or not owned by user" });
   }

   //generating a link token
   const shareToken = nanoid(10);
   //save the share link
   content.shareLink = shareToken
   await content.save();
   const BASE_URL = process.env.BASE_URL || "http://localhost:3000"
  const shareUrl = `${BASE_URL}/share/${shareToken}`;
  res.json({
    mssg : "Share link created", shareUrl
  })
} catch(e){
  res.status(500).json({mssg : "Server error"})
}
});

app.get("/api/v1/:shareLink", async function(req,res){
   try{
    const {shareLink} = req.params;
    const content = await ContentModel.findOne({shareLink}).populate("userId","username");
    if(!content){
      return res.status(404).json({mssg : "Shared content not found"})
    }
    res.json({content})
   }catch(e){
    res.status(500).json({mssg : "Server error"})
   }
});


app.listen(3000);