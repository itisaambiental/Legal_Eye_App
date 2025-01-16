import PropTypes from "prop-types";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Spinner,
  Textarea,
} from "@nextui-org/react";
import check from "../../assets/check.png";

/**
 * CreateModal component for Articles
 *
 * This component provides a form for creating a new article, including fields for order, name, and description.
 * Validation is performed for the required fields, and appropriate error messages are shown.
 * The form submission triggers the addArticle function to create the article, and feedback is displayed to the user based on the response.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Object} props.config - Configuration object for the component.
 * @param {boolean} props.config.isOpen - Controls whether the modal is open.
 * @param {Function} props.config.closeModalCreate - Function to close the modal.
 * @param {Function} props.config.addArticle - Function to add a new article.
 * @param {string|null} props.config.nameError - Error message for the article name input field.
 * @param {string|null} props.config.descriptionError - Error message for the article description field.
 * @param {string|null} props.config.orderError - Error message for the article order input field.
 * @param {Function} props.config.setNameError - Setter function for nameError.
 * @param {Function} props.config.setDescriptionError - Setter function for descriptionError.
 * @param {Function} props.config.setOrderError - Setter function for orderError.
 * @param {Function} props.config.handleNameChange - Handler for article name input change.
 * @param {Function} props.config.handleDescriptionChange - Handler for article description input change.
 * @param {Function} props.config.clearDescription - Handler to clear description entry.
 * @param {Function} props.config.handleOrderChange - Handler for article order input change.
 * @param {Object} props.config.formData - Form data containing the article details.
 *
 * @returns {JSX.Element} Rendered CreateModal component with form elements and validation.
 */
function CreateModal({ config }) {
  const {
    isOpen,
    closeModalCreate,
    addArticle,
    nameError,
    descriptionError,
    orderError,
    setNameError,
    setDescriptionError,
    setOrderError,
    handleNameChange,
    handleDescriptionChange,
    clearDescription,
    handleOrderChange,
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
    } else if (formData.order <= 0) {
      setOrderError("Este campo debe ser mayor a 0.");
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

    if (!formData.description.trim()) {
      setDescriptionError("Este campo es obligatorio");
      setIsLoading(false);
      return;
    } else {
      setDescriptionError(null);
    }

    try {
      const { success, error } = await addArticle(
        formData.legalBaseId,
        formData.name,
        formData.description,
        formData.order
      );

      if (success) {
        toast.info("El artículo ha sido registrado correctamente", {
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
      toast.error("Algo salió mal al crear el artículo. Intenta de nuevo.");
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
              Registrar Nuevo Artículo
            </ModalHeader>
            <ModalBody>
              <form onSubmit={handleCreate}>
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
                  <Textarea
                    isClearable
                    onClear={clearDescription} 
                    radius="md"
                    value={formData.description}
                    onChange={handleDescriptionChange}
                    label="Descripción"
                    placeholder="Ingrese la descripción"
                    variant="bordered"
                    classNames={{
                      base: "w-full",
                      input: "min-h-[100px]",
                    }}
                  />
                  {descriptionError && (
                    <p className="mt-2 text-sm text-red">{descriptionError}</p>
                  )}
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full rounded border mb-4 border-primary bg-primary p-3 text-white transition hover:bg-opacity-90"
                  >
                    {isLoading ? (
                      <div role="status">
                        <Spinner size="sm" color="white" />
                      </div>
                    ) : (
                      "Registrar Artículo"
                    )}
                  </button>
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
    addArticle: PropTypes.func.isRequired,
    nameError: PropTypes.string,
    descriptionError: PropTypes.string,
    orderError: PropTypes.string,
    setNameError: PropTypes.func.isRequired,
    setDescriptionError: PropTypes.func.isRequired,
    setOrderError: PropTypes.func.isRequired,
    handleNameChange: PropTypes.func.isRequired,
    handleDescriptionChange: PropTypes.func.isRequired,
    clearDescription: PropTypes.func.isRequired,
    handleOrderChange: PropTypes.func.isRequired,
    formData: PropTypes.shape({
      order: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      legalBaseId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default CreateModal;
