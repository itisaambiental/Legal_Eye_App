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
 * @param {string|null} props.config.specifyEvidenceError - Error message for the "Specify Evidence" input field (shown when evidence is set to "Específica").
 * @param {Function} props.config.setSpecifyEvidenceError - Setter function for the "Specify Evidence" input error.
 * @param {Function} props.config.handlSpecifyEvidenceChange - Handler for changes in the "Specify Evidence" input field.
 * @param {string|null} props.config.periodicityError - Error message for the "Periodicity" dropdown.
 * @param {Function} props.config.setPeriodicityError - Setter for "Periodicity" field error.
 * @param {Function} props.config.handlePeriodicityChange - Change handler for the "Periodicity" dropdown.
 * @param {string|null} props.config.subjectInputError - Error message for the "Subject" dropdown.
 * @param {Function} props.config.setSubjectError - Setter for "Subject" field error.
 * @param {Function} props.config.handleSubjectChange - Change handler for the "Subject" dropdown.
 * @param {string|null} props.config.aspectError - Error message for the "Aspect" dropdown.
 * @param {Function} props.config.setAspectInputError - Setter for "Aspect" field error.
 * @param {Function} props.config.handleAspectsChange - Change handler for the "Aspect" dropdown.
 * @param {Function} props.config.handleAcceptanceCriteriaChange - Handler for the "Acceptance Criteria" textarea.
 * @param {string|null} props.config.acceptanceCriteriaError - Error message for the "Acceptance Criteria" textarea.
 * @param {Function} props.config.setacceptanceCriteriaError - Setter for the "Acceptance Criteria" field error.
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
 * @param {Array} props.config.subjects - List of available subjects.
 * @param {boolean} props.config.isAspectsActive - Enables/disables the "Aspect" dropdown.
 * @param {boolean} props.config.aspectsLoading - Indicates if aspects are loading.
 * @param {Array} props.config.aspects - List of available aspects.
 * @param {Object|null} props.config.errorAspects - Error object related to aspect fetching.
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
    specifyEvidenceError,
    handlSpecifyEvidenceChange,
    setSpecifyEvidenceError,
    periodicityError,
    setPeriodicityError,
    handlePeriodicityChange,
    subjectInputError,
    setSubjectError,
    handleSubjectChange,
    aspectError,
    setAspectInputError,
    handleAspectsChange,
    acceptanceCriteriaError,
    setAcceptanceCriteriaError,
    handleAcceptanceCriteriaChange,
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
    subjects,
    fetchAspects,
    clearAspects,
    isAspectsActive,
    aspectsLoading,
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
        specifyEvidence: selectedRequirement.specify_evidence || "",
        periodicity: selectedRequirement.periodicity,
        acceptanceCriteria: selectedRequirement.acceptance_criteria,
        subject: selectedRequirement.subject?.subject_id.toString(),
        aspects: selectedRequirement.aspects?.map((aspect) =>
          aspect.aspect_id.toString()
        ),
        mandatoryDescription: selectedRequirement.mandatory_description,
        complementaryDescription: selectedRequirement.complementary_description,
        mandatorySentences: selectedRequirement.mandatory_sentences,
        complementarySentences: selectedRequirement.complementary_sentences,
        mandatoryKeywords: selectedRequirement.mandatory_keywords,
        complementaryKeywords: selectedRequirement.complementary_keywords,
      });


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
    setIsAspectsActive,
    fetchAspects,
    clearAspects,
  ]);


  const handleBack = () => setStep(1);

  const handleEdit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (step === 1) {
      if (!formData.number) {
        setNumberError("Este campo es obligatorio.");
        setIsLoading(false);
        return;
      } else if (isNaN(formData.number)) {
        setNumberError("Este campo debe ser un número válido.");
        setIsLoading(false);
        return;
      } else if (Number(formData.number) <= 0) {
        setNumberError("Este campo debe ser mayor a 0.");
        setIsLoading(false);
        return;
      } else if (!Number.isInteger(Number(formData.number))) {
        setNumberError("Este campo debe ser un número entero.");
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
      if (
        formData.evidence === "Específica" &&
        (!formData.specifyEvidence || formData.specifyEvidence.trim() === "")
      ) {

        setSpecifyEvidenceError("Este campo es obligatorio si se selecciona el valor Específica.");
        setIsLoading(false);
        return;
      } else {
        setSpecifyEvidenceError(null);
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

      if (formData.periodicity === "") {
        setPeriodicityError("Debes seleccionar una periodicidad.");
        setIsLoading(false);
        return;
      } else {
        setPeriodicityError(null);
      }
      if (formData.acceptanceCriteria === "") {
        setAcceptanceCriteriaError("Este campo es obligatorio.");
        setIsLoading(false);
        return;
      } else {
        setAcceptanceCriteriaError(null);
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
        specifyEvidence: formData.specifyEvidence,
        periodicity: formData.periodicity,
        subjectId: formData.subject,
        aspectsIds: formData.aspects,
        acceptanceCriteria: formData.acceptanceCriteria,
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
      className="w-full sm:w-[90vw] md:w-[80vw] lg:w-[60vw] max-w-4xl"
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
                      type="number"
                      name="number"
                      id="floating_order"
                      value={formData.number}
                      onChange={handleNumberChange}
                      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer"
                      placeholder=""
                    />
                    <label
                      htmlFor="floating_number"
                      className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 peer-focus:left-0 peer-focus:text-primary peer-focus:dark:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                      Orden
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
                      Requerimiento
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
                      <AutocompleteItem key="Específica">Específica</AutocompleteItem>
                      <AutocompleteItem key="Documento">Documento</AutocompleteItem>
                    </Autocomplete>
                    {evidenceError && (
                      <p className="mt-2 text-sm text-red">
                        {evidenceError}
                      </p>
                    )}
                  </div>

                  {(formData.evidence === "Específica" || formData.specifyEvidence) && (
                    <div className="relative z-0 w-full group">
                      <input
                        type="text"
                        name="specifyEvidence"
                        id="floating_specify_evidence"
                        value={formData.specifyEvidence}
                        onChange={handlSpecifyEvidenceChange}
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer"
                        placeholder=""
                      />
                      <label
                        htmlFor="floating_specify_evidence"
                        className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 peer-focus:left-0 peer-focus:text-primary peer-focus:dark:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        Especificar Evidencia
                      </label>
                      {specifyEvidenceError && (
                        <p className="mt-2 text-sm text-red">{specifyEvidenceError}</p>
                      )}
                    </div>
                  )}
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
                    <AutocompleteItem key="Específica">Específica</AutocompleteItem>
                  </Autocomplete>
                  {periodicityError && (
                    <p className="mt-2 text-sm text-red">
                      {periodicityError}
                    </p>
                  )}
                </div>
                <div className="w-full mt-4">
                  <Textarea
                    disableAnimation
                    disableAutosize
                    value={formData.acceptanceCriteria}
                    onChange={handleAcceptanceCriteriaChange}
                    classNames={{
                      base: "max-w-4xl",
                      input: "resize-y min-h-[100px] py-1 px-2 w-full text-xs text-gray-900 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-primary peer",
                    }}
                    label="Criterio de Aceptación"
                    placeholder="Escribir el criterio..."
                    variant="bordered"
                  />
                  {acceptanceCriteriaError && (
                    <p className="mt-2 text-sm text-red">{acceptanceCriteriaError}</p>
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

    specifyEvidenceError: PropTypes.string,
    setSpecifyEvidenceError: PropTypes.func.isRequired,
    handlSpecifyEvidenceChange: PropTypes.func.isRequired,

    periodicityError: PropTypes.string,
    setPeriodicityError: PropTypes.func.isRequired,
    handlePeriodicityChange: PropTypes.func.isRequired,

    subjectInputError: PropTypes.string,
    setSubjectError: PropTypes.func.isRequired,
    handleSubjectChange: PropTypes.func.isRequired,

    aspectError: PropTypes.string,
    setAspectInputError: PropTypes.func.isRequired,
    handleAspectsChange: PropTypes.func.isRequired,

    acceptanceCriteriaError: PropTypes.string,
    setAcceptanceCriteriaError: PropTypes.func.isRequired,
    handleAcceptanceCriteriaChange: PropTypes.func.isRequired,

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
