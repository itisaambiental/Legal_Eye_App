import { Input, Button, ScrollShadow } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import search_icon from "../../assets/busqueda_blue.png";
import mas_icon from "../../assets/mas.png";
import flecha_icon from "../../assets/flecha_izquierda.png";

/**
 * TopContent component for Articles Management
 *
 * This component renders the top section of an articles management interface. It provides options
 * for navigation back to the legal basis list, search functionality, and control over the number
 * of rows displayed per page. Additionally, it includes a button to create a new article.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Object} props.config - Configuration object.
 * @param {string} props.config.legalBaseName - The name of the legalBase associated with the articles.
 * @param {Function} props.config.onRowsPerPageChange - Callback function triggered when the number of rows per page changes.
 * @param {number} props.config.totalArticles - The total number of articles being managed.
 * @param {Function} props.config.openModalCreate - Function to open the modal for creating a new article.
 * @param {Function} props.config.onFilterByName - Callback function triggered when the search input for filtering by name changes.
 * @param {Function} props.config.onFilterByDescription - Callback function triggered when the search input for filtering by description changes.
 * @param {Function} props.config.onClear - Callback function to clear the search inputs.
 * @param {string} props.config.filterByName - Current value of the search input for filtering by name.
 * @param {string} props.config.filterByDescription - Current value of the search input for filtering by description.
 *
 * @returns {JSX.Element} Rendered TopContent component for managing articles, with options for filtering, pagination, and creating articles.
 */

function TopContent({ config }) {
  const {
    legalBaseName,
    onRowsPerPageChange,
    totalArticles,
    openModalCreate,
    onFilterByName,
    onFilterByDescription,
    onClear,
    filterByName,
    filterByDescription,
  } = config;

  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/legal_basis");
  };

  return (
    <div>
      <ScrollShadow
        orientation="vertical"
        className="relative -mt-8 mb-8 max-w-xs sm:max-w-md md:max-w-xl mx-auto text-center max-h-20 overflow-y-auto overflow-x-hidden"
      >
        <h1 className="font-semibold text-primary text-sm lg:text-lg">
          Artículos del fundamento:
          <span className="block font-thin text-gray-800 text-sm mt-1">
            {legalBaseName}
          </span>
        </h1>
      </ScrollShadow>

      <div className="flex flex-col gap-4 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
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
            value={filterByDescription}
            className="w-full"
            placeholder="Buscar por descripción..."
            startContent={
              <img
                src={search_icon}
                alt="Search Icon"
                className="w-4 h-4 flex-shrink-0"
              />
            }
            onClear={onClear}
            onValueChange={onFilterByDescription}
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
            Nuevo Artículo
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <span className="text-default-400">
            Artículos totales: {totalArticles}
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
          </div>
        </div>
      </div>
    </div>
  );
}

TopContent.propTypes = {
  config: PropTypes.shape({
    legalBaseName: PropTypes.string,
    onRowsPerPageChange: PropTypes.func.isRequired,
    totalArticles: PropTypes.number.isRequired,
    openModalCreate: PropTypes.func.isRequired,
    onFilterByName: PropTypes.func.isRequired,
    onFilterByDescription: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
    filterByName: PropTypes.string,
    filterByDescription: PropTypes.string,
  }).isRequired,
};

export default TopContent;
