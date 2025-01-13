/* eslint-disable react/prop-types */
import { Input, Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import search_icon from "../../assets/busqueda_blue.png";
import mas_icon from "../../assets/mas.png";
import flecha_icon from "../../assets/flecha_izquierda.png";

/**
 * TopContent component for Aspects Management
 *
 * This component renders the top section of an aspects management interface. It provides options
 * for navigation back to the subject list, search functionality, and control over the number
 * of rows displayed per page. Additionally, it includes a button to create a new aspect.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {string} props.subjectName - The name of the subject associated with the aspects.
 * @param {Function} props.onRowsPerPageChange - Callback function triggered when the number of rows per page changes.
 * @param {number} props.totalAspects - The total number of aspects being managed.
 * @param {Function} props.openModalCreate - Function to open the modal for creating a new aspect.
 * @param {Function} props.onFilterChange - Callback function triggered when the search input changes.
 * @param {Function} props.onClear - Callback function to clear the search input.
 *
 * @returns {JSX.Element} Rendered TopContent component for managing aspects, with options for filtering, pagination, and creating aspects.
 */

function TopContent({
  subjectName,
  onRowsPerPageChange,
  totalAspects,
  openModalCreate,
  onFilterChange,
  onClear,
}) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/subjects");
  };

  return (
    <div>
      <h1
      
        className="font-semibold text-primary text-lg sm:text-xl md:text-xl lg:text-2xl text-center -mt-8 mb-8 truncate max-w-xs sm:max-w-md md:max-w-xl mx-auto whitespace-nowrap overflow-hidden text-ellipsis"
        title={`Aspectos de la materia: ${subjectName}`}
      >
        Aspectos de la materia: {subjectName}
      </h1>

      <div className="flex flex-col gap-4 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4">
          <Button
            color="primary"
            variant="solid"
            className="w-full"
            startContent={
              <img
                src={flecha_icon}
                alt="Back Icon"
                className="w-6 h-6 flex-shrink-0"
              />
            }
            onPress={handleBack}
          >
            Volver
          </Button>
          <Input
            color="primary"
            variant="faded"
            isClearable
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
            onValueChange={onFilterChange}
          />
          <Button
            color="primary"
            onPress={openModalCreate}
            className="w-full"
            endContent={
              <img
                src={mas_icon}
                alt="Add Icon"
                className="w-4 h-4 flex-shrink-0"
              />
            }
          >
            Nuevo Aspecto
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <span className="text-default-400">
            Aspectos totales: {totalAspects}
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
    </div>
  );
}

export default TopContent;
