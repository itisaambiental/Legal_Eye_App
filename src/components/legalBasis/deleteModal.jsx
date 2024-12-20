/* eslint-disable react/prop-types */
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Spinner } from '@nextui-org/react';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

/**
 * DeleteModal component
 * 
 * This component displays a modal dialog to confirm the deletion of one or multiple legal basis.
 * It includes options to proceed with deletion or cancel the action, with appropriate feedback 
 * displayed to the user upon success or failure.
 * 
 * @component
 * @param {Object} props - Component properties.
 * @param {boolean} props.showDeleteModal - Controls whether the modal is visible.
 * @param {Function} props.closeDeleteModal - Function to close the modal.
 * @param {Function} props.setIsDeletingBatch - Function to set the loading state for batch deletion.
 * @param {boolean} props.isDeletingBatch - Indicates whether the deletion process is ongoing.
 * @param {Set|string} props.selectedKeys - Set of selected legalBasis IDs for deletion or "all" for all legalBasis.
 * @param {Array} props.legalBasis - Array of all legalBasis objects.
 * @param {Function} props.deleteLegalBasisBatch - Function to delete multiple legalBasis by their IDs.
 * @param {Function} props.setSelectedKeys - Function to reset selected legalBasis after deletion.
 * @param {string} props.check - URL or path for the success icon displayed on toast notifications.
 * 
 * @returns {JSX.Element} Rendered DeleteModal component with deletion confirmation and feedback.
 */

function DeleteModal({ showDeleteModal, closeDeleteModal, setIsDeletingBatch, isDeletingBatch, selectedKeys, legalBasis, deleteLegalBasisBatch, setSelectedKeys, check }) {

    const handleDeleteBatch = useCallback(async () => {
        setIsDeletingBatch(true);
        const legalBasisIds = selectedKeys === "all"
            ? legalBasis.map(legalBase => legalBase.id)
            : Array.from(selectedKeys).map(id => Number(id));

        try {
            const { success, error } = await deleteLegalBasisBatch(legalBasisIds);

            if (success) {
                toast.success(
                    legalBasisIds.length <= 1 ? 'Fundamento legal eliminado con éxito' : 'Fundamentos legales eliminados con éxito',
                    {
                        icon: () => <img src={check} alt="Success Icon" />,
                        progressStyle: { background: '#113c53' },
                    }
                );
                setSelectedKeys(new Set());
                closeDeleteModal();
            } else {
                toast.error(error)
            }
        } catch (error) {
            console.error(error);
            toast.error('Algo salió mal al eliminar los fundamentos legales. Intente de nuevo');
        } finally {
            setIsDeletingBatch(false);
        }
    }, [selectedKeys, deleteLegalBasisBatch, legalBasis, setIsDeletingBatch, setSelectedKeys, closeDeleteModal, check]);

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
                {() => (
                    <>
                        <ModalHeader className="text-center">
                            {selectedKeys === "all"
                                ? "¿Estás seguro de que deseas eliminar TODos los Fundamentos Legales?"
                                : selectedKeys.size <= 1
                                    ? "¿Estás seguro de que deseas eliminar este Fundamento Legal?"
                                    : "¿Estás seguro de que deseas eliminar estos Fundamentos Legales?"}
                        </ModalHeader>
                        <ModalBody className="text-center">
                            <p className="mb-5 text-lg font-normal text-primary">
                                Esta acción no se puede deshacer. Por favor, confirme si desea continuar.
                            </p>
                        </ModalBody>
                        <ModalFooter className="flex justify-center">
                            <Button
                                onPress={handleDeleteBatch}
                                color="primary"
                                className="text-white bg-primary hover:bg-primary/90 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 mr-3"
                                auto
                            >
                                {isDeletingBatch ? <Spinner size="sm" color="white" /> : 'Sí, estoy seguro'}
                            </Button>
                            <Button
                                onPress={closeDeleteModal}
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
