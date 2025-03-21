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
 * CreateModal component for Subjects
 *
 * This component provides a form for creating a new subject, including a field for the subject name.
 * Validation is performed for the required field, and appropriate error messages are shown.
 * The form submission triggers the addSubject function to create the subject, and feedback is
 * displayed to the user based on the response.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Object} props.config - Configuration object for the component.
 * @param {boolean} props.config.isOpen - Controls whether the modal is open.
 * @param {Function} props.config.closeModalCreate - Function to close the modal.
 * @param {Function} props.config.addSubject - Function to add a new subject.
 * @param {string|null} props.config.nameError - Error message for the subject name input field.
 * @param {Function} props.config.setNameError - Setter function for nameError.
 * @param {Function} props.config.handleNameChange - Handler for subject name input change.
 * @param {Object} props.config.formData - Form data containing the subject name.
 *
 * @returns {JSX.Element} Rendered CreateModal component with form elements and validation.
 */
function CreateModal({ config }) {
  const {
    isOpen,
    closeModalCreate,
    addSubject,
    nameError,
    setNameError,
    handleNameChange,
    formData,
  } = config;

  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async (e) => {
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
      const { success, error } = await addSubject(formData.name);
      if (success) {
        toast.info("La materia ha sido registrada correctamente", {
          icon: () => <img src={check} alt="Success Icon" />,
          progressStyle: { background: "#113c53" },
        });
        closeModalCreate();
      } else {
        toast.error(error);
      }
    } catch (error) {
      console.error(error);
      toast.error("Algo salió mal al crear la materia. Intenta de nuevo");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={closeModalCreate}
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
              Registrar Nueva Materia
            </ModalHeader>
            <ModalBody>
              <form onSubmit={handleCreate}>
                <div className="grid gap-4 mb-4 grid-cols-1">
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
                      Nombre de la Materia
                    </label>
                    {nameError && (
                      <p className="mt-2 text-sm text-red">{nameError}</p>
                    )}
                  </div>
                </div>
                <div>
                <Button
                  type="submit"
                  color="primary"
                  disabled={isLoading}
                  className="w-full rounded border mb-4 border-primary bg-primary p-3 text-white transition hover:bg-opacity-90"
                >
                  {isLoading ? (
                    <Spinner size="sm" color="white" />
                  ) : (
                    "Registrar Materia"
                  )}
                </Button>
                </div>
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
    addSubject: PropTypes.func.isRequired,
    nameError: PropTypes.string,
    setNameError: PropTypes.func.isRequired,
    handleNameChange: PropTypes.func.isRequired,
    formData: PropTypes.shape({
        name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default CreateModal;
