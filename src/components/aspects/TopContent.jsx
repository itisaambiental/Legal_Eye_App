import PropTypes from "prop-types";
import { Input, Button, ScrollShadow } from "@nextui-org/react";
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
 * @param {Object} props.config - Component configuration object.
 * @param {string} props.config.subjectName - The name of the subject associated with the aspects.
 * @param {Function} props.config.onRowsPerPageChange - Callback function to handle changes in rows per page.
 * @param {number} props.config.totalAspects - The total number of aspects.
 * @param {Function} props.config.openModalCreate - Callback function to open the modal for creating a new aspect.
 * @param {Function} props.config.onFilterByName - Callback function for handling changes in the search input.
 * @param {Function} props.config.onClear - Callback function to clear the search input.
 * @param {string} props.config.filterByName - The current value of the search input.
 *
 * @returns {JSX.Element} Rendered TopContent component for managing aspects, with options for filtering, pagination, and creating aspects.
 */
function TopContent({ config }) {
  const {
    subjectName,
    onRowsPerPageChange,
    totalAspects,
    openModalCreate,
    onFilterByName,
    onClear,
    filterByName,
  } = config;

  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/subjects");
  };

  return (
    <div>
      <ScrollShadow
        orientation="vertical"
        className="relative -mt-8 mb-8 max-w-xs sm:max-w-md md:max-w-xl mx-auto text-center max-h-20 overflow-y-auto overflow-x-hidden"
      >
        <h1 className="font-semibold text-primary text-sm lg:text-lg">
          Aspectos de la materia:
          <span className="block font-thin text-gray-800 text-sm mt-1">
            {subjectName}
          </span>
        </h1>
      </ScrollShadow>
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

TopContent.propTypes = {
  config: PropTypes.shape({
    subjectName: PropTypes.string,
    onRowsPerPageChange: PropTypes.func.isRequired,
    totalAspects: PropTypes.number.isRequired,
    openModalCreate: PropTypes.func.isRequired,
    onFilterByName: PropTypes.func.isRequired, 
    onClear: PropTypes.func.isRequired,
    filterByName: PropTypes.string.isRequired, 
  }).isRequired,
};

export default TopContent;
