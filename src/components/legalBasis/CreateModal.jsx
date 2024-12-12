/* eslint-disable react/prop-types */
import { useState } from "react";
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
  Spinner
} from "@nextui-org/react";
import { toast } from "react-toastify";
import { I18nProvider } from "@react-aria/i18n";
import check from "../../assets/check.png";

function CreateModal({
  isOpen,
  closeModalCreate,
  formData,
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
}) {
  console.log(formData);
  const [isLoading, setIsLoading] = useState(false);

  const getTooltipContentForState = () => {
    if (formData.jurisdiction === "Federal") {
      return "La jurisdicción debe ser estatal o local";
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
    console.log("Datos enviados:", formData);
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
    } else {
      setLastReformError(null);
    }
    try {
      toast.info("El fundamento legal ha sido registrado correctamente", {
        icon: () => <img src={check} alt="Success Icon" />,
        progressStyle: {
          background: "#113c53",
        },
      });
    } catch (error) {
      console.error(error);
      toast.error("Algo mal sucedió al crear el fundamento. Intente de nuevo");
    } finally {
      setIsLoading(false);
    }
  };

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
                  <div className="relative z-0 w-full group">
                    <input
                      type="text"
                      name="abbreviation"
                      id="floating_abbreviation"
                      value={formData.abbreviation}
                      onChange={handleAbbreviationChange}
                      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer"
                      placeholder=" "
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
                      selectedKeys={formData.subject}
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