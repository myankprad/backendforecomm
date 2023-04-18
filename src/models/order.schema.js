import mongoose from "mongoose";
const orderSchema = new mongoose.Schema({
 
    product :{
        type: [
            {
                productId : {
                    type: mongoose.Schema.Types.ObjectId, 
                    ref: "Product"
                },
                count: Number,
                price: Number
            }
        ],
        require: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true,

    },
    address:{
        type:String,
        require: true
    },
    phoneNumber:{
        type: Number,
        require: true
    },
    amount:{
     type: Number,
     require: true
    },
    coupon: String,
    transactionId: String,
    status: {
        type:String,
        enum: ["ORDERES", "SHIPPED", "DELIVERED", "CANCELLED"],
        default: "ORDERED"
    }

}, {timestamps: true})

export default mongoose.model("Order", orderSchema)