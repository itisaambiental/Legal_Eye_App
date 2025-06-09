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
 * CreateModal component for Legal Verbs
 *
 * This component provides a form to create a new Legal Verbs, including fields for name, description, and translation.
 * It validates the required fields and displays error messages accordingly.
 * On submit, it triggers the addLegalVerbs function, and shows feedback via toast notifications.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Object} props.config - Configuration object for the component.
 * @param {boolean} props.config.isOpen - Controls whether the modal is open.
 * @param {Function} props.config.closeModalCreate - Function to close the modal.
 * @param {Function} props.config.addLegalVerb - Function to create a new Legal Verbs.
 * @param {Object} props.config.formData - Object containing form values: name, description, translation.
 * @param {string|null} props.config.nameError - Error message for the name input field.
 * @param {string|null} props.config.descriptionError - Error message for the description input field.
 * @param {string|null} props.config.translationError - Error message for the translation input field.
 * @param {Function} props.config.setNameError - Setter function for nameError.
 * @param {Function} props.config.setDescriptionError - Setter function for descriptionError.
 * @param {Function} props.config.setTranslationError - Setter function for translationError.
 * @param {Function} props.config.handleNameChange - Handler for name input change.
 * @param {Function} props.config.handleDescriptionChange - Handler for description input change.
 * @param {Function} props.config.handleTranslationnChange - Handler for translation input change.
 *
 * @returns {JSX.Element} Rendered CreateModal component with form inputs and validations.
 */
function CreateModal({ config }) {
  const {
    isOpen,
    closeModalCreate,
    addLegalVerb,
    formData,
    nameError,
    setNameError,
    handleNameChange,
    descriptionError,
    setDescriptionError,
    handleDescriptionChange,
    translationError,
    setTranslationError,
    handleTranslationChange,
  } = config;

  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { name, description, translation } = formData;

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

    if (!translation.trim()) {
      setTranslationError("Este campo es obligatorio");
      setIsLoading(false);
      return;
    } else {
      setTranslationError(null);
    }

    try {
      const legalVerbData = { 
        name, 
        description, 
        translation 
      };
      const { success, error } = await addLegalVerb(legalVerbData);

      if (success) {
        toast.info("El verbo legal ha sido creado correctamente", {
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
      toast.error("Error al crear el verbo legal.");
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
              Crear Nuevo Verbo Legal
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
                    value={formData.translation}
                    onChange={handleTranslationChange}
                    classNames={{
                      base: "max-w-lg",
                      input: "resize-y min-h-[80px] py-1 px-2 w-full text-xs text-gray-900 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-primary peer",
                    }}
                    label="Traducción"
                    placeholder="Escribir la Traduccíon."
                    variant="bordered"
                  />
                  {translationError && (
                    <p className="mt-2 text-sm text-red">{translationError}</p>
                  )}
                </div>

                <div className="w-full mt-4">
                  <Button
                    type="submit"
                    color="primary"
                    disabled={isLoading}
                    className="w-full rounded border mb-4 border-primary bg-primary p-3 text-white transition hover:bg-opacity-90"
                  >
                    {isLoading ? <Spinner size="sm" color="white" /> : "Crear Verbo Legal"}
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
    addLegalVerb: PropTypes.func.isRequired,
    formData: PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      translation: PropTypes.string.isRequired,
    }).isRequired,
    nameError: PropTypes.string,
    descriptionError: PropTypes.string,
    translationError: PropTypes.string,
    setNameError: PropTypes.func.isRequired,
    setDescriptionError: PropTypes.func.isRequired,
    setTranslationError: PropTypes.func.isRequired,
    handleNameChange: PropTypes.func.isRequired,
    handleDescriptionChange: PropTypes.func.isRequired,
    handleTranslationChange: PropTypes.func.isRequired,
  }).isRequired,
};

export default CreateModal;
