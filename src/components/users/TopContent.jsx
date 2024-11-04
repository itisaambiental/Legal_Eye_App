/* eslint-disable react/prop-types */
import { Input, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import search_icon from "../../assets/busqueda_blue.png";
import angulo_abajo_icon from "../../assets/angulo_abajo.png";
import mas_icon from "../../assets/mas.png";

/**
 * TopContent component
 * 
 * This component renders the top section of a user management interface, providing search, filter, 
 * and pagination controls, as well as a button to create a new user.
 * 
 * @component
 * @param {Object} props - Component properties.
 * @param {Array} props.roles - List of roles available for filtering users.
 * @param {Function} props.onRowsPerPageChange - Callback function for changing rows per page.
 * @param {number} props.totalUsers - The total number of users.
 * @param {Function} props.capitalize - Function to capitalize role names.
 * @param {Function} props.openModalCreate - Function to open the modal for creating a new user.
 * @param {Function} props.onFilterChange - Callback function for handling search input changes.
 * @param {Function} props.onClear - Callback function to clear the search input.
 * @param {string} props.selectedValue - Currently selected value for role filtering display.
 * @param {Set} props.selectedRoleKeys - Set of selected role keys for filtering.
 * @param {Function} props.onRoleChange - Callback function for handling role selection changes.
 * @param {Function} props.translateRole - Function to translate role names.
 * 
 * @returns {JSX.Element} Rendered TopContent component for managing users.
 */

function TopContent({ roles, onRowsPerPageChange, totalUsers, capitalize, openModalCreate, onFilterChange, onClear, selectedValue, selectedRoleKeys, onRoleChange, translateRole }) {

  return (
    <div className="flex flex-col gap-4 mb-4">
      <div className="flex justify-between gap-16 items-end">
        <Input
          color="primary"
          variant="faded"
          isClearable
          className="w-full sm:max-w-[44%] flex-grow"
          placeholder="Buscar por nombre o email..."
          startContent={<img src={search_icon} alt="Search Icon" className="w-4 h-4 flex-shrink-0" />}
          onClear={onClear}
          onValueChange={onFilterChange}
        />

        <div className="flex gap-3 ml-auto">
          <Dropdown>
            <DropdownTrigger>
              <Button endContent={<img src={angulo_abajo_icon} alt="Search Icon" className="w-4 h-4 flex-shrink-0 text-small" />} variant="faded" color="primary">
                {selectedValue}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              color="primary"
              variant="flat"
              disallowEmptySelection
              aria-label="Seleccionar Rol"
              selectionMode="single"
              selectedKeys={selectedRoleKeys}
              onSelectionChange={onRoleChange}
            >
              <DropdownItem key="0">Todos los Roles</DropdownItem>
              {roles.map((role) => (
                <DropdownItem key={role.id.toString()}>{capitalize(translateRole(role.role))}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          <Button color="primary" onClick={openModalCreate} endContent={<img src={mas_icon} alt="Add Icon" className="w-4 h-4 flex-shrink-0" />}>
            Nuevo Usuario
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-default-400">Usuarios totales: {totalUsers}</span>
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
