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
 * @param {string} props.config.filterByNumber - Current value for filtering by requirement number.
 * @param {Function} props.config.onFilterByNumber - Callback for filtering by requirement number.
 * @param {string} props.config.filterByName - Current value for filtering by requirement name.
 * @param {Function} props.config.onFilterByName - Callback for filtering by requirement name.
 * @param {string} props.config.selectedCondition - Selected condition filter.
 * @param {Function} props.config.onFilterByCondition - Callback for filtering by condition.
 * @param {string} props.config.selectedEvidence - Selected evidence filter.
 * @param {Function} props.config.onFilterByEvidence - Callback for filtering by evidence.
 * @param {string} props.config.selectedPeriodicity - Selected periodicity filter.
 * @param {Function} props.config.onFilterByPeriodicity - Callback for filtering by periodicity.
 * @param {string} props.config.selectedRequirementType - Selected requirement type filter.
 * @param {Function} props.config.onFilterByRequirementType - Callback for filtering by requirement type.
 * @param {string} props.config.selectedJurisdiction - Selected jurisdiction filter.
 * @param {Function} props.config.onFilterByJurisdiction - Callback for filtering by jurisdiction.
 * @param {string} props.config.selectedState - Selected state filter.
 * @param {boolean} props.config.stateLoading - Indicates if states are loading.
 * @param {Function} props.config.onFilterByState - Callback for filtering by state.
 * @param {Array<string>} props.config.states - List of available states.
 * @param {Array<string>} props.config.municipalities - List of available municipalities.
 * @param {Array<string>} props.config.selectedMunicipalities - List of selected municipalities.
 * @param {boolean} props.config.municipalitiesLoading - Indicates if municipalities are loading.
 * @param {Function} props.config.onFilterByMunicipalities - Callback for filtering by municipalities.
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
    filterByNumber,
    onFilterByNumber,
    filterByName,
    onFilterByName,
    selectedCondition,
    onFilterByCondition,
    selectedEvidence,
    onFilterByEvidence,
    selectedPeriodicity,
    onFilterByPeriodicity,
    selectedRequirementType,
    onFilterByRequirementType,
    selectedJurisdiction,
    onFilterByJurisdiction,
    selectedState,
    stateLoading,
    onFilterByState,
    states,
    selectedMunicipalities,
    onFilterByMunicipalities,
    municipalities,
    municipalitiesLoading,
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
        {/* Número de requerimiento */}
        <Input
          color="primary"
          variant="faded"
          isClearable
          value={filterByNumber}
          className="w-full"
          placeholder="Buscar por número..."
          startContent={<img src={search_icon} alt="Search Icon" className="w-4 h-4" />}
          onClear={onClear}
          onValueChange={onFilterByNumber}
        />

        {/* Nombre del requerimiento */}
        <Input
          color="primary"
          variant="faded"
          isClearable
          value={filterByName}
          className="w-full"
          placeholder="Buscar por nombre..."
          startContent={
            <img 
              src={search_icon} 
              alt="Search Icon" 
              className="w-4 h-4 flex-shrink-0"
            />}
          onClear={onClear}
          onValueChange={onFilterByName}
        />
        {/* Condición */}
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

        {/* Evidencia */}
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
          <AutocompleteItem key="Específico">Específico</AutocompleteItem>
          <AutocompleteItem key="Documento">Documento</AutocompleteItem>
        </Autocomplete>

        {/* Periodicidad */}
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
        </Autocomplete>

        {/* Tipo de requerimiento */}
        <Autocomplete
          color="primary"
          variant="faded"
          onClear={onClear}
          placeholder="Buscar por tipo de requerimiento..."
          className="w-full"
          listboxProps={{
            emptyContent: "Tipo de requerimiento no encontrado",
          }}
          startContent={<img src={search_icon} alt="Search Icon" className="w-4 h-4" />}
          selectedKey={selectedRequirementType}
          onSelectionChange={onFilterByRequirementType}
        >
          <AutocompleteItem key="Identificación Estatal">Identificación Estatal</AutocompleteItem>
          <AutocompleteItem key="Identificación Federal">Identificación Federal</AutocompleteItem>
          <AutocompleteItem key="Identificación Local">Identificación Local</AutocompleteItem>
          <AutocompleteItem key="Requerimiento Compuesto">Requerimiento Compuesto</AutocompleteItem>
          <AutocompleteItem key="Requerimiento Compuesto e Identificación">Requerimiento Compuesto e Identificación</AutocompleteItem>
          <AutocompleteItem key="Requerimiento Estatal">Requerimiento Estatal</AutocompleteItem>
          <AutocompleteItem key="Requerimiento Local">Requerimiento Local</AutocompleteItem>
        </Autocomplete>

        {/* Jurisdicción */}
        <Autocomplete
          color="primary"
          variant="faded"
          onClear={onClear}
          placeholder="Seleccionar jurisdicción..."
          className="w-full"
          listboxProps={{
            emptyContent: "Jurisdicción no encontrada",
          }}
          startContent={<img src={search_icon} alt="Search Icon" className="w-4 h-4" />}
          selectedKey={selectedJurisdiction}
          onSelectionChange={onFilterByJurisdiction}
        >
          <AutocompleteItem key="Federal">Federal</AutocompleteItem>
          <AutocompleteItem key="Estatal">Estatal</AutocompleteItem>
          <AutocompleteItem key="Local">Local</AutocompleteItem>
        </Autocomplete>

        {/* Estado */}
        <Autocomplete
          color="primary"
          variant="faded"
          onClear={onClear}
          defaultItems={states.map((estado) => ({ id: estado, name: estado }))}
          isLoading={stateLoading}
          placeholder="Buscar por estado..."
          startContent={
            <img
              src={search_icon}
              alt="Search Icon"
              className="w-4 h-4 flex-shrink-0"
            />
          }
          className="w-full"
          selectedKey={selectedState}
          listboxProps={{
            emptyContent: "Estado no encontrado",
          }}
          onSelectionChange={onFilterByState}
        >
          {(estado) => (
            <AutocompleteItem key={estado.id} value={estado.id}>
              {estado.name}
            </AutocompleteItem>
          )}
        </Autocomplete>

        {/* Municipio */}
        <Tooltip content="Debes seleccionar un estado" 
        isDisabled={!!selectedState}
        >
          <div className="w-full">
            <Select
              color="primary"  
              items={municipalities.map((municipio) => ({
                id: municipio,
                name: municipio,
              }))}
              onClear={onClear}
              variant="faded"
              placeholder="Buscar por municipio..."
              startContent={
              <img 
              src={search_icon} 
              alt="Search Icon" 
              className="w-4 h-4 flex-shrink-0" 
              />
            }
              className="w-full"
              isLoading={
                municipalitiesLoading && !isCreateModalOpen && !isEditModalOpen
              }
              selectionMode="multiple"
              selectedKeys={selectedMunicipalities}
              listboxProps={{
                emptyContent: "Municipios no encontrados",
              }}
              isDisabled={!selectedState}
              onSelectionChange={onFilterByMunicipalities}
              renderValue={(selected) =>
                !selected || selected.length === 0
                  ? "Buscar por municipio..."
                  : `${selected.length} municipio${selected.length > 1 ? "s" : ""
                  } seleccionado${selected.length > 1 ? "s" : ""}`
              }
            >
              {(municipio) => (
                <SelectItem key={municipio.id} value={municipio.id}>
                  {municipio.name}
                </SelectItem>
              )}
            </Select>
          </div>
        </Tooltip>

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

        <div className="flex items-center gap-4 w-full sm:w-auto sm:ml-auto">
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
            endContent={<img src={mas_icon} alt="Add Icon" className="w-4 h-4" />}
          >
            Nuevo Requerimientos
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
    selectedRequirementType: PropTypes.string,
    onFilterByRequirementType: PropTypes.func.isRequired,
    selectedJurisdiction: PropTypes.string,
    onFilterByJurisdiction: PropTypes.func.isRequired,
    selectedState: PropTypes.string,
    stateLoading: PropTypes.bool.isRequired,
    onFilterByState: PropTypes.func.isRequired,
    states: PropTypes.arrayOf(PropTypes.string).isRequired,
    selectedMunicipalities: PropTypes.arrayOf(PropTypes.string),
    municipalities: PropTypes.arrayOf(PropTypes.string).isRequired,
    municipalitiesLoading: PropTypes.bool.isRequired,
    onFilterByMunicipalities: PropTypes.func.isRequired,
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


