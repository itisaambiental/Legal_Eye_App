/* eslint-disable react/prop-types */
import { Input, Button, Autocomplete, AutocompleteItem, Select, SelectItem, Tooltip } from "@nextui-org/react";
import search_icon from "../../assets/busqueda_blue.png";
// import angulo_abajo_icon from "../../assets/angulo_abajo.png";
import mas_icon from "../../assets/mas.png";

/**
 * TopContent component
 * 
 * This component renders the top section of a Legal Basis management interface. It provides inputs for
 * searching and filtering Legal Basis by name, abbreviation, and subject, as well as controls for pagination
 * and adding a new Legal Basis.
 * 
 * @component
 * @param {Object} props - Component properties.
 * @param {Function} props.onRowsPerPageChange - Callback function for changing the number of rows displayed per page.
 * @param {number} props.totalLegalBasis - The total number of Legal Basis to display.
 * @param {Function} props.openModalCreate - Function to open a modal for creating a new Legal Basis.
 * @param {string} props.filterByName - Current value of the search filter for Legal Basis names.
 * @param {string} props.filterByAbbreviation - Current value of the search filter for Legal Basis abbreviations.
 * @param {Function} props.onFilterByName - Callback function to update the search filter by name.
 * @param {Function} props.onFilterByAbbreviation - Callback function to update the search filter by abbreviation.
 * @param {Function} props.onClear - Callback function to reset all active filters and reload the data.
 * @param {Array} props.subjects - Array of subjects available for filtering.
 * @param {Function} props.onFilterBySubject - Callback function to filter Legal Basis by a specific subject's ID.
 * @param {Array} props.aspects - Array of aspects available for filtering.
 * 
 * @returns {JSX.Element} A component for managing the top section of the Legal Basis interface, including search, 
 * filtering, pagination, and a button to add a new Legal Basis.
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
}) {
  return (
    <div className="flex flex-col gap-4 mb-4">
      <div className="flex justify-between gap-16 items-end">
        <Input
          color="primary"
          variant="faded"
          isClearable
          value={filterByName}
          className="max-w-xs flex-grow"
          placeholder="Buscar por nombre..."
          startContent={<img src={search_icon} alt="Search Icon" className="w-4 h-4 flex-shrink-0" />}
          onClear={onClear}
          onValueChange={onFilterByName}
        />
        <Input
          color="primary"
          variant="faded"
          isClearable
          value={filterByAbbreviation}
          className="max-w-xs flex-grow"
          placeholder="Buscar por abreviatura..."
          startContent={<img src={search_icon} alt="Search Icon" className="w-4 h-4 flex-shrink-0" />}
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
          className="max-w-xs flex-grow"
          selectedKey={selectedSubject}
          listboxProps={{
            emptyContent: 'Materia no encontrada'
          }}
          onSelectionChange={onFilterBySubject}
        >
          {(subject) => (
            <AutocompleteItem key={subject.id} value={subject.id}>
              {subject.subject_name}
            </AutocompleteItem>
          )}
        </Autocomplete>
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
              className="max-w-xs flex-grow"
              isLoading={aspectLoading}
              selectionMode="multiple"
              selectedKeys={selectedAspects}
              listboxProps={{
                emptyContent: 'Aspectos no encontrados'
              }}
              isDisabled={!selectedSubject} 
              onSelectionChange={onFilterByAspects}
              renderValue={(selected) =>
                !selected || selected.length === 0
                  ? "Buscar por aspecto..."
                  : `${selected.length} aspecto${selected.length > 1 ? 's' : ''} seleccionado${selected.length > 1 ? 's' : ''}`
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

        <div className="flex gap-6 ml-auto">
          <Button color="primary" onPress={openModalCreate} endContent={<img src={mas_icon} alt="Add Icon" className="w-4 h-4 flex-shrink-0" />}>
            Nuevo Fundamento
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-default-400">Fundamentos totales: {totalLegalBasis}</span>
        <label className="flex items-center text-default-400">
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
      </div>
    </div>
  );
}

export default TopContent;