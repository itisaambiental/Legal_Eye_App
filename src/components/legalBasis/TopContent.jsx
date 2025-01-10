/* eslint-disable react/prop-types */
import {
  Input,
  Button,
  Autocomplete,
  AutocompleteItem,
  Select,
  SelectItem,
  Tooltip,
  DateRangePicker,
} from "@nextui-org/react";
import search_icon from "../../assets/busqueda_blue.png";
import mas_icon from "../../assets/mas.png";
import {I18nProvider} from "@react-aria/i18n";


/**
 * TopContent component
 *
 * This component renders the top section of the Legal Basis management interface.
 * It includes search filters for name, abbreviation, subject, classification, jurisdiction, state, and municipality,
 * as well as controls for pagination and the ability to add new legal basis entries.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {boolean} props.isCreateModalOpen - Indicates whether the create modal is open.
 * @param {boolean} props.isEditModalOpen - Indicates whether the edit modal is open.
 * @param {Function} props.onRowsPerPageChange - Callback to handle changes in the number of rows displayed per page.
 * @param {number} props.totalLegalBasis - The total number of legal basis entries.
 * @param {Function} props.openModalCreate - Callback to open the modal for creating a new legal basis.
 * @param {string} props.filterByName - Current value of the name filter input.
 * @param {Function} props.onFilterByName - Callback to handle changes in the name filter input.
 * @param {string} props.filterByAbbreviation - Current value of the abbreviation filter input.
 * @param {Function} props.onFilterByAbbreviation - Callback to handle changes in the abbreviation filter input.
 * @param {Function} props.onClear - Callback to reset all filters and reload the data.
 * @param {Array<Object>} props.subjects - List of available subjects for filtering.
 * @param {boolean} props.subjectLoading - Indicates whether subjects are currently being loaded.
 * @param {string} props.selectedSubject - The currently selected subject for filtering.
 * @param {Function} props.onFilterBySubject - Callback to filter data by selected subject.
 * @param {Array<Object>} props.aspects - List of available aspects for filtering.
 * @param {boolean} props.aspectLoading - Indicates whether aspects are currently being loaded.
 * @param {Array<string>} props.selectedAspects - The currently selected aspects for filtering.
 * @param {Function} props.onFilterByAspects - Callback to filter data by selected aspects.
 * @param {Array<Object>} props.classifications - List of available classifications for filtering.
 * @param {string} props.selectedClassification - The currently selected classification for filtering.
 * @param {boolean} props.classificationsLoading - Indicates whether classifications are currently being loaded.
 * @param {Function} props.onFilterByClassification - Callback to filter data by selected classification.
 * @param {Array<Object>} props.jurisdictions - List of available jurisdictions for filtering.
 * @param {string} props.selectedJurisdiction - The currently selected jurisdiction for filtering.
 * @param {boolean} props.jurisdictionsLoading - Indicates whether jurisdictions are currently being loaded.
 * @param {Function} props.onFilterByJurisdiction - Callback to filter data by selected jurisdiction.
 * @param {Array<string>} props.states - List of available states for filtering.
 * @param {string} props.selectedState - The currently selected state for filtering.
 * @param {boolean} props.stateLoading - Indicates whether states are currently being loaded.
 * @param {Function} props.onFilterByState - Callback to filter data by selected state.
 * @param {Array<string>} props.municipalities - List of available municipalities for filtering.
 * @param {Set<string>} props.selectedMunicipalities - The currently selected municipalities for filtering.
 * @param {boolean} props.municipalitiesLoading - Indicates whether municipalities are currently being loaded.
 * @param {Function} props.onFilterByMunicipalities - Callback to filter data by selected municipalities.
 * @param {Object} props.lastReformRange - Object containing the start and end dates of the reform range.
 * @param {boolean} props.lastReformIsInvalid - Indicates whether the selected reform range is invalid.
 * @param {string} props.lastReformError - Error message displayed for the reform range input.
 * @param {Function} props.onFilterByLastReformRange - Callback to filter data by reform range.
 *
 * @returns {JSX.Element} Rendered component displaying filters, controls, and pagination options.
 */

function TopContent({
  isCreateModalOpen,
  isEditModalOpen,
  onRowsPerPageChange,
  totalLegalBasis,
  openModalCreate,
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
  aspectLoading,
  onFilterByAspects,
  classifications,
  selectedClassification,
  classificationsLoading,
  onFilterByClassification,
  jurisdictions,
  selectedJurisdiction,
  jurisdictionsLoading,
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
  onFilterByLastReformRange
}) {
  return (
    <div className="flex flex-col gap-4 mb-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <Input
          color="primary"
          variant="faded"
          isClearable
          label="Buscar por nombre..."
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
          label="Buscar por abreviatura..."
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
          label="Buscar por materia..."
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
          label="Buscar por clasificación..."
          defaultItems={classifications}
          isLoading={classificationsLoading}
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
          {(classification) => (
            <AutocompleteItem
              key={classification.classification_name}
              value={classification.classification_name}
            >
              {classification.classification_name}
            </AutocompleteItem>
          )}
        </Autocomplete>
        <Autocomplete
          color="primary"
          variant="faded"
          label="Buscar por jurisdicción..."
          defaultItems={jurisdictions}
          isLoading={jurisdictionsLoading}
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
          {(jurisdiction) => (
            <AutocompleteItem
              key={jurisdiction.jurisdiction_name}
              value={jurisdiction.jurisdiction_name}
            >
              {jurisdiction.jurisdiction_name}
            </AutocompleteItem>
          )}
        </Autocomplete>
        <Autocomplete
          color="primary"
          variant="faded"
          label="Buscar por estado..."
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
              items={municipalities.map((municipio) => ({ id: municipio, name: municipio }))}
              onClear={onClear}
              variant="faded"
              label="Buscar por municipio..."
              placeholder="Buscar por municipio..."
              startContent={
                <img
                  src={search_icon}
                  alt="Search Icon"
                  className="w-4 h-4 flex-shrink-0"
                />
              }
              className="w-full"
              isLoading={municipalitiesLoading && !isCreateModalOpen && !isEditModalOpen}
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
                  : `${selected.length} municipio${
                      selected.length > 1 ? "s" : ""
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
              label="Buscar por aspecto..."
              placeholder="Buscar por aspecto..."
              startContent={
                <img
                  src={search_icon}
                  alt="Search Icon"
                  className="w-4 h-4 flex-shrink-0"
                />
              }
              className="w-full"
              isLoading={aspectLoading && !isCreateModalOpen && !isEditModalOpen}
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
                  : `${selected.length} aspecto${
                      selected.length > 1 ? "s" : ""
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
            size="sm"
            variant="faded"
            aria-label="Buscar por última reforma"
            isInvalid={lastReformIsInvalid}
            errorMessage={lastReformIsInvalid ? lastReformError : " "}
            label="Buscar por última reforma..."
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
        </div>
      </div>
    </div>
  );
}

export default TopContent;
