import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken"
const app = express();
app.use(express.json())

app.post("api/v1/signup", async function(req,res){
    
});

app.post("api/v1/signin", async function(req,res){

});

app.post("api/v1/content", async function(req,res){

});

app.get("api/v1/content", async function(req,res){

});

app.delete("api/v1/content", async function(req,res){

});

app.post("api/v1/share", async function(req,res){

});

app.get("api/v1/:shareLink", async function(req,res){

});


app.listen(3000);