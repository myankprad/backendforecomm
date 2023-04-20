import User from "../models/user.schema.js";
import JWT from "jsonwebtoken"
import asyncHandler from "../service/asyncHandler.js";
import config from "../config.js";
import CustomError from "../utils/CustomError.js";

export const isLoggedIn = asyncHandler(async(req, res, next)=>{
   let token;
   if(req.cookie.token || (req.headers.authorization && req.headers.authorization.startWith("Bearer"))){
    token = req.cookie.token || req.headers.authorization.split("")[1]

    // token = "Bearer jbhuebgkjihkgvbjbjvjekjbv"           
   }
   
   

   if(!token){
    throw new CustomError("not authorised to access this resource", 401)
   }

   try {
        const decodedJwtPayload = JWT.verify(token, config.JWT_SECRET)

      req.user = await  User.findById(decodedJwtPayload._id, "name email role")
      next()
   } catch (error) {
     throw new CustomError("not authorised to access this resource", 401)
   }


})

export const authorise =(...requiredRoles) => asyncHandler(async (req, res, next)=>{
  if(!requiredRoles.inCludes(req.user.role)){
    throw new CustomError("you are not eligible for this resource")
  }
  next()
})