import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Spinner,
  Button
} from "@heroui/react";
import check from "../../assets/check.png";

/**
 * CreateModal component for Aspects
 *
 * This component renders a modal form to register a new aspect.
 * It validates the required fields: name, order (numeric and > 0), and abbreviation.
 * On form submission, it calls the `addAspect` function and displays success or error notifications.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Object} props.config - Configuration object for the component.
 * @param {boolean} props.config.isOpen - Controls whether the modal is open.
 * @param {Function} props.config.closeModalCreate - Function to close the modal.
 * @param {Function} props.config.addAspect - Function to add a new aspect.
 * @param {string|null} props.config.nameError - Error message for the name input field.
 * @param {Function} props.config.setNameError - Setter function for nameError.
 * @param {Function} props.config.handleNameChange - Handler for name input change.
 * @param {string|null} props.config.orderError - Error message for the order input field.
 * @param {Function} props.config.setOrderError - Setter for orderError.
 * @param {Function} props.config.handleOrderChange - Handler for order input change.
 * @param {string|null} props.config.abbreviationError - Error message for the abbreviation input field.
 * @param {Function} props.config.setAbbreviationError - Setter for abbreviationError.
 * @param {Function} props.config.handleAbbreviationChange - Handler for abbreviation input change.
 * @param {Object} props.config.formData - Form data containing the aspect details.
 *
 * @returns {JSX.Element} Rendered CreateModal component with form elements and validation.
 */
function CreateModal({ config }) {
  const {
    isOpen,
    closeModalCreate,
    addAspect,
    nameError,
    setNameError,
    handleNameChange,
    orderError,
    setOrderError,
    handleOrderChange,
    abbreviationError,
    setAbbreviationError,
    handleAbbreviationChange,
    formData,
  } = config;

  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async (e) => {
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
      const { success, error } = await addAspect({
        subjectId: formData.subject_id,
        aspectName: formData.name,
        order: formData.order,
        abbreviation: formData.abbreviation,
      });

      if (success) {
        toast.info("El aspecto ha sido registrado correctamente", {
          icon: () => <img src={check} alt="Success Icon" />,
          progressStyle: {
            background: "#113c53",
          },
        });
        closeModalCreate();
      } else {
        toast.error(error);
      }
    } catch (error) {
      console.error(error);
      toast.error("Algo salió mal al registrar el aspecto. Intenta de nuevo");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={closeModalCreate}
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
            <ModalHeader className="flex flex-col gap-1">
              Registrar Nuevo Aspecto
            </ModalHeader>
            <ModalBody>
              <form onSubmit={handleCreate}>
                <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="relative z-0 w-full group">
                    <input
                      type="number"
                      name="order"
                      id="floating_order"
                      value={formData.order}
                      onChange={handleOrderChange}
                      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer"
                      placeholder=" "
                    />
                    <label
                      htmlFor="floating_order"
                      className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 peer-focus:left-0 peer-focus:text-primary peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                      Orden
                    </label>
                    {orderError && (
                      <p className="mt-2 text-sm text-red">{orderError}</p>
                    )}
                  </div>

                  <div className="relative z-0 w-full group">
                    <input
                      type="text"
                      name="abbreviation"
                      id="floating_abbreviation"
                      value={formData.abbreviation}
                      onChange={handleAbbreviationChange}
                      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer"
                      placeholder=" "
                    />
                    <label
                      htmlFor="floating_abbreviation"
                      className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 peer-focus:left-0 peer-focus:text-primary peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                      Abreviatura
                    </label>
                    {abbreviationError && (
                      <p className="mt-2 text-sm text-red">{abbreviationError}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 mb-4 grid-cols-1">
                  <div className="relative z-0 w-full group">
                    <input
                      type="text"
                      name="name"
                      id="floating_name"
                      value={formData.name}
                      onChange={handleNameChange}
                      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer"
                      placeholder=" "
                    />
                    <label
                      htmlFor="floating_name"
                      className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 peer-focus:left-0 peer-focus:text-primary peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                      Nombre del Aspecto
                    </label>
                    {nameError && (
                      <p className="mt-2 text-sm text-red">{nameError}</p>
                    )}
                  </div>
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
                    "Registrar Aspecto"
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

CreateModal.propTypes = {
  config: PropTypes.shape({
    isOpen: PropTypes.bool.isRequired,
    closeModalCreate: PropTypes.func.isRequired,
    addAspect: PropTypes.func.isRequired,
    nameError: PropTypes.string,
    setNameError: PropTypes.func.isRequired,
    handleNameChange: PropTypes.func.isRequired,
    orderError: PropTypes.string,
    setOrderError: PropTypes.func.isRequired,
    handleOrderChange: PropTypes.func.isRequired,
    abbreviationError: PropTypes.string,
    setAbbreviationError: PropTypes.func.isRequired,
    handleAbbreviationChange: PropTypes.func.isRequired,
    formData: PropTypes.shape({
      name: PropTypes.string.isRequired,
      order: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      abbreviation: PropTypes.string.isRequired,
      subject_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    }).isRequired,
  }).isRequired,
};

export default CreateModal;
