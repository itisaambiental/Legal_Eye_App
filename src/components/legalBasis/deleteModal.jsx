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
 * DeleteModal component
 *
 * This component displays a modal dialog to confirm the deletion of one or multiple legal basis.
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
 * @param {Set|string} props.config.selectedKeys - Set of selected legalBasis IDs for deletion or "all" for all legalBasis.
 * @param {Array} props.config.legalBasis - Array of all legalBasis objects.
 * @param {Function} props.config.deleteLegalBasisBatch - Function to delete multiple legalBasis by their IDs.
 * @param {Function} props.config.setSelectedKeys - Function to reset selected legalBasis after deletion.
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
    legalBasis,
    deleteLegalBasisBatch,
    setSelectedKeys,
    check,
  } = config;

  const handleDeleteBatch = useCallback(async () => {
    setIsDeletingBatch(true);
    const legalBasisIds =
      selectedKeys === "all"
        ? legalBasis.map((legalBase) => legalBase.id)
        : Array.from(selectedKeys).map((id) => Number(id));
    try {
      const { success, error } = await deleteLegalBasisBatch(legalBasisIds);
      if (success) {
        toast.info(
          legalBasisIds.length <= 1
            ? "Fundamento legal eliminado con éxito"
            : "Fundamentos legales eliminados con éxito",
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
      toast.error(
        "Algo salió mal al eliminar los fundamentos legales. Intente de nuevo"
      );
    } finally {
      setIsDeletingBatch(false);
    }
  }, [
    selectedKeys,
    deleteLegalBasisBatch,
    legalBasis,
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
                ? "¿Estás seguro de que deseas eliminar TODOS los Fundamentos Legales?"
                : selectedKeys.size <= 1
                ? "¿Estás seguro de que deseas eliminar este Fundamento Legal?"
                : "¿Estás seguro de que deseas eliminar estos Fundamentos Legales?"}
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
      PropTypes.string,
      PropTypes.instanceOf(Set),
    ]).isRequired,
    legalBasis: PropTypes.array.isRequired,
    deleteLegalBasisBatch: PropTypes.func.isRequired,
    setSelectedKeys: PropTypes.func.isRequired,
    check: PropTypes.string.isRequired,
  }).isRequired,
};

export default DeleteModal;
