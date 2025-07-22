import { API_PATHS } from "./apiPaths";
import axiosInstance from "./axiosInstance"

const uploadImage = async({image,username}) => {
    const formData = new FormData();
    console.log(image);
    formData.append("image", image);
    
    try{
        const response = await axiosInstance.post(API_PATHS.USER.UPLOAD_IMAGE(username),formData,{
            headers : {
                "Content-Type" : "multipart/form-data"
            }
        });

        return response.data;
    }
    catch(err){
        console.log("Error uploading image", err?.response?.data);
        throw err;
    }
}
export  default uploadImage;