import PropTypes from "prop-types";
import {
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import search_icon from "../../assets/busqueda_blue.png";
import angulo_abajo_icon from "../../assets/angulo_abajo.png";
import mas_icon from "../../assets/mas.png";

/**
 * TopContent component
 *
 * This component renders the top section of a user management interface, providing search, filter,
 * pagination controls, and a button to create a new user. It supports filtering by name, email,
 * and roles, and provides callbacks for handling search, filter, and pagination interactions.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Object} props.config - Configuration object for the component.
 * @param {Array} props.config.roles - List of roles available for filtering users.
 * @param {Function} props.config.onRowsPerPageChange - Callback for changing rows per page.
 * @param {number} props.config.totalUsers - Total number of users.
 * @param {Function} props.config.capitalize - Function to capitalize role names.
 * @param {Function} props.config.openModalCreate - Callback to open the modal for creating a new user.
 * @param {Function} props.config.onFilterByNameOrEmail - Callback to handle filtering by name or email.
 * @param {Function} props.config.onFilterByRole - Callback to handle filtering by role.
 * @param {Function} props.config.onClear - Callback to clear all filters.
 * @param {string} props.config.filterByNameOrEmail - Current value of the name or email filter input.
 * @param {string} props.config.filterByRole - Current value of the role filter.
 * @param {Set} props.config.selectedRoleKeys - Set of selected role keys for filtering.
 * @param {Function} props.config.translateRole - Function to translate role names.
 *
 * @returns {JSX.Element} Rendered TopContent component.
 */
function TopContent({ config }) {
  const {
    roles,
    onRowsPerPageChange,
    totalUsers,
    capitalize,
    openModalCreate,
    onFilterByNameOrEmail,
    onFilterByRole,
    onClear,
    filterByNameOrEmail,
    filterByRole,
    selectedRoleKeys,
    translateRole,
  } = config;

  return (
    <div className="flex flex-col gap-4 mb-4">
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        <Input
          color="primary"
          variant="faded"
          isClearable
          value={filterByNameOrEmail}
          className="w-full"
          placeholder="Buscar por nombre o email..."
          startContent={
            <img
              src={search_icon}
              alt="Search Icon"
              className="w-4 h-4 flex-shrink-0"
            />
          }
          onClear={onClear}
          onValueChange={onFilterByNameOrEmail}
        />

        <Dropdown>
          <DropdownTrigger>
            <Button
              endContent={
                <img
                  src={angulo_abajo_icon}
                  alt="Dropdown Icon"
                  className="w-4 h-4 flex-shrink-0 text-small"
                />
              }
              variant="faded"
              color="primary"
            >
              {filterByRole}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            color="primary"
            variant="flat"
            disallowEmptySelection
            aria-label="Seleccionar Rol"
            selectionMode="single"
            selectedKeys={selectedRoleKeys}
            onSelectionChange={onFilterByRole}
          >
            <DropdownItem key="0">Todos los Roles</DropdownItem>
            {roles.map((role) => (
              <DropdownItem key={role.id.toString()}>
                {capitalize(translateRole(role.role))}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
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
          Nuevo Usuario
        </Button>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <span className="text-default-400">Usuarios totales: {totalUsers}</span>
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
    roles: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
        role: PropTypes.string.isRequired,
      })
    ).isRequired,
    onRowsPerPageChange: PropTypes.func.isRequired,
    totalUsers: PropTypes.number.isRequired,
    capitalize: PropTypes.func.isRequired,
    openModalCreate: PropTypes.func.isRequired,
    onFilterByNameOrEmail: PropTypes.func.isRequired,
    onFilterByRole: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
    filterByNameOrEmail: PropTypes.string.isRequired,
    filterByRole: PropTypes.string.isRequired,
    selectedRoleKeys: PropTypes.instanceOf(Set).isRequired,
    translateRole: PropTypes.func.isRequired,
  }).isRequired,
};

export default TopContent;
