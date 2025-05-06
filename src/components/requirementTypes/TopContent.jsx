import PropTypes from "prop-types";
import { Input, Button } from "@heroui/react";
import search_icon from "../../assets/busqueda_blue.png";
import mas_icon from "../../assets/mas.png";

/**
 * TopContent for Requirement Types module.
 *
 * @param {Object} props
 * @param {Object} props.config
 * @returns {JSX.Element}
 */
function TopContent({ config }) {
  const {
    filterByName,
    filterByDescription,
    filterByClassification,
    onFilterByName,
    onFilterByDescription,
    onFilterByClassification,
    onClear,
    totalRequirementTypes,
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
          startContent={<img src={search_icon} alt="Search Icon" className="w-4 h-4" />}
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
          startContent={<img src={search_icon} alt="Search Icon" className="w-4 h-4" />}
          onClear={onClear}
          onValueChange={onFilterByDescription}
        />
        <Input
          color="primary"
          variant="faded"
          isClearable
          value={filterByClassification}
          className="w-full"
          placeholder="Buscar por clasificación..."
          startContent={<img src={search_icon} alt="Search Icon" className="w-4 h-4" />}
          onClear={onClear}
          onValueChange={onFilterByClassification}
        />
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <span className="text-default-400">Tipos de requerimiento totales: {totalRequirementTypes}</span>
        <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto sm:ml-auto">
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
            className="w-full sm:w-auto"
            endContent={<img src={mas_icon} alt="Add Icon" className="w-4 h-4" />}
          >
            Nuevo Tipo de Requerimiento
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
    filterByClassification: PropTypes.string.isRequired,
    onFilterByName: PropTypes.func.isRequired,
    onFilterByDescription: PropTypes.func.isRequired,
    onFilterByClassification: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
    totalRequirementTypes: PropTypes.number.isRequired,
    onRowsPerPageChange: PropTypes.func.isRequired,
    openModalCreate: PropTypes.func.isRequired,
  }).isRequired,
};

export default TopContent;
