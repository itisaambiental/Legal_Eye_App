/* eslint-disable react/prop-types */
import { toast } from 'react-toastify';
import { Listbox, ListboxOption, ListboxOptions, ListboxButton, Transition } from '@headlessui/react';
import { useState, Fragment, useRef } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, Spinner, Card, CardFooter, Image, Button, Tooltip } from '@nextui-org/react';
import check from "../../assets/check.png";
import chevron_icon from "../../assets/chevron.png";
import cruz_icon from "../../assets/cruz.png"


/**
 * CreateModal component
 * 
 * This component provides a form for creating a new user, including fields
 * for name, email, user type, and profile picture upload. Validation is 
 * performed for required fields, and appropriate error messages are shown. 
 * The form submission triggers the addUser function to create the user, and 
 * feedback is displayed to the user based on the response.
 * 
 * @component
 * @param {Object} props - Component properties.
 * @param {boolean} props.isOpen - Controls whether the modal is open.
 * @param {Function} props.closeModalCreate - Function to close the modal.
 * @param {Function} props.addUser - Function to add a new user.
 * @param {Function} props.handleEmailChange - Handler for email input change.
 * @param {Object} props.formData - The data of the form being filled.
 * @param {string|null} props.usertypeError - Error message for user type selection.
 * @param {Function} props.setusertypeError - Setter function for usertypeError.
 * @param {Function} props.handleTypeChange - Handler for user type selection.
 * @param {string|null} props.nameError - Error message for the name input field.
 * @param {Function} props.setNameError - Setter function for nameError.
 * @param {Function} props.handleNameChange - Handler for name input change.
 * @param {Function} props.handleFileChange - Handler for profile picture file input.
 * @param {string|null} props.fileError - Error message for file input.
 * @param {Function} props.handleRemoveImage - Handler to remove the selected profile picture.
 * @param {Function} props.setEmailError - Setter function for email error.
 * @param {string|null} props.emailError - Error message for email input field.
 * @param {Array} props.roles - List of roles available for selection.
 * @param {Function} props.translateRole - Function to translate role names.
 * 
 * @returns {JSX.Element} Rendered CreateModal component with form elements and validation.
 */
function CreateModal({ isOpen, closeModalCreate, addUser, handleEmailChange, formData, usertypeError, setusertypeError, handleTypeChange, nameError, setNameError, handleNameChange, handleFileChange, fileError, handleRemoveImage, setEmailError, emailError, roles, translateRole }) {
    const [isLoading, setIsLoading] = useState(false);
    const inputFileRef = useRef(null);

    const getRoleName = (value, roles) => {
        const selectedRole = roles.find(option => option.id === value);
        return selectedRole ? translateRole(selectedRole.role) : 'Selecciona el tipo de usuario';
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
    
        if (formData.nombre === '') {
            setNameError('Este campo es obligatorio');
            setIsLoading(false);
            return;
        } else {
            setNameError(null);
        }
    
        if (formData.email === '') {
            setEmailError('Este campo es obligatorio');
            setIsLoading(false);
            return;
        } else if (!formData.email.endsWith('@isaambiental.com')) {
            setEmailError('El correo debe terminar con @isaambiental.com');
            setIsLoading(false);
            return;
        } else {
            setEmailError(null);
        }
    
        if (formData.user_type === '') {
            setusertypeError('Este campo es obligatorio');
            setIsLoading(false);
            return;
        } else {
            setusertypeError(null);
        }
        try {
            const userData = {
                name: formData.nombre,
                email: formData.email,
                role_id: formData.user_type,
                ...(formData.profile_picture && { profile_picture: formData.profile_picture.file })
            };
    
            const { success, error } = await addUser(userData);
    
            if (success) {
                toast.info('El usuario ha sido registrado correctamente', {
                    icon: () => <img src={check} alt="Success Icon" />,
                    progressStyle: {
                        background: '#113c53',
                    }
                });
                closeModalCreate();
            } else {
                toast.error(error)
            }
        } catch (error) {
            console.error(error);
            toast.error('Algo mal sucedió al crear el usuario. Intente de nuevo');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <Modal isOpen={isOpen} onOpenChange={closeModalCreate}
            backdrop="opaque"
            placement='center'
            classNames={{
                closeButton: "hover:bg-primary/20 text-primary active:bg-primary/10",
            }}
        >
            <ModalContent>
                {() => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Registrar Nuevo Usuario
                        </ModalHeader>
                        <ModalBody>
                            <form onSubmit={handleCreate}>
                                <div className="grid gap-4 mb-4 grid-cols-2">
                                    <div className="relative z-0 w-full mb-5 group">
                                        <input
                                            type="text"
                                            name="nombre"
                                            id="floating_nombre"
                                            value={formData.nombre}
                                            onChange={handleNameChange} 
                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer"
                                            placeholder=" "
                                        />
                                        <label htmlFor="floating_nombre" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 peer-focus:left-0 peer-focus:text-primary peer-focus:dark:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Nombre</label>
                                        {nameError && <p className="mt-2 text-sm text-red">{nameError}</p>}
                                    </div>

                                    <div className="relative z-0 w-full mb-5 group">
                                        <input
                                            type="email"
                                            name="email"
                                            id="floating_email"
                                            value={formData.email}
                                            onChange={handleEmailChange}
                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 focus:outline-none focus:ring-0 focus:border-primary peer"
                                            placeholder=" "
                                        />
                                        <label htmlFor="floating_email" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 peer-focus:left-0 peer-focus:text-primary peer-focus:dark:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                        Correo Electrónico
                                        </label>
                                        {emailError && <p className="mt-2 text-sm text-red">{emailError}</p>}
                                    </div>
                                </div>
                                <div className="relative z-20 mb-6">
                                    {formData.profile_picture ? (
                                        <div className="flex justify-center items-center h-full">
                                            <Card isFooterBlurred radius="sm" className="border-none relative z-20 mb-6 w-full max-w-lg h-auto">

                                                <div className="w-full h-60 relative">
                                                    <Image
                                                        alt={formData.nombre}
                                                        className="object-cover w-full h-full"
                                                        src={formData.profile_picture.previewUrl}
                                                    />
                                                     <Tooltip color='primary' content="Eliminar">
                                                    <Button
                                                        className="absolute top-2 right-2 bg-transparent z-10"
                                                        onClick={handleRemoveImage}
                                                        auto
                                                        size="sm"
                                                        isIconOnly
                                                        variant="light"
                                                    >
                                                        <img src={cruz_icon} alt="Remove Icon" className="w-6 h-6" />
                                                    </Button>
                                                    </Tooltip>
                                                </div>

                                                <CardFooter className="flex flex-col items-center justify-center bg-primary/70 before:bg-primary/10 border-primary/20 border-1 overflow-hidden py-2 absolute bottom-0 w-full shadow-small rounded-b-lg z-10">
                                                    <p className="text-tiny text-white text-center">Imagen seleccionada</p>
                                                    <Button
                                                        onClick={() => inputFileRef.current.click()}
                                                        className="text-tiny text-primary mt-2"
                                                        variant="solid"
                                                        color="default"
                                                        radius="lg"
                                                        size="sm"
                                                    >
                                                        Editar
                                                    </Button>
                                                    <input
                                                        type="file"
                                                        name="profile_picture"
                                                        id="profile_picture"
                                                        accept=".png, .jpg, .jpeg, .webp"
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
                                                    {formData.profile_picture ? formData.profile_picture.name : "Selecciona una foto de perfil"}
                                                </span>
                                            </button>
                                            <input
                                                type="file"
                                                name="profile_picture"
                                                id="profile_picture"
                                                accept=".png, .jpg, .jpeg, .webp"
                                                ref={inputFileRef}
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                            {fileError && <p className="mt-2 text-sm text-red">{fileError}</p>}
                                        </div>
                                    )}
                                    <Listbox value={formData.user_type} onChange={handleTypeChange}>
                                        <ListboxButton className="relative z-20 -mt-2 w-full appearance-none rounded-lg border border-stroke bg-transparent px-5 py-[10px] text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-black dark:border-dark-3">
                                            <span className={`block truncate ${usertypeError ? 'text-red' : ''}`}>
                                                {usertypeError || getRoleName(formData.user_type, roles)}
                                            </span>

                                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                <img src={chevron_icon} alt="Chevron Icon"
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
                                                            `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'text-white bg-primary/90' : 'text-gray-900'
                                                            }`
                                                        }
                                                        value={role.id}
                                                    >
                                                        {({ selected }) => (
                                                            <>
                                                                <span
                                                                    className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                                        }`}
                                                                >
                                                                    {translateRole(role.role)}
                                                                </span>
                                                                {selected ? (
                                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                                                        <img src={check} alt="Check Icon" className="h-5 w-5" aria-hidden="true" />
                                                                    </span>
                                                                ) : null}
                                                            </>
                                                        )}
                                                    </ListboxOption>
                                                ))}
                                            </ListboxOptions>
                                        </Transition>
                                    </Listbox>
                                </div>
                                <div>
                                    <button
                                        disabled={fileError}
                                        type="submit"
                                        className="w-full rounded border mb-4 border-primary bg-primary p-3 text-white transition hover:bg-opacity-90"
                                    >
                                        {isLoading ? (
                                            <div role="status">
                                                <Spinner size="sm" color="white" />
                                            </div>
                                        ) : (
                                            'Registrar Usuario'
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

export default CreateModal;