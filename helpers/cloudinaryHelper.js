import cloudinary from "../config/cloudinary.js";
//this is for upload data 
export let uploadImageOnCloudinary= async(img)=>
{
    let images=[]
    for (let i = 0; i < img.length; i++) {
        let result2 = await cloudinary.uploader.upload(img[i].path);
        images.push({ url: result2.url, public_id: result2.public_id });
      }
      return images
}
//this is for the delete data
export let deleteImageFromCloudinary= async (img)=>
{
    for (const image of img.images) {
        await cloudinary.uploader.destroy(image.public_id);
      }
}