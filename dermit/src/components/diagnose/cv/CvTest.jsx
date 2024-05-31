import React, { useRef, useState, useEffect } from "react";
import { useContext } from "react";
import { AIModelContext } from "../../../contexts/AIModelContext";
import { AuthContext } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { IoImages } from "react-icons/io5";
import { GrUploadOption } from "react-icons/gr";
import { MdOutlineCancel } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import { Button } from "@nextui-org/react";

const CvTest = () => {
  const { user, authAxios } = useContext(AuthContext);
  const imageHandler = useRef(null);
  const [filesList, setFilesList] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const { formValues, setFormValues } = useContext(AIModelContext);
  // console.log(formValues);

  const dragEnter = () => {
    imageHandler.current.classList.add("dragClass");
  };
  const dragLeave = () => {
    imageHandler.current.classList.remove("dragClass");
  };
  const drop = () => {
    imageHandler.current.classList.remove("dragClass");
  };
  const clearQueue = () => {
    filesList.forEach((image) => {
      console.log("image.name: ", image.file.name);
      URL.revokeObjectURL(image.preview);
    });
    setFilesList([]);
    toast.warn("Image Queue Cleared", {
      autoClose: 3000,
      position: "top-center",
    });
  };
  const onFileDrop = (e) => {
    // e.target.files returns FileList object which doesn't have all the property of an array
    const files = [...e.target.files]; // spread operator (...) converts this FileList to an actual array object
    // Now filter each files for supported image format
    // If right format then append the to fileList state based on its previous value

    const acceptedFiles = files.filter((element) => {
      return (
        element.type === "image/png" ||
        element.type === "image/jpeg" ||
        element.type === "image/jpg"
      );
    });

    if (acceptedFiles.length > 0) {
      const filesWithPreview = acceptedFiles.map((file) => {
        console.log("file: ", file);
        return {
          file,
          preview: URL.createObjectURL(file),
        };
      });
      console.log("acceptedFiles: ", filesWithPreview);
      setFilesList((prevList) => [...prevList, ...filesWithPreview]);
    } else {
      toast.error(`Please upload image(s) in supported formats`, {
        autoClose: 3000,
        position: "top-center",
        newestOnTop: true,
      });
    }
  };
  useEffect(() => {
    if (filesList.length > 0) {
      console.log("ue", filesList);
      console.log("ue", typeof filesList);
      toast.success(`${filesList.length} images are uploaded`, {
        autoClose: 3000,
        position: "top-center",
      });
    }
  }, [filesList]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsUploading(true);
    const formData = new FormData();

    filesList.forEach((image) => {
      formData.append("image", image.file);
    });

    formData.entries().forEach((e) => console.log(e));

    try {
      const response = await authAxios.post("images/upload/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status !== 201) {
        throw new Error(response.data || "Upload failed");
      }
      console.log(response.data);
      toast.success(`${response.data}`, {
        autoClose: 3000,
        position: "top-center",
        newestOnTop: true,
      });
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  // TODO: Add image previewing feature
  // TODO: Add individual image deleting from the queue feature
  // TODO: Remove duplicate images
  // TODO: Disable button during submission to avoid multiple submission


  return (
    <>
      <ToastContainer
        position="top-center"
        newestOnTop={true}
        containerId="file-toast"
        draggable={true}
      />

      <section className="bg-gray-100 w-full min-h-screen flex flex-col items-center gap-6">
        <div className="p-[30px] rounded-lg shadow-md bg-white h-max flex flex-col gap-6 text-center items-center mt-20 w-[25vw]">
          <p className="font-semibold text-4xl">Upload Images</p>

          <div
            ref={imageHandler}
            className={`drop-file-input relative w-[400px] h-[200px] border-2 border-emerald-600 border-dashed rounded-md flex items-center justify-center`}
            onDragEnter={dragEnter}
            onDragLeave={dragLeave}
            onDrop={drop}
          >
            <div className="drop-file-input__label flex flex-col items-center gap-3">
              <IoImages size={70} className="" />
              <div>
                <p className="text-gray-500">Drag & Drop you images here</p>
                <p className="text-gray-500">
                  <span className="text-red-600">*</span> .png .jpg .jpeg
                  supported
                </p>
              </div>
            </div>
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={onFileDrop}
              multiple
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          <div className="space-x-4">
            <Button
              color={filesList.length > 0 ? "primary" : "default"}
              className="transition-all"
              isDisabled={filesList.length > 0 ? false : true}
              onClick={handleSubmit}
            >
              <GrUploadOption size={18} /> Upload & Next
            </Button>
            <Button
              color={filesList.length > 0 ? "danger" : "default"}
              className="transition-all"
              isDisabled={filesList.length > 0 ? false : true}
              onClick={clearQueue}
            >
              <MdOutlineCancel size={20} />
              Clear Queue
            </Button>
          </div>
        </div>
        {filesList.length > 0 && (
          <div className="p-[30px] rounded-lg shadow-md bg-white h-max grid grid-cols-3 gap-4 w-[25vw]">
            {filesList.map((image, index) => {
              return (
                <div
                  key={index}
                  className="bg-primaryGreen h-32 relative w-full text-center font-semibold flex flex-col"
                >
                  <img
                    src={image.preview}
                    alt="image container"
                    className="object-cover absolute h-full"
                  />
                  <div className="flex h-full flex-col justify-between">
                    <p className="h-max z-40 relative bg-primaryGreen text-white">
                      {image.file.name}
                    </p>
                    <p className="h-max z-40 relative bg-primaryGreen text-white">
                      {Math.floor(image.file.size / 1024)} KB
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
};

export default CvTest;
