import PropTypes from "prop-types";
import { useEffect, useState } from "react";
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
 * EditModal component for Legal Verbs
 *
 * This component provides a modal to edit an existing legal verb.
 * It preloads data into the form, validates required fields, and shows success or error feedback.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Object} props.config - Configuration object for modal state and form behavior.
 * @param {boolean} props.config.isOpen - Whether the modal is open.
 * @param {Function} props.config.closeModalEdit - Function to close the modal.
 * @param {Function} props.config.editLegalVerb - Function to submit updated data.
 * @param {Object} props.config.formData - Current form values.
 * @param {Function} props.config.setFormData - Setter to update formData.
 * @param {Object} props.config.selectedLegalVerb - The selected legal verb to edit.
 * @param {string|null} props.config.nameError - Error for name field.
 * @param {Function} props.config.setNameError - Setter for name error.
 * @param {Function} props.config.handleNameChange - Input handler for name.
 * @param {string|null} props.config.descriptionError - Error for description.
 * @param {Function} props.config.setDescriptionError - Setter for description error.
 * @param {Function} props.config.handleDescriptionChange - Input handler for description.
 * @param {string|null} props.config.translationError - Error for translation.
 * @param {Function} props.config.setTranslationError - Setter for translation error.
 * @param {Function} props.config.handleTranslationChange - Input handler for translation.
 *
 * @returns {JSX.Element} Rendered EditModal component.
 */
function EditModal({ config }) {
  const {
    isOpen,
    closeModalEdit,
    editLegalVerb,
    formData,
    setFormData,
    selectedLegalVerb,
    nameError,
    setNameError,
    handleNameChange,
    descriptionError,
    setDescriptionError,
    handleDescriptionChange,
    translationError,
    setTranslationError,
    handleTranslationChange
  } = config;

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedLegalVerb) {
      setFormData({
        id: selectedLegalVerb.id,
        name: selectedLegalVerb.name,
        description: selectedLegalVerb.description,
        translation: selectedLegalVerb.translation,
      });
    }
  }, [selectedLegalVerb, setFormData]);

  const handleEdit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { id, name, description, translation } = formData;

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
        id, 
        name, 
        description, 
        translation 
      };
      const { success, error } = await editLegalVerb(legalVerbData);
      if (success) {
        toast.info("El verbo legal ha sido actualizado correctamente", {
          icon: () => <img src={check} alt="Success Icon" />,
          progressStyle: { background: "#113c53" },
        });
        closeModalEdit();
      } else {
        toast.error(error);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error al actualizar el verbo legal.");
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
            <ModalHeader className="flex flex-col gap-1">
              Editar Verbo Legal
            </ModalHeader>
            <ModalBody>
              <form onSubmit={handleEdit} className="space-y-6">
                <div className="relative z-0 w-full group">
                  <input
                    type="text"
                    name="name"
                    id="edit_floating_name"
                    value={formData.name}
                    onChange={handleNameChange}
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer"
                    placeholder=""
                  />
                  <label
                    htmlFor="edit_floating_name"
                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Nombre
                  </label>
                  {nameError && <p className="mt-2 text-sm text-red">{nameError}</p>}
                </div>

                <div className="w-full">
                  <Textarea
                    disableAnimation
                    disableAutosize
                    value={formData.description}
                    onChange={handleDescriptionChange}
                    classNames={{
                      base: "max-w-lg",
                      input:
                        "resize-y min-h-[80px] py-1 px-2 w-full text-xs text-gray-900 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-primary peer",
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
                      input:
                        "resize-y min-h-[80px] py-1 px-2 w-full text-xs text-gray-900 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-primary peer",
                    }}
                    label="Traducción"
                    placeholder="Escribir la Traducción."
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
                    {isLoading ? (
                      <Spinner size="sm" color="white" />
                    ) : (
                      "Editar Verbo Legal"
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

EditModal.propTypes = {
  config: PropTypes.shape({
    isOpen: PropTypes.bool.isRequired,
    closeModalEdit: PropTypes.func.isRequired,
    editLegalVerb: PropTypes.func.isRequired,
    formData: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      translation: PropTypes.string.isRequired,
    }).isRequired,
    setFormData: PropTypes.func.isRequired,
    selectedLegalVerb: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
      description: PropTypes.string,
      translation: PropTypes.string,
    }),
    nameError: PropTypes.string,
    setNameError: PropTypes.func.isRequired,
    handleNameChange: PropTypes.func.isRequired,
    descriptionError: PropTypes.string,
    setDescriptionError: PropTypes.func.isRequired,
    handleDescriptionChange: PropTypes.func.isRequired,
    translationError: PropTypes.string,
    setTranslationError: PropTypes.func.isRequired,
    handleTranslationChange: PropTypes.func.isRequired,
  }).isRequired,
};

export default EditModal;
