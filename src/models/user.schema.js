import mongoose from "mongoose";
import AuthRoles from "../utils/authRoles";
import bcrypt from "bcrypt.js"
import config from "../config";
import crypto from "crypto"
import { Jwt } from "jsonwebtoken";

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
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods = {
    //  compare the password

    comparePassword: async function(enteredPassword){
       return await bcrypt.compare(enteredPassword, this.password)
    },
    //  generate jwt token
    getJWTtoken : function(){
        JWT.sign({_id: this._id, role: this.role}, config.JWT_SECRET,
         {
            expiresIn : config.JWT_EXPIRY
        })
    },

    // generate forgot password token 
    generateForgotPasswordToken : function(){
       const forgotToken =   crypto.randomBytes(20).toString("hex")

    // encrypt the token generate by crypto     

       this.forgotPasswordToken = crypto
       .createHash("sha256")
       .update(forgotToken)
       .digest("hex")

    //    time to token to expire
     this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000
     return forgotToken
    }
}





export default mongoose.model("User", userSchema)