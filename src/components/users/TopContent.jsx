import { useState, useCallback } from "react";
import { Input, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import search_icon from "../../assets/busqueda_blue.png";
import angulo_abajo_icon from "../../assets/angulo_abajo.png";
import mas_icon from "../../assets/mas.png";


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
