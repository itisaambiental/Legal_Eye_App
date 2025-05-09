import PropTypes from "prop-types";
import { Input, Button } from "@heroui/react";
import search_icon from "../../assets/busqueda_blue.png";
import mas_icon from "../../assets/mas.png";

/**
 * TopContent component for Legal Verbs Management
 *
 * This component renders the top section of the Legal Verbs management view.
 * It includes search inputs for name, description, and translation, controls for
 * pagination, and a button to open the modal to create a new Legal Verbs.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Object} props.config - Configuration object with all props needed to manage state and actions.
 * @param {string} props.config.filterByName - Current value of the name search input.
 * @param {string} props.config.filterByDescription - Current value of the description search input.
 * @param {string} props.config.filterByTranslation - Current value of the translation search input.
 * @param {Function} props.config.onFilterByName - Callback to handle name input changes.
 * @param {Function} props.config.onFilterByDescription - Callback to handle description input changes.
 * @param {Function} props.config.onFilterByTranslation - Callback to handle translation input changes.
 * @param {Function} props.config.onClear - Callback to clear all search filters.
 * @param {number} props.config.totalLegalVerbs - Total number of Legal Verbs currently loaded.
 * @param {Function} props.config.onRowsPerPageChange - Callback to change the number of rows per page.
 * @param {Function} props.config.openModalCreate - Callback to open the modal to create a new Legal Verbs.
 *
 * @returns {JSX.Element} Rendered TopContent component.
 */
function TopContent({ config }) {
  const {
    filterByName,
    filterByDescription,
    filterByTranslation,
    onFilterByName,
    onFilterByDescription,
    onFilterByTranslation,
    onClear,
    totalLegalVerbs,
    onRowsPerPageChange,
    openModalCreate,
  } = config;

  return (
    <div className="flex flex-col gap-4 mb-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Input
          color="primary"
          variant="faded"
          isClearable
          value={filterByName}
          className="w-full"
          placeholder="Buscar por nombre..."
          startContent={<img src={search_icon} alt="Icono de búsqueda" className="w-4 h-4" />}
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
          startContent={<img src={search_icon} alt="Icono de búsqueda" className="w-4 h-4" />}
          onClear={onClear}
          onValueChange={onFilterByDescription}
        />
        <Input
          color="primary"
          variant="faded"
          isClearable
          value={filterByTranslation}
          className="w-full"
          placeholder="Buscar por traducción..."
          startContent={<img src={search_icon} alt="Icono de búsqueda" className="w-4 h-4" />}
          onClear={onClear}
          onValueChange={onFilterByTranslation}
        />
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <span className="text-default-400">
          Tipos de requerimiento totales: {totalLegalVerbs}
        </span>
        <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto sm:ml-auto">
          <label className="flex items-center text-default-400 gap-2">
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
          <Button
            color="primary"
            onPress={openModalCreate}
            className="w-full sm:w-auto"
            endContent={<img src={mas_icon} alt="Icono de agregar" className="w-4 h-4" />}
          >
            Nuevo Verbo Legal 
          </Button>
        </div>
      </div>
    </div>
  );
}

TopContent.propTypes = {
  config: PropTypes.shape({
    filterByName: PropTypes.string.isRequired,
    filterByDescription: PropTypes.string.isRequired,
    filterByTranslation: PropTypes.string.isRequired,
    onFilterByName: PropTypes.func.isRequired,
    onFilterByDescription: PropTypes.func.isRequired,
    onFilterByTranslation: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
    totalLegalVerbs: PropTypes.number.isRequired,
    onRowsPerPageChange: PropTypes.func.isRequired,
    openModalCreate: PropTypes.func.isRequired,
  }).isRequired,
};

export default TopContent;
