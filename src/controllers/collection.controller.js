import Collection from "../models/collection.schema.js"
import asyncHandler from "../service/asyncHandler.js"
import CustomError from "../utils/CustomError.js"

export const createCollection = asyncHandler(async(req, res)=>{
    const name = req.body
    if(!name){
        throw new CustomError("Colection name is required", 400)
    }
  const collection = await  Collection.create({
        name
    })
    res.status(200).json({
        success: true,
        message: "Collection was created successfully",
        collection
    })
})

export const updateCollection = asyncHandler(async(req, res)=>{
    const {name} = req.body
    const {id:collectionId} = req.body

    if(!name){
        throw new CustomError("Colection name is required", 400)
    }
 let updateCollection = await Collection.findByIdAndUpdate(collectionId,{
    name
 },{
    new: true,
    runValidators: true
 })

 if(!updateCollection){
    throw new CustomError("Colection not found", 400)
}

    res.status(200).json({
        success: true,
        message: "Collection updated successfully",
        updateCollection
    })
})

export const deleteCollection = asyncHandler(async(req, res)=>{
   
    const {id:collectionId} = req.body

  collectionToDelete =await Collection.findById(collectionId)

 if(!collectionToDelete){
    throw new CustomError("Colection to be delete", 400)
}

collectionToDelete.remove()

    res.status(200).json({
        success: true,
        message: "Collection deleted successfully",
        updateCollection
    })
})

export const getAllCollection = asyncHandler(async(req, res)=>{
   

 const collections =await Collection.find()

 if(!collections){
    throw new CustomError("No Colection found ", 400)
}


    res.status(200).json({
        success: true,
        collections
    })
})

export const updateCoupon = asyncHandler(async (req, res) => {
    const {id: couponId} = req.params
    const {action} = req.body

    // action is boolean or not

    const coupon = await Coupon.findByIdAndUpdate(
        couponId,
        {
            active: action
        }, 
        {
            new: true,
            runValidators: true
        }
    )
    if (!coupon) {
        throw new CustomError("Coupon not found", 404)
    }

    res.status(200).json({
        success: true,
        message: "Coupon updated",
        coupon
    })
})

export const deleteCoupon = asyncHandler(async (req, res)=>{
    const {id: couponId} = req.params
    
   const coupon = await Coupon.findByIdAndDelete(couponId)

   if (!coupon) {
    throw new CustomError("Coupon not found", 404)
}

res.status(200).json({
    success: true,
    message: "Coupon deleted",
    coupon
})

})