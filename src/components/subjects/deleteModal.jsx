import PropTypes from "prop-types";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
} from "@nextui-org/react";
import { useCallback } from "react";
import { toast } from "react-toastify";

/**
 * DeleteModal component
 *
 * This component displays a modal dialog to confirm the deletion of one or multiple subjects.
 * It includes options to proceed with deletion or cancel the action, with appropriate feedback
 * displayed to the user upon success or failure.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Object} props.config - Configuration object for the component.
 * @param {boolean} props.config.showDeleteModal - Controls whether the modal is visible.
 * @param {Function} props.config.closeDeleteModal - Function to close the modal.
 * @param {Function} props.config.setIsDeletingBatch - Function to set the loading state for batch deletion.
 * @param {boolean} props.config.isDeletingBatch - Indicates whether the deletion process is ongoing.
 * @param {Set|string} props.config.selectedKeys - Set of selected subject IDs for deletion or "all" for all subjects.
 * @param {Array} props.config.subjects - Array of all subject objects.
 * @param {Function} props.config.deleteSubjectsBatch - Function to delete multiple subjects by their IDs.
 * @param {Function} props.config.setSelectedKeys - Function to reset selected subjects after deletion.
 * @param {string} props.config.check - URL or path for the success icon displayed on toast notifications.
 *
 * @returns {JSX.Element} Rendered DeleteModal component with deletion confirmation and feedback.
 */
function DeleteModal({ config }) {
  const {
    showDeleteModal,
    closeDeleteModal,
    setIsDeletingBatch,
    isDeletingBatch,
    selectedKeys,
    subjects,
    deleteSubjectsBatch,
    setSelectedKeys,
    check,
  } = config;

  const handleDeleteBatch = useCallback(async () => {
    setIsDeletingBatch(true);
    const subjectIds =
      selectedKeys === "all"
        ? subjects.map((subject) => subject.id)
        : Array.from(selectedKeys).map((id) => Number(id));

    try {
      const { success, error } = await deleteSubjectsBatch(subjectIds);
      if (success) {
        toast.info(
          subjectIds.length <= 1
            ? "Materia eliminada con éxito"
            : "Materias eliminadas con éxito",
          {
            icon: () => <img src={check} alt="Success Icon" />,
            progressStyle: { background: "#113c53" },
          }
        );
        setSelectedKeys(new Set());
        closeDeleteModal();
      } else {
        toast.error(error);
      }
    } catch (error) {
      console.error(error);
      toast.error("Algo salió mal al eliminar las materias. Intente de nuevo");
    } finally {
      setIsDeletingBatch(false);
    }
  }, [
    selectedKeys,
    deleteSubjectsBatch,
    subjects,
    setIsDeletingBatch,
    setSelectedKeys,
    closeDeleteModal,
    check,
  ]);

  return (
    <Modal
      isOpen={showDeleteModal}
      onOpenChange={closeDeleteModal}
      backdrop="opaque"
      placement="center"
      classNames={{
        closeButton: "hover:bg-primary/20 text-primary active:bg-primary/10",
      }}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="text-center">
              {selectedKeys === "all"
                ? "¿Estás seguro de que deseas eliminar TODAS las materias?"
                : selectedKeys.size <= 1
                ? "¿Estás seguro de que deseas eliminar esta materia?"
                : "¿Estás seguro de que deseas eliminar estas materias?"}
            </ModalHeader>
            <ModalBody className="text-center">
              <p className="mb-5 text-lg font-normal text-primary">
                Esta acción no se puede deshacer. Por favor, confirme si desea
                continuar.
              </p>
            </ModalBody>
            <ModalFooter className="flex justify-center">
              <Button
                onPress={handleDeleteBatch}
                color="primary"
                className="text-white bg-primary hover:bg-primary/90 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 mr-3"
                auto
              >
                {isDeletingBatch ? (
                  <Spinner size="sm" color="white" />
                ) : (
                  "Sí, estoy seguro"
                )}
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

DeleteModal.propTypes = {
  config: PropTypes.shape({
    showDeleteModal: PropTypes.bool.isRequired,
    closeDeleteModal: PropTypes.func.isRequired,
    setIsDeletingBatch: PropTypes.func.isRequired,
    isDeletingBatch: PropTypes.bool.isRequired,
    selectedKeys: PropTypes.oneOfType([
      PropTypes.instanceOf(Set),
      PropTypes.string,
    ]).isRequired,
    subjects: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
      })
    ).isRequired,
    deleteSubjectsBatch: PropTypes.func.isRequired,
    setSelectedKeys: PropTypes.func.isRequired,
    check: PropTypes.string.isRequired,
  }).isRequired,
};

export default DeleteModal;
