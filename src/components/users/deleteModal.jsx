import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Spinner } from '@nextui-org/react';

function DeleteModal({ showDeleteModal, closeDeleteModal, handleDeleteBatch, isDeletingBatch, selectedKeys }) {
    return (
        <Modal
            isOpen={showDeleteModal}
            onOpenChange={closeDeleteModal}
            backdrop="opaque"
            placement='center'
            classNames={{
                closeButton: "hover:bg-primary/20 text-primary active:bg-primary/10",
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="text-center">
                            {selectedKeys === "all"
                                ? "¿Estás seguro de que deseas eliminar TODOS los usuarios?"
                                : selectedKeys.size <= 1
                                    ? "¿Estás seguro de que deseas eliminar este usuario?"
                                    : "¿Estás seguro de que deseas eliminar estos usuarios?"}
                        </ModalHeader>
                        <ModalBody className="text-center">
                            <p className="mb-5 text-lg font-normal text-primary">
                                Esta acción no se puede deshacer. Por favor, confirme si desea continuar.
                            </p>
                        </ModalBody>
                        <ModalFooter className="flex justify-center">
                            <Button
                                onClick={handleDeleteBatch}
                                color="primary"
                                className="text-white bg-primary hover:bg-primary/90 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 mr-3"
                                auto
                            >
                                {isDeletingBatch ? <Spinner size="sm" color="white" /> : 'Sí, estoy seguro'}
                            </Button>
                            <Button
                                onClick={closeDeleteModal}
                                color="default"
                                variant="light"
                                className="py-2.5 px-5 text-sm font-medium text-primary bg-white rounded-lg border border-gray-200 hover:bg-primary/10 hover:text-primary"
                                auto
                            >
                                No, cancelar
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}

export default DeleteModal;
