import PropTypes from "prop-types";
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
 *
 * @param {Object} props - Component properties.
 * @param {Object} props.config - Component configuration object.
 * @param {Function} props.config.onRowsPerPageChange - Callback function for changing rows per page.
 * @param {number} props.config.totalSubjects - The total number of subjects.
 * @param {Function} props.config.openModalCreate - Function to open the modal for creating a new subject.
 * @param {Function} props.config.onFilterByName - Callback function for handling search input changes.
 * @param {Function} props.config.onClear - Callback function to clear the search input.
 * @param {string} props.config.filterByName - The current value of the search input.
 *
 * @returns {JSX.Element} Rendered TopContent component for managing subjects.
 */

function TopContent({ config }) {
  const {
    onRowsPerPageChange,
    totalSubjects,
    openModalCreate,
    onFilterByName,
    onClear,
    filterByName,
  } = config;

  return (
    <div className="flex flex-col gap-4 mb-4">
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
        <Input
          color="primary"
          variant="faded"
          isClearable
          className="w-full"
          value={filterByName}
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
          Nueva Materia
        </Button>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <span className="text-default-400">
          Materias totales: {totalSubjects}
        </span>
        <div className="flex items-center gap-4 w-full sm:w-auto sm:ml-auto">
          <label className="flex items-center text-default-400 gap-2">
            Filas por página:
            <select
              className="bg-transparent outline-none text-default-400"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}

TopContent.propTypes = {
  config: PropTypes.shape({
    onRowsPerPageChange: PropTypes.func.isRequired,
    totalSubjects: PropTypes.number.isRequired,
    openModalCreate: PropTypes.func.isRequired,
    onFilterByName: PropTypes.func.isRequired, 
    onClear: PropTypes.func.isRequired,
    filterByName: PropTypes.string.isRequired, 
  }).isRequired,
};

export default TopContent;
