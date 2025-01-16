import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Spinner,
  Button,
} from "@nextui-org/react";
import check from "../../assets/check.png";

/**
 * EditModal component for Aspects
 *
 * This component provides a modal dialog for editing an aspect's information.
 * It includes a field for updating the aspect's name, validates the input,
 * and provides feedback to the user on the success or failure of the update operation.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Object} props.config - Configuration object for the component.
 * @param {Object} props.config.formData - Current form data for the aspect being edited.
 * @param {Function} props.config.setFormData - Function to update form data.
 * @param {boolean} props.config.isOpen - Controls whether the modal is visible.
 * @param {Function} props.config.updateAspect - Function to submit the updated aspect data.
 * @param {Function} props.config.closeModalEdit - Function to close the modal.
 * @param {Object} props.config.selectedAspect - The aspect object selected for editing.
 * @param {string} props.config.nameError - Error message for the name field, if any.
 * @param {Function} props.config.setNameError - Function to set the name error message.
 * @param {Function} props.config.handleNameChange - Function to handle changes in the name input.
 *
 * @returns {JSX.Element} Rendered EditModal component for editing aspect details.
 */
function EditModal({ config }) {
  const {
    formData,
    setFormData,
    isOpen,
    updateAspect,
    closeModalEdit,
    selectedAspect,
    nameError,
    setNameError,
    handleNameChange,
  } = config;

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedAspect) {
      setFormData({
        id: selectedAspect.id,
        name: selectedAspect.aspect_name,
      });
    }
  }, [selectedAspect, setFormData]);

  const handleEdit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.name === "") {
      setNameError("Este campo es obligatorio");
      setIsLoading(false);
      return;
    } else {
      setNameError(null);
    }

    try {
      const { success, error } = await updateAspect(
        formData.id,
        formData.name
      );
      if (success) {
        toast.info("El aspecto ha sido actualizado correctamente", {
          icon: () => <img src={check} alt="Success Icon" />,
          progressStyle: { background: "#113c53" },
        });
        closeModalEdit();
      } else {
        toast.error(error);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        "Algo mal sucedió al actualizar el aspecto. Intente de nuevo"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={closeModalEdit}
      backdrop="opaque"
      placement="center"
      classNames={{
        closeButton: "hover:bg-primary/20 text-primary active:bg-primary/10",
      }}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader role="heading" className="flex flex-col gap-1">
              Editar Aspecto
            </ModalHeader>
            <ModalBody>
              <form onSubmit={handleEdit}>
                <div className="relative z-0 w-full mb-5 group">
                  <input
                    type="text"
                    name="nombre"
                    id="floating_nombre"
                    value={formData.name}
                    onChange={handleNameChange}
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer"
                    placeholder=" "
                  />
                  <label
                    htmlFor="floating_nombre"
                    className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 peer-focus:left-0 peer-focus:text-primary peer-focus:dark:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Nombre del Aspecto
                  </label>
                  {nameError && (
                    <p className="mt-2 text-sm text-red">{nameError}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  color="primary"
                  disabled={isLoading}
                  className="w-full rounded border mb-4 border-primary bg-primary p-3 text-white transition hover:bg-opacity-90"
                >
                  {isLoading ? (
                    <Spinner size="sm" color="white" />
                  ) : (
                    "Guardar Cambios"
                  )}
                </Button>
              </form>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

EditModal.propTypes = {
  config: PropTypes.shape({
    formData: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
    setFormData: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    updateAspect: PropTypes.func.isRequired,
    closeModalEdit: PropTypes.func.isRequired,
    selectedAspect: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      aspect_name: PropTypes.string,
    }),
    nameError: PropTypes.string,
    setNameError: PropTypes.func.isRequired,
    handleNameChange: PropTypes.func.isRequired,
  }).isRequired,
};

export default EditModal;
