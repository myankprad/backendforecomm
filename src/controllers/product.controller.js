import Product from "../models/product.schema.js"
import formidable from "formidable"
import { s3FileUpload, s3deleteFile} from "../service/imageUpload.js"
import Mongoose from "mongoose"
import asyncHandler from "../service/asyncHandler.js"
import CustomError from "../utils/CustomError.js"
import config from "../config/index.js"
import fs from "fs"
import mongoose from "mongoose"

/**********************************************************
 * @ADD_PRODUCT
 * @route https://localhost:5000/api/product
 * @description Controller used for creating a new product
 * @description Only admin can create the coupon
 * @descriptio Uses AWS S3 Bucket for image upload
 * @returns Product Object
 *********************************************************/

export const addProduct = asyncHandler(async(req, res)=>{
    const form = formidable({multiples: true, keepExtensions: true})

    form.parse(req, async function(err, fields, files){
        if(err){
            throw new CustomError(err.message || "Something went wrong", 500)
        }


        let productId = new mongoose.Types.ObjectId().toHexString()
        // `products/${productId}/photo_3.`
        console.log(fields, files);

    })
})