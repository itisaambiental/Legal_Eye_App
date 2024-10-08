import { toast } from 'react-toastify';
import { Listbox, ListboxOption, ListboxOptions, ListboxButton, Transition } from '@headlessui/react'
import { useState, Fragment, useRef } from 'react';
import check from "../../assets/check.png"
import cruz_icon from "../../assets/cruz.png"
import { Button, Spinner } from '@nextui-org/react';
import chevron_icon from "../../assets/chevron.png"

const options = [
    { name: 'Selecciona el tipo de usuario:', value: '' },
    { name: 'Admin', value: 1 },
    { name: 'Analista', value: 2 },
];

const getRoleName = (value) => {
    const selectedRole = options.find(option => option.value === value);
    return selectedRole ? selectedRole.name : 'Selecciona el tipo de usuario';
};


function CreateModal({ closeModalCreate, addUser, handleChange, formData, usertypeError, setusertypeError, handleTypeChange, handleFileChange, fileError, setEmailError, emailError }) {
    const [isLoading, setIsLoading] = useState(false);
    const inputFileRef = useRef(null);

    const handleCreate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
    
        if (formData.user_type === '') {
            setusertypeError('Este campo es obligatorio');
            setIsLoading(false);
            return;
        } else {
            setusertypeError(null);
        }
    
        if (!formData.email.endsWith('@isaambiental.com')) {
            setEmailError('El correo debe terminar con @isaambiental.com');
            setIsLoading(false);
            return;
        } else {
            setEmailError(null);
        }
    
        try {
            const { success, error } = await addUser({
                name: formData.nombre,
                email: formData.email,
                role_id: formData.user_type,
                profile_picture: formData.profile_picture
            });
    
            if (success) {
                toast.info('El usuario ha sido registrado correctamente', {
                    icon: () => <img src={check} alt="Success Icon" />,
                    progressStyle: {
                        background: '#113c53',
                    }
                });
                closeModalCreate();
            } else {
                if (error === 'Gmail already exists') {
                    toast.error('El correo ya está en uso. Por favor, elige otro.');
                } else if (error === 'Validation failed') {
                    toast.error('Fallo de validación. Revisa los campos e intenta nuevamente.');
                } else if (error === 'Unauthorized to register a new user') {
                    toast.error('No tienes autorización para registrar un nuevo usuario.');
                } else if (error === 'Network error occurred while registering') {
                    toast.error('Ocurrió un error de red. Revisa tu conexión e intenta de nuevo.');
                } else if (error === 'Internal server error') {
                    toast.error('Error interno del servidor. Intenta más tarde.');
                } else {
                    toast.error('Ocurrió un error inesperado al registrar el usuario. Intenta nuevamente.');
                }
            }
        } catch (error) {
            console.error(error);
            toast.error('Algo mal sucedió al crear el usuario. Intente de nuevo');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div>
            <div id="crud-modal" tabIndex="-1" aria-hidden="true" className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50">
                <div className="relative p-4 mx-auto mt-20 max-w-md bg-white rounded-lg shadow-lg">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                        <h3 className="text-lg font-semibold text-primary">
                            Registrar Nuevo Usuario
                        </h3>
                        <Button variant="light" disabled={isLoading} onClick={closeModalCreate} color="primary" size="sm" isIconOnly auto aria-label="Close Modal">
                            <img src={cruz_icon} alt="Cruz Icon" className="w-4 h-4" />
                        </Button>
                    </div>
                    <form onSubmit={handleCreate} className="p-4 md:p-5">
                        <div className="grid gap-4 mb-4 grid-cols-2">
                            <div className="relative z-0 w-full mb-5 group">
                                <input
                                    type="text"
                                    name="nombre"
                                    id="floating_nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer"
                                    placeholder=" "
                                    required
                                />
                                <label htmlFor="floating_nombre" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 peer-focus:left-0 peer-focus:text-primary peer-focus:dark:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Nombre</label>
                            </div>


                            <div className="relative z-0 w-full mb-5 group">
                                <input
                                    type="email"
                                    name="email"
                                    id="floating_email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 focus:outline-none focus:ring-0 focus:border-primary peer"
                                    placeholder=" "
                                    required
                                />
                                <label htmlFor="floating_email" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 peer-focus:left-0 peer-focus:text-primary peer-focus:dark:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Correo Electrónico</label>
                                {emailError && <p className="mt-2 text-sm text-red">{emailError}</p>}
                 
                            </div>
                        </div>
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
                            <Listbox value={formData.user_type} onChange={handleTypeChange}>
                                <ListboxButton className="relative z-20 mt-2 w-full appearance-none rounded-lg border border-stroke bg-transparent px-5 py-[10px] text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-black dark:border-dark-3">
                                    <span className={`block truncate ${usertypeError ? 'text-red' : ''}`}>
                                        {usertypeError || getRoleName(formData.user_type)}
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
                                        {options.map((type, typeIdx) => (
                                            <ListboxOption
                                                key={typeIdx}
                                                className={({ active }) =>
                                                    `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'text-white bg-primary/90' : 'text-gray-900'
                                                    }`
                                                }
                                                value={type.value}
                                            >
                                                {({ selected }) => (
                                                    <>
                                                        <span
                                                            className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                                }`}
                                                        >
                                                            {type.name}
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
                                className="w-full rounded border border-primary bg-primary p-3 text-white transition hover:bg-opacity-90"
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
                </div>
            </div>
        </div>
    );
}

export default CreateModal;
