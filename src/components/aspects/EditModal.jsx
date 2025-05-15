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
} from "@heroui/react";
import check from "../../assets/check.png";

/**
 * EditModal component for Aspects
 *
 * This component provides a modal dialog for editing an aspect's information.
 * It includes fields for updating the aspect's name, order and abbreviation, validates inputs,
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
 * @param {string} props.config.orderError - Error message for the order field.
 * @param {Function} props.config.setOrderError - Setter for order error state.
 * @param {Function} props.config.handleOrderChange - Handler for order input changes.
 * @param {string} props.config.abbreviationError - Error message for abbreviation field.
 * @param {Function} props.config.setAbbreviationError - Setter for abbreviation error.
 * @param {Function} props.config.handleAbbreviationChange - Handler for abbreviation input.
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
    orderError,
    setOrderError,
    handleOrderChange,
    abbreviationError,
    setAbbreviationError,
    handleAbbreviationChange,
  } = config;

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedAspect) {
      setFormData({
        id: selectedAspect.id,
        name: selectedAspect.aspect_name,
        order: selectedAspect.order_index,
        abbreviation: selectedAspect.abbreviation,
      });
    }
  }, [selectedAspect, setFormData]);

  const handleEdit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.order) {
      setOrderError("Este campo es obligatorio");
      setIsLoading(false);
      return;
    } else if (isNaN(formData.order)) {
      setOrderError("Este campo debe ser un número válido.");
      setIsLoading(false);
      return;
    } else if (Number(formData.order) <= 0) {
      setOrderError("Este campo debe ser mayor a 0.");
      setIsLoading(false);
      return;
    } else if (!Number.isInteger(Number(formData.order))) {
      setOrderError("Este campo debe ser un número entero.");
      setIsLoading(false);
      return;
    } else {
      setOrderError(null);
    }
    if (formData.abbreviation?.trim().length > 10) {
      setAbbreviationError("La abreviatura no puede tener más de 10 caracteres.");
      setIsLoading(false);
      return;
    } else {
      setAbbreviationError(null);
    }
    if (!formData.name.trim()) {
      setNameError("Este campo es obligatorio");
      setIsLoading(false);
      return;
    } else {
      setNameError(null);
    }

    try {
      const { success, error } = await updateAspect({
        id: formData.id,
        aspectName: formData.name,
        order: formData.order,
        abbreviation: formData.abbreviation,
      });

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
      toast.error("Algo salió mal al actualizar el aspecto. Intente de nuevo");
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
                <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="relative z-0 w-full group">
                    <input
                      type="number"
                      name="order"
                      id="edit_order"
                      value={formData.order}
                      onChange={handleOrderChange}
                      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer"
                      placeholder=" "
                    />
                    <label
                      htmlFor="edit_order"
                      className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 peer-focus:text-primary peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                      Orden
                    </label>
                    {orderError && <p className="mt-2 text-sm text-red">{orderError}</p>}
                  </div>

                  <div className="relative z-0 w-full group">
                    <input
                      type="text"
                      name="abbreviation"
                      id="edit_abbreviation"
                      value={formData.abbreviation}
                      onChange={handleAbbreviationChange}
                      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer"
                      placeholder=" "
                    />
                    <label
                      htmlFor="edit_abbreviation"
                      className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 peer-focus:text-primary peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                      Abreviatura
                    </label>
                    {abbreviationError && <p className="mt-2 text-sm text-red">{abbreviationError}</p>}
                  </div>
                </div>

                <div className="relative z-0 w-full mb-5 group">
                  <input
                    type="text"
                    name="name"
                    id="edit_name"
                    value={formData.name}
                    onChange={handleNameChange}
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer"
                    placeholder=" "
                  />
                  <label
                    htmlFor="edit_name"
                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 peer-focus:text-primary peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Nombre del Aspecto
                  </label>
                  {nameError && <p className="mt-2 text-sm text-red">{nameError}</p>}
                </div>

                <Button
                  type="submit"
                  color="primary"
                  disabled={isLoading}
                  className="w-full rounded border mb-4 border-primary bg-primary p-3 text-white transition hover:bg-opacity-90"
                >
                  {isLoading ? <Spinner size="sm" color="white" /> : "Actualizar Aspecto"}
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
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
      order: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      abbreviation: PropTypes.string,
    }).isRequired,
    setFormData: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    updateAspect: PropTypes.func.isRequired,
    closeModalEdit: PropTypes.func.isRequired,
    selectedAspect: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      aspect_name: PropTypes.string,
      order_index: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      abbreviation: PropTypes.string,
    }),
    nameError: PropTypes.string,
    setNameError: PropTypes.func.isRequired,
    handleNameChange: PropTypes.func.isRequired,
    orderError: PropTypes.string,
    setOrderError: PropTypes.func.isRequired,
    handleOrderChange: PropTypes.func.isRequired,
    abbreviationError: PropTypes.string,
    setAbbreviationError: PropTypes.func.isRequired,
    handleAbbreviationChange: PropTypes.func.isRequired,
  }).isRequired,
};

export default EditModal;
