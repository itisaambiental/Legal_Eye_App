import { toast } from "react-toastify";
import {
  Listbox,
  ListboxOption,
  ListboxOptions,
  ListboxButton,
  Transition,
} from "@headlessui/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Spinner,
  Card,
  CardFooter,
  Image,
  Button,
  Tooltip,
} from "@heroui/react";
import { useState, Fragment, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import check from "../../assets/check.png";
import chevron_icon from "../../assets/chevron.png";
import cruz_icon from "../../assets/cruz.png";

/**
 * EditModal component
 *
 * Provides a modal dialog for editing user information.
 * It includes fields for updating the user's name, email, role, and profile picture.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Object} props.config - Configuration object for the modal.
 * @param {Object} props.config.formData - Current form data for the user being edited.
 * @param {Function} props.config.setFormData - Function to update form data.
 * @param {boolean} props.config.isOpen - Controls whether the modal is visible.
 * @param {Function} props.config.updateUserDetails - Function to submit the updated user data.
 * @param {Function} props.config.closeModalEdit - Function to close the modal.
 * @param {Object} props.config.selectedUser - The user object selected for editing.
 * @param {string} props.config.usertypeError - Error message for the user type field, if any.
 * @param {Function} props.config.setusertypeError - Function to set the user type error message.
 * @param {Function} props.config.handleTypeChange - Function to handle changes in the user type selection.
 * @param {string} props.config.nameError - Error message for the name field, if any.
 * @param {Function} props.config.setNameError - Function to set the name error message.
 * @param {Function} props.config.handleNameChange - Function to handle changes in the name input.
 * @param {Function} props.config.handleFileChange - Function to handle changes in the profile picture input.
 * @param {string} props.config.fileError - Error message for the profile picture field, if any.
 * @param {Function} props.config.handleRemoveImage - Function to remove the profile picture.
 * @param {Array} props.config.roles - Array of role options for user type selection.
 * @param {Function} props.config.translateRole - Function to translate the role name.
 * @returns {JSX.Element} Rendered EditModal component for editing user details.
 */

function EditModal({ config }) {
  const {
    formData,
    setFormData,
    isOpen,
    updateUserDetails,
    closeModalEdit,
    selectedUser,
    usertypeError,
    setusertypeError,
    handleTypeChange,
    nameError,
    setNameError,
    handleNameChange,
    handleFileChange,
    fileError,
    handleRemoveImage,
    roles,
    translateRole,
  } = config;
  const [isLoading, setIsLoading] = useState(false);
  const inputFileRef = useRef(null);

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        id: selectedUser.id,
        user_type: selectedUser.roleId,
        name: selectedUser.name,
        email: selectedUser.gmail,
        profile_picture: selectedUser.profile_picture,
      });
    }
  }, [selectedUser, setFormData]);

  const getRoleName = (value, roles) => {
    const selectedRole = roles.find((option) => option.id === value);
    return selectedRole
      ? translateRole(selectedRole.role)
      : "Selecciona el tipo de usuario";
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.name === "") {
      setNameError("Este campo es obligatorio");
      setIsLoading(false);
      return;
    } else {
      setNameError(null);
    }
    if (formData.user_type === "") {
      setusertypeError("Este campo es obligatorio");
      setIsLoading(false);
      return;
    } else {
      setusertypeError(null);
    }

    try {
      const userData = {
        id: formData.id,
        name: formData.name,
        email: formData.email,
        role_id: formData.user_type,
        profile_picture:
          formData.profile_picture &&
          formData.profile_picture.file instanceof File
            ? formData.profile_picture.file
            : null,
        removePicture: formData.profile_picture === null,
      };
      const { success, error } = await updateUserDetails(userData);
      if (success) {
        toast.info("El usuario ha sido actualizado correctamente", {
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
        "Algo mal sucedió al actualizar el usuario. Intente de nuevo"
      );
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
              Editar Usuario
            </ModalHeader>

            <ModalBody>
              <form onSubmit={handleEdit}>
                <div className="grid gap-4 mb-4 grid-cols-2">
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
                      Nombre
                    </label>
                    {nameError && (
                      <p className="mt-2 text-sm text-red">{nameError}</p>
                    )}
                  </div>

                  <div className="relative z-0 w-full mb-5 group">
                    <input
                      type="email"
                      readOnly
                      name="email"
                      id="floating_email"
                      value={formData.email}
                      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 focus:outline-none focus:ring-0 focus:border-primary peer"
                      placeholder=" "
                    />
                    <label
                      htmlFor="floating_email"
                      className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 peer-focus:left-0 peer-focus:text-primary peer-focus:dark:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                      Correo Electrónico
                    </label>
                  </div>
                </div>
                <div className="relative z-20 mb-6">
                  {formData.profile_picture ? (
                    <div className="flex justify-center items-center h-full">
                      <Card
                        isFooterBlurred
                        radius="sm"
                        className="border-none relative z-20 mb-6 w-full max-w-lg h-auto"
                      >
                        <div className="w-full h-60 relative">
                          <Image
                            alt={formData.name}
                            className="object-cover w-full h-full"
                            src={
                              typeof formData.profile_picture === "string"
                                ? formData.profile_picture
                                : formData.profile_picture?.previewUrl
                            }
                          />

                          <Tooltip color="primary" content="Eliminar">
                            <Button
                              className="absolute top-2 right-2 bg-transparent z-10"
                              onPress={handleRemoveImage}
                              auto
                              size="sm"
                              isIconOnly
                              variant="light"
                            >
                              <img
                                src={cruz_icon}
                                alt="Remove Icon"
                                className="w-6 h-6"
                              />
                            </Button>
                          </Tooltip>
                        </div>
                        <CardFooter className="flex flex-col items-center justify-center bg-primary/40 before:bg-primary/10 border-primary/20 border-1 overflow-hidden py-2 absolute bottom-0 w-full shadow-small rounded-b-lg z-10">
                          <p className="text-tiny text-white text-center">
                            Foto de perfil actual
                          </p>
                          <Button
                            onPress={() => inputFileRef.current.click()}
                            className="text-tiny text-primary mt-2"
                            variant="solid"
                            color="default"
                            radius="lg"
                            size="sm"
                          >
                            Editar Foto
                          </Button>
                          <input
                            type="file"
                            name="profile_picture"
                            id="profile_picture"
                            accept=".png, .jpeg"
                            ref={inputFileRef}
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </CardFooter>
                      </Card>
                    </div>
                  ) : (
                    <div className="relative z-20 mb-6">
                      <button
                        type="button"
                        onClick={() => inputFileRef.current.click()}
                        className="relative z-20 w-full appearance-none rounded-lg border border-stroke bg-transparent px-5 py-[10px] text-dark-6 outline-none transition focus:border-primary active:border-primary cursor-pointer"
                      >
                        <span className="block truncate">
                          {formData.profile_picture
                            ? formData.profile_picture.name
                            : "Sin foto de perfil, Selecciona una foto"}
                        </span>
                      </button>
                      <input
                        type="file"
                        name="profile_picture"
                        id="profile_picture"
                        accept=".png, .jpeg"
                        ref={inputFileRef}
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      {fileError && (
                        <p className="mt-2 text-sm text-red">{fileError}</p>
                      )}
                    </div>
                  )}

                  <Listbox
                    value={formData.user_type}
                    onChange={handleTypeChange}
                  >
                    <ListboxButton className="relative z-20 -mt-2 w-full appearance-none rounded-lg border border-stroke bg-transparent px-5 py-[10px] text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-black dark:border-dark-3">
                      <span
                        className={`block truncate ${
                          usertypeError ? "text-red" : ""
                        }`}
                      >
                        {usertypeError ||
                          getRoleName(formData.user_type, roles)}
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <img
                          src={chevron_icon}
                          alt="Chevron Icon"
                          className="h-3 w-3 text-gray-400"
                          aria-hidden="true"
                        />
                      </span>
                    </ListboxButton>
                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <ListboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                        {roles.map((role) => (
                          <ListboxOption
                            key={role.id}
                            className={({ active }) =>
                              `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                active
                                  ? "text-white bg-primary/90"
                                  : "text-gray-900"
                              }`
                            }
                            value={role.id}
                          >
                            {({ selected }) => (
                              <>
                                <span
                                  className={`block truncate ${
                                    selected ? "font-medium" : "font-normal"
                                  }`}
                                >
                                  {translateRole(role.role)}
                                </span>
                                {selected && (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <img
                                      src={check}
                                      alt="Check Icon"
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  </span>
                                )}
                              </>
                            )}
                          </ListboxOption>
                        ))}
                      </ListboxOptions>
                    </Transition>
                  </Listbox>
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
                    "Editar Usuario"
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
    formData: PropTypes.object.isRequired,
    setFormData: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    updateUserDetails: PropTypes.func.isRequired,
    closeModalEdit: PropTypes.func.isRequired,
    selectedUser: PropTypes.object,
    usertypeError: PropTypes.string,
    setusertypeError: PropTypes.func.isRequired,
    handleTypeChange: PropTypes.func.isRequired,
    nameError: PropTypes.string,
    setNameError: PropTypes.func.isRequired,
    handleNameChange: PropTypes.func.isRequired,
    handleFileChange: PropTypes.func.isRequired,
    fileError: PropTypes.string,
    handleRemoveImage: PropTypes.func.isRequired,
    roles: PropTypes.arrayOf(PropTypes.object).isRequired,
    translateRole: PropTypes.func.isRequired,
  }).isRequired,
};

export default EditModal;
