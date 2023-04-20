
import s3 from "../config/s3.config.js"

export const s3FileUpload = async({bucketName, key, body, contentType})=>{
  return await s3.upload({
    Bucket: bucketName,
    key: key,
    Body: body,
    contentType: contentType
   })
   .promise()
}

export const s3deleteFile = async({bucketName, key, body, contentType})=>{
    return await s3.deleteObject({
      Bucket: bucketName,
      key: key,
     })
     .promise()
  }