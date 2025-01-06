/* eslint-disable react/prop-types */
import { useState, useRef } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  DatePicker,
  Select,
  SelectItem,
  Autocomplete,
  AutocompleteItem,
  Tooltip,
  Spinner,
  Link,
  Checkbox,
  Button,
} from "@nextui-org/react";
import { toast } from "react-toastify";
import { I18nProvider } from "@react-aria/i18n";
import check from "../../assets/check.png";
import cruz_icon from "../../assets/cruz.png";
import Progress from "./Progress";
/**
 * CreateModal component
 *
 * This component allows users to register a new legal basis.
 * It includes dynamic validations based on jurisdiction, management of
 * aspects, states, and municipalities, and supports file uploads.
 *
 * @component
 *
 * @param {Object} props - Component properties.
 * @param {boolean} props.isOpen - Indicates whether the modal is open.
 * @param {Function} props.closeModalCreate - Function to close the modal.
 * @param {Object} props.formData - Form data for the legal basis.
 * @param {Function} props.addLegalBasis - Function to register a legal basis.
 * @param {string|null} props.nameError - Error message for the "Name" field.
 * @param {Function} props.setNameError - Function to set the "Name" field error message.
 * @param {Function} props.handleNameChange - Function to handle changes in the "Name" field.
 * @param {string|null} props.abbreviationError - Error message for the "Abbreviation" field.
 * @param {Function} props.setAbbreviationError - Function to set the "Abbreviation" field error message.
 * @param {Function} props.handleAbbreviationChange - Function to handle changes in the "Abbreviation" field.
 * @param {string|null} props.classificationError - Error message for the "Classification" field.
 * @param {Function} props.setClassificationError - Function to set the "Classification" field error message.
 * @param {Function} props.handleClassificationChange - Function to handle changes in the "Classification" field.
 * @param {string|null} props.jurisdictionError - Error message for the "Jurisdiction" field.
 * @param {Function} props.setJurisdictionError - Function to set the "Jurisdiction" field error message.
 * @param {Function} props.handleJurisdictionChange - Function to handle changes in the "Jurisdiction" field.
 * @param {Array<string>} props.states - List of states available for selection.
 * @param {string|null} props.stateError - Error message for the "State" field.
 * @param {Function} props.setStateError - Function to set the "State" field error message.
 * @param {boolean} props.isStateActive - Indicates whether the state field is active.
 * @param {Function} props.handleStateChange - Function to handle changes in the "State" field.
 * @param {Function} props.clearMunicipalities - Function to clear selected municipalities.
 * @param {Array<string>} props.municipalities - List of municipalities available for selection.
 * @param {string|null} props.municipalityError - Error message for the "Municipality" field.
 * @param {Function} props.setMunicipalityError - Function to set the "Municipality" field error message.
 * @param {boolean} props.isMunicipalityActive - Indicates whether the municipality field is active.
 * @param {boolean} props.loadingMunicipalities - Indicates if municipalities are loading.
 * @param {string|null} props.errorMunicipalities - Error message when municipalities cannot be loaded.
 * @param {Function} props.handleMunicipalityChange - Function to handle changes in the "Municipality" field.
 * @param {Array<Object>} props.subjects - List of subjects available for selection.
 * @param {string|null} props.subjectInputError - Error message for the "Subject" field.
 * @param {Function} props.setSubjectError - Function to set the "Subject" field error message.
 * @param {Function} props.handleSubjectChange - Function to handle changes in the "Subject" field.
 * @param {Array<Object>} props.aspects - List of aspects available for selection.
 * @param {string|null} props.aspectError - Error message for the "Aspects" field.
 * @param {Function} props.setAspectInputError - Function to set the "Aspects" field error message.
 * @param {boolean} props.isAspectsActive - Indicates whether the aspects field is active.
 * @param {boolean} props.loadingAspects - Indicates if aspects are loading.
 * @param {string|null} props.errorAspects - Error message when aspects cannot be loaded.
 * @param {Function} props.handleAspectsChange - Function to handle changes in the "Aspects" field.
 * @param {string|null} props.lastReformError - Error message for the "Last Reform" field.
 * @param {Function} props.setLastReformError - Function to set the "Last Reform" field error message.
 * @param {Function} props.handleLastReformChange - Function to handle changes in the "Last Reform" field.
 * @param {Function} props.handleFileChange - Function to handle file uploads.
 * @param {string|null} props.fileError - Error message for the file upload field.
 * @param {Function} props.handleRemoveDocument - Function to handle document removal.
 * @param {string|null} props.checkboxInputError - Error message for the "Extract Articles" checkbox.
 * @param {Function} props.setCheckboxInputError - Function to set the checkbox error message.
 * @param {boolean} props.isCheckboxChecked - Indicates if the "Extract Articles" checkbox is checked.
 * @param {Function} props.handleCheckboxChange - Function to handle changes in the checkbox.
 *
 * @returns {JSX.Element} - Rendered CreateModal component.
 */
function CreateModal({
  isOpen,
  closeModalCreate,
  formData,
  addLegalBasis,
  nameError,
  setNameError,
  handleNameChange,
  abbreviationError,
  setAbbreviationError,
  handleAbbreviationChange,
  classificationError,
  setClassificationError,
  handleClassificationChange,
  jurisdictionError,
  setJurisdictionError,
  handleJurisdictionChange,
  states,
  stateError,
  setStateError,
  isStateActive,
  handleStateChange,
  clearMunicipalities,
  municipalities,
  municipalityError,
  setMunicipalityError,
  isMunicipalityActive,
  loadingMunicipalities,
  errorMunicipalities,
  handleMunicipalityChange,
  subjects,
  subjectInputError,
  setSubjectError,
  handleSubjectChange,
  aspects,
  aspectError,
  setAspectInputError,
  isAspectsActive,
  loadingAspects,
  errorAspects,
  handleAspectsChange,
  lastReformError,
  setLastReformError,
  handleLastReformChange,
  handleFileChange,
  fileError,
  handleRemoveDocument,
  checkboxInputError,
  setCheckboxInputError,
  isCheckboxChecked,
  handleCheckboxChange,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [jobId, setJobId] = useState(null);
  const inputFileRef = useRef(null);

  const getTooltipContentForState = () => {
    if (formData.jurisdiction === "Federal") {
      return "La jurisdicción debe ser estatal o local para habilitar este campo";
    }
    if (!formData.jurisdiction) {
      return "Debes seleccionar una jurisdicción para habilitar este campo.";
    }
    return null;
  };

  const getTooltipContentForMunicipality = () => {
    if (formData.jurisdiction === "Federal") {
      return "La jurisdicción debe ser local para habilitar este campo.";
    }
    if (formData.jurisdiction === "Estatal") {
      return "La jurisdicción debe ser local para habilitar este campo.";
    }
    if (formData.jurisdiction === "Local" && !formData.state) {
      return "Debes seleccionar un estado para habilitar este campo.";
    }
    if (!formData.jurisdiction) {
      return "Debes seleccionar una jurisdicción para habilitar este campo.";
    }
    return null;
  };


  const onClose = () => {
    setJobId(null)
    setShowProgress(false);
    closeModalCreate();
  };
  
  const onComplete = () => {
    setJobId(null)
    setShowProgress(false);
    closeModalCreate();
  };
  
  const handleCreate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.nombre === "") {
      setNameError("Este campo es obligatorio");
      setIsLoading(false);
      return;
    } else {
      setNameError(null);
    }

    if (formData.abbreviation === "") {
      setAbbreviationError("Este campo es obligatorio");
      setIsLoading(false);
      return;
    } else {
      setAbbreviationError(null);
    }

    if (formData.classification === "") {
      setClassificationError("Este campo es obligatorio");
      setIsLoading(false);
      return;
    } else {
      setClassificationError(null);
    }

    if (formData.jurisdiction === "") {
      setJurisdictionError("Este campo es obligatorio");
      setIsLoading(false);
      return;
    } else {
      setJurisdictionError(null);
    }

    if (formData.jurisdiction === "Estatal") {
      if (formData.state === "") {
        setStateError(
          "Este campo es obligatorio para la jurisdicción Estatal."
        );
        setIsLoading(false);
        return;
      } else {
        setStateError(null);
      }
    }

    if (formData.jurisdiction === "Local") {
      if (formData.state === "") {
        setStateError("Este campo es obligatorio para la jurisdicción Local.");
        setIsLoading(false);
        return;
      } else {
        setStateError(null);
      }
      if (formData.municipality === "") {
        setMunicipalityError(
          "Este campo es obligatorio para la jurisdicción Local."
        );
        setIsLoading(false);
        return;
      } else {
        setMunicipalityError(null);
      }
    }
    if (formData.subject === "") {
      setSubjectError("Este campo es obligatorio");
      setIsLoading(false);
      return;
    } else {
      setSubjectError(null);
    }
    if (!formData.aspects || formData.aspects.length === 0) {
      setAspectInputError("Debes seleccionar al menos un aspecto");
      setIsLoading(false);
      return;
    } else {
      setAspectInputError(null);
    }
    if (!formData.lastReform) {
      setLastReformError("Este campo es obligatorio");
      setIsLoading(false);
      return;
    }
    if (!formData.lastReform) {
      setLastReformError("Este campo es obligatorio");
      setIsLoading(false);
      return;
    }
    const reformDate = formData.lastReform.toDate();
    if (
      isNaN(reformDate.getTime()) ||
      reformDate.getFullYear() < 1900 ||
      reformDate.getFullYear() > 2099
    ) {
      setLastReformError(
        "La fecha de la última reforma está fuera del rango permitido (1900-2099)"
      );
      setIsLoading(false);
      return;
    } else {
      setLastReformError(null);
    }
    if (isCheckboxChecked && !formData.document) {
      setCheckboxInputError(
        "Debes cargar un documento si seleccionas 'Extraer Articulos'."
      );
      setIsLoading(false);
      return;
    } else {
      setCheckboxInputError(null);
    }

    try {
      const legalBasisData = {
        legalName: formData.nombre,
        abbreviation: formData.abbreviation,
        subjectId: formData.subject,
        aspectsIds: formData.aspects,
        classification: formData.classification,
        jurisdiction: formData.jurisdiction,
        state: formData.state,
        municipality: formData.municipality,
        lastReform: formData.lastReform.toString(),
        extractArticles: formData.extractArticles,
        ...(formData.document && { document: formData.document.file }),
      };

      const { success, error, jobId } = await addLegalBasis(legalBasisData);

      if (success) {
        toast.info("El fundamento legal ha sido registrado correctamente", {
          icon: () => <img src={check} alt="Success Icon" />,
          progressStyle: {
            background: "#113c53",
          },
        });

        if (!jobId) {
          onClose();
        } else {
          setJobId(jobId)
          setShowProgress(true);
        }
      } else {
        toast.error(error);
      }
    } catch (error) {
      console.error(error);
      toast.error("Algo mal sucedió al crear el fundamento. Intente de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      backdrop="opaque"
      placement="center"
      hideCloseButton={showProgress}
      isDismissable={false}
      isKeyboardDismissDisabled={showProgress}
      classNames={{
        closeButton: "hover:bg-primary/20 text-primary active:bg-primary/10",
      }}
    >
      <ModalContent>
      {showProgress ? (
          <Progress 
          jobId={jobId} 
          onComplete={onComplete}   
          onClose={onClose}
          labelTop="Podrás ver los artículos del fundamento cuando se hayan extraído del documento."
          labelButton="Ver artículos" />
        ) : (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Registrar Fundamento
            </ModalHeader>
            <ModalBody>
              <form onSubmit={handleCreate}>
                <div className="grid grid-cols-2 gap-6">
                  <div className="relative z-0 w-full group">
                    <input
                      type="text"
                      name="nombre"
                      id="floating_nombre"
                      value={formData.nombre}
                      onChange={handleNameChange}
                      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer"
                      placeholder=""
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
                  <div className="relative z-0 w-full group">
                    <input
                      type="text"
                      name=""
                      id="floating_abbreviation"
                      value={formData.abbreviation}
                      onChange={handleAbbreviationChange}
                      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer"
                      placeholder="Abreviatura"
                    />
                    <label
                      htmlFor="floating_abbreviation"
                      className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 peer-focus:left-0 peer-focus:text-primary peer-focus:dark:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                      Abreviatura
                    </label>
                    {abbreviationError && (
                      <p className="mt-2 text-sm text-red">
                        {abbreviationError}
                      </p>
                    )}
                  </div>
                  <div className="w-full">
                    <Autocomplete
                      size="sm"
                      variant="bordered"
                      label="Clasificación"
                      selectedKey={formData.classification}
                      onSelectionChange={handleClassificationChange}
                      listboxProps={{
                        emptyContent: "Clasificación no encontrada",
                      }}
                      disabledKeys={[
                        "Norma",
                        "Acuerdos",
                        "Código",
                        "Decreto",
                        "Lineamiento",
                        "Aviso",
                      ]}
                    >
                      <AutocompleteItem key="Ley">Ley</AutocompleteItem>
                      <AutocompleteItem key="Reglamento">
                        Reglamento
                      </AutocompleteItem>
                      <AutocompleteItem key="Norma">Norma</AutocompleteItem>
                      <AutocompleteItem key="Acuerdos">
                        Acuerdos
                      </AutocompleteItem>
                      <AutocompleteItem key="Código">Código</AutocompleteItem>
                      <AutocompleteItem key="Decreto">Decreto</AutocompleteItem>
                      <AutocompleteItem key="Lineamiento">
                        Lineamiento
                      </AutocompleteItem>
                      <AutocompleteItem key="Aviso">Aviso</AutocompleteItem>
                    </Autocomplete>
                    {classificationError && (
                      <p className="mt-2 text-sm text-red">
                        {classificationError}
                      </p>
                    )}
                  </div>
                  <div className="w-full">
                    <Autocomplete
                      size="sm"
                      variant="bordered"
                      label="Jurisdicción"
                      selectedKey={formData.jurisdiction}
                      onSelectionChange={handleJurisdictionChange}
                      listboxProps={{
                        emptyContent: "Jurisdicción no encontrada",
                      }}
                    >
                      <AutocompleteItem key="Federal">Federal</AutocompleteItem>
                      <AutocompleteItem key="Estatal">Estatal</AutocompleteItem>
                      <AutocompleteItem key="Local">Local</AutocompleteItem>
                    </Autocomplete>
                    {jurisdictionError && (
                      <p className="mt-2 text-sm text-red">
                        {jurisdictionError}
                      </p>
                    )}
                  </div>
                  <Tooltip
                    content={getTooltipContentForState()}
                    isDisabled={isStateActive}
                  >
                    <div className="w-full">
                      <Autocomplete
                        size="sm"
                        variant="bordered"
                        label="Estado"
                        placeholder="Buscar estado"
                        isDisabled={!isStateActive}
                        onClear={clearMunicipalities}
                        className="max-w-xs"
                        defaultItems={states.map((estado) => ({
                          id: estado,
                          name: estado,
                        }))}
                        selectedKey={formData.state}
                        onSelectionChange={handleStateChange}
                        listboxProps={{
                          emptyContent: "Estados no encontrados",
                        }}
                      >
                        {(estado) => (
                          <AutocompleteItem key={estado.id} value={estado.id}>
                            {estado.name}
                          </AutocompleteItem>
                        )}
                      </Autocomplete>
                      {stateError && (
                        <p className="mt-2 text-sm text-red">{stateError}</p>
                      )}
                    </div>
                  </Tooltip>

                  <div className="w-full">
                    <Tooltip
                      content={getTooltipContentForMunicipality()}
                      isDisabled={isMunicipalityActive || errorMunicipalities}
                    >
                      <div className="w-full">
                        <Autocomplete
                          size="sm"
                          variant="bordered"
                          label="Municipio"
                          isLoading={loadingMunicipalities}
                          selectedKey={formData.municipality}
                          listboxProps={{
                            emptyContent: "Municipios no encontrados",
                          }}
                          onSelectionChange={handleMunicipalityChange}
                          isDisabled={
                            !isMunicipalityActive || !!errorMunicipalities
                          }
                          defaultItems={municipalities.map((municipio) => ({
                            id: municipio,
                            name: municipio,
                          }))}
                        >
                          {(municipio) => (
                            <AutocompleteItem
                              key={municipio.id}
                              value={municipio.id}
                            >
                              {municipio.name}
                            </AutocompleteItem>
                          )}
                        </Autocomplete>
                      </div>
                    </Tooltip>

                    {errorMunicipalities && (
                      <p className="mt-2 text-sm text-red">
                        {errorMunicipalities.message}
                      </p>
                    )}
                    {!errorMunicipalities && municipalityError && (
                      <p className="mt-2 text-sm text-red">
                        {municipalityError}
                      </p>
                    )}
                  </div>
                  <div className="w-full">
                    <Autocomplete
                      size="sm"
                      variant="bordered"
                      label="Materia"
                      selectedKey={formData.subject}
                      onSelectionChange={handleSubjectChange}
                      listboxProps={{
                        emptyContent: "Materia no encontrado",
                      }}
                      defaultItems={subjects}
                    >
                      {(subject) => (
                        <AutocompleteItem key={subject.id} value={subject.id}>
                          {subject.subject_name}
                        </AutocompleteItem>
                      )}
                    </Autocomplete>
                    {subjectInputError && (
                      <p className="mt-2 text-sm text-red">
                        {subjectInputError}
                      </p>
                    )}
                  </div>
                  <div className="w-full">
                    <Tooltip
                      content="Debes seleccionar una materia para habilitar este campo."
                      isDisabled={isAspectsActive || errorAspects}
                    >
                      <div className="w-full">
                        <Select
                          size="sm"
                          variant="bordered"
                          label="Aspectos"
                          selectionMode="multiple"
                          isLoading={loadingAspects}
                          selectedKeys={formData.aspects}
                          onSelectionChange={handleAspectsChange}
                          isDisabled={!isAspectsActive || !!errorAspects}
                          items={aspects}
                          listboxProps={{
                            emptyContent: "Aspectos no encontrados",
                          }}
                        >
                          {(aspect) => (
                            <SelectItem key={aspect.id} value={aspect.id}>
                              {aspect.aspect_name}
                            </SelectItem>
                          )}
                        </Select>
                      </div>
                    </Tooltip>

                    {errorAspects && (
                      <p className="mt-2 text-sm text-red">
                        {errorAspects.message}
                      </p>
                    )}
                    {!errorAspects && aspectError && (
                      <p className="mt-2 text-sm text-red">{aspectError}</p>
                    )}
                  </div>
                </div>
                <div className="w-full mt-4">
                  <I18nProvider locale="es">
                    <DatePicker
                      showMonthAndYearPickers
                      value={formData.lastReform}
                      size="sm"
                      onChange={handleLastReformChange}
                      variant="bordered"
                      label="Última Reforma"
                    />
                  </I18nProvider>
                  {lastReformError && (
                    <p className="mt-2 text-sm text-red">{lastReformError}</p>
                  )}
                </div>

                <div className="w-full mt-4">
                  <button
                    type="button"
                    onClick={() => inputFileRef.current.click()}
                    className="w-full px-4 py-2 border rounded-md bg-gray-100 hover:bg-gray-200 hover:border-primary relative"
                  >
                    <span className="block truncate">
                      {formData.document
                        ? formData.document.file.name
                        : "Selecciona un Documento"}
                    </span>
                    {formData.document && (
                      <Tooltip content="Eliminar">
                        <Button
                          className="absolute -mt-7 right-2 bg-transparent z-10"
                          onPress={handleRemoveDocument}
                          auto
                          size="sm"
                          isIconOnly
                          variant="light"
                        >
                          <img
                            src={cruz_icon}
                            alt="Remove Icon"
                            className="w-3 h-3"
                          />
                        </Button>
                      </Tooltip>
                    )}
                  </button>
                  <input
                    type="file"
                    ref={inputFileRef}
                    onChange={handleFileChange}
                    accept=".pdf, .png, .jpeg"
                    className="hidden"
                  />
                  {fileError && (
                    <p className="mt-2 text-sm text-red">{fileError}</p>
                  )}
                  {formData.document?.previewUrl && (
                    <div className="flex items-center mt-2 gap-4">
                      <p className="text-sm">
                        Vista previa:{" "}
                        <Link
                          href={formData.document.previewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          underline="always"
                        >
                          Abrir documento
                        </Link>
                      </p>
                    </div>
                  )}
                </div>
                <div className="w-full mt-2 flex items-start">
                  <Checkbox
                    size="md"
                    isSelected={isCheckboxChecked}
                    onValueChange={(isChecked) =>
                      handleCheckboxChange(isChecked)
                    }
                  >
                    Extraer Articulos
                  </Checkbox>
                </div>
                {checkboxInputError && (
                  <p className="mt-2 text-sm text-red">{checkboxInputError}</p>
                )}
                <div>
                  <button
                    type="submit"
                    className="w-full rounded border mb-4 mt-4 border-primary bg-primary p-3 text-white transition hover:bg-opacity-90"
                  >
                    {isLoading ? (
                      <div role="status">
                        <Spinner size="sm" color="white" />
                      </div>
                    ) : (
                      "Registrar Fundamento"
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
