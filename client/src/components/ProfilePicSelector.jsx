import { useRef, useState } from "react"
import {LuUpload, LuUser, LuTrash} from "react-icons/lu"

const ProfilePicSelector = ({image, setImage}) => {
    const inputRef = useRef(null);  
    const [preview, setPreview] = useState(null);

    const handleImageChange = (e) =>{
        const file = e.target.files[0];

        if(file){
            setImage(file);

            const previewUrl = URL.createObjectURL(file);
            setPreview(previewUrl);
        }
        e.preventDefault();

    } 

    const handleRemoveImage = () => {
        setImage(null);
        setPreview(null);
    }

    const onChooseFile = () => {
        inputRef.current.click();
    }

    return (
        <div className="flex justify-center mb-6">
            <input
                type="file" 
                accept="image/*"
                ref={inputRef}
                onChange={handleImageChange}
                className="hidden"
            />

            {!image ? (
                <div className="w-20 h-20 flex items-center justify-center rounded-full bg-green-400 relative">
                    <LuUser className="text-4xl text-primary"/>

                    <button
                        type="button"
                        className="w-8 h-8 flex items-center justify-center text-white rounded-full absolute -bottom-1 "
                        onClick={onChooseFile}
                    >
                        <LuUpload className="text-xl" />
                    </button>
                </div>
            ):(
                <div className="relative">
                    <img
                        src={preview}
                        alt="profile photo"
                        className="w-20 h-20 rounded-full object-cover"
                    />

                    <button
                        type="button"
                        className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1"
                        onClick={handleRemoveImage}
                    >
                        <LuTrash className="" />
                    </button>

                </div>
            )}
        </div>
    )
};
export default ProfilePicSelector;