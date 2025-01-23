import PropTypes from "prop-types";
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
import Progress from "./progress/Progress.jsx";

/**
 * CreateModal component
 *
 * This component allows users to register a new legal basis.
 * It includes dynamic validations based on jurisdiction, management of
 * aspects, states, and municipalities, and supports file uploads.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Object} props.config - Configuration object for the component.
 * @param {boolean} props.config.isOpen - Indicates whether the modal is open.
 * @param {Function} props.config.closeModalCreate - Function to close the modal.
 * @param {Function} props.config.goToArticles - Function to navigate to articles of the Legal Base.
 * @param {Object} props.config.formData - Form data for the legal basis.
 * @param {Function} props.config.addLegalBasis - Function to register a legal basis.
 * @param {string|null} props.config.nameError - Error message for the "Name" field.
 * @param {Function} props.config.setNameError - Function to set the "Name" field error message.
 * @param {Function} props.config.handleNameChange - Function to handle changes in the "Name" field.
 * @param {string|null} props.config.abbreviationError - Error message for the "Abbreviation" field.
 * @param {Function} props.config.setAbbreviationError - Function to set the "Abbreviation" field error message.
 * @param {Function} props.config.handleAbbreviationChange - Function to handle changes in the "Abbreviation" field.
 * @param {string|null} props.config.classificationError - Error message for the "Classification" field.
 * @param {Function} props.config.setClassificationError - Function to set the "Classification" field error message.
 * @param {Function} props.config.handleClassificationChange - Function to handle changes in the "Classification" field.
 * @param {string|null} props.config.jurisdictionError - Error message for the "Jurisdiction" field.
 * @param {Function} props.config.setJurisdictionError - Function to set the "Jurisdiction" field error message.
 * @param {Function} props.config.handleJurisdictionChange - Function to handle changes in the "Jurisdiction" field.
 * @param {Array<string>} props.config.states - List of states available for selection.
 * @param {string|null} props.config.stateError - Error message for the "State" field.
 * @param {Function} props.config.setStateError - Function to set the "State" field error message.
 * @param {boolean} props.config.isStateActive - Indicates whether the state field is active.
 * @param {Function} props.config.handleStateChange - Function to handle changes in the "State" field.
 * @param {Function} props.config.clearMunicipalities - Function to clear selected municipalities.
 * @param {Array<string>} props.config.municipalities - List of municipalities available for selection.
 * @param {string|null} props.config.municipalityError - Error message for the "Municipality" field.
 * @param {Function} props.config.setMunicipalityError - Function to set the "Municipality" field error message.
 * @param {boolean} props.config.isMunicipalityActive - Indicates whether the municipality field is active.
 * @param {boolean} props.config.loadingMunicipalities - Indicates if municipalities are loading.
 * @param {string|null} props.config.errorMunicipalities - Error message when municipalities cannot be loaded.
 * @param {Function} props.config.handleMunicipalityChange - Function to handle changes in the "Municipality" field.
 * @param {Array<Object>} props.config.subjects - List of subjects available for selection.
 * @param {string|null} props.config.subjectInputError - Error message for the "Subject" field.
 * @param {Function} props.config.setSubjectError - Function to set the "Subject" field error message.
 * @param {Function} props.config.handleSubjectChange - Function to handle changes in the "Subject" field.
 * @param {Array<Object>} props.config.aspects - List of aspects available for selection.
 * @param {string|null} props.config.aspectError - Error message for the "Aspects" field.
 * @param {Function} props.config.setAspectInputError - Function to set the "Aspects" field error message.
 * @param {boolean} props.config.isAspectsActive - Indicates whether the aspects field is active.
 * @param {boolean} props.config.aspectsLoading - Indicates if aspects are loading.
 * @param {string|null} props.config.errorAspects - Error message when aspects cannot be loaded.
 * @param {Function} props.config.handleAspectsChange - Function to handle changes in the "Aspects" field.
 * @param {string|null} props.config.lastReformError - Error message for the "Last Reform" field.
 * @param {Function} props.config.setLastReformError - Function to set the "Last Reform" field error message.
 * @param {Function} props.config.handleLastReformChange - Function to handle changes in the "Last Reform" field.
 * @param {Function} props.config.handleFileChange - Function to handle file uploads.
 * @param {string|null} props.config.fileError - Error message for the file upload field.
 * @param {Function} props.config.handleRemoveDocument - Function to handle document removal.
 * @param {string|null} props.config.checkboxInputError - Error message for the "Extract Articles" checkbox.
 * @param {Function} props.config.setCheckboxInputError - Function to set the checkbox error message.
 * @param {boolean} props.config.isCheckboxChecked - Indicates if the "Extract Articles" checkbox is checked.
 * @param {Function} props.config.handleCheckboxChange - Function to handle changes in the checkbox.
 *
 * @returns {JSX.Element} - Rendered CreateModal component.
 */

const CreateModal = ({ config }) => {
  const {
    isOpen,
    closeModalCreate,
    formData,
    goToArticles,
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
    aspectsLoading,
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
  } = config;

  const [isLoading, setIsLoading] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [legalBaseId, setLegalBaseId] = useState(null);
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
    setJobId(null);
    setShowProgress(false);
    setLegalBaseId(null);
    closeModalCreate();
  };

  const onComplete = () => {
    setJobId(null);
    setShowProgress(false);
    closeModalCreate();
    goToArticles(legalBaseId);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.name === "") {
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
        legalName: formData.name,
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
      const { success, error, jobId, legalBasis } = await addLegalBasis(
        legalBasisData
      );
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
          setJobId(jobId);
          setShowProgress(true);
          setLegalBaseId(legalBasis.id);
        }
      } else {
        toast.error(error);
      }
    } catch (error) {
      console.error(error);
      toast.error("Algo mal sucedió al registrar el fundamento. Intente de nuevo.");
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
            labelButton="Ver artículos"
          />
        ) : (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Registrar Nuevo Fundamento
            </ModalHeader>
            <ModalBody>
              <form onSubmit={handleCreate}>
                <div className="grid grid-cols-2 gap-6">
                  <div className="relative z-0 w-full group">
                    <input
                      type="text"
                      name="nombre"
                      id="floating_nombre"
                      value={formData.name}
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
                      placeholder=""
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
                          isLoading={aspectsLoading}
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
                    <span
                      className="block truncate"
                      title={
                        formData.document
                          ? formData.document.file.name
                          : "Selecciona un Documento"
                      }
                    >
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
                <div className="w-full mt-2 mb-3 flex items-start">
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
                  <p className="mb-2 text-sm text-red">{checkboxInputError}</p>
                )}
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
                    "Registrar Fundamento"
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
};

CreateModal.propTypes = {
  config: PropTypes.shape({
    isOpen: PropTypes.bool.isRequired,
    closeModalCreate: PropTypes.func.isRequired,
    formData: PropTypes.object.isRequired,
    goToArticles: PropTypes.func.isRequired,
    addLegalBasis: PropTypes.func.isRequired,
    nameError: PropTypes.string,
    setNameError: PropTypes.func.isRequired,
    handleNameChange: PropTypes.func.isRequired,
    abbreviationError: PropTypes.string,
    setAbbreviationError: PropTypes.func.isRequired,
    handleAbbreviationChange: PropTypes.func.isRequired,
    classificationError: PropTypes.string,
    setClassificationError: PropTypes.func.isRequired,
    handleClassificationChange: PropTypes.func.isRequired,
    jurisdictionError: PropTypes.string,
    setJurisdictionError: PropTypes.func.isRequired,
    handleJurisdictionChange: PropTypes.func.isRequired,
    states: PropTypes.array.isRequired,
    stateError: PropTypes.string,
    setStateError: PropTypes.func.isRequired,
    isStateActive: PropTypes.bool.isRequired,
    handleStateChange: PropTypes.func.isRequired,
    clearMunicipalities: PropTypes.func.isRequired,
    municipalities: PropTypes.array.isRequired,
    municipalityError: PropTypes.string,
    setMunicipalityError: PropTypes.func.isRequired,
    isMunicipalityActive: PropTypes.bool.isRequired,
    loadingMunicipalities: PropTypes.bool.isRequired,
    errorMunicipalities: PropTypes.object,
    handleMunicipalityChange: PropTypes.func.isRequired,
    subjects: PropTypes.array.isRequired,
    subjectInputError: PropTypes.string,
    setSubjectError: PropTypes.func.isRequired,
    handleSubjectChange: PropTypes.func.isRequired,
    aspects: PropTypes.array.isRequired,
    aspectError: PropTypes.string,
    setAspectInputError: PropTypes.func.isRequired,
    isAspectsActive: PropTypes.bool.isRequired,
    aspectsLoading: PropTypes.bool.isRequired,
    errorAspects: PropTypes.object,
    handleAspectsChange: PropTypes.func.isRequired,
    lastReformError: PropTypes.string,
    setLastReformError: PropTypes.func.isRequired,
    handleLastReformChange: PropTypes.func.isRequired,
    handleFileChange: PropTypes.func.isRequired,
    fileError: PropTypes.string,
    handleRemoveDocument: PropTypes.func.isRequired,
    checkboxInputError: PropTypes.string,
    setCheckboxInputError: PropTypes.func.isRequired,
    isCheckboxChecked: PropTypes.bool.isRequired,
    handleCheckboxChange: PropTypes.func.isRequired,
  }).isRequired,
};

export default CreateModal;
