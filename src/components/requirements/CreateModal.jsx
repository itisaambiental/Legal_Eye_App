import PropTypes from "prop-types";
import { useState } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    Tooltip,
    Button,
    Spinner,
    Autocomplete,
    AutocompleteItem,
    Textarea,
    Select,
    SelectItem,
} from "@heroui/react";
import { toast } from "react-toastify";
import check from "../../assets/check.png";
import go_back from "../../assets/volver.png";

/**
 * CreateModal Component
 *
 * Functional component that renders a multi-step modal for creating new requirements.
 * It includes dynamic validations based on jurisdiction, management of
 * aspects, states, and municipalities, and supports file uploads.
 * 
 * @component
 * @param {Object} props - Component props.
 * @param {Object} props.config - Configuration object containing modal state, form data, handlers, and validation setters.
 * @param {boolean} props.config.isOpen - Whether the modal is currently open.
 * @param {Function} props.config.closeModalCreate - Function to close the modal.
 * @param {Object} props.config.formData - Object containing the values for all form fields.
 * @param {Function} props.config.addRequirement - Function to submit and create a new requirement.
 * @param {string|null} props.config.numberError - Error message for the "Number" input field.
 * @param {Function} props.config.setNumberError - Setter for the "Number" field error.
 * @param {Function} props.config.handleNumberChange - Handler for changes in the "Number" input field.
 * @param {string|null} props.config.nameError - Error message for the "Name" input field.
 * @param {Function} props.config.setNameError - Setter for the "Name" field error.
 * @param {Function} props.config.handleNameChange - Handler for changes in the "Name" input field.
 * @param {string|null} props.config.conditionError - Error message for the "Condition" autocomplete field.
 * @param {Function} props.config.handleConditionChange - Handler for changes in the "Condition" autocomplete field.
 * @param {string|null} props.config.evidenceError - Error message for the "Evidence" autocomplete field.
 * @param {Function} props.config.handleEvidenceChange - Handler for changes in the "Evidence" autocomplete field.
 * @param {string|null} props.config.specifyEvidenceError - Error message for the "Specify Evidence" input field (shown when evidence is set to "Específica").
 * @param {Function} props.config.setSpecifyEvidenceError - Setter function for the "Specify Evidence" input error.
 * @param {Function} props.config.handlSpecifyEvidenceChange - Handler for changes in the "Specify Evidence" input field.
 * @param {string|null} props.config.periodicityError - Error message for the "Periodicity" autocomplete field.
 * @param {Function} props.config.handlePeriodicityChange - Handler for changes in the "Periodicity" autocomplete field.
 * @param {Function} props.config.setConditionError - Setter for the "Condition" field error.
 * @param {Function} props.config.setEvidenceError - Setter for the "Evidence" field error.
 * @param {Function} props.config.setPeriodicityError - Setter for the "Periodicity" field error.
 * @param {Array} props.config.subjects - List of available subjects for the "Subject" autocomplete.
 * @param {string|null} props.config.subjectInputError - Error message for the "Subject" autocomplete.
 * @param {Function} props.config.setSubjectError - Setter for the "Subject" field error.
 * @param {Function} props.config.handleSubjectChange - Handler for changes in the "Subject" autocomplete.
 * @param {Array<Object>} props.config.aspects - List of aspects available for selection.
 * @param {string|null} props.config.aspectError - Error message for the "Aspects" field.
 * @param {Function} props.config.setAspectInputError - Function to set the "Aspects" field error message.
 * @param {boolean} props.config.isAspectsActive - Indicates whether the aspects field is active.
 * @param {boolean} props.config.aspectsLoading - Indicates if aspects are loading.
 * @param {string|null} props.config.errorAspects - Error message when aspects cannot be loaded.
 * @param {Function} props.config.handleAspectsChange - Function to handle changes in the "Aspects" field.
 * @param {Function} props.config.handleAcceptanceCriteriaChange - Handler for the "Acceptance Criteria" textarea.
 * @param {string|null} props.config.acceptanceCriteriaError - Error message for the "Acceptance Criteria" textarea.
 * @param {Function} props.config.setacceptanceCriteriaError - Setter for the "Acceptance Criteria" field error.
 * @param {Function} props.config.handleMandatoryDescriptionChange - Handler for the "Mandatory Description" textarea.
 * @param {string|null} props.config.mandatoryDescriptionError - Error message for the "Mandatory Description" textarea.
 * @param {Function} props.config.setMandatoryDescriptionError - Setter for the "Mandatory Description" field error.
 * @param {Function} props.config.handleComplementaryDescriptionChange - Handler for the "Complementary Description" textarea.
 * @param {string|null} props.config.complementaryDescriptionError - Error message for the "Complementary Description" textarea.
 * @param {Function} props.config.setComplementaryDescriptionError - Setter for the "Complementary Description" field error.
 * @param {Function} props.config.handleMandatorySentencesChange - Handler for the "Mandatory Sentences" textarea.
 * @param {string|null} props.config.mandatorySentencesError - Error message for the "Mandatory Sentences" textarea.
 * @param {Function} props.config.setMandatorySentencesError - Setter for the "Mandatory Sentences" field error.
 * @param {Function} props.config.handleComplementarySentencesChange - Handler for the "Complementary Sentences" textarea.
 * @param {string|null} props.config.complementarySentencesError - Error message for the "Complementary Sentences" textarea.
 * @param {Function} props.config.setComplementarySentencesError - Setter for the "Complementary Sentences" field error.
 * @param {Function} props.config.handleMandatoryKeywordsChange - Handler for the "Mandatory Keywords" textarea.
 * @param {string|null} props.config.mandatoryKeywordsError - Error message for the "Mandatory Keywords" textarea.
 * @param {Function} props.config.setMandatoryKeywordsError - Setter for the "Mandatory Keywords" field error.
 * @param {Function} props.config.handleComplementaryKeywordsChange - Handler for the "Complementary Keywords" textarea.
 * @param {string|null} props.config.complementaryKeywordsError - Error message for the "Complementary Keywords" textarea.
 * @param {Function} props.config.setComplementaryKeywordsError - Setter for the "Complementary Keywords" field error.
 *
 * @returns {JSX.Element} Rendered modal for creating a new requirement.
 */

const CreateModal = ({ config }) => {
    const {
        isOpen,
        closeModalCreate,
        formData,
        addRequirement,
        numberError,
        setNumberError,
        handleNumberChange,
        nameError,
        setNameError,
        handleNameChange,
        conditionError,
        handleConditionChange,
        evidenceError,
        handleEvidenceChange,
        handlSpecifyEvidenceChange,
        specifyEvidenceError,
        setSpecifyEvidenceError,
        periodicityError,
        handlePeriodicityChange,
        setConditionError,
        setEvidenceError,
        setPeriodicityError,
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
        handleAcceptanceCriteriaChange,
        acceptanceCriteriaError,
        setAcceptanceCriteriaError,
        handleMandatoryDescriptionChange,
        mandatoryDescriptionError,
        setMandatoryDescriptionError,
        handleComplementaryDescriptionChange,
        complementaryDescriptionError,
        setComplementaryDescriptionError,
        handleMandatorySentencesChange,
        mandatorySentencesError,
        setMandatorySentencesError,
        handleComplementarySentencesChange,
        complementarySentencesError,
        setComplementarySentencesError,
        handleMandatoryKeywordsChange,
        mandatoryKeywordsError,
        setMandatoryKeywordsError,
        handleComplementaryKeywordsChange,
        complementaryKeywordsError,
        setComplementaryKeywordsError,
    } = config;

    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1);

    const handleCreate = async (e) => {
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

            if (!formData.condition) {
                setConditionError("Debes seleccionar una condición.");
                setIsLoading(false);
                return;
            } else {
                setConditionError(null);
            }

            if (!formData.evidence) {
                setEvidenceError("Debes seleccionar una evidencia.");
                setIsLoading(false);
                return;
            } else {
                setEvidenceError(null);
            }

            if (
                formData.evidence === "Específica" &&
                (!formData.specifyEvidence || !formData.specifyEvidence.trim())
            ) {
                setSpecifyEvidenceError("Este campo es obligatorio si se selecciona el valor Específica.");
                setIsLoading(false);
                return;
            } else {
                setSpecifyEvidenceError(null);
            }

            if (!formData.subject) {
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

            if (!formData.periodicity) {
                setPeriodicityError("Debes seleccionar una periodicidad.");
                setIsLoading(false);
                return;
            } else {
                setPeriodicityError(null);
            }

            if (!formData.acceptanceCriteria.trim()) {
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
            if (!formData.mandatoryDescription.trim()) {
                setMandatoryDescriptionError("Este campo es obligatorio.");
                setIsLoading(false);
                return;
            } else {
                setMandatoryDescriptionError(null);
            }

            if (!formData.complementaryDescription.trim()) {
                setComplementaryDescriptionError("Este campo es obligatorio.");
                setIsLoading(false);
                return;
            } else {
                setComplementaryDescriptionError(null);
            }

            if (!formData.mandatorySentences.trim()) {
                setMandatorySentencesError("Este campo es obligatorio.");
                setIsLoading(false);
                return;
            } else {
                setMandatorySentencesError(null);
            }

            if (!formData.complementarySentences.trim()) {
                setComplementarySentencesError("Este campo es obligatorio.");
                setIsLoading(false);
                return;
            } else {
                setComplementarySentencesError(null);
            }

            if (!formData.mandatoryKeywords.trim()) {
                setMandatoryKeywordsError("Este campo es obligatorio.");
                setIsLoading(false);
                return;
            } else {
                setMandatoryKeywordsError(null);
            }

            if (!formData.complementaryKeywords.trim()) {
                setComplementaryKeywordsError("Este campo es obligatorio.");
                setIsLoading(false);
                return;
            } else {
                setComplementaryKeywordsError(null);
            }
        }

        const requirementData = {
            requirementNumber: formData.number,
            requirementName: formData.name.trim(),
            condition: formData.condition,
            evidence: formData.evidence,
            specifyEvidence: formData.specifyEvidence?.trim() || null,
            periodicity: formData.periodicity,
            subjectId: formData.subject,
            aspectsIds: formData.aspects,
            acceptanceCriteria: formData.acceptanceCriteria.trim(),
            mandatoryDescription: formData.mandatoryDescription.trim(),
            complementaryDescription: formData.complementaryDescription.trim(),
            mandatorySentences: formData.mandatorySentences.trim(),
            complementarySentences: formData.complementarySentences.trim(),
            mandatoryKeywords: formData.mandatoryKeywords.trim(),
            complementaryKeywords: formData.complementaryKeywords.trim(),
        };

        try {
            const { success, error } = await addRequirement(requirementData);
            if (success) {
                toast.info("El requerimiento ha sido registrado correctamente", {
                    icon: () => <img src={check} alt="Success Icon" />,
                    progressStyle: { background: "#113c53" },
                });
                closeModalCreate();
            } else {
                toast.error(error);
            }
        } catch (error) {
            console.error(error);
            toast.error("Hubo un error al registrar el requerimiento. Intente de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };


    const resetStepTwoErrors = () => {
        setMandatoryDescriptionError(null);
        setComplementaryDescriptionError(null);
        setMandatorySentencesError(null);
        setComplementarySentencesError(null);
        setMandatoryKeywordsError(null);
        setComplementaryKeywordsError(null);
    };


    const handleBack = () => {
        resetStepTwoErrors();
        setStep(1);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={closeModalCreate}
            placement="center"
            className="w-full sm:w-[90vw] md:w-[80vw] lg:w-[60vw] max-w-4xl"
            classNames={{
                closeButton: "hover:bg-primary/20 text-primary active:bg-primary/10",
            }}
        >
            <ModalContent>
                <ModalHeader className="flex items-center gap-2">
                    {step === 1 ? (
                        "Crear Nuevo Requerimiento"
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
                            <form onSubmit={handleCreate}>
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
                                    {formData.evidence === "Específica" && (
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
                                <div className="w-full  mt-4">
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

                            <form onSubmit={handleCreate}>
                                <div className="grid  grid-cols-2 gap-6">
                                    <div className="w-full">
                                        <Textarea
                                            disableAnimation
                                            disableAutosize
                                            value={formData.mandatoryDescription}
                                            onChange={handleMandatoryDescriptionChange}
                                            classNames={{
                                                base: "max-w-lg",
                                                input: "resize-y min-h-[80px] py-1 px-2 w-full text-xs text-gray-900 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-primary peer",
                                            }}
                                            label="Descripción Obligatoria"
                                            placeholder="Escribir la descripción."
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
                                                input: "resize-y min-h-[80px] py-1 px-2 w-full text-xs text-gray-900 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-primary peer",
                                            }}
                                            label="Descripción Complementaria"
                                            placeholder="Escribir la descripción."
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
                                                input: "resize-y min-h-[80px] py-1 px-2 w-full text-xs text-gray-900 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-primary peer",
                                            }}
                                            label="Frases Obligatorias"
                                            placeholder="Escribir las frases separadas por espacio."
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
                                                input: "resize-y min-h-[80px] py-1 px-2 w-full text-xs text-gray-900 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-primary peer",
                                            }}
                                            label="Frases Complementarias"
                                            placeholder="Escribir las frases separadas por espacio."
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
                                                input: "resize-y min-h-[80px] py-1 px-2 w-full text-xs text-gray-900 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-primary peer",
                                            }}
                                            label="Palabras Clave Obligatorias"
                                            placeholder="Escribir las palabras claves separadas por coma."
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
                                                input: "resize-y min-h-[80px] py-1 px-2 w-full text-xs text-gray-900 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-primary peer",
                                            }}
                                            label="Palabras Clave Complementarias"
                                            placeholder="Escribir las palabras claves separadas por coma."
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
                                        {isLoading ? <Spinner size="sm" color="white" /> : "Crear Requerimiento"}
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

CreateModal.propTypes = {
    config: PropTypes.shape({
        isOpen: PropTypes.bool.isRequired,
        closeModalCreate: PropTypes.func.isRequired,
        formData: PropTypes.object.isRequired,
        addRequirement: PropTypes.func.isRequired,
        numberError: PropTypes.string,
        setNumberError: PropTypes.func.isRequired,
        handleNumberChange: PropTypes.func.isRequired,
        nameError: PropTypes.string,
        setNameError: PropTypes.func.isRequired,
        handleNameChange: PropTypes.func.isRequired,
        conditionError: PropTypes.string,
        handleConditionChange: PropTypes.func.isRequired,
        evidenceError: PropTypes.string,
        handleEvidenceChange: PropTypes.func.isRequired,
        handlSpecifyEvidenceChange: PropTypes.func.isRequired,
        periodicityError: PropTypes.string,
        handlePeriodicityChange: PropTypes.func.isRequired,
        setConditionError: PropTypes.func.isRequired,
        setEvidenceError: PropTypes.func.isRequired,
        setPeriodicityError: PropTypes.func.isRequired,
        specifyEvidenceError: PropTypes.string,
        setSpecifyEvidenceError: PropTypes.func.isRequired,
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
        handleAcceptanceCriteriaChange: PropTypes.func.isRequired,
        acceptanceCriteriaError: PropTypes.string,
        setAcceptanceCriteriaError: PropTypes.func.isRequired,
        handleMandatoryDescriptionChange: PropTypes.func.isRequired,
        mandatoryDescriptionError: PropTypes.string,
        setMandatoryDescriptionError: PropTypes.func.isRequired,
        handleComplementaryDescriptionChange: PropTypes.func.isRequired,
        complementaryDescriptionError: PropTypes.string,
        setComplementaryDescriptionError: PropTypes.func.isRequired,
        handleMandatorySentencesChange: PropTypes.func.isRequired,
        mandatorySentencesError: PropTypes.string,
        setMandatorySentencesError: PropTypes.func.isRequired,
        handleComplementarySentencesChange: PropTypes.func.isRequired,
        complementarySentencesError: PropTypes.string,
        setComplementarySentencesError: PropTypes.func.isRequired,
        handleMandatoryKeywordsChange: PropTypes.func.isRequired,
        mandatoryKeywordsError: PropTypes.string,
        setMandatoryKeywordsError: PropTypes.func.isRequired,
        handleComplementaryKeywordsChange: PropTypes.func.isRequired,
        complementaryKeywordsError: PropTypes.string,
        setComplementaryKeywordsError: PropTypes.func.isRequired,
    }).isRequired,
};

export default CreateModal;