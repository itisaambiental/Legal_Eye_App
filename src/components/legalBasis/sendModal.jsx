import PropTypes from "prop-types";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Spinner,
} from "@heroui/react";
import { useCallback } from "react";
import { toast } from "react-toastify";

/**
 * SendModal component
 *
 * This component displays a modal dialog to confirm sending one or multiple items.
 * It includes options to proceed with sending or cancel the action, with appropriate feedback
 * displayed to the user upon success or failure.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Object} props.config - Configuration object for the component.
 * @param {boolean} props.config.showSendModal - Controls whether the modal is visible.
 * @param {Function} props.config.closeSendModal - Function to close the modal.
 * @param {Function} props.config.setIsSendingBatch - Function to set the loading state for batch sending.
 * @param {boolean} props.config.isSendingBatch - Indicates whether the sending process is ongoing.
 * @param {Set|string} props.config.selectedKeys - Set of selected item IDs for sending or "all" for all items.
 * @param {Array} props.config.items - Array of all items to send.
 * @param {Function} props.config.sendItemsBatch - Function to send multiple items by their IDs.
 * @param {Function} props.config.setSelectedKeys - Function to reset selected items after sending.
 * @param {string} props.config.check - URL or path for the success icon displayed on toast notifications.
 *
 * @returns {JSX.Element} Rendered SendModal component with sending confirmation and feedback.
 */

function SendModal({ config }) {
    const {
        showSendModal,
        closeSendModal,
        setIsSendingBatch,
        isSendingBatch,
        selectedKeys,
        items,
        sendItemsBatch,
        setSelectedKeys,
        check,
    } = config;

    const handleSendBatch = useCallback(async () => {
        setIsSendingBatch(true);
        const itemIds =
            selectedKeys === "all"
                ? items.map((item) => item.id)
                : Array.from(selectedKeys).map((id) => Number(id));
        try {
            const { success, error } = await sendItemsBatch(itemIds);
            if (success) {
                toast.info(
                    itemIds.length <= 1
                        ? "Fundamento legal enviado con éxito"
                        : "Fundamentos legales enviados con éxito",
                    {
                        icon: () => <img src={check} alt="Success Icon" />,
                        progressStyle: { background: "#113c53" },
                    }
                );
                setSelectedKeys(new Set());
                closeSendModal();
            } else {
                toast.error(error);
            }
        } catch (error) {
            console.error(error);
            toast.error(
                "Algo salió mal al enviar los fundamentos legales. Intente de nuevo."
            );
        } finally {
            setIsSendingBatch(false);
        }
    }, [
        selectedKeys,
        sendItemsBatch,
        items,
        setIsSendingBatch,
        setSelectedKeys,
        closeSendModal,
        check,
    ]);

    return (
        <Modal
            isOpen={showSendModal}
            onOpenChange={closeSendModal}
            backdrop="opaque"
            placement="center"
            isDismissable={false}
            classNames={{
                closeButton: "hover:bg-primary/20 text-primary active:bg-primary/10",
            }}
        >
            <ModalContent>
                {() => (
                    <>
                        <ModalHeader className="text-center">
                            {selectedKeys === "all"
                                ? "¿Estás seguro de que deseas enviar TODOS los Fundamentos Legales?"
                                : selectedKeys.size <= 1
                                    ? "¿Estás seguro de que deseas enviar este Fundamento Legal?"
                                    : "¿Estás seguro de que deseas enviar estos Fundamentos Legales?"}
                        </ModalHeader>
                        <ModalBody className="text-center">
                            <p className="mb-5 text-lg font-normal text-primary">
                                Esta acción no se puede deshacer. Por favor, confirme si desea
                                continuar.
                            </p>
                        </ModalBody>
                        <ModalFooter className="flex justify-center">
                            <Button
                                onPress={handleSendBatch}
                                color="primary"
                                isDisabled={isSendingBatch}
                                className="text-white bg-primary hover:bg-primary/90 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 mr-3"
                                auto
                            >
                                {isSendingBatch ? (
                                    <Spinner size="sm" color="white" />
                                ) : (
                                    "Sí, enviar"
                                )}
                            </Button>
                            <Button
                                onPress={closeSendModal}
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

SendModal.propTypes = {
    config: PropTypes.shape({
        showSendModal: PropTypes.bool.isRequired,
        closeSendModal: PropTypes.func.isRequired,
        setIsSendingBatch: PropTypes.func.isRequired,
        isSendingBatch: PropTypes.bool.isRequired,
        selectedKeys: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.instanceOf(Set),
        ]).isRequired,
        items: PropTypes.array.isRequired,
        sendItemsBatch: PropTypes.func.isRequired,
        setSelectedKeys: PropTypes.func.isRequired,
        check: PropTypes.string.isRequired,
    }).isRequired,
};

export default SendModal;
