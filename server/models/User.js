const mongoose = require('mongoose');

const userSchema=new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,"Name is required"],
            trim:true,
            minlength:5,
            maxlength:50,
        },
        email:{
            type:String,
            required:[true,"Email is required"],
            unique:true,
            lowercase:true,
            trim:true
        },
        password:{
            type:String,
            required:[true,"password is required"],
            minlength:8
        },
        role:{
            type:String,
            enum:["admin","member"],
            default:"member"
        },
        avatar:{
            type:String,
            default:""
        },

    },
    {
        timestamps:true,
    }
)

const User = mongoose.model("User", userSchema);

module.exports = User;