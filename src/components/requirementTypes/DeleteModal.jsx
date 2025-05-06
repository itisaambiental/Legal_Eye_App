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
 * DeleteModal component for Requirement Types
 *
 * This component displays a modal dialog to confirm the deletion of one or multiple requirement types.
 * It includes options to proceed with deletion or cancel the action, with appropriate feedback displayed
 * to the user upon success or failure.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Object} props.config - Configuration object for the component.
 * @returns {JSX.Element} Rendered DeleteModal component
 */
function DeleteModal({ config }) {
  const {
    showDeleteModal,
    closeDeleteModal,
    setIsDeletingBatch,
    isDeletingBatch,
    selectedKeys,
    requirementTypes,
    deleteRequirementTypesBatch,
    setSelectedKeys,
    check,
  } = config;

  const handleDeleteBatch = useCallback(async () => {
    setIsDeletingBatch(true);
    const idsToDelete =
      selectedKeys === "all"
        ? requirementTypes.map((item) => item.id)
        : Array.from(selectedKeys).map((id) => Number(id));

    try {
      const { success, error } = await deleteRequirementTypesBatch(idsToDelete);

      if (success) {
        toast.info(
          idsToDelete.length <= 1
            ? "Tipo de requerimiento eliminado con éxito"
            : "Tipos de requerimiento eliminados con éxito",
          {
            icon: () => <img src={check} alt="Success Icon" />,
            progressStyle: { background: "#113c53" },
          }
        );
        setSelectedKeys(new Set());
        closeDeleteModal();
      } else {
        toast.error(error || "No se pudo completar la eliminación.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Ocurrió un error al eliminar los tipos de requerimiento.");
    } finally {
      setIsDeletingBatch(false);
    }
  }, [
    selectedKeys,
    deleteRequirementTypesBatch,
    requirementTypes,
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
      hideCloseButton={true}
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
                ? "¿Deseas eliminar TODOS los tipos de requerimiento?"
                : selectedKeys.size <= 1
                ? "¿Deseas eliminar este tipo de requerimiento?"
                : "¿Deseas eliminar estos tipos de requerimiento?"}
            </ModalHeader>
            <ModalBody className="text-center">
              <p className="mb-5 text-lg font-normal text-primary">
                Esta acción no se puede deshacer. Por favor, confirma si deseas continuar.
              </p>
            </ModalBody>
            <ModalFooter className="flex justify-center">
              <Button
                onPress={handleDeleteBatch}
                color="primary"
                isDisabled={isDeletingBatch}
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
                isDisabled={isDeletingBatch}
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
    requirementTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
    deleteRequirementTypesBatch: PropTypes.func.isRequired,
    setSelectedKeys: PropTypes.func.isRequired,
    check: PropTypes.string.isRequired,
  }).isRequired,
};

export default DeleteModal;
