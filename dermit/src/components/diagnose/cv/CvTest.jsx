import React, { useRef, useState, useEffect } from "react";
import { useContext } from "react";
import { AIModelContext } from "../../../contexts/AIModelContext";
import { useNavigate } from "react-router-dom";
import { IoImages } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";

const CvTest = () => {
  const imageHandler = useRef(null);
  const [filesList, setFilesList] = useState([]);
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

  const onFileDrop = (e) => {
    // e.target.files returns FileList object which doesn't have all the property of an array
    const files = [...e.target.files]; // spread operator (...) converts this FileList to an actual array object
    // Now filter each files for supported image format
    // If right format then append the to fileList state based on its previous value
    if (
      // TODO: Write a condition to check duplicates
      files.filter((element) => {
        console.log(element);
        return (
          (element.type === "image/png" ||
            element.type === "image/jpeg" ||
            element.type === "image/jpg") &&
          element.size > 0
        );
      }).length > 0
    ) {
      const acceptedFiles = files.filter((element) => {
        return (
          element.type === "image/png" ||
          element.type === "image/jpeg" ||
          element.type === "image/jpg"
        );
      });
      console.log("acceptedFiles: ", acceptedFiles);
      setFilesList((prevList) => [...prevList, ...files]);
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


  // TODO: Add image previewing feature and deleting feature, learn about URL.createObjectURL -> caveat

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
        </div>
        {filesList.length > 0 && (
          <div className="p-[30px] rounded-lg shadow-md bg-white h-max grid grid-cols-3 gap-4 w-[25vw]">
            {filesList.map((image) => {
              return (
                <>
                  <div className="bg-primaryGreen h-32 relative w-full text-center font-semibold flex flex-col">
                    <img
                      src={URL.createObjectURL(image)}
                      alt="image container"
                      className="object-cover absolute h-full"
                    />
                    <p className="h-max z-40 relative bg-primaryGreen text-white">
                      {image.name}
                    </p>
                  </div>
                </>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
};

export default CvTest;
