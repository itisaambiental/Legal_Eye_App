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
} from "@heroui/react";
import { toast } from "react-toastify";
import check from "../../assets/check.png";
import go_back from "../../assets/volver.png";

/**
 * CreateModal component
 *
 * Functional component used for rendering the modal to create a new requirement.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Object} props.config - Configuration object for the component.
 * @param {boolean} props.config.isOpen - Indicates whether the modal is open.
 * @param {Function} props.config.closeModalCreate - Function to close the modal.
 * @param {Object} props.config.formData - Form data for the requirement.
 * @param {Function} props.config.addRequirement - Function to add a new requirement.
 * @param {string|null} props.config.numberError - Error message for "Number" field.
 * @param {Function} props.config.setNumberError - Function to set "Number" field error.
 * @param {Function} props.config.handleNumberChange - Function to handle changes in "Number" field.
 * @param {string|null} props.config.nameError - Error message for "Name" field.
 * @param {Function} props.config.setNameError - Function to set "Name" field error.
 * @param {Function} props.config.handleNameChange - Function to handle changes in "Name" field.
 * @param {Function} props.config.handleConditionChange - Function to handle changes in "Condition" field.
 * @param {Function} props.config.handleEvidenceChange - Function to handle changes in "Evidence" field.
 * @param {Function} props.config.handlePeriodicityChange - Function to handle changes in "Periodicity" field.
 * @param {Function} props.config.handleRequirementType - Function to handle changes in "Requirement Type" field.
 * @param {Function} props.config.fetchRequirements - Function to fetch updated requirements.
 *@param {Function} props.config.setJurisdictionError 
 * @returns {JSX.Element} - Rendered CreateModal component.
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
        periodicityError,
        handlePeriodicityChange,
        requirementTypeError,
        handleRequirementType,
        setConditionError,
        setEvidenceError,
        setPeriodicityError,
        setRequirementTypeError,
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

    const handleCreate = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (step === 1) {
            // Validaciones del Primer Modal
            if (formData.number === "") {
                setNumberError("El campo es obligatorio.");
                setIsLoading(false);
                return;
            } else {
                setNumberError(null);
            }

            if (!formData.name.trim()) {
                setNameError("El nombre es obligatorio.");
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
                setJurisdictionError("Este campo es obligatorio");
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
                setSubjectError("Este campo es obligatorio");
                setIsLoading(false);
                return;
            } else {
                setSubjectError(null);
            }

            if (!formData.aspect === "") {
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

            // Si pasa todas las validaciones, avanzar al segundo paso
            setIsLoading(false);
            setStep(2);
            return;
        }

        if (step === 2) {
            // Validaciones del Segundo Modal
            if (formData.mandatoryDescription === "") {
                setMandatoryDescriptionError("Este campo es obligatorio");
                setIsLoading(false);
                return;
            } else {
                setMandatoryDescriptionError(null);
            }

            if (formData.complementaryDescription === "") {
                setComplementaryDescriptionError("Este campo es obligatorio");
                setIsLoading(false);
                return;
            } else {
                setComplementaryDescriptionError(null);
            }
            if (formData.mandatorySentences === "") {
                setMandatorySentencesError("Este campo es obligatorio");
                setIsLoading(false);
                return;
            } else {
                setMandatorySentencesError(null);
            }
            if (formData.complementarySentences === "") {
                setComplementarySentencesError("Este campo es obligatorio");
                setIsLoading(false);
                return;
            } else {
                setComplementarySentencesError(null);
            }
            if (formData.mandatoryKeywords === "") {
                setMandatoryKeywordsError("Este campo es obligatorio");
                setIsLoading(false);
                return;
            } else {
                setMandatoryKeywordsError(null);
            }
            if (formData.complementaryKeywords === "") {
                setComplementaryKeywordsError("Este campo es obligatorio");
                setIsLoading(false);
                return;
            } else {
                setComplementaryKeywordsError(null);
            }
        }
        const requirementData = {
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
            aspectId: formData.aspect,
            mandatoryDescription: formData.mandatoryDescription,
            complementaryDescription: formData.complementaryDescription,
            mandatorySentences: formData.mandatorySentences,
            complementarySentences: formData.complementarySentences,
            mandatoryKeywords: formData.mandatoryKeywords,
            complementaryKeywords: formData.complementaryKeywords,
        };

        try {
            // Envío de los datos (esto se puede conectar a una API o backend)
            const { success, error } = await addRequirement(requirementData);
            console.log(requirementData)
            if (success) {
                toast.info("El requerimiento ha sido registrado correctamente", {
                    icon: () => <img src={check} alt="Success Icon" />,
                    progressStyle: {
                        background: "#113c53",
                    },
                });

                closeModalCreate(); // Cerrar el modal después de registrar
            } else {
                toast.error(error);
            }
        } catch (error) {
            console.error(error);
            toast.error("Hubo un error al registrar el requerimiento. Intente de nuevo.");
        } finally {
            setIsLoading(false);
        }
    }

    const handleBack = () => {
        setStep(1); // Volver al primer paso
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={closeModalCreate}
            className="w-[60vw] max-w-2xl"
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
                                            type="text"
                                            name="nombre"
                                            id="floating_nombre"
                                            value={formData.number}
                                            onChange={handleNumberChange}
                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer"
                                            placeholder=""
                                        />
                                        <label
                                            htmlFor="floating_nombre"
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
                                                <Autocomplete
                                                    size="sm"
                                                    variant="bordered"
                                                    label="Aspecto"
                                                    isLoading={aspectsLoading}
                                                    selectedKey={formData.aspect}
                                                    listboxProps={{
                                                        emptyContent: "Aspecto no encontrados",
                                                    }}
                                                    onSelectionChange={handleAspectsChange}
                                                    isDisabled={
                                                        !isAspectsActive || !!errorAspects
                                                    }
                                                    defaultItems={aspects.map((aspect) => ({
                                                        id: aspect.id,
                                                        name: aspect.aspect_name,
                                                    }))}
                                                >
                                                    {(aspect) => (
                                                        <AutocompleteItem
                                                            key={aspect.id}
                                                            value={aspect.id}
                                                        >
                                                            {aspect.name}
                                                        </AutocompleteItem>
                                                    )}
                                                </Autocomplete>
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
                                            <p className="text-red-500">{complementaryDescriptionError}</p>
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
                                            <p className="text-red">{mandatorySentencesError}</p>
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
                                            <p className="text-red">{complementarySentencesError}</p>
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
                                            <p className="text-red">{mandatoryKeywordsError}</p>
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
                                            <p className="text-red">{complementaryKeywordsError}</p>
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
                                        {isLoading ? <Spinner size="sm" color="white" /> : "Enviar"}
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
        periodicityError: PropTypes.string,
        handlePeriodicityChange: PropTypes.func.isRequired,
        requirementTypeError: PropTypes.string,
        handleRequirementType: PropTypes.func.isRequired,
        fetchRequirements: PropTypes.func.isRequired,
        setConditionError: PropTypes.func.isRequired,
        setEvidenceError: PropTypes.func.isRequired,
        setPeriodicityError: PropTypes.func.isRequired,
        setRequirementTypeError: PropTypes.func.isRequired,
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