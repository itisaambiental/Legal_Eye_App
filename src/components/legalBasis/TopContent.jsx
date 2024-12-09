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
 * It includes search filters by name, abbreviation, subject, classification, jurisdiction, state, and municipality,
 * as well as pagination controls and a button to add a new Legal Basis.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Function} props.onRowsPerPageChange - Function to change the number of displayed rows per page.
 * @param {number} props.totalLegalBasis - The total number of Legal Basis.
 * @param {Function} props.openModalCreate - Function to open the modal for creating a new Legal Basis.
 * @param {string} props.filterByName - Current value of the name search filter.
 * @param {Function} props.onFilterByName - Callback to update the name filter.
 * @param {string} props.filterByAbbreviation - Current value of the abbreviation search filter.
 * @param {Function} props.onFilterByAbbreviation - Callback to update the abbreviation filter.
 * @param {Function} props.onClear - Callback to clear all filters and reload the data.
 * @param {Array} props.subjects - Array of available subjects for filtering.
 * @param {boolean} props.subjectLoading - Indicates whether subjects are currently loading.
 * @param {string} props.selectedSubject - Currently selected subject.
 * @param {Function} props.onFilterBySubject - Callback to filter by subject.
 * @param {Array} props.aspects - Array of available aspects for filtering.
 * @param {boolean} props.aspectLoading - Indicates whether aspects are currently loading.
 * @param {Array<string>} props.selectedAspects - Currently selected aspects.
 * @param {Function} props.onFilterByAspects - Callback to filter by aspects.
 * @param {Array<{classification_name: string}>} props.classifications - Array of available classifications.
 * @param {string} props.selectedClassification - Currently selected classification.
 * @param {boolean} props.classificationsLoading - Indicates whether classifications are loading.
 * @param {Function} props.onFilterByClassification - Callback to filter by classification.
 * @param {Array<{jurisdiction_name: string}>} props.jurisdictions - Array of available jurisdictions.
 * @param {string} props.selectedJurisdiction - Currently selected jurisdiction.
 * @param {boolean} props.jurisdictionsLoading - Indicates whether jurisdictions are loading.
 * @param {Function} props.onFilterByJurisdiction - Callback to filter by jurisdiction.
 * @param {Array<string>} props.states - Array of available states.
 * @param {string} props.selectedState - Currently selected state.
 * @param {boolean} props.stateLoading - Indicates whether states are currently loading.
 * @param {Function} props.onFilterByState - Callback to filter by state.
 * @param {Array<string>} props.municipalities - Array of available municipalities.
 * @param {Set<string>} props.selectedMunicipalities - Currently selected municipalities.
 * @param {boolean} props.municipalitiesLoading - Indicates whether municipalities are currently loading.
 * @param {Function} props.onFilterByMunicipalities - Callback to filter by municipalities.
 *
 * @returns {JSX.Element}
 */
function TopContent({
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
  selectedLastReformRange,
  onFilterByLastReformRange
}) {
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
              items={municipalities.map((muni) => ({ id: muni, name: muni }))}
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
              isLoading={municipalitiesLoading}
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
              placeholder="Buscar por aspecto..."
              startContent={
                <img
                  src={search_icon}
                  alt="Search Icon"
                  className="w-4 h-4 flex-shrink-0"
                />
              }
              className="w-full"
              isLoading={aspectLoading}
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
          showMonthAndYearPickers
          size="sm"
          variant="faded"
          label="Buscar por última reforma..."
          onChange={onFilterByLastReformRange}
          errorMessage="La fecha de inicio debe ser anterior a la fecha de finalización."
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
