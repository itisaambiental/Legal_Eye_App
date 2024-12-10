/* eslint-disable react/prop-types */
import { toast } from 'react-toastify';
import { useState } from 'react';
import { useRef } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, Spinner, Select, SelectItem, Checkbox, DatePicker } from "@nextui-org/react";
import check from "../../assets/check.png";

/**
 * CreateModal component for Legal Basis
 * 
 * This component provides a form for creating a new Legal Basis.
 * Validation is performed for the required field, and appropriate error messages are shown.
 * The form submission triggers the addLegalBasis function to create the Legal Basis, and feedback is
 * displayed to the user based on the response.
 * 
 * @component
 * @param {Object} props - Component properties.
 * @param {boolean} props.isOpen - Controls whether the modal is open.
 * @param {Function} props.closeModalCreate - Function to close the modal.
 * @param {Function} props.addLegalBasis - Function to add a new Legal Basis.
 * @param {string|null} props.nameError - Error message for the Legal Basis name input field.
 * @param {Function} props.setNameError - Setter function for nameError.
 * @param {Function} props.handleNameChange - Handler for Legal Basis name input change.
 * @param {Object} formData - Form data containing the Legal Basis data.
 * 
 * @returns {JSX.Element} Rendered CreateModal component with form elements and validation.
 */
function CreateModal({ isOpen, closeModalCreate, addLegalBasis, nameError, setNameError, handleNameChange, formData }) {
    const [isLoading, setIsLoading] = useState(false);
    const inputFileRef = useRef(null);

    // const handleCreate = async (e) => {
    //     e.preventDefault();
    //     setIsLoading(true);
    //     if (formData.nombre === '') {
    //         setNameError('Este campo es obligatorio');
    //         setIsLoading(false);
    //         return;
    //     } else {
    //         setNameError(null);
    //     }

    // };

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
                <ModalHeader className="flex flex-col gap-1 text-center">
                  Registrar Nueva Fundamento
                </ModalHeader>
                <ModalBody>
                  <form>
                    <div className="flex flex-col items-center justify-center gap-6">
                      {/* Nombre */}
                      <div className="relative z-0 w-full max-w-lg group">
                        <input
                          type="text"
                          name="nombre"
                          id="floating_nombre"
                          value={formData.nombre}
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
                        {nameError && <p className="mt-2 text-sm text-red">{nameError}</p>}
                      </div>
    
                      {/* Abbreviation */}
                      <div className="relative z-0 w-full max-w-lg group">
                        <input
                          type="text"
                          name="abbreviation"
                          id="floating_abbreviation"
                          value={formData.abbreviation}
                          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer"
                          placeholder=" "
                        />
                        <label
                          htmlFor="floating_abbreviation"
                          className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 peer-focus:left-0 peer-focus:text-primary peer-focus:dark:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                          Abreviatura
                        </label>
                      </div>
                      <div className="w-full max-w-lg">
                        <Select variant='bordered' label="Materia">
                          <SelectItem key="1">Materia 1</SelectItem>
                          <SelectItem key="2">Materia 2</SelectItem>
                        </Select>
                      </div>
                      <div className="w-full max-w-lg">
                        <Select variant='bordered' selectionMode="multiple" label="Aspectos">
                          <SelectItem key="1">Aspecto 1</SelectItem>
                          <SelectItem key="2">Aspecto 2</SelectItem>
                        </Select>
                      </div>

                      <div className="w-full max-w-lg">
                        <Select variant='bordered' label="Estado">
                          <SelectItem key="1">Estado 1</SelectItem>
                          <SelectItem key="2">Estado 2</SelectItem>
                        </Select>
                      </div>
                      <div className="w-full max-w-lg">
                        <Select variant='bordered' label="Municipios">
                          <SelectItem key="1">Municipio 1</SelectItem>
                          <SelectItem key="2">Municipio 2</SelectItem>
                        </Select>
                      </div>
                      <div className="w-full max-w-lg">
                        <DatePicker showMonthAndYearPickers label="Última Reforma" variant="bordered" />
                      </div>

                      <div className="relative z-0 w-full max-w-lg group">
                        <input
                          type="file"
                          name="document"
                          id="document"
                          accept=".png, .jpg, .jpeg, .pdf"
                          ref={inputFileRef}
                          className="hidden"
                        />
                        <label
                          htmlFor="document"
                          className="block py-2.5 px-0 text-sm text-gray-500 dark:text-gray-400 cursor-pointer"
                        >
                          Cargar Documento
                        </label>
                      </div>
                      <div className="w-full max-w-lg">
                        <Checkbox defaultSelected={formData.extractArticles} radius="full">
                          Extraer Artículos
                        </Checkbox>
                      </div>
                    </div>
    
                    <div className="w-full flex justify-center mt-4">
                      <button
                        type="submit"
                        className="w-full max-w-lg rounded border mb-4 border-primary bg-primary p-3 text-white transition hover:bg-opacity-90"
                      >
                        Registrar Fundamento
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
