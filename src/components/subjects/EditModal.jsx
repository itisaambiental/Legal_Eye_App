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
 * EditModal component for Subjects
 *
 * This component renders a modal form to edit an existing subject.
 * It validates the required fields: name, order (numeric and > 0), and abbreviation.
 * On submission, it calls the `updateSubject` function and shows success or error messages.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Object} props.config - Modal configuration object.
 * @param {Object} props.config.formData - Current form data of the subject.
 * @param {Function} props.config.setFormData - Setter for the form data.
 * @param {boolean} props.config.isOpen - Indicates if the modal is open.
 * @param {Function} props.config.updateSubject - Function to update the subject.
 * @param {Function} props.config.closeModalEdit - Function to close the modal.
 * @param {Object} props.config.selectedSubject - The subject being edited.
 * @param {string|null} props.config.nameError - Error message for the name field.
 * @param {Function} props.config.setNameError - Setter for name error.
 * @param {Function} props.config.handleNameChange - Handler for name input changes.
 * @param {string|null} props.config.orderError - Error message for the order field.
 * @param {Function} props.config.setOrderError - Setter for order error.
 * @param {Function} props.config.handleOrderChange - Handler for order input changes.
 * @param {string|null} props.config.abbreviationError - Error message for the abbreviation field.
 * @param {Function} props.config.setAbbreviationError - Setter for abbreviation error.
 * @param {Function} props.config.handleAbbreviationChange - Handler for abbreviation input changes.
 *
 * @returns {JSX.Element} Rendered EditModal component.
 */
function EditModal({ config }) {
  const {
    formData,
    setFormData,
    isOpen,
    updateSubject,
    closeModalEdit,
    selectedSubject,
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
    if (selectedSubject) {
      setFormData({
        id: selectedSubject.id,
        name: selectedSubject.subject_name,
        order: selectedSubject.order_index,
        abbreviation: selectedSubject.abbreviation,
      });
    }
  }, [selectedSubject, setFormData]);

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
      const { success, error } = await updateSubject({
        id: formData.id,
        subjectName: formData.name,
        order: formData.order,
        abbreviation: formData.abbreviation,
      });

      if (success) {
        toast.info("La materia ha sido actualizada correctamente", {
          icon: () => <img src={check} alt="Success Icon" />,
          progressStyle: { background: "#113c53" },
        });
        closeModalEdit();
      } else {
        toast.error(error);
      }
    } catch (error) {
      console.error(error);
      toast.error("Algo salió mal al actualizar la materia. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={closeModalEdit}
      isDismissable={false}
      backdrop="opaque"
      placement="center"
      classNames={{
        closeButton: "hover:bg-primary/20 text-primary active:bg-primary/10",
      }}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader role="heading" className="flex flex-col gap-1">Editar Materia</ModalHeader>
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
                    Nombre de la Materia
                  </label>
                  {nameError && <p className="mt-2 text-sm text-red">{nameError}</p>}
                </div>

                <Button
                  type="submit"
                  color="primary"
                  disabled={isLoading}
                  className="w-full rounded border mb-4 border-primary bg-primary p-3 text-white transition hover:bg-opacity-90"
                >
                  {isLoading ? <Spinner size="sm" color="white" /> : "Actualizar Materia"}
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
    updateSubject: PropTypes.func.isRequired,
    closeModalEdit: PropTypes.func.isRequired,
    selectedSubject: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      subject_name: PropTypes.string,
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
