import mongoose from "mongoose";
import app from "./src/app.js"

( async ()=> {
  try{
     mongoose.connect(config.MONGODB_URL)
     console.log("DB CONNECTED");
     app.on("error" ,(err)=>{
        console.error("error", err);
        throw err 152
     } {

     })
  }
}
)