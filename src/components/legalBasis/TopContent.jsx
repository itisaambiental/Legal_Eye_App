/* eslint-disable react/prop-types */
import { Input, Dropdown, DropdownTrigger, DropdownMenu, Button } from "@nextui-org/react";
import search_icon from "../../assets/busqueda_blue.png";
import angulo_abajo_icon from "../../assets/angulo_abajo.png";
import mas_icon from "../../assets/mas.png";

/**
 * TopContent component
 * 
 * This component renders the top section of a Legal basis management interface, providing search, filter, 
 * and pagination controls, as well as a button to create a new legal basis.
 * 
 * @component
 * @param {Object} props - Component properties.
 * @param {Function} props.onRowsPerPageChange - Callback function for changing rows per page.
 * @param {number} props.totalLegalBasis - The total number of Legal Basis.
 * @param {Function} props.openModalCreate - Function to open the modal for creating a new legal basis.
 * @param {Function} props.onFilterChange - Callback function for handling search input changes.
 * @param {Function} props.onClear - Callback function to clear the search input.
 * 
 * @returns {JSX.Element} Rendered TopContent component for managing legal basis.
 */

function TopContent({ onRowsPerPageChange, totalLegalBasis, openModalCreate, onFilterChange, onClear, value }) {

  return (
    <div className="flex flex-col gap-4 mb-4">
      <div className="flex justify-between gap-16 items-end">
        <Input
          color="primary"
          variant="faded"
          isClearable
          value={value} 
          className="w-full sm:max-w-[44%] flex-grow"
          placeholder="Buscar por nombre..."
          startContent={<img src={search_icon} alt="Search Icon" className="w-4 h-4 flex-shrink-0" />}
          onClear={onClear}
          onValueChange={(value) => onFilterChange('legal_name', value)}
        />
             <Input
          color="primary"
          variant="faded"
          isClearable
          value={value} 
          className="w-full sm:max-w-[44%] flex-grow"
          placeholder="Buscar por abreviatura..."
          startContent={<img src={search_icon} alt="Search Icon" className="w-4 h-4 flex-shrink-0" />}
          onClear={onClear}
          onValueChange={(value) => onFilterChange('abbreviation', value)}
        />

        <div className="flex gap-3 ml-auto">
          <Dropdown>
            <DropdownTrigger>
              <Button endContent={<img src={angulo_abajo_icon} alt="Search Icon" className="w-4 h-4 flex-shrink-0 text-small" />} variant="faded" color="primary">

              </Button>
            </DropdownTrigger>
            <DropdownMenu
              color="primary"
              variant="flat"
              disallowEmptySelection
              aria-label="Seleccionar Rol"
              selectionMode="single"
            >
        
            </DropdownMenu>
          </Dropdown>

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
