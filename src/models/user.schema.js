import mongoose from "mongoose";
import AuthRoles from "../utils/authRoles";
import bcrypt from "bcrypt.js"

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        require :[ "true", "Name is req" ],
        maxLength : [50, "Name must be less than 50 words"]
    }, 

    email:{
        type: String,
        require :[ "true", "Email is req" ], 
    },

    password:{
        type: String,
        require :[true, "password is req"],
        minLenght : [8, "must be more than 8 chars"],
        select: false
    },

    role:{ 
        type: String,
        enum: Object.values(AuthRoles),
        default: AuthRoles.USER

    },

    forgotPasswordToken: String,
    forgotPasswordExpiry : Date,

}, {timestamp : true})

// encrypt password before saving

userSchema.pre("save", async function(next){
    if (this.isModified("password")) return next()
    bcrypt.hash(this.password, 10)
}  )



export default mongoose.model("User", userSchema)