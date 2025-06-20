import PropTypes from "prop-types";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Textarea,
  Button,
  Spinner,
} from "@heroui/react";
import check from "../../assets/check.png";

/**
 * CreateModal component for Requirement Types
 *
 * This component provides a form to create a new requirement type, including fields for name, description, and classification.
 * It validates the required fields and displays error messages accordingly.
 * On submit, it triggers the addRequirementTypes function, and shows feedback via toast notifications.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Object} props.config - Configuration object for the component.
 * @param {boolean} props.config.isOpen - Controls whether the modal is open.
 * @param {Function} props.config.closeModalCreate - Function to close the modal.
 * @param {Function} props.config.addRequirementType - Function to create a new requirement type.
 * @param {Object} props.config.formData - Object containing form values: name, description, classification.
 * @param {string|null} props.config.nameError - Error message for the name input field.
 * @param {string|null} props.config.descriptionError - Error message for the description input field.
 * @param {string|null} props.config.classificationError - Error message for the classification input field.
 * @param {Function} props.config.setNameError - Setter function for nameError.
 * @param {Function} props.config.setDescriptionError - Setter function for descriptionError.
 * @param {Function} props.config.setClassificationError - Setter function for classificationError.
 * @param {Function} props.config.handleNameChange - Handler for name input change.
 * @param {Function} props.config.handleDescriptionChange - Handler for description input change.
 * @param {Function} props.config.handleClassificationChange - Handler for classification input change.
 *
 * @returns {JSX.Element} Rendered CreateModal component with form inputs and validations.
 */
function CreateModal({ config }) {
  const {
    isOpen,
    closeModalCreate,
    addRequirementType,
    formData,
    nameError,
    setNameError,
    handleNameChange,
    descriptionError,
    setDescriptionError,
    handleDescriptionChange,
    classificationError,
    setClassificationError,
    handleClassificationChange,
  } = config;

  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { name, description, classification } = formData;

    if (!name.trim()) {
      setNameError("Este campo es obligatorio");
      setIsLoading(false);
      return;
    } else {
      setNameError(null);
    }

    if (!description.trim()) {
      setDescriptionError("Este campo es obligatorio");
      setIsLoading(false);
      return;
    } else {
      setDescriptionError(null);
    }

    if (!classification.trim()) {
      setClassificationError("Este campo es obligatorio");
      setIsLoading(false);
      return;
    } else {
      setClassificationError(null);
    }

    try {
      const requirementTypeData = { 
        name, 
        description, 
        classification 
      };
      const { success, error } = await addRequirementType(requirementTypeData);

      if (success) {
        toast.info("El tipo de requerimiento ha sido creado correctamente", {
          icon: () => <img src={check} alt="Success Icon" />,
          progressStyle: {
            background: "#113c53",
          },
        });
        closeModalCreate();
      } else {
        toast.error(error);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error al crear el tipo de requerimiento.");
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
              Crear Nuevo Tipo de Requerimiento
            </ModalHeader>
            <ModalBody>
              <form onSubmit={handleCreate} className="space-y-6">
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
                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Nombre
                  </label>
                  {nameError && (
                    <p className="mt-2 text-sm text-red">{nameError}</p>
                  )}
                </div>

                <div className="w-full">
                  <Textarea
                    disableAnimation
                    disableAutosize
                    value={formData.description}
                    onChange={handleDescriptionChange}
                    classNames={{
                      base: "max-w-lg",
                      input: "resize-y min-h-[80px] py-1 px-2 w-full text-xs text-gray-900 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-primary peer",
                    }}
                    label="Descripción"
                    placeholder="Escribir la descripción."
                    variant="bordered"
                  />
                  {descriptionError && (
                    <p className="mt-2 text-sm text-red">{descriptionError}</p>
                  )}
                </div>

                <div className="w-full">
                  <Textarea
                    disableAnimation
                    disableAutosize
                    value={formData.classification}
                    onChange={handleClassificationChange}
                    classNames={{
                      base: "max-w-lg",
                      input: "resize-y min-h-[80px] py-1 px-2 w-full text-xs text-gray-900 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-primary peer",
                    }}
                    label="Clasificación"
                    placeholder="Escribir la clasificación."
                    variant="bordered"
                  />
                  {classificationError && (
                    <p className="mt-2 text-sm text-red">{classificationError}</p>
                  )}
                </div>

                <div className="w-full mt-4">
                  <Button
                    type="submit"
                    color="primary"
                    disabled={isLoading}
                    className="w-full rounded border mb-4 border-primary bg-primary p-3 text-white transition hover:bg-opacity-90"
                  >
                    {isLoading ? <Spinner size="sm" color="white" /> : "Crear Tipo de Requerimiento"}
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
    addRequirementType: PropTypes.func.isRequired,
    formData: PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      classification: PropTypes.string.isRequired,
    }).isRequired,
    nameError: PropTypes.string,
    descriptionError: PropTypes.string,
    classificationError: PropTypes.string,
    setNameError: PropTypes.func.isRequired,
    setDescriptionError: PropTypes.func.isRequired,
    setClassificationError: PropTypes.func.isRequired,
    handleNameChange: PropTypes.func.isRequired,
    handleDescriptionChange: PropTypes.func.isRequired,
    handleClassificationChange: PropTypes.func.isRequired,
  }).isRequired,
};

export default CreateModal;
