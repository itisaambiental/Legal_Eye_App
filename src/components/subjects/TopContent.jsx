/* eslint-disable react/prop-types */
import { Input, Button } from "@nextui-org/react";
import search_icon from "../../assets/busqueda_blue.png";
import mas_icon from "../../assets/mas.png";

/**
 * TopContent component
 * 
 * This component renders the top section of a subject management interface, providing search, filter, 
 * and pagination controls, as well as a button to create a new subject.
 * 
 * @component
 * @param {Object} props - Component properties.
 * @param {Function} props.onRowsPerPageChange - Callback function for changing rows per page.
 * @param {number} props.totalSubjects - The total number of subjects.
 * @param {Function} props.openModalCreate - Function to open the modal for creating a new subject.
 * @param {Function} props.onFilterChange - Callback function for handling search input changes.
 * @param {Function} props.onClear - Callback function to clear the search input.
 * 
 * @returns {JSX.Element} Rendered TopContent component for managing subjects.
 */

function TopContent({ onRowsPerPageChange, totalSubjects, openModalCreate, onFilterChange, onClear }) {

  return (
    <div className="flex flex-col gap-4 mb-4">
      <div className="flex justify-between gap-16 items-end">
        <Input
          color="primary"
          variant="faded"
          isClearable
          className="w-full sm:max-w-[44%] flex-grow"
          placeholder="Buscar por nombre..."
          startContent={<img src={search_icon} alt="Search Icon" className="w-4 h-4 flex-shrink-0" />}
          onClear={onClear}
          onValueChange={onFilterChange}
        />

        <div className="flex gap-3 ml-auto">
          <Button color="primary" onClick={openModalCreate} endContent={<img src={mas_icon} alt="Add Icon" className="w-4 h-4 flex-shrink-0" />}>
            Nueva Materia
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-default-400">Materias totales: {totalSubjects}</span>
        <label className="flex items-center text-default-400">
          Filas por página:
          <select
            className="bg-transparent outline-none text-default-400"
            onChange={onRowsPerPageChange}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
          </select>
        </label>
      </div>
    </div>
  );
}

export default TopContent;
