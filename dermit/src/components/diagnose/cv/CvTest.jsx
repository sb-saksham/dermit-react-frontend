import React, { useRef, useState, useEffect } from "react";
import { useContext } from "react";
import { AIModelContext } from "../../../contexts/AIModelContext";
import { AuthContext } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { IoImages } from "react-icons/io5";
import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";
import { GrUploadOption } from "react-icons/gr";
import { MdOutlineCancel } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { truncate } from "lodash";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";


const CvTest = () => {
  const { user, authAxios } = useContext(AuthContext);
  const imageHandler = useRef(null);
  const [filesList, setFilesList] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const { formValues, setFormValues } = useContext(AIModelContext);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  // console.log(formValues);
  const [modalValue, setModalValue] = useState({});

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
    setTimeout(() => {}, 2000);
    const formData = new FormData();

    filesList.forEach((image) => {
      formData.append("image", image.file);
    });

    formData.entries().forEach((e) => console.log(e));

    try {
      const response = await authAxios.post("images/upload/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Token ${user.token}`,
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

  const removeImage = (image) => {
    console.log(`removing ${image.file.name}`);
    URL.revokeObjectURL(image.preview);
    const updatedList = filesList.filter((img) => {
      return img.file.name !== image.file.name;
    });
    setFilesList(updatedList);
  };

  const handleModalValue = (image) => {
    setModalValue(image);
  };

  // TODO: Remove duplicate images
  // TODO: Add Carousel
  // TODO: Add Identified Symptoms

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
              isDisabled={filesList.length > 0 && !isUploading ? false : true}
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

        <div className="p-[30px] rounded-lg shadow-md bg-white gap-[30px] flex flex-col w-[38vw] min-h-[413px]">
          <p className="font-semibold text-4xl text-center">Uploaded Images</p>
          <div className="flex w-full text-primaryGreen justify-between items-center">
            <IoIosArrowDropleft size={45} className={`prev cursor-pointer`} />
            <IoIosArrowDropright size={45} className={`next cursor-pointer`} />
          </div>
          {filesList.length > 0 && (
            <>
              <Swiper
                slidesPerView={3.2}
                spaceBetween={20}
                grabCursor={true}
                navigation={{
                  nextEl: ".next",
                  prevEl: ".prev",
                }}
                modules={[Navigation]}
                className="w-full"
              >
                {filesList.map((image, index) => {
                  return (
                    <SwiperSlide>
                      <div
                        key={index}
                        className="bg-primaryGreen h-52 relative w-full font-semibold flex flex-col rounded-md"
                      >
                        <img
                          src={image.preview}
                          alt="image container"
                          className="object-cover absolute h-full w-full z-10 rounded-md"
                        />
                        <span className="absolute z-30 top-2 right-2 flex text-white cursor-pointer">
                          <MdOutlineCancel
                            size={25}
                            onClick={() => {
                              removeImage(image);
                            }}
                          />
                        </span>
                        <div className="flex h-full flex-col justify-between items-start p-2 bg-black/30 z-20 relative text-white rounded-md">
                          <div className="">
                            <p>
                              {truncate(`${user.username}_${image.file.name}`, {
                                length: 15,
                              })}
                              {image.file.name.slice(
                                -5,
                                image.file.name.length
                              )}
                            </p>
                            <p>{Math.floor(image.file.size / 1024)} KB</p>
                          </div>
                          <button
                            className="w-full py-1 bg-white text-black text-center rounded-md"
                            onClick={() => {
                              handleModalValue(image);
                              onOpen();
                            }}
                          >
                            PREVIEW
                          </button>
                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>

              <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                className="bg-black text-white"
                size="2xl"
                backdrop="blur"
              >
                <ModalContent>
                  {(onClose) => (
                    <>
                      <ModalHeader className="flex flex-col gap-1">
                        {`${user.username}_${modalValue.file.name}`}
                      </ModalHeader>
                      <ModalBody>
                        <div className="relative bg-black w-full h-96">
                          <img
                            src={modalValue.preview}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </ModalBody>
                      <ModalFooter className="justify-between">
                        <p className="text-sm text-gray-500">
                          size: {Math.floor(modalValue.file.size / 1024)} KB
                        </p>
                        <Button color="danger" onPress={onClose}>
                          Close
                        </Button>
                      </ModalFooter>
                    </>
                  )}
                </ModalContent>
              </Modal>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default CvTest;
