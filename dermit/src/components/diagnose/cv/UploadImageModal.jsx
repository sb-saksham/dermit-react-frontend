import React from "react";
const { isOpen, onOpen, onOpenChange } = useDisclosure();

const UploadImageModal = () => {
  return (
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
  );
};

export default UploadImageModal;
