import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Autocomplete,
  AutocompleteItem,
  Tooltip,
  Textarea,
  Select,
  SelectItem,
  Button,
  Spinner,
} from "@heroui/react";
import { toast } from "react-toastify";
import check from "../../assets/check.png";
import go_back from "../../assets/volver.png";

/**
 * EditModal component
 *
 * This component allows users to edit a requirement.
 * It includes dynamic validations based on jurisdiction, management of
 * aspects, states, and municipalities, and supports file uploads.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Object} props.config - Configuration object for the component.
 * @param {boolean} props.config.isOpen - Whether the modal is open.
 * @param {Function} props.config.closeModalEdit - Function to close the modal.
 * @param {Object} props.config.selectedRequirement - The selected requirement to be edited.
 * @param {Function} props.config.setFormData - Setter function to populate form data.
 * @param {Object} props.config.formData - Object holding all form field values.
 * @param {Function} props.config.editRequirement - Function to submit the updated requirement.
 * @param {string|null} props.config.numberError - Error message for the "Number" input field.
 * @param {Function} props.config.setNumberError - Setter for "Number" field error.
 * @param {Function} props.config.handleNumberChange - Change handler for the "Number" input field.
 * @param {string|null} props.config.nameError - Error message for the "Name" input field.
 * @param {Function} props.config.setNameError - Setter for "Name" field error.
 * @param {Function} props.config.handleNameChange - Change handler for the "Name" input field.
 * @param {string|null} props.config.conditionError - Error message for the "Condition" dropdown.
 * @param {Function} props.config.setConditionError - Setter for "Condition" field error.
 * @param {Function} props.config.handleConditionChange - Change handler for the "Condition" dropdown.
 * @param {string|null} props.config.evidenceError - Error message for the "Evidence" dropdown.
 * @param {Function} props.config.setEvidenceError - Setter for "Evidence" field error.
 * @param {Function} props.config.handleEvidenceChange - Change handler for the "Evidence" dropdown.
 * @param {string|null} props.config.periodicityError - Error message for the "Periodicity" dropdown.
 * @param {Function} props.config.setPeriodicityError - Setter for "Periodicity" field error.
 * @param {Function} props.config.handlePeriodicityChange - Change handler for the "Periodicity" dropdown.
 * @param {string|null} props.config.jurisdictionError - Error message for the "Jurisdiction" dropdown.
 * @param {Function} props.config.setJurisdictionError - Setter for "Jurisdiction" field error.
 * @param {Function} props.config.handleJurisdictionChange - Change handler for the "Jurisdiction" dropdown.
 * @param {string|null} props.config.stateError - Error message for the "State" dropdown.
 * @param {Function} props.config.setStateError - Setter for "State" field error.
 * @param {Function} props.config.handleStateChange - Change handler for the "State" dropdown.
 * @param {string|null} props.config.municipalityError - Error message for the "Municipality" dropdown.
 * @param {Function} props.config.setMunicipalityError - Setter for "Municipality" field error.
 * @param {Function} props.config.handleMunicipalityChange - Change handler for the "Municipality" dropdown.
 * @param {string|null} props.config.subjectInputError - Error message for the "Subject" dropdown.
 * @param {Function} props.config.setSubjectError - Setter for "Subject" field error.
 * @param {Function} props.config.handleSubjectChange - Change handler for the "Subject" dropdown.
 * @param {string|null} props.config.aspectError - Error message for the "Aspect" dropdown.
 * @param {Function} props.config.setAspectInputError - Setter for "Aspect" field error.
 * @param {Function} props.config.handleAspectsChange - Change handler for the "Aspect" dropdown.
 * @param {string|null} props.config.requirementTypeError - Error message for the "Requirement Type" dropdown.
 * @param {Function} props.config.setRequirementTypeError - Setter for "Requirement Type" field error.
 * @param {Function} props.config.handleRequirementType - Change handler for the "Requirement Type" dropdown.
 * @param {string|null} props.config.mandatoryDescriptionError - Error for the "Mandatory Description" textarea.
 * @param {Function} props.config.setMandatoryDescriptionError - Setter for the "Mandatory Description" error.
 * @param {Function} props.config.handleMandatoryDescriptionChange - Handler for "Mandatory Description" textarea.
 * @param {string|null} props.config.complementaryDescriptionError - Error for the "Complementary Description" textarea.
 * @param {Function} props.config.setComplementaryDescriptionError - Setter for the "Complementary Description" error.
 * @param {Function} props.config.handleComplementaryDescriptionChange - Handler for "Complementary Description" textarea.
 * @param {string|null} props.config.mandatorySentencesError - Error for the "Mandatory Sentences" textarea.
 * @param {Function} props.config.setMandatorySentencesError - Setter for the "Mandatory Sentences" error.
 * @param {Function} props.config.handleMandatorySentencesChange - Handler for "Mandatory Sentences" textarea.
 * @param {string|null} props.config.complementarySentencesError - Error for the "Complementary Sentences" textarea.
 * @param {Function} props.config.setComplementarySentencesError - Setter for the "Complementary Sentences" error.
 * @param {Function} props.config.handleComplementarySentencesChange - Handler for "Complementary Sentences" textarea.
 * @param {string|null} props.config.mandatoryKeywordsError - Error for the "Mandatory Keywords" textarea.
 * @param {Function} props.config.setMandatoryKeywordsError - Setter for the "Mandatory Keywords" error.
 * @param {Function} props.config.handleMandatoryKeywordsChange - Handler for "Mandatory Keywords" textarea.
 * @param {string|null} props.config.complementaryKeywordsError - Error for the "Complementary Keywords" textarea.
 * @param {Function} props.config.setComplementaryKeywordsError - Setter for the "Complementary Keywords" error.
 * @param {Function} props.config.handleComplementaryKeywordsChange - Handler for "Complementary Keywords" textarea.
 * @param {Array} props.config.states - List of available states.
 * @param {boolean} props.config.isStateActive - Enables/disables the "State" dropdown.
 * @param {Function} props.config.clearMunicipalities - Clears municipalities when the state is changed.
 * @param {Array} props.config.municipalities - List of available municipalities.
 * @param {boolean} props.config.isMunicipalityActive - Enables/disables the "Municipality" dropdown.
 * @param {boolean} props.config.loadingMunicipalities - Indicates if municipalities are loading.
 * @param {Object|null} props.config.errorMunicipalities - Error object related to municipality fetching.
 * @param {Array} props.config.subjects - List of available subjects.
 * @param {boolean} props.config.isAspectsActive - Enables/disables the "Aspect" dropdown.
 * @param {boolean} props.config.aspectsLoading - Indicates if aspects are loading.
 * @param {Array} props.config.aspects - List of available aspects.
 * @param {Object|null} props.config.errorAspects - Error object related to aspect fetching.
 * @param {Function} props.config.setIsStateActive - Setter to enable/disable state input.
 * @param {Function} props.config.setIsMunicipalityActive - Setter to enable/disable municipality input.
 * @param {Function} props.config.setIsAspectsActive - Setter to enable/disable aspect input.
 * @param {Function} props.config.clearAspects - Clears the aspect list.
 * @param {Function} props.config.fetchMunicipalities - Fetches municipalities based on the state.
 * @param {Function} props.config.fetchAspects - Fetches aspects based on the subject.
 */
const EditModal = ({ config }) => {
  const {
    isOpen,
    closeModalEdit,
    selectedRequirement,
    setFormData,
    formData,
    editRequirement,
    numberError,
    setNumberError,
    handleNumberChange,
    nameError,
    setNameError,
    handleNameChange,
    conditionError,
    setConditionError,
    handleConditionChange,
    evidenceError,
    setEvidenceError,
    handleEvidenceChange,
    periodicityError,
    setPeriodicityError,
    handlePeriodicityChange,
    jurisdictionError,
    setJurisdictionError,
    handleJurisdictionChange,
    stateError,
    setStateError,
    handleStateChange,
    municipalityError,
    setMunicipalityError,
    handleMunicipalityChange,
    subjectInputError,
    setSubjectError,
    handleSubjectChange,
    aspectError,
    setAspectInputError,
    handleAspectsChange,
    requirementTypeError,
    setRequirementTypeError,
    handleRequirementType,
    mandatoryDescriptionError,
    setMandatoryDescriptionError,
    handleMandatoryDescriptionChange,
    complementaryDescriptionError,
    setComplementaryDescriptionError,
    handleComplementaryDescriptionChange,
    mandatorySentencesError,
    setMandatorySentencesError,
    handleMandatorySentencesChange,
    complementarySentencesError,
    setComplementarySentencesError,
    handleComplementarySentencesChange,
    mandatoryKeywordsError,
    setMandatoryKeywordsError,
    handleMandatoryKeywordsChange,
    complementaryKeywordsError,
    setComplementaryKeywordsError,
    handleComplementaryKeywordsChange,
    states,
    isStateActive,
    clearMunicipalities,
    municipalities,
    isMunicipalityActive,
    loadingMunicipalities,
    fetchMunicipalities,
    errorMunicipalities,
    subjects,
    fetchAspects,
    clearAspects,
    isAspectsActive,
    setIsMunicipalityActive,
    aspectsLoading,
    setIsStateActive,
    setIsAspectsActive,
    aspects,
    errorAspects,
  } = config;

  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (selectedRequirement) {
      setFormData({
        id: selectedRequirement.id,
        number: selectedRequirement.requirement_number,
        name: selectedRequirement.requirement_name,
        condition: selectedRequirement.condition,
        evidence: selectedRequirement.evidence,
        periodicity: selectedRequirement.periodicity,
        jurisdiction: selectedRequirement.jurisdiction,
        state: selectedRequirement.state,
        municipality: selectedRequirement.municipality,
        subject: selectedRequirement.subject?.subject_id.toString(),
        aspects: selectedRequirement.aspects?.map((aspect) =>
          aspect.aspect_id.toString()
        ),
        requirementType: selectedRequirement.requirement_type,
        mandatoryDescription: selectedRequirement.mandatory_description,
        complementaryDescription: selectedRequirement.complementary_description,
        mandatorySentences: selectedRequirement.mandatory_sentences,
        complementarySentences: selectedRequirement.complementary_sentences,
        mandatoryKeywords: selectedRequirement.mandatory_keywords,
        complementaryKeywords: selectedRequirement.complementary_keywords,
      });
      switch (selectedRequirement.jurisdiction) {
        case "Federal":
          setIsStateActive(false);
          setIsMunicipalityActive(false);
          clearMunicipalities();
          break;
        case "Estatal":
          setIsStateActive(true);
          setIsMunicipalityActive(false);
          clearMunicipalities();
          break;
        case "Local":
          setIsStateActive(true);
          setIsMunicipalityActive(!!selectedRequirement.state);
          if (selectedRequirement.state) {
            fetchMunicipalities(selectedRequirement.state);
          }
          break;
        default:
          setIsStateActive(false);
          setIsMunicipalityActive(false);
          clearMunicipalities();
          break;
      }

      if (selectedRequirement.subject) {
        setIsAspectsActive(true);
        fetchAspects(selectedRequirement.subject.subject_id);
      } else {
        setIsAspectsActive(false);
        clearAspects();
      }
    }
  }, [selectedRequirement,
    setFormData,
    setIsStateActive,
    setIsMunicipalityActive,
    setIsAspectsActive,
    clearMunicipalities,
    fetchMunicipalities,
    fetchAspects,
    clearAspects,
  ]);

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



  const handleBack = () => setStep(1);

  const handleEdit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (step === 1) {
      if (formData.number === "") {
        setNumberError("Este campo es obligatorio.");
        setIsLoading(false);
        return;
      } else {
        setNumberError(null);
      }

      if (!formData.name.trim()) {
        setNameError("Este campo es obligatorio.");
        setIsLoading(false);
        return;
      } else {
        setNameError(null);
      }

      if (formData.condition === "") {
        setConditionError("Debes seleccionar una condición.");
        setIsLoading(false);
        return;
      } else {
        setConditionError(null);
      }

      if (formData.evidence === "") {
        setEvidenceError("Debes seleccionar una evidencia.");
        setIsLoading(false);
        return;
      } else {
        setEvidenceError(null);
      }

      if (formData.periodicity === "") {
        setPeriodicityError("Debes seleccionar una periodicidad.");
        setIsLoading(false);
        return;
      } else {
        setPeriodicityError(null);
      }
      if (formData.jurisdiction === "") {
        setJurisdictionError("Debes seleccionar una jurisdicción.");
        setIsLoading(false);
        return;
      } else {
        setJurisdictionError(null);
      }

      if (formData.jurisdiction === "Estatal" && formData.state === "") {
        setStateError("Este campo es obligatorio para la jurisdicción Estatal.");
        setIsLoading(false);
        return;
      } else {
        setStateError(null);
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
          setMunicipalityError("Este campo es obligatorio para la jurisdicción Local.");
          setIsLoading(false);
          return;
        } else {
          setMunicipalityError(null);
        }
      }

      if (formData.subject === "") {
        setSubjectError("Debes seleccionar una materia.");
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
      if (formData.requirementType === "") {
        setRequirementTypeError("Debes seleccionar un tipo de requerimiento.");
        setIsLoading(false);
        return;
      } else {
        setRequirementTypeError(null);
      }
      setIsLoading(false);
      setStep(2);
      return;
    }

    if (step === 2) {
      if (formData.mandatoryDescription === "") {
        setMandatoryDescriptionError("Este campo es obligatorio.");
        setIsLoading(false);
        return;
      } else {
        setMandatoryDescriptionError(null);
      }

      if (formData.complementaryDescription === "") {
        setComplementaryDescriptionError("Este campo es obligatorio.");
        setIsLoading(false);
        return;
      } else {
        setComplementaryDescriptionError(null);
      }
      if (formData.mandatorySentences === "") {
        setMandatorySentencesError("Este campo es obligatorio.");
        setIsLoading(false);
        return;
      } else {
        setMandatorySentencesError(null);
      }
      if (formData.complementarySentences === "") {
        setComplementarySentencesError("Este campo es obligatorio.");
        setIsLoading(false);
        return;
      } else {
        setComplementarySentencesError(null);
      }
      if (formData.mandatoryKeywords === "") {
        setMandatoryKeywordsError("Este campo es obligatorio.");
        setIsLoading(false);
        return;
      } else {
        setMandatoryKeywordsError(null);
      }
      if (formData.complementaryKeywords === "") {
        setComplementaryKeywordsError("Este campo es obligatorio.");
        setIsLoading(false);
        return;
      } else {
        setComplementaryKeywordsError(null);
      }
    }
    try {
      const requirementData = {
        id: formData.id,
        requirementNumber: formData.number,
        requirementName: formData.name,
        condition: formData.condition,
        evidence: formData.evidence,
        periodicity: formData.periodicity,
        requirementType: formData.requirementType,
        jurisdiction: formData.jurisdiction,
        state: formData.state,
        municipality: formData.municipality,
        subjectId: formData.subject,
        aspectsIds: formData.aspects,
        mandatoryDescription: formData.mandatoryDescription,
        complementaryDescription: formData.complementaryDescription,
        mandatorySentences: formData.mandatorySentences,
        complementarySentences: formData.complementarySentences,
        mandatoryKeywords: formData.mandatoryKeywords,
        complementaryKeywords: formData.complementaryKeywords,
      };
      const { success, error } = await editRequirement(
        requirementData
      );
      if (success) {
        toast.info("El requerimiento ha sido actualizado correctamente", {
          icon: () => <img src={check} alt="Success Icon" />,
          progressStyle: {
            background: "#113c53",
          },
        });
        closeModalEdit()
      } else {
        toast.error(error);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        "Algo mal sucedió al actualizar el requerimiento. Intente de nuevo."
      );
    } finally {
      setIsLoading(false);
    }

  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModalEdit}
      backdrop="opaque"
      placement="center"
      isDismissable={false}
      className="w-[60vw] max-w-2xl"
      classNames={{
        closeButton: "hover:bg-primary/20 text-primary active:bg-primary/10",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex items-center gap-2">
          {step === 1 ? (
            "Editar Requerimiento"
          ) : (
            <>
              <button
                onClick={handleBack}
                type="button"
                className="text-sm text-primary hover:text-primary/60 transition-colors flex items-center gap-2"
              >
                <img
                  src={go_back}
                  alt="Volver al inicio"
                  className="w-6 h-6 inline-block"
                />
              </button>
              <span>Detalles Adicionales</span>
            </>
          )}
        </ModalHeader>
        <ModalBody>
          <div className="transition-opacity duration-300 ease-in-out">
            {step === 1 ? (
              <form onSubmit={handleEdit}>
                <div className="grid grid-cols-2 gap-6">
                  <div className="relative z-0 w-full group">
                    <input
                      type="text"
                      name="number"
                      id="floating_number"
                      value={formData.number}
                      onChange={handleNumberChange}
                      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer"
                      placeholder=""
                    />
                    <label
                      htmlFor="floating_number"
                      className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 peer-focus:left-0 peer-focus:text-primary peer-focus:dark:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                      Número
                    </label>
                    {numberError && (
                      <p className="mt-2 text-sm text-red">{numberError}</p>
                    )}
                  </div>
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
                  <div className="w-full">
                    <Autocomplete
                      size="sm"
                      variant="bordered"
                      label="Condición"
                      selectedKey={formData.condition}
                      onSelectionChange={handleConditionChange}
                      listboxProps={{
                        emptyContent: "Condición no encontrada",
                      }}
                    >
                      <AutocompleteItem key="Crítica">Crítica</AutocompleteItem>
                      <AutocompleteItem key="Operativa">Operativa</AutocompleteItem>
                      <AutocompleteItem key="Recomendación">Recomendación</AutocompleteItem>
                      <AutocompleteItem key="Pendiente">Pendiente</AutocompleteItem>
                    </Autocomplete>
                    {conditionError && (
                      <p className="mt-2 text-sm text-red">
                        {conditionError}
                      </p>
                    )}
                  </div>
                  <div className="w-full">
                    <Autocomplete
                      size="sm"
                      variant="bordered"
                      label="Evidencia"
                      selectedKey={formData.evidence}
                      onSelectionChange={handleEvidenceChange}
                      listboxProps={{
                        emptyContent: "Evidencia no encontrada",
                      }}
                    >
                      <AutocompleteItem key="Trámite">Trámite</AutocompleteItem>
                      <AutocompleteItem key="Registro">Registro</AutocompleteItem>
                      <AutocompleteItem key="Específico">Específico</AutocompleteItem>
                      <AutocompleteItem key="Documento">Documento</AutocompleteItem>
                    </Autocomplete>
                    {evidenceError && (
                      <p className="mt-2 text-sm text-red">
                        {evidenceError}
                      </p>
                    )}
                  </div>
                  <div className="w-full">
                    <Autocomplete
                      size="sm"
                      variant="bordered"
                      label="Periodicidad"
                      selectedKey={formData.periodicity}
                      onSelectionChange={handlePeriodicityChange}
                      listboxProps={{
                        emptyContent: "Periodicidad no encontrada",
                      }}
                    >
                      <AutocompleteItem key="Anual">Anual</AutocompleteItem>
                      <AutocompleteItem key="2 años">2 años</AutocompleteItem>
                      <AutocompleteItem key="Por evento">Por evento</AutocompleteItem>
                      <AutocompleteItem key="Única vez">Única vez</AutocompleteItem>
                    </Autocomplete>
                    {periodicityError && (
                      <p className="mt-2 text-sm text-red">
                        {periodicityError}
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
                  <Autocomplete
                    size="sm"
                    variant="bordered"
                    className="w-full py-2"
                    label="Tipo de Requerimiento"
                    selectedKey={formData.requirementType}
                    onSelectionChange={handleRequirementType}
                    listboxProps={{
                      emptyContent: "Tipo de Requerimiento no encontrada",
                    }}
                  >
                    <AutocompleteItem key="Identificación Estatal">Identificación Estatal</AutocompleteItem>
                    <AutocompleteItem key="Identificación Federal">Identificación Federal</AutocompleteItem>
                    <AutocompleteItem key="Identificación Local">Identificación Local</AutocompleteItem>
                    <AutocompleteItem key="Requerimiento Compuesto">Requerimiento Compuesto</AutocompleteItem>
                    <AutocompleteItem key="Requerimiento Compuesto e Identificación">Requerimiento Compuesto e Identificación</AutocompleteItem>
                    <AutocompleteItem key="Requerimiento Estatal">Requerimiento Estatal</AutocompleteItem>
                    <AutocompleteItem key="Requerimiento Local">Requerimiento Local</AutocompleteItem>
                  </Autocomplete>
                  {requirementTypeError && (
                    <p className="mt-2 text-sm text-red">
                      {requirementTypeError}
                    </p>
                  )}
                </div>
                <div className="w-full mt-4">
                  <Button
                    type="submit"
                    color="primary"
                    disabled={isLoading}
                    className="w-full rounded border mb-4 border-primary bg-primary p-3 text-white transition hover:bg-opacity-90"
                  >
                    {isLoading ? (
                      <Spinner size="sm" color="white" />
                    ) : (
                      "Siguiente"
                    )}
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleEdit}>
                <div className="grid  grid-cols-2 gap-6">
                  <div className="w-full">
                    <Textarea
                      disableAnimation
                      disableAutosize
                      value={formData.mandatoryDescription}
                      onChange={handleMandatoryDescriptionChange}
                      classNames={{
                        base: "max-w-lg",
                        input: "resize-y py-1 px-2 w-full text-xs text-gray-900 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-primary peer",
                      }}
                      label="Descripción Obligatoria"
                      placeholder=""
                      variant="bordered"
                    />
                    {mandatoryDescriptionError && (
                      <p className="mt-2 text-sm text-red">{mandatoryDescriptionError}</p>
                    )}
                  </div>
                  <div className="w-full">
                    <Textarea
                      disableAnimation
                      disableAutosize
                      value={formData.complementaryDescription}
                      onChange={handleComplementaryDescriptionChange}
                      classNames={{
                        base: "max-w",
                        input: "resize-y py-1 px-2 w-full text-xs text-gray-900 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-primary peer",
                      }}
                      label="Descripción Complementaria"
                      placeholder=""
                      variant="bordered"
                    />
                    {complementaryDescriptionError && (
                      <p className="mt-2 text-sm text-red">{complementaryDescriptionError}</p>
                    )}
                  </div>

                  <div className="w-full">
                    <Textarea
                      disableAnimation
                      disableAutosize
                      value={formData.mandatorySentences}
                      onChange={handleMandatorySentencesChange}
                      classNames={{
                        base: "max-w",
                        input: "resize-y py-1 px-2 w-full text-xs text-gray-900 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-primary peer",
                      }}
                      label="Frases Obligatorias"
                      placeholder=""
                      variant="bordered"
                    />
                    {mandatorySentencesError && (
                      <p className="mt-2 text-sm text-red">{mandatorySentencesError}</p>
                    )}
                  </div>

                  <div className="w-full">
                    <Textarea
                      disableAnimation
                      disableAutosize
                      value={formData.complementarySentences}
                      onChange={handleComplementarySentencesChange}
                      classNames={{
                        base: "max-w",
                        input: "resize-y py-1 px-2 w-full text-xs text-gray-900 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-primary peer",
                      }}
                      label="Frases Complementarias"
                      placeholder=""
                      variant="bordered"
                    />
                    {complementarySentencesError && (
                      <p className="mt-2 text-sm text-red">{complementarySentencesError}</p>
                    )}
                  </div>

                  <div className="w-full">
                    <Textarea
                      disableAnimation
                      disableAutosize
                      value={formData.mandatoryKeywords}
                      onChange={handleMandatoryKeywordsChange}
                      classNames={{
                        base: "max-w",
                        input: "resize-y py-1 px-2 w-full text-xs text-gray-900 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-primary peer",
                      }}
                      label="Palabras Clave Obligatorias"
                      placeholder=""
                      variant="bordered"
                    />
                    {mandatoryKeywordsError && (
                      <p className="mt-2 text-sm text-red">{mandatoryKeywordsError}</p>
                    )}
                  </div>

                  <div className="w-full">
                    <Textarea
                      disableAnimation
                      disableAutosize
                      value={formData.complementaryKeywords}
                      onChange={handleComplementaryKeywordsChange}
                      classNames={{
                        base: "max-w",
                        input: "resize-y py-1 px-2 w-full text-xs text-gray-900 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-primary peer",
                      }}
                      label="Palabras Clave Complementarias"
                      placeholder=""
                      variant="bordered"
                    />
                    {complementaryKeywordsError && (
                      <p className="mt-2 text-sm text-red">{complementaryKeywordsError}</p>
                    )}
                  </div>

                </div>
                <div className="w-full mt-4">
                  <Button
                    type="submit"
                    color="primary"
                    disabled={isLoading}
                    className="w-full rounded border mb-4 border-primary bg-primary p-3 text-white transition hover:bg-opacity-90"
                  >
                    {isLoading ? <Spinner size="sm" color="white" /> : "Guardar Cambios"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

EditModal.propTypes = {
  config: PropTypes.shape({
    isOpen: PropTypes.bool.isRequired,
    closeModalEdit: PropTypes.func.isRequired,
    selectedRequirement: PropTypes.object,
    setFormData: PropTypes.func.isRequired,
    formData: PropTypes.object.isRequired,
    editRequirement: PropTypes.func.isRequired,

    numberError: PropTypes.string,
    setNumberError: PropTypes.func.isRequired,
    handleNumberChange: PropTypes.func.isRequired,

    nameError: PropTypes.string,
    setNameError: PropTypes.func.isRequired,
    handleNameChange: PropTypes.func.isRequired,

    conditionError: PropTypes.string,
    setConditionError: PropTypes.func.isRequired,
    handleConditionChange: PropTypes.func.isRequired,

    evidenceError: PropTypes.string,
    setEvidenceError: PropTypes.func.isRequired,
    handleEvidenceChange: PropTypes.func.isRequired,

    periodicityError: PropTypes.string,
    setPeriodicityError: PropTypes.func.isRequired,
    handlePeriodicityChange: PropTypes.func.isRequired,

    jurisdictionError: PropTypes.string,
    setJurisdictionError: PropTypes.func.isRequired,
    handleJurisdictionChange: PropTypes.func.isRequired,

    stateError: PropTypes.string,
    setStateError: PropTypes.func.isRequired,
    handleStateChange: PropTypes.func.isRequired,

    municipalityError: PropTypes.string,
    setMunicipalityError: PropTypes.func.isRequired,
    handleMunicipalityChange: PropTypes.func.isRequired,

    subjectInputError: PropTypes.string,
    setSubjectError: PropTypes.func.isRequired,
    handleSubjectChange: PropTypes.func.isRequired,

    aspectError: PropTypes.string,
    setAspectInputError: PropTypes.func.isRequired,
    handleAspectsChange: PropTypes.func.isRequired,

    requirementTypeError: PropTypes.string,
    setRequirementTypeError: PropTypes.func.isRequired,
    handleRequirementType: PropTypes.func.isRequired,

    mandatoryDescriptionError: PropTypes.string,
    setMandatoryDescriptionError: PropTypes.func.isRequired,
    handleMandatoryDescriptionChange: PropTypes.func.isRequired,

    complementaryDescriptionError: PropTypes.string,
    setComplementaryDescriptionError: PropTypes.func.isRequired,
    handleComplementaryDescriptionChange: PropTypes.func.isRequired,

    mandatorySentencesError: PropTypes.string,
    setMandatorySentencesError: PropTypes.func.isRequired,
    handleMandatorySentencesChange: PropTypes.func.isRequired,

    complementarySentencesError: PropTypes.string,
    setComplementarySentencesError: PropTypes.func.isRequired,
    handleComplementarySentencesChange: PropTypes.func.isRequired,

    mandatoryKeywordsError: PropTypes.string,
    setMandatoryKeywordsError: PropTypes.func.isRequired,
    handleMandatoryKeywordsChange: PropTypes.func.isRequired,

    complementaryKeywordsError: PropTypes.string,
    setComplementaryKeywordsError: PropTypes.func.isRequired,
    handleComplementaryKeywordsChange: PropTypes.func.isRequired,

    states: PropTypes.array.isRequired,
    isStateActive: PropTypes.bool.isRequired,
    clearMunicipalities: PropTypes.func.isRequired,

    municipalities: PropTypes.array.isRequired,
    isMunicipalityActive: PropTypes.bool.isRequired,
    loadingMunicipalities: PropTypes.bool.isRequired,
    errorMunicipalities: PropTypes.object,

    subjects: PropTypes.array.isRequired,
    isAspectsActive: PropTypes.bool.isRequired,
    aspectsLoading: PropTypes.bool.isRequired,
    aspects: PropTypes.array.isRequired,
    errorAspects: PropTypes.object,

    setIsStateActive: PropTypes.func.isRequired,
    setIsMunicipalityActive: PropTypes.func.isRequired,
    setIsAspectsActive: PropTypes.func.isRequired,
    clearAspects: PropTypes.func.isRequired,
    fetchMunicipalities: PropTypes.func.isRequired,
    fetchAspects: PropTypes.func.isRequired,

  }).isRequired,
};

export default EditModal;
