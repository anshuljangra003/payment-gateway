// const express=require("express");
import express from "express";

import { z } from "zod";
import jwt from "jsonwebtoken";
import { accountModel, userModel } from "../db.js";
import { middleware } from "../middleware/authMiddleware.js";
import mongoose from "mongoose";

const router = express.Router();
const userSchema = z.object({
  username: z.string().email(),
  password: z.string(),
  name: z.string(),
});
const SignInSchema = z.object({
  username: z.string().email(),
  password: z.string(),
});


router.post("/signup", async (req, res) => {
  const body = req.body;
  const username = req.body.username;

  const { success } = userSchema.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "Invalid INPUT TYPE",
    });
  }

  const existingUser = await userModel.findOne({
    username: username,
  });
  if (existingUser) {
    return res.status(403).json({
      message: "User already Exists",
    });
  }

  const newUser = await userModel.create(body);
 

  const userId = newUser._id;

  await accountModel.create({
    userId,
    balance:1+Math.random()*10000
  })

  res.json({
    message: "successfully created user",
    userId,
  });
});

router.post("/signin", async (req, res) => {
  const body = req.body;
  const { success } = SignInSchema.safeParse(body);
  if (!success) {
    res.status(411).json({
      err: "invalid input",
    });
  }
  const User = await userModel.findOne(body);
  if (!User) {
    res.status(404).json({
      msg: "user not found",
    });
  }
  const userId = User._id;

  const token = jwt.sign({userId}, "anshulsecret");

  res.json({
    token,
  });
});
const updateSchema = z.object({
  password: z.string(),
  name: z.string(),
});

router.put("/", middleware, async (req, res) => {
  const body = req.body;
  const { success } = updateSchema.safeParse(body);
  if (!success) {
    res.status(411).json({
      msg: "invalid input",
    });
  }
  const User = await userModel.updateOne(body, {
    _id: req.userId,
  });

  res.json({
    msg: "updated Successfully",
  });
});

router.get("/bulk", async (req, res) => {
  try {
    const filter = req.query.filter?.trim() || ""; // Remove spaces

    const query = filter
      ? {
          $or: [
            { name: { $regex: filter, $options: "i" } },
            { username: { $regex: filter, $options: "i" } }  // ✅ Search by both
          ]
        }
      : {}; // No filter → return all users

    const users = await userModel.find(query);

    res.json({
      users: users.map(u => ({
        username: u.username,
        name: u.name,
        _id: u._id
      }))
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post("/transfer",middleware,async(req,res)=>{
  const session=await mongoose.startSession();

  session.startTransaction();
  const {amount,to}=req.body;
  const account=await accountModel.findOne({
    userId:req.userId
  }).session(session)
  if(account.balance<amount || !account){
    await session.abortTransaction();
    return res.json({
      error:"Some Error Occured"
    })
    
  }
  const ToAccount=await accountModel.findOne({
    userId:to
  }).session(session)


  if(!ToAccount){
   await session.abortTransaction();
   console.log("here")
   return res.json({ 
    err:"Invalid User"
   })
  }

  await accountModel.updateOne({userId:req.userId},{
   $inc:{
    balance:-amount
   }
  }).session(session);

  await accountModel.updateOne({userId:to},{
    $inc:{balance:amount}
  }).session(session)


  await session.commitTransaction();

  res.json({
    msg:"payment successful"
  })

})
   


export default router;
