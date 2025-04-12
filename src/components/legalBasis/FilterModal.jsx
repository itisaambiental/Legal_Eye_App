import PropTypes from "prop-types";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Button,
  Autocomplete,
  AutocompleteItem,
  Select,
  SelectItem,
  Tooltip,
} from "@heroui/react";

export default function FilterModal({ config }) {
  const {
    formData,
    getLegalBasisBySubjectAndFilters,
    isOpen,
    onClose,
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
  } = config;

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

  const handleFilter = async () => {

    if (formData.jurisdiction === "") {
      setJurisdictionError("Este campo es obligatorio");
      return;
    } else {
      setJurisdictionError(null);
    }

    if (formData.jurisdiction === "Estatal") {
      if (formData.state === "") {
        setStateError(
          "Este campo es obligatorio para la jurisdicción Estatal."
        );
        return;
      } else {
        setStateError(null);
      }
    }

    if (formData.jurisdiction === "Local") {
      if (formData.state === "") {
        setStateError("Este campo es obligatorio para la jurisdicción Local.");
        return;
      } else {
        setStateError(null);
      }
      if (formData.municipality === "") {
        setMunicipalityError(
          "Este campo es obligatorio para la jurisdicción Local."
        );
        return;
      } else {
        setMunicipalityError(null);
      }
    }
    if (formData.subject === "") {
      setSubjectError("Este campo es obligatorio");
      return;
    } else {
      setSubjectError(null);
    }
    if (!formData.aspects || formData.aspects.length === 0) {
      setAspectInputError("Debes seleccionar al menos un aspecto");
      return;
    } else {
      setAspectInputError(null);
    }
    const filterData = {
      subjectId: formData.subject,
      aspectsIds: formData.aspects,
      jurisdiction: formData.jurisdiction,
      state: formData.state,
      municipality: formData.municipality,
    };
    await getLegalBasisBySubjectAndFilters(
      filterData
    );
    onClose()
  };



  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      isDismissable={false}
      className="z-[200]">
      <ModalContent>
        <ModalHeader>Búsqueda Avanzada</ModalHeader>
        <ModalBody className="flex flex-col gap-4">
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
          <div className="w-full">
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
          </div>
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
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Cancelar
          </Button>
          <Button color="secondary" onPress={handleFilter}>
            Aplicar Filtros
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}


FilterModal.propTypes = {
  config: PropTypes.shape({
    formData: PropTypes.object.isRequired,
    getLegalBasisBySubjectAndFilters: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
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
  }).isRequired,
};
