import { useState, useRef } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Select,
  SelectItem,
  Checkbox,
  DatePicker,
} from "@nextui-org/react";
import {I18nProvider} from "@react-aria/i18n";

function CreateModal({
  isOpen,
  closeModalCreate,
  nameError,
  handleNameChange,
  formData,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const inputFileRef = useRef(null);

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
              Registrar Nueva Fundamento
            </ModalHeader>
            <ModalBody>
              <form>
                <div className="grid grid-cols-2 gap-6">
                  {/* Nombre */}
                  <div className="relative z-0 w-full group">
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
                    {nameError && (
                      <p className="mt-2 text-sm text-red">{nameError}</p>
                    )}
                  </div>

                  {/* Abbreviation */}
                  <div className="relative z-0 w-full group">
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

                  {/* Clasificación */}
                  <div className="w-full">
                    <Select size="sm" variant="bordered" label="Clasificación">
                      <SelectItem key="1">Clasificación 1</SelectItem>
                      <SelectItem key="2">Clasificación 2</SelectItem>
                    </Select>
                  </div>

                  {/* Jurisdicción */}
                  <div className="w-full">
                    <Select size="sm" variant="bordered" label="Jurisdicción">
                      <SelectItem key="1">Jurisdicción 1</SelectItem>
                      <SelectItem key="2">Jurisdicción 2</SelectItem>
                    </Select>
                  </div>

                  {/* Estado */}
                  <div className="w-full">
                    <Select
                      size="sm"
                      variant="bordered"
                      label="Estado"
                      isDisabled
                    >
                      <SelectItem key="1">Estado 1</SelectItem>
                      <SelectItem key="2">Estado 2</SelectItem>
                    </Select>
                  </div>

                  {/* Municipios */}
                  <div className="w-full">
                    <Select
                      size="sm"
                      variant="bordered"
                      label="Municipios"
                      isDisabled
                    >
                      <SelectItem key="1">Municipio 1</SelectItem>
                      <SelectItem key="2">Municipio 2</SelectItem>
                    </Select>
                  </div>

                  {/* Materia */}
                  <div className="w-full">
                    <Select size="sm" variant="bordered" label="Materia">
                      <SelectItem key="1">Materia 1</SelectItem>
                      <SelectItem key="2">Materia 2</SelectItem>
                    </Select>
                  </div>

                  {/* Aspectos */}
                  <div className="w-full">
                    <Select
                      size="sm"
                      variant="bordered"
                      selectionMode="multiple"
                      label="Aspectos"
                      isDisabled
                    >
                      <SelectItem key="1">Aspecto 1</SelectItem>
                      <SelectItem key="2">Aspecto 2</SelectItem>
                    </Select>
                  </div>

                  {/* Última Reforma */}
                  <div className="w-full col-span-2">
                  <I18nProvider locale="es">
                    <DatePicker
                      size="sm"
                      showMonthAndYearPickers
                      label="Última Reforma"
                      variant="bordered"
                    />
                    </I18nProvider>
                  </div>

                  {/* Documento */}
                  <div className="w-full col-span-2">
                    <button
                      type="button"
                      onClick={() => inputFileRef.current.click()}
                      className="relative z-20 w-full appearance-none rounded-lg border border-stroke bg-transparent px-5 py-[10px] text-dark-6 outline-none transition focus:border-primary active:border-primary hover:border-primary cursor-pointer"
                    >
                      <span className="block truncate">Seleccionar Documento</span>
                    </button>
                    <input
                      type="file"
                      name="profile_picture"
                      id="profile_picture"
                      accept=".png, .jpg, .jpeg, .webp"
                      className="hidden"
                      ref={inputFileRef}
                    />
                  </div>

                  {/* Extraer Artículos */}
                  <div className="w-full">
                    <Checkbox
                      defaultSelected={formData.extractArticles}
                      radius="full"
                    >
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
