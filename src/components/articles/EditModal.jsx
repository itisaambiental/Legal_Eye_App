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
import TextArea from "./TextArea/TextArea.jsx";
import check from "../../assets/check.png";

/**
 * EditModal component for Articles
 *
 * This component provides a modal dialog for editing an articles's information.
 * Validation is performed for the required fields, and appropriate error messages are shown.
 * and provides feedback to the user on the success or failure of the update operation.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Object} props.config - Configuration object for the component.
 * @param {Object} props.config.formData - Current form data for the article being edited.
 * @param {Function} props.config.setFormData - Function to update form data.
 * @param {Object} props.config.selectedArticle - The article object selected for editing.
 * @param {boolean} props.config.isOpen - Controls whether the modal is visible.
 * @param {Function} props.config.updateArticle - Function to submit the updated article data.
 * @param {Function} props.config.closeModalEdit - Function to close the modal.
 * @param {string|null} props.config.nameError - Error message for the article name input field.
 * @param {string|null} props.config.orderError - Error message for the article order input field.
 * @param {Function} props.config.setNameError - Setter function for nameError.
 * @param {Function} props.config.setOrderError - Setter function for orderError.
 * @param {Function} props.config.handleNameChange - Handler for article name input change.
 * @param {Function} props.config.handleDescriptionChange - Handler for article description input change.
 * @param {Function} props.config.handleOrderChange - Handler for article order input change.
 *
 * @returns {JSX.Element} Rendered EditModal component for editing aspect details.
 */
function EditModal({ config }) {
  const {
    isOpen,
    closeModalEdit,
    formData,
    setFormData,
    selectedArticle,
    updateArticle,
    nameError,
    orderError,
    setNameError,
    setOrderError,
    handleNameChange,
    handleDescriptionChange,
    handleOrderChange,
  } = config;

  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingPicture, setIsUploadingPicture] = useState(false); 

  useEffect(() => {
    if (selectedArticle) {
      setFormData({
        id: selectedArticle.id,
        legalBaseId: selectedArticle.legal_basis_id,
        name: selectedArticle.article_name,
        description: selectedArticle.description,
        order: selectedArticle.article_order,
      });
    }
  }, [selectedArticle, setFormData]);

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
    } else if (formData.order <= 0) {
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
    if (!formData.name.trim()) {
      setNameError("Este campo es obligatorio");
      setIsLoading(false);
      return;
    } else {
      setNameError(null);
    }
    try {
      const { success, error } = await updateArticle(formData.id, {
        title: formData.name,
        article: formData.description,
        order: formData.order,
      });
      if (success) {
        toast.info("El artículo ha sido actualizado correctamente", {
          icon: () => <img src={check} alt="Success Icon" />,
          progressStyle: {
            background: "#113c53",
          },
        });
        closeModalEdit();
      } else {
        toast.error(error);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        "Algo salió mal al actualizar el artículo. Intenta de nuevo."
      );
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
            <ModalHeader role="heading" className="flex flex-col gap-1">
              Editar Artículo
            </ModalHeader>
            <ModalBody>
              <form onSubmit={handleEdit}>
                <div className="grid gap-4 mb-2 grid-cols-1 sm:grid-cols-2">
                  <div className="relative z-0 w-full mb-5 group">
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
                      className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 peer-focus:left-0 peer-focus:text-primary peer-focus:dark:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                      Orden
                    </label>
                    {orderError && (
                      <p className="mt-2 text-sm text-red">{orderError}</p>
                    )}
                  </div>
                  <div className="relative z-0 w-full mb-5 group">
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
                      className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 peer-focus:left-0 peer-focus:text-primary peer-focus:dark:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                      Artículo
                    </label>
                    {nameError && (
                      <p className="mt-2 text-sm text-red">{nameError}</p>
                    )}
                  </div>
                </div>

                <div className="mb-5">
                  <TextArea
                    value={formData.description}
                    onChange={(value) =>
                      handleDescriptionChange({ target: { value } })
                    }
                    placeholder="Ingrese la descripción(Opcional)"
                    setIsUploading={setIsUploadingPicture}
                    />
                </div>
                <div>
                  <Button
                    type="submit"
                    color="primary"
                    disabled={isLoading || isUploadingPicture} 
                    className="w-full rounded border mb-4 border-primary bg-primary p-3 text-white transition hover:bg-opacity-90"
                  >
                    {isLoading ? (
                      <Spinner size="sm" color="white" />
                    ) : (
                      "Editar Artículo"
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
    formData: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      order: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    }).isRequired,
    setFormData: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    updateArticle: PropTypes.func.isRequired, 
    closeModalEdit: PropTypes.func.isRequired,
    selectedArticle: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      legal_basis_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      article_name: PropTypes.string,
      description: PropTypes.string,
      article_order: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
    nameError: PropTypes.string,
    orderError: PropTypes.string,
    setNameError: PropTypes.func.isRequired,
    setOrderError: PropTypes.func.isRequired,
    handleNameChange: PropTypes.func.isRequired,
    handleDescriptionChange: PropTypes.func.isRequired,
    handleOrderChange: PropTypes.func.isRequired,
  }).isRequired,
};

export default EditModal;
