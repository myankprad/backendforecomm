// SIGN UP
import asyncHandler from "../service/asyncHandler";
import CustomError from "../utils/CustomError";
import User from "../models/user.schema.js"
import mailHelper from "../utils/mailHelper.js"


/******************************************************
 * @SIGNUP
 * @route http://localhost:5000/api/auth/signup
 * @description User signUp Controller for creating new user
 * @returns User Object
 ******************************************************/


export const cookieOptions = {
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000  ),
    httpOnly: true
}

export const signUp = asyncHandler(async(req, res)=>{
    // get data from body
    const {name, email, password} = req.body

    // validation
    if (!name || !email || !password) {
        throw new CustomError("Please add all field", 400)
    }
    // add this data to the database
    // check if user already exist 

   const existingUser = await User.findOne({email})

   if(existingUser){
    throw new CustomError("User already exist", 400)
   }

   const user =  await User.create({
    name,
    email,
    password
   })
   const token = user.getJWTtoken()

//    safety

user.password = undefined

// store this token in users cookie
res.cookie("token", token, cookieOptions)

// send back response to user

res.status(200).json({
    success: true,
    token,
    user,
})

})


export const logIn = asyncHandler(async(req, res)=>{
    const {email, password} = req.body

    // validation

    if(!email || !password){
        throw new CustomError("please fill all details ", 400)
    }

  const user =   User.findOne({email}).select("+password")

    if(!user){
        throw new CustomError("Invalid Credentials", 400)
    }

   const isPasswordMatched =  await user.comparePassword(password)

   if(isPasswordMatched){
   const token = user.getJWTtoken()
   user.password = undefined
   res.cookie("token", token, cookieOptions)
   return res.status(200).json({
    success: true,
    token,
    user
   })
   }

   throw new CustomError("password is incorrect", 400)

})

export const logout = asyncHandler(async (req, res)=>{
    res.cookie("token", null,{
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: "logged out"
    })
})

export const getProfile = asyncHandler(async(req, res)=>{
    const {user} = req
    if(!user){
        throw new CustomError("user not found", 401)
    }
    res.status(200).json({
        success: true,
        user
    })
})

export const forgotPassword = asyncHandler(async (req, res)=>{
    const {email} = req.body
    if(!email){
        throw new CustomError("Email not found", 400)
    }

  const user =  await User.findOne({email})
  if(!user){
    throw new CustomError("user not found", 404)
}

const resetToken = user.generateForgotPasswordToken()

await user.save({validateBeforeSave: false})

const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/auth/password/reset/${resetToken}`
   
const message = `Your password reset token is as follows \n\n ${resetUrl} \n\n if this was not requested bt you please ignore`

try{
    const options = {}
    await mailHelper({
        email: user.email,
        subject: "Password reset mail",
        message
    })
} catch(error){
user.forgotPasswordToken = undefined
user.forgotPasswordExpiry = undefined

await user.save({validateBeforeSave : false})

throw new CustomError( error.message ||"Email could not be send")

}

})


export const resetPassword = asyncHandler(async (req, res)=>{
    const {token : resetToken} = req.params
    const {password, confirmPassword} = req.body

    const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex")

  const user = await  User.findOne({
        forgotPasswordToken : resetPasswordToken,
        forgotPasswordExpiry: {$gt : Date.now() }
    })

    if(!user){
        throw new CustomError("Password reset token is invalid", 400)
    }

    if(password !== confirmPassword){
        throw new CustomError("password does not match",400)
    }

    user.password = password;

    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined

    await user.save()

    // optional 
    const token = user.getJWTtoken()
    res.cookie("token", token, cookieOptions)

    res.status(200).json({
        success: true,
        user,
    })
})