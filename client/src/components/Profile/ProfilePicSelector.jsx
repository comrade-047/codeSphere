import { useRef, useState, useEffect } from "react";
import { LuUpload, LuUser, LuTrash } from "react-icons/lu";

const ProfilePicSelector = ({ image, setImage, previousImageUrl = "" }) => {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (image) {
      const previewUrl = URL.createObjectURL(image);
      setPreview(previewUrl);

      return () => URL.revokeObjectURL(previewUrl);
    } else if (previousImageUrl) {
      setPreview(previousImageUrl);
    } else {
      setPreview("");
    }
  }, [image, previousImageUrl]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreview("");
  };

  const onChooseFile = () => {
    inputRef.current?.click();
  };

  return (
    <div className="flex justify-center mb-6">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {preview ? (
        <div className="relative group">
          <img
            src={preview}
            alt="Profile Preview"
            className="w-20 h-20 rounded-full object-cover ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-zinc-900"
          />

          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1 hover:bg-red-600 transition"
            onClick={handleRemoveImage}
          >
            <LuTrash size={16} />
          </button>
        </div>
      ) : (
        <div className="w-20 h-20 flex items-center justify-center rounded-full bg-green-400 text-white relative shadow-md">
          <LuUser className="text-3xl" />
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full absolute -bottom-1 right-1 hover:bg-blue-700 transition"
            onClick={onChooseFile}
          >
            <LuUpload size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePicSelector;
