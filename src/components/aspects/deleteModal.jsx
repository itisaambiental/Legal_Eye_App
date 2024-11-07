/* eslint-disable react/prop-types */
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Spinner } from '@nextui-org/react';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

/**
 * DeleteModal component for Aspects
 * 
 * This component displays a modal dialog to confirm the deletion of one or multiple aspects.
 * It includes options to proceed with deletion or cancel the action, with appropriate feedback 
 * displayed to the user upon success or failure.
 * 
 * @component
 * @param {Object} props - Component properties.
 * @param {boolean} props.showDeleteModal - Controls whether the modal is visible.
 * @param {Function} props.closeDeleteModal - Function to close the modal.
 * @param {Function} props.setIsDeletingBatch - Function to set the loading state for batch deletion.
 * @param {boolean} props.isDeletingBatch - Indicates whether the deletion process is ongoing.
 * @param {Set|string} props.selectedKeys - Set of selected aspect IDs for deletion or "all" for all aspects.
 * @param {Array} props.aspects - Array of all aspect objects.
 * @param {Function} props.deleteAspectsBatch - Function to delete multiple aspects by their IDs.
 * @param {Function} props.setShowDeleteModal - Function to control the visibility of the modal.
 * @param {Function} props.setSelectedKeys - Function to reset selected aspects after deletion.
 * @param {string} props.check - URL or path for the success icon displayed on toast notifications.
 * 
 * @returns {JSX.Element} Rendered DeleteModal component with deletion confirmation and feedback.
 */

function DeleteModal({ showDeleteModal, closeDeleteModal, setIsDeletingBatch, isDeletingBatch, selectedKeys, aspects, deleteAspectsBatch, setShowDeleteModal, setSelectedKeys, check }) {

    const handleDeleteBatch = useCallback(async () => {
        setIsDeletingBatch(true);
        const aspectIds = selectedKeys === "all"
            ? aspects.map(aspect => aspect.id)
            : Array.from(selectedKeys).map(id => Number(id));

        try {
            const { success, error } = await deleteAspectsBatch(aspectIds);

            if (success) {
                toast.success(
                    aspectIds.length <= 1 ? 'Aspecto eliminado con éxito' : 'Aspectos eliminados con éxito',
                    {
                        icon: () => <img src={check} alt="Success Icon" />,
                        progressStyle: { background: '#113c53' },
                    }
                );
                setSelectedKeys(new Set());
                setShowDeleteModal(false);
            } else {
                switch (error) {
                    case 'Faltan campos requeridos: aspectIds':
                        toast.error('Faltan campos requeridos: aspectIds');
                        break;
                    case 'No autorizado para eliminar aspectos':
                        toast.error('No tienes autorización para eliminar estos aspectos.');
                        break;
                    case 'Uno o más aspectos no encontrados':
                        toast.error('Uno o más aspectos no fueron encontrados.');
                        break;
                    case 'Error de conexión al eliminar aspectos':
                        toast.error('Error de red. Revisa tu conexión a internet e intenta de nuevo.');
                        break;
                    case 'Error interno del servidor':
                        toast.error('Error interno del servidor. Intenta más tarde.');
                        break;
                    default:
                        toast.error('Ocurrió un error inesperado al eliminar los aspectos. Intenta nuevamente.');
                }
            }
        } catch (error) {
            console.error(error);
            toast.error('Algo salió mal al eliminar los aspectos. Intente de nuevo');
        } finally {
            setIsDeletingBatch(false);
        }
    }, [selectedKeys, deleteAspectsBatch, aspects, setIsDeletingBatch, setSelectedKeys, setShowDeleteModal, check]);

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
                                ? "¿Estás seguro de que deseas eliminar TODOS los aspectos?"
                                : selectedKeys.size <= 1
                                    ? "¿Estás seguro de que deseas eliminar este aspecto?"
                                    : "¿Estás seguro de que deseas eliminar estos aspectos?"}
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
