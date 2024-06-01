import { useState } from "react";
import { MdOutlineCancel } from "react-icons/md";
import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";
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

const UploadImage = ({ filesList, user, removeImage }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [modalValue, setModalValue] = useState({});
  const handleModalValue = (image) => {
    setModalValue(image);
  };
  return (
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
                <SwiperSlide key={index}>
                  <div
                    
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
                          {image.file.name.slice(-5, image.file.name.length)}
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
  );
};

export default UploadImage;
