import PropTypes from "prop-types";
import {
  Input,
  Button,
  Autocomplete,
  AutocompleteItem,
  Select,
  SelectItem,
  Tooltip,
} from "@heroui/react";
import search_icon from "../../assets/busqueda_blue.png";
import mas_icon from "../../assets/mas.png";

/**
 * TopContent component for Requirement
 *
 * This component renders the filter section for Requirement management.
 * It includes search inputs, dropdowns, and a button to add new requirements.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Object} props.config - Configuration object for the component.
 * @param {boolean} props.config.isCreateModalOpen - Indicates whether the create modal is open.
 * @param {boolean} props.config.isEditModalOpen - Indicates whether the edit modal is open.
 * @param {Function} props.config.onRowsPerPageChange - Callback for changing rows per page.
 * @param {number} props.config.totalRequirements - Total number of requirements.
 * @param {Function} props.config.openModalCreate - Function to open the create modal.
 * @param {string} props.config.filterByName - Current value for filtering by requirement name.
 * @param {Function} props.config.onFilterByName - Callback for filtering by requirement name.
 * @param {string} props.config.selectedCondition - Selected condition filter.
 * @param {Function} props.config.onFilterByCondition - Callback for filtering by condition.
 * @param {string} props.config.selectedEvidence - Selected evidence filter.
 * @param {Function} props.config.onFilterByEvidence - Callback for filtering by evidence.
 * @param {string} props.config.selectedPeriodicity - Selected periodicity filter.
 * @param {Function} props.config.onFilterByPeriodicity - Callback for filtering by periodicity.
 * @param {string} props.config.filterByMandatoryDescription - Current value for filtering by mandatory description.
 * @param {Function} props.config.onFilterByMandatoryDescription - Callback for filtering by mandatory description.
 * @param {string} props.config.filterByComplementaryDescription - Current value for filtering by complementary description.
 * @param {Function} props.config.onFilterByComplementaryDescription - Callback for filtering by complementary description.
 * @param {string} props.config.filterByObligatoryDescription - Current value for filtering by mandatory sentences.
 * @param {Function} props.config.onFilterByObligatoryDescription - Callback for filtering by mandatory sentences.
 * @param {string} props.config.filterByMandatorySentences - Current value for filtering by mandatory sentences.
 * @param {Function} props.config.onFilterByMandatorySentences - Callback for filtering by mandatory sentences.
 * @param {string} props.config.filterByComplementarySentences - Current value for filtering by complementary sentences.
 * @param {Function} props.config.onFilterByComplementarySentences - Callback for filtering by complementary sentences.
 * @param {string} props.config.filterByMandatoryKeywords - Current value for filtering by mandatory keywords.
 * @param {Function} props.config.onFilterByMandatoryKeywords - Callback for filtering by mandatory keywords.
 * @param {string} props.config.filterByComplementaryKeywords - Current value for filtering by complementary keywords.
 * @param {Function} props.config.onFilterByComplementaryKeywords - Callback for filtering by complementary keywords.
 * @param {Function} props.config.onClear - Callback to reset all filters.
 * @param {Array<Object>} props.config.subjects - List of subjects for filtering.
 * @param {string} props.config.selectedSubject - Currently selected subject.
 * @param {boolean} props.config.subjectLoading - Indicates if subjects are loading.
 * @param {Function} props.config.onFilterBySubject - Callback for filtering by subject.
 * @param {Array<Object>} props.config.aspects - List of aspects for filtering.
 * @param {Array<string>} props.config.selectedAspects - Selected aspects.
 * @param {boolean} props.config.aspectsLoading - Indicates if aspects are loading.
 * @param {Function} props.config.onFilterByAspects - Callback for aspect filter changes.
 *
 * @returns {JSX.Element} The rendered filter component.
 */

function TopContent({ config }) {
  const {
    isCreateModalOpen,
    isEditModalOpen,
    onRowsPerPageChange,
    totalRequirements,
    openModalCreate,
    filterByName,
    onFilterByName,
    selectedCondition,
    onFilterByCondition,
    selectedEvidence,
    onFilterByEvidence,
    selectedPeriodicity,
    onFilterByPeriodicity,
    onClear,
    subjects,
    subjectLoading,
    selectedSubject,
    onFilterBySubject,
    aspects,
    aspectsLoading,
    selectedAspects,
    onFilterByAspects,
    filterByComplementaryDescription,
    filterByAcceptanceCriteria,
    onFilterByAcceptanceCriteria,
    filterByMandatoryDescription,
    onFilterByMandatoryDescription,
    onFilterByComplementaryDescription,
    filterByMandatorySentences,
    onFilterByMandatorySentences,
    filterByComplementarySentences,
    onFilterByComplementarySentences,
    filterByMandatoryKeywords,
    onFilterByMandatoryKeywords,
    filterByComplementaryKeywords,
    onFilterByComplementaryKeywords,
  } = config;

  return (
    <div className="flex flex-col gap-4 mb-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <Input
          color="primary"
          variant="faded"
          isClearable
          value={filterByName}
          className="w-full"
          placeholder="Buscar por Requerimiento..."
          startContent={
            <img
              src={search_icon}
              alt="Search Icon"
              className="w-4 h-4 flex-shrink-0"
            />}
          onClear={onClear}
          onValueChange={onFilterByName}
        />
        <Autocomplete
          color="primary"
          variant="faded"
          onClear={onClear}
          placeholder="Seleccionar condición..."
          className="w-full"
          listboxProps={{
            emptyContent: "Condición no encontrada",
          }}
          startContent={<img src={search_icon} alt="Search Icon" className="w-4 h-4" />}
          selectedKey={selectedCondition}
          onSelectionChange={onFilterByCondition}
        >
          <AutocompleteItem key="Crítica">Crítica</AutocompleteItem>
          <AutocompleteItem key="Operativa">Operativa</AutocompleteItem>
          <AutocompleteItem key="Recomendación">Recomendación</AutocompleteItem>
          <AutocompleteItem key="Pendiente">Pendiente</AutocompleteItem>
        </Autocomplete>
        <Autocomplete
          color="primary"
          variant="faded"
          onClear={onClear}
          placeholder="Seleccionar evidencia..."
          className="w-full"
          listboxProps={{
            emptyContent: "Evidencia no encontrada",
          }}
          startContent={<img src={search_icon} alt="Search Icon" className="w-4 h-4" />}
          selectedKey={selectedEvidence}
          onSelectionChange={onFilterByEvidence}
        >
          <AutocompleteItem key="Trámite">Trámite</AutocompleteItem>
          <AutocompleteItem key="Registro">Registro</AutocompleteItem>
          <AutocompleteItem key="Específica">Específica</AutocompleteItem>
          <AutocompleteItem key="Documento">Documento</AutocompleteItem>
        </Autocomplete>
        <Autocomplete
          color="primary"
          variant="faded"
          onClear={onClear}
          placeholder="Seleccionar periodicidad..."
          className="w-full"
          listboxProps={{
            emptyContent: "Periodicidad no encontrada",
          }}
          startContent={<img src={search_icon} alt="Search Icon" className="w-4 h-4" />}
          selectedKey={selectedPeriodicity}
          onSelectionChange={onFilterByPeriodicity}
        >
          <AutocompleteItem key="Anual">Anual</AutocompleteItem>
          <AutocompleteItem key="2 años">2 años</AutocompleteItem>
          <AutocompleteItem key="Por evento">Por evento</AutocompleteItem>
          <AutocompleteItem key="Única vez">Única vez</AutocompleteItem>
          <AutocompleteItem key="Específica">Específica</AutocompleteItem>
        </Autocomplete>
        <Autocomplete
          color="primary"
          variant="faded"
          defaultItems={subjects}
          isLoading={subjectLoading}
          onClear={onClear}
          placeholder="Buscar por materia..."
          startContent={
            <img
              src={search_icon}
              alt="Search Icon"
              className="w-4 h-4 flex-shrink-0"
            />
          }
          className="w-full"
          selectedKey={selectedSubject}
          listboxProps={{
            emptyContent: "Materia no encontrada",
          }}
          onSelectionChange={onFilterBySubject}
        >
          {(subject) => (
            <AutocompleteItem key={subject.id} value={subject.id}>
              {subject.subject_name}
            </AutocompleteItem>
          )}
        </Autocomplete>
        <Input
          color="primary"
          variant="faded"
          isClearable
          value={filterByAcceptanceCriteria}
          className="w-full"
          placeholder="Buscar por criterio de aceptación..."
          startContent={
            <img
              src={search_icon}
              alt="Search Icon"
              className="w-4 h-4 flex-shrink-0"
            />
          }
          onClear={onClear}
          onValueChange={onFilterByAcceptanceCriteria}
        />
        <Input
          color="primary"
          variant="faded"
          isClearable
          value={filterByMandatoryDescription}
          className="w-full"
          placeholder="Buscar por descripción obligatoria..."
          startContent={
            <img
              src={search_icon}
              alt="Search Icon"
              className="w-4 h-4 flex-shrink-0"
            />
          }
          onClear={onClear}
          onValueChange={onFilterByMandatoryDescription}
        />
        <Input
          color="primary"
          variant="faded"
          isClearable
          value={filterByComplementaryDescription}
          className="w-full"
          placeholder="Buscar por descripción complementaria..."
          startContent={
            <img
              src={search_icon}
              alt="Search Icon"
              className="w-4 h-4"
            />}
          onClear={onClear}
          onValueChange={onFilterByComplementaryDescription}
        />

        <Input
          color="primary"
          variant="faded"
          isClearable
          value={filterByMandatorySentences}
          className="w-full"
          startContent={<img src={search_icon} alt="Search Icon" className="w-4 h-4" />}
          placeholder="Buscar por frases obligatorias..."
          onClear={onClear}
          onValueChange={onFilterByMandatorySentences}
        />

        <Input
          color="primary"
          variant="faded"
          isClearable
          value={filterByComplementarySentences}
          className="w-full"
          startContent={<img src={search_icon} alt="Search Icon" className="w-4 h-4" />}
          placeholder="Buscar por frases complementarias..."
          onClear={onClear}
          onValueChange={onFilterByComplementarySentences}
        />
        <Tooltip
          content="Debes seleccionar una materia"
          isDisabled={!!selectedSubject}
        >
          <div className="w-full">
            <Select
              color="primary"
              items={aspects}
              onClear={onClear}
              variant="faded"
              placeholder="Buscar por aspecto..."
              startContent={
                <img
                  src={search_icon}
                  alt="Search Icon"
                  className="w-4 h-4 flex-shrink-0"
                />
              }
              className="w-full"
              isLoading={
                aspectsLoading && !isCreateModalOpen && !isEditModalOpen
              }
              selectionMode="multiple"
              selectedKeys={selectedAspects}
              listboxProps={{
                emptyContent: "Aspectos no encontrados",
              }}
              isDisabled={!selectedSubject}
              onSelectionChange={onFilterByAspects}
              renderValue={(selected) =>
                !selected || selected.length === 0
                  ? "Buscar por aspecto..."
                  : `${selected.length} aspecto${selected.length > 1 ? "s" : ""
                  } seleccionado${selected.length > 1 ? "s" : ""}`
              }
            >
              {(aspect) => (
                <SelectItem key={aspect.id} value={aspect.id}>
                  {aspect.aspect_name}
                </SelectItem>
              )}
            </Select>
          </div>
        </Tooltip>

        <Input
          color="primary"
          variant="faded"
          isClearable
          value={filterByMandatoryKeywords}
          className="w-full"
          startContent={<img src={search_icon} alt="Search Icon" className="w-4 h-4" />}
          placeholder="Buscar por palabras clave obligatorias..."
          onClear={onClear}
          onValueChange={onFilterByMandatoryKeywords}
        />

        <Input
          color="primary"
          variant="faded"
          isClearable
          value={filterByComplementaryKeywords}
          className="w-full"
          startContent={<img src={search_icon} alt="Search Icon" className="w-4 h-4" />}
          placeholder="Buscar por palabras clave complementarias..."
          onClear={onClear}
          onValueChange={onFilterByComplementaryKeywords}
        />

      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <span className="text-default-400">Requerimientos totales: {totalRequirements}</span>

        <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto sm:ml-auto">
          <label className="flex items-center text-default-400 gap-2">
            Filas por página:
            <select className="bg-transparent outline-none text-default-400" onChange={onRowsPerPageChange}>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="40">40</option>
            </select>
          </label>

          <Button
            color="primary"
            onPress={openModalCreate}
            className="w-full sm:w-auto"
            endContent={<img src={mas_icon} alt="Add Icon" className="w-4 h-4" />}
          >
            Nuevo Requerimiento
          </Button>

        </div>
      </div>
    </div>
  );
}

TopContent.propTypes = {
  config: PropTypes.shape({
    isCreateModalOpen: PropTypes.bool.isRequired,
    isEditModalOpen: PropTypes.bool.isRequired,
    onRowsPerPageChange: PropTypes.func.isRequired,
    totalRequirements: PropTypes.number.isRequired,
    openModalCreate: PropTypes.func.isRequired,
    filterByNumber: PropTypes.string.isRequired,
    onFilterByNumber: PropTypes.func.isRequired,
    filterByName: PropTypes.string.isRequired,
    onFilterByName: PropTypes.func.isRequired,
    selectedCondition: PropTypes.string,
    onFilterByCondition: PropTypes.func.isRequired,
    selectedEvidence: PropTypes.string,
    onFilterByEvidence: PropTypes.func.isRequired,
    selectedPeriodicity: PropTypes.string,
    onFilterByPeriodicity: PropTypes.func.isRequired,
    filterByAcceptanceCriteria: PropTypes.string,
    onFilterByAcceptanceCriteria: PropTypes.func,
    filterByMandatoryDescription: PropTypes.string,
    onFilterByMandatoryDescription: PropTypes.func,
    filterByComplementaryDescription: PropTypes.string,
    onFilterByComplementaryDescription: PropTypes.func,
    filterByMandatorySentences: PropTypes.string,
    onFilterByMandatorySentences: PropTypes.func,
    filterByComplementarySentences: PropTypes.string,
    onFilterByComplementarySentences: PropTypes.func,
    filterByMandatoryKeywords: PropTypes.string,
    onFilterByMandatoryKeywords: PropTypes.func,
    filterByComplementaryKeywords: PropTypes.string,
    onFilterByComplementaryKeywords: PropTypes.func,
    subjects: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        subject_name: PropTypes.string.isRequired,
      })
    ).isRequired,
    selectedSubject: PropTypes.string,
    subjectLoading: PropTypes.bool.isRequired,
    onFilterBySubject: PropTypes.func.isRequired,
    aspects: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        aspect_name: PropTypes.string.isRequired,
      })
    ).isRequired,
    selectedAspects: PropTypes.arrayOf(PropTypes.string),
    aspectsLoading: PropTypes.bool.isRequired,
    onFilterByAspects: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
  }).isRequired,
};


export default TopContent;


