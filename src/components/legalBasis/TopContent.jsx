import PropTypes from "prop-types";
import {
  Input,
  Button,
  Autocomplete,
  AutocompleteItem,
  Select,
  SelectItem,
  Tooltip,
  DateRangePicker,
} from "@heroui/react";
import search_icon from "../../assets/busqueda_blue.png";
import search_icon_white from "../../assets/busqueda.png";
import mas_icon from "../../assets/mas.png";
import { I18nProvider } from "@react-aria/i18n";

/**
 * TopContent component
 *
 * This component renders the top section of the Legal Basis management interface.
 * It includes search filters for various parameters, pagination controls, and
 * the ability to add new legal basis entries.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Object} props.config - Configuration object for the component.
 * @param {boolean} props.config.isCreateModalOpen - Indicates whether the create modal is open.
 * @param {boolean} props.config.isEditModalOpen - Indicates whether the edit modal is open.
 * @param {boolean} props.config.isFilterModalOpen - Indicates whether the filter modal is open.
 * @param {Function} props.config.onRowsPerPageChange - Callback to handle changes in rows per page.
 * @param {number} props.config.totalLegalBasis - Total number of legal basis entries.
 * @param {Function} props.config.openModalCreate - Function to open the create modal.
 * @param {Function} props.config.openFilterModal, - Function to open the filter modal.
 * @param {string} props.config.filterByName - Current value of the name filter.
 * @param {Function} props.config.onFilterByName - Callback for name filter changes.
 * @param {string} props.config.filterByAbbreviation - Current value of the abbreviation filter.
 * @param {Function} props.config.onFilterByAbbreviation - Callback for abbreviation filter changes.
 * @param {Function} props.config.onClear - Callback to reset all filters.
 * @param {Array<Object>} props.config.subjects - List of subjects for filtering.
 * @param {string} props.config.selectedSubject - Currently selected subject.
 * @param {boolean} props.config.subjectLoading - Indicates if subjects are loading.
 * @param {Function} props.config.onFilterBySubject - Callback for subject filter changes.
 * @param {Array<Object>} props.config.aspects - List of aspects for filtering.
 * @param {Array<string>} props.config.selectedAspects - Selected aspects.
 * @param {boolean} props.config.aspectsLoading - Indicates if aspects are loading.
 * @param {Function} props.config.onFilterByAspects - Callback for aspect filter changes.
 * @param {string} props.config.selectedClassification - Selected classification.
 * @param {Function} props.config.onFilterByClassification - Callback for classification changes.
 * @param {string} props.config.selectedJurisdiction - Selected jurisdiction.
 * @param {Function} props.config.onFilterByJurisdiction - Callback for jurisdiction changes.
 * @param {Array<string>} props.config.states - List of states for filtering.
 * @param {string} props.config.selectedState - Selected state.
 * @param {boolean} props.config.stateLoading - Indicates if states are loading.
 * @param {Function} props.config.onFilterByState - Callback for state filter changes.
 * @param {Array<string>} props.config.municipalities - List of municipalities for filtering.
 * @param {Set<string>} props.config.selectedMunicipalities - Selected municipalities.
 * @param {boolean} props.config.municipalitiesLoading - Indicates if municipalities are loading.
 * @param {Function} props.config.onFilterByMunicipalities - Callback for municipality filter changes.
 * @param {Object} props.config.lastReformRange - Object with start and end dates for the reform range.
 * @param {boolean} props.config.lastReformIsInvalid - Indicates if the reform range is invalid.
 * @param {string} props.config.lastReformError - Error message for the reform range.
 * @param {Function} props.config.onFilterByLastReformRange - Callback for reform range filter changes.
 *
 * @returns {JSX.Element} Rendered component displaying filters, controls, and pagination options.
 */
function TopContent({ config }) {
  const {
    isCreateModalOpen,
    isEditModalOpen,
    isFilterModalOpen,
    onRowsPerPageChange,
    totalLegalBasis,
    openModalCreate,
    openFilterModal,
    filterByName,
    filterByAbbreviation,
    onFilterByName,
    onFilterByAbbreviation,
    onClear,
    subjects,
    selectedSubject,
    subjectLoading,
    onFilterBySubject,
    aspects,
    selectedAspects,
    aspectsLoading,
    onFilterByAspects,
    selectedClassification,
    onFilterByClassification,
    selectedJurisdiction,
    onFilterByJurisdiction,
    states,
    selectedState,
    stateLoading,
    onFilterByState,
    municipalities,
    selectedMunicipalities,
    municipalitiesLoading,
    onFilterByMunicipalities,
    lastReformRange,
    lastReformIsInvalid,
    lastReformError,
    onFilterByLastReformRange,
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
          placeholder="Buscar por nombre..."
          startContent={
            <img
              src={search_icon}
              alt="Search Icon"
              className="w-4 h-4 flex-shrink-0"
            />
          }
          onClear={onClear}
          onValueChange={onFilterByName}
        />
        <Input
          color="primary"
          variant="faded"
          isClearable
          value={filterByAbbreviation}
          className="w-full"
          placeholder="Buscar por abreviatura..."
          startContent={
            <img
              src={search_icon}
              alt="Search Icon"
              className="w-4 h-4 flex-shrink-0"
            />
          }
          onClear={onClear}
          onValueChange={onFilterByAbbreviation}
        />
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
        <Autocomplete
          color="primary"
          variant="faded"
          onClear={onClear}
          placeholder="Buscar por clasificación..."
          startContent={
            <img
              src={search_icon}
              alt="Search Icon"
              className="w-4 h-4 flex-shrink-0"
            />
          }
          className="w-full"
          selectedKey={selectedClassification}
          listboxProps={{
            emptyContent: "Clasificación no encontrada",
          }}
          onSelectionChange={onFilterByClassification}
        >
          <AutocompleteItem key="Ley">Ley</AutocompleteItem>
          <AutocompleteItem key="Reglamento">Reglamento</AutocompleteItem>
          <AutocompleteItem key="Norma">Norma</AutocompleteItem>
          <AutocompleteItem key="Acuerdos">Acuerdos</AutocompleteItem>
          <AutocompleteItem key="Código">Código</AutocompleteItem>
          <AutocompleteItem key="Decreto">Decreto</AutocompleteItem>
          <AutocompleteItem key="Lineamiento">Lineamiento</AutocompleteItem>
          <AutocompleteItem key="Aviso">Aviso</AutocompleteItem>
        </Autocomplete>
        <Autocomplete
          color="primary"
          variant="faded"
          onClear={onClear}
          placeholder="Buscar por jurisdicción..."
          startContent={
            <img
              src={search_icon}
              alt="Search Icon"
              className="w-4 h-4 flex-shrink-0"
            />
          }
          className="w-full"
          selectedKey={selectedJurisdiction}
          listboxProps={{
            emptyContent: "Jurisdicción no encontrada",
          }}
          onSelectionChange={onFilterByJurisdiction}
        >
          <AutocompleteItem key="Federal">Federal</AutocompleteItem>
          <AutocompleteItem key="Estatal">Estatal</AutocompleteItem>
          <AutocompleteItem key="Local">Local</AutocompleteItem>
        </Autocomplete>
        <Autocomplete
          color="primary"
          variant="faded"
          defaultItems={states.map((estado) => ({ id: estado, name: estado }))}
          isLoading={stateLoading}
          onClear={onClear}
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
        <Tooltip
          content="Debes seleccionar un estado"
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
                municipalitiesLoading && !isCreateModalOpen && !isEditModalOpen && !isFilterModalOpen
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
                aspectsLoading && !isCreateModalOpen && !isEditModalOpen && !isFilterModalOpen
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
        <I18nProvider locale="es">
          <DateRangePicker
            value={lastReformRange}
            showMonthAndYearPickers
            onChange={onFilterByLastReformRange}
            color="primary"
            radius="sm"
            variant="faded"
            aria-label="Buscar por última reforma..."
            label="Buscar por última reforma..."
            isInvalid={lastReformIsInvalid}
            errorMessage={lastReformIsInvalid ? lastReformError : " "}
            classNames={{
              base: "h-12 relative",
              input: "text-xs",
              errorMessage: "absolute mt-1 text-xs",
            }}
          />
        </I18nProvider>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <span className="text-default-400">
          Fundamentos totales: {totalLegalBasis}
        </span>
        <div className="flex items-center gap-4 w-full sm:w-auto sm:ml-auto">
          <label className="flex items-center text-default-400 gap-2">
            Filas por página:
            <select
              className="bg-transparent outline-none text-default-400"
              onChange={onRowsPerPageChange}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="40">40</option>
            </select>
          </label>
          <Button
            color="primary"
            onPress={openModalCreate}
            endContent={
              <img
                src={mas_icon}
                alt="Add Icon"
                className="w-4 h-4 flex-shrink-0"
              />
            }
          >
            Nuevo Fundamento
          </Button>
          <Button
            className="bg-secondary text-white"
            onPress={openFilterModal}
            endContent={
              <img
                src={search_icon_white}
                alt="Add Icon"
                className="w-4 h-4 flex-shrink-0"
              />
            }
          >
            Búsqueda Avanzada
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
    isFilterModalOpen: PropTypes.bool.isRequired,
    onRowsPerPageChange: PropTypes.func.isRequired,
    totalLegalBasis: PropTypes.number.isRequired,
    openModalCreate: PropTypes.func.isRequired,
    openFilterModal: PropTypes.func.isRequired,
    filterByName: PropTypes.string.isRequired,
    onFilterByName: PropTypes.func.isRequired,
    filterByAbbreviation: PropTypes.string.isRequired,
    onFilterByAbbreviation: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
    subjects: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        subject_name: PropTypes.string,
      })
    ).isRequired,
    selectedSubject: PropTypes.string,
    subjectLoading: PropTypes.bool.isRequired,
    onFilterBySubject: PropTypes.func.isRequired,
    aspects: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        aspect_name: PropTypes.string,
      })
    ).isRequired,
    selectedAspects: PropTypes.arrayOf(PropTypes.string),
    aspectsLoading: PropTypes.bool.isRequired,
    onFilterByAspects: PropTypes.func.isRequired,
    selectedClassification: PropTypes.string,
    onFilterByClassification: PropTypes.func.isRequired,
    selectedJurisdiction: PropTypes.string,
    onFilterByJurisdiction: PropTypes.func.isRequired,
    states: PropTypes.arrayOf(PropTypes.string).isRequired,
    selectedState: PropTypes.string,
    stateLoading: PropTypes.bool.isRequired,
    onFilterByState: PropTypes.func.isRequired,
    municipalities: PropTypes.arrayOf(PropTypes.string).isRequired,
    selectedMunicipalities: PropTypes.array,
    municipalitiesLoading: PropTypes.bool.isRequired,
    onFilterByMunicipalities: PropTypes.func.isRequired,
    lastReformRange: PropTypes.shape({
      start: PropTypes.string,
      end: PropTypes.string,
    }),
    lastReformIsInvalid: PropTypes.bool.isRequired,
    lastReformError: PropTypes.string,
    onFilterByLastReformRange: PropTypes.func.isRequired,
  }).isRequired,
};

export default TopContent;
