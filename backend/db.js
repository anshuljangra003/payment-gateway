import mongoose, { Mongoose, Schema }  from "mongoose";
mongoose.connect("mongodb+srv://AnshulAj69:iaG8rdyIVXniPvw0@cluster0.sh8fm.mongodb.net/paytm");
const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    }

})


const accountSchema=new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    balance:{
        type:Number,
        required:true,
        default:0
    }

})
export const accountModel=new mongoose.model("Account",accountSchema)
export const userModel=new mongoose.model("User",userSchema);




