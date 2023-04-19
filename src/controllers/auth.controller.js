// SIGN UP
import asyncHandler from "../service/asyncHandler";
import CustomError from "../utils/CustomError";
import User from "../models/user.schema.js"


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