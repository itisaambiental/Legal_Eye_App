import PropTypes from "prop-types";
import { useState, useCallback } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from "@heroui/react";
import { toast } from "react-toastify";
import Progress from './sendProgress/Progress.jsx';

/**
 * SendModal component
 *
 * This modal allows users to confirm and send one or multiple Legal Basis entries to ACM Suite.
 * If the send action is successful, a progress component is displayed to track the background job.
 * It handles loading states, success/error feedback through toast notifications, and manages modal transitions.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Object} props.config - Configuration object for the component.
 * @param {boolean} props.config.showSendModal - Controls whether the modal is visible.
 * @param {Function} props.config.closeSendModal - Function to close the modal.
 * @param {Function} props.config.sendLegalBasis - Function to send selected Legal Basis entries.
 * @param {Set|string} props.config.selectedKeys - Selected item IDs to send or "all" for sending all.
 * @param {Function} props.config.setSelectedKeys - Function to reset selected items after sending.
 * @param {string} props.config.check - URL or path for the success icon displayed in toast notifications.
 *
 * @returns {JSX.Element} Rendered SendModal component with send confirmation and background job progress.
 */
function SendModal({ config }) {
    const {
        showSendModal,
        closeSendModal,
        sendLegalBasis,
        selectedKeys,
        setSelectedKeys,
        check,
    } = config;

    const [isLoading, setIsLoading] = useState(false);
    const [showProgress, setShowProgress] = useState(false);
    const [jobId, setJobId] = useState(null);

    const onClose = () => {
        setJobId(null);
        setShowProgress(false);
        setSelectedKeys(new Set());
        closeSendModal();
    };

    const onComplete = () => {
        setJobId(null);
        setShowProgress(false);
        setSelectedKeys(new Set());
        closeSendModal();
    };

    const handleSend = useCallback(async () => {
        setIsLoading(true);
        try {
            const idsToSend = selectedKeys === "all" ? "all" : Array.from(selectedKeys);
            const { success, jobId, error } = await sendLegalBasis({ legalBasisIds: idsToSend });

            if (success) {
                toast.info(
                    selectedKeys.size === 1
                        ? "Fundamento Legal enviado exitosamente."
                        : "Fundamentos Legales enviados exitosamente.",
                    {
                        icon: () => <img src={check} alt="Ícono de éxito" />,
                        progressStyle: {
                            background: "#113c53",
                        },
                    }
                );
                setJobId(jobId);
                setShowProgress(true);
            } else {
                toast.error(error);
            }
        } catch (err) {
            console.error(err);
            toast.error("Algo salió mal al enviar los fundamentos legales. Inténtalo de nuevo.");
        } finally {
            setIsLoading(false);
        }
    }, [sendLegalBasis, selectedKeys, check]);

    return (
        <Modal
            isOpen={showSendModal}
            onOpenChange={onClose}
            backdrop="opaque"
            placement="center"
            hideCloseButton={true}
            isDismissable={!showProgress}
            isKeyboardDismissDisabled={showProgress}
            classNames={{
                closeButton: "hover:bg-primary/20 text-primary active:bg-primary/10",
            }}
        >
            <ModalContent>
                {showProgress ? (
                    <Progress
                        jobId={jobId}
                        onComplete={onComplete}
                        onClose={onClose}
                        labelTop="Cuando se termine el proceso se te notificará vía correo electrónico."
                        labelButton="Cerrar"
                    />
                ) : (
                    <>
                        <ModalHeader className="text-center">
                            {selectedKeys === "all"
                                ? "¿Estás seguro de que deseas enviar TODOS los Fundamentos Legales a ACM Suite?"
                                : selectedKeys.size <= 1
                                    ? "¿Estás seguro de que deseas enviar este Fundamento Legal a ACM Suite?"
                                    : "¿Estás seguro de que deseas enviar estos Fundamentos Legales a ACM Suite?"}
                        </ModalHeader>
                        <ModalBody className="text-center">
                            <p className="mb-5 text-lg font-normal text-primary">
                                Esta acción no se puede deshacer. Por favor, confirma si deseas continuar.
                            </p>
                        </ModalBody>
                        <ModalFooter className="flex justify-center">
                            <Button
                                onPress={handleSend}
                                color="primary"
                                isLoading={isLoading}
                                className="text-white bg-primary hover:bg-primary/90 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 mr-3"
                                auto
                            >
                                Sí, enviar
                            </Button>
                            <Button
                                onPress={onClose}
                                color="default"
                                variant="light"
                                className="py-2.5 px-5 text-sm font-medium text-primary bg-white rounded-lg border border-gray-200 hover:bg-primary/10 hover:text-primary"
                                auto
                                isDisabled={isLoading}
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
        sendLegalBasis: PropTypes.func.isRequired,
        selectedKeys: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.instanceOf(Set),
        ]).isRequired,
        setSelectedKeys: PropTypes.func.isRequired,
        check: PropTypes.string.isRequired,
    }).isRequired,
};

export default SendModal;
