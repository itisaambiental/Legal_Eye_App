/* eslint-disable react/prop-types */
import { toast } from 'react-toastify';
import { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, Spinner } from '@nextui-org/react';
import check from "../../assets/check.png";

/**
 * CreateModal component for Aspects
 * 
 * This component provides a form for creating a new aspect, including a field for the aspect name.
 * Validation is performed for the required field, and appropriate error messages are shown.
 * The form submission triggers the addAspect function to create the aspect, and feedback is
 * displayed to the user based on the response.
 * 
 * @component
 * @param {Object} props - Component properties.
 * @param {boolean} props.isOpen - Controls whether the modal is open.
 * @param {Function} props.closeModalCreate - Function to close the modal.
 * @param {Function} props.addAspect - Function to add a new aspect.
 * @param {string|null} props.nameError - Error message for the aspect name input field.
 * @param {Function} props.setNameError - Setter function for nameError.
 * @param {Function} props.handleNameChange - Handler for aspect name input change.
 * @param {Object} formData - Form data containing the aspect name.
 * 
 * @returns {JSX.Element} Rendered CreateModal component with form elements and validation.
 */
function CreateModal({ isOpen, closeModalCreate, addAspect, nameError, setNameError, handleNameChange, formData }) {
    const [isLoading, setIsLoading] = useState(false);

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
        try {
            const { success, error } = await addAspect(formData.subject_id, formData.nombre);
            if (success) {
                toast.info('El aspecto ha sido registrado correctamente', {
                    icon: () => <img src={check} alt="Success Icon" />,
                    progressStyle: {
                        background: '#113c53',
                    }
                });
                closeModalCreate();
            } else {
                switch (error) {
                    case 'Aspect already exists':
                        toast.error('El aspecto ya existe. Cambia el nombre del aspecto e intenta nuevamente.');
                        break;
                    case 'No autorizado para crear un nuevo aspecto':
                        toast.error('No tienes autorización para registrar un nuevo aspecto.');
                        break;
                    case 'La materia no existe':
                        toast.error('La materia especificada no existe. Verifica la materia e intente de nuevo.');
                        break;
                    case 'Error de conexión durante la creación':
                        toast.error('Ocurrió un error de red. Revisa tu conexión a internet e intenta de nuevo.');
                        break;
                    case 'Error interno del servidor':
                        toast.error('Error interno del servidor. Intenta más tarde.');
                        break;
                    default:
                        toast.error('Ocurrió un error inesperado al registrar el aspecto. Intenta nuevamente.');
                }
            }
        } catch (error) {
            console.error(error);
            toast.error('Algo salió mal al crear el aspecto. Intenta de nuevo');
        } finally {
            setIsLoading(false);
        }
    };
    

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={closeModalCreate}
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
                            Registrar Nuevo Aspecto
                        </ModalHeader>
                        <ModalBody>
                            <form onSubmit={handleCreate}>
                                <div className="grid gap-4 mb-4 grid-cols-1">
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
                                        <label htmlFor="floating_nombre" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 peer-focus:left-0 peer-focus:text-primary peer-focus:dark:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Nombre del Aspecto</label>
                                        {nameError && <p className="mt-2 text-sm text-red">{nameError}</p>}
                                    </div>
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
                                            'Registrar Aspecto'
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
