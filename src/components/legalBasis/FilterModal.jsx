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

/**
 * FilterModal component
 *
 * This component renders a modal for advanced filtering of legal basis entries.
 * It allows filtering by jurisdiction, state, municipality, subject, and aspects.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Object} props.config - Configuration object for the modal.
 * @param {Object} props.config.formData - Form state containing selected filter values.
 * @param {Function} props.config.fetchLegalBasisByCriteria - Function to trigger filtered request.
 * @param {boolean} props.config.isOpen - Indicates if the modal is open.
 * @param {Function} props.config.onClose - Function to close the modal.
 * @param {Function} props.config.setPage - Function to set the current page for results.
 * @param {Function} props.config.handleJurisdictionChange - Callback for jurisdiction selection.
 * @param {Array<string>} props.config.states - List of available states.
 * @param {boolean} props.config.isStateActive - Whether the state selector is enabled.
 * @param {Function} props.config.handleStateChange - Callback for state selection.
 * @param {Function} props.config.clearMunicipalities - Clears selected municipalities when state changes.
 * @param {Array<string>} props.config.municipalities - List of available municipalities.
 * @param {boolean} props.config.isMunicipalityActive - Whether the municipality selector is enabled.
 * @param {boolean} props.config.loadingMunicipalities - Indicates if municipalities are loading.
 * @param {Object} [props.config.errorMunicipalities] - Error object for municipality loading.
 * @param {Function} props.config.handleMunicipalityChange - Callback for municipality selection.
 * @param {Array<Object>} props.config.subjects - List of available subjects.
 * @param {Function} props.config.handleSubjectChange - Callback for subject selection.
 * @param {Array<Object>} props.config.aspects - List of available aspects.
 * @param {boolean} props.config.isAspectsActive - Whether the aspect selector is enabled.
 * @param {boolean} props.config.aspectsLoading - Indicates if aspects are loading.
 * @param {Object} [props.config.errorAspects] - Error object for aspects loading.
 * @param {Function} props.config.handleAspectsChange - Callback for aspects selection.
 *
 * @returns {JSX.Element} Rendered modal for advanced filtering.
 */
export default function FilterModal({ config }) {
  const {
    formData,
    fetchLegalBasisByCriteria,
    isOpen,
    onClose,
    setPage,
    handleJurisdictionChange,
    states,
    isStateActive,
    handleStateChange,
    clearMunicipalities,
    municipalities,
    isMunicipalityActive,
    loadingMunicipalities,
    errorMunicipalities,
    handleMunicipalityChange,
    subjects,
    handleSubjectChange,
    aspects,
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
    const filterData = {
      subjectId: formData.subject,
      aspectIds: formData.aspects,
      jurisdiction: formData.jurisdiction,
      state: formData.state,
      municipality: formData.municipality,
    };
    fetchLegalBasisByCriteria(filterData);
    setPage(1)
    onClose()
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      backdrop="opaque"
      placement="center"
      isDismissable={false}
      classNames={{
        closeButton: "hover:bg-primary/20 text-primary active:bg-primary/10",
      }}
    >
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
    fetchLegalBasisByCriteria: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    setPage: PropTypes.func.isRequired,
    handleJurisdictionChange: PropTypes.func.isRequired,
    states: PropTypes.arrayOf(PropTypes.string).isRequired,
    isStateActive: PropTypes.bool.isRequired,
    handleStateChange: PropTypes.func.isRequired,
    clearMunicipalities: PropTypes.func.isRequired,
    municipalities: PropTypes.arrayOf(PropTypes.string).isRequired,
    isMunicipalityActive: PropTypes.bool.isRequired,
    loadingMunicipalities: PropTypes.bool.isRequired,
    errorMunicipalities: PropTypes.object,
    handleMunicipalityChange: PropTypes.func.isRequired,
    subjects: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        subject_name: PropTypes.string,
      })
    ).isRequired,
    handleSubjectChange: PropTypes.func.isRequired,
    aspects: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        aspect_name: PropTypes.string,
      })
    ).isRequired,
    isAspectsActive: PropTypes.bool.isRequired,
    aspectsLoading: PropTypes.bool.isRequired,
    errorAspects: PropTypes.object,
    handleAspectsChange: PropTypes.func.isRequired,
  }).isRequired,
};
