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
 * EditModal component for Requirement Types
 *
 * Provides a form to edit an existing requirement type with fields for name, description and classification.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Object} props.config - Configuration for modal and form logic.
 * @returns {JSX.Element} Rendered EditModal component
 */
function EditModal({ config }) {
  const {
    isOpen,
    closeModalEdit,
    editRequirementTypes,
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

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.name.trim()) {
      setNameError("Este campo es obligatorio");
      setIsLoading(false);
      return;
    } else {
      setNameError(null);
    }

    if (!formData.description.trim()) {
      setDescriptionError("Este campo es obligatorio");
      setIsLoading(false);
      return;
    } else {
      setDescriptionError(null);
    }

    if (!formData.classification.trim()) {
      setClassificationError("Este campo es obligatorio");
      setIsLoading(false);
      return;
    } else {
      setClassificationError(null);
    }

    try {
      const { success, error } = await editRequirementTypes(formData);

      if (success) {
        toast.info("El tipo de requerimiento ha sido actualizado correctamente", {
          icon: () => <img src={check} alt="Success Icon" />,
          progressStyle: { background: "#113c53" },
        });
        closeModalEdit();
      } else {
        toast.error(error || "No se pudo actualizar el tipo.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error al actualizar el tipo de requerimiento.");
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
            <ModalHeader className="flex flex-col gap-1">
              Editar Tipo de Requerimiento
            </ModalHeader>
            <ModalBody>
              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="relative z-0 w-full group">
                  <input
                    type="text"
                    name="name"
                    id="edit_floating_name"
                    value={formData.name}
                    onChange={handleNameChange}
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer"
                    placeholder=" "
                  />
                  <label
                    htmlFor="edit_floating_name"
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
                    label="Clasificación Obligatoria"
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
                    {isLoading ? <Spinner size="sm" color="white" /> : "Editar Tipo de Requerimiento"}
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
    editRequirementTypes: PropTypes.func.isRequired,
    formData: PropTypes.shape({
      name: PropTypes.string,
      description: PropTypes.string,
      classification: PropTypes.string,
    }).isRequired,
    nameError: PropTypes.string,
    setNameError: PropTypes.func.isRequired,
    handleNameChange: PropTypes.func.isRequired,
    descriptionError: PropTypes.string,
    setDescriptionError: PropTypes.func.isRequired,
    handleDescriptionChange: PropTypes.func.isRequired,
    classificationError: PropTypes.string,
    setClassificationError: PropTypes.func.isRequired,
    handleClassificationChange: PropTypes.func.isRequired,
  }).isRequired,
};

export default EditModal;
