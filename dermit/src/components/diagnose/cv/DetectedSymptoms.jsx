
import { useState } from "react";
import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";
import { MdOutlineCancel } from "react-icons/md";
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



const DetectedSymptoms = ({resp}) => {

    const symptomsURL = "http://localhost:8000/static/chat/images/output";
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [modalValue, setModalValue] = useState({});
    const handleModalValue = (image) => {
        setModalValue(image);
      };

  return (
    <div className="p-[30px] rounded-lg shadow-md bg-white gap-[30px] flex flex-col w-[38vw] min-h-[413px]">
    <p className="font-semibold text-4xl text-center">
      Detected Symptoms
    </p>
    <div className="flex w-full text-primaryGreen justify-between items-center">
      <IoIosArrowDropleft size={45} className={`prev cursor-pointer`} />
      <IoIosArrowDropright size={45} className={`next cursor-pointer`} />
    </div>
    {resp.length > 0 && (
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
          {resp.map((data, index) => {
            return (
              <SwiperSlide key={index}>
                <div
                  
                  className="bg-primaryGreen h-52 relative w-full font-semibold flex flex-col rounded-md"
                >
                  <img
                    src={`${symptomsURL}/${data.img_name}`}
                    alt="image container"
                    className="object-cover absolute h-full w-full z-10 rounded-md"
                  />
                  <div className="flex h-full flex-col justify-between items-start p-2 bg-black/30 z-20 relative text-white rounded-md">
                    <div className="">
                      <p>
                        {truncate(`${data.img_name}`, {
                          length: 15,
                        })}
                        {data.img_name.slice(-5, data.img_name.length)}
                      </p>
                    </div>
                    <button
                      className="w-full py-1 bg-white text-black text-center rounded-md"
                      onClick={() => {
                        handleModalValue(data);
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
                  {`${modalValue.img_name}`}
                </ModalHeader>
                <ModalBody>
                  <div className="relative bg-black w-full h-96">
                    <img
                      src={`${symptomsURL}/${modalValue.img_name}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </ModalBody>
                <ModalFooter className="justify-between">
                  <p className="text-sm text-gray-500">
                    detected classes:
                    {modalValue.cls_name.map((cls, index) => {
                      return <span key={index}>{" "}{cls} {" "}</span>;
                    })}
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
  )
}

export default DetectedSymptoms