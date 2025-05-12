import PropTypes from "prop-types";
import { useCallback } from "react";
import {
  Dropdown,
  DropdownItem,
  Button,
  DropdownTrigger,
  DropdownMenu,
  Tooltip
} from "@heroui/react";
import menu_icon from "../../assets/aplicaciones.png";
import update_icon from "../../assets/actualizar.png";
import delete_icon from "../../assets/eliminar.png";
import watch_icon from "../../assets/ver.png";

/**
 * RequirementTypeCell component
 *
 * Handles rendering of individual cells in the requirement types table.
 *
 * @param {Object} props
 * @param {Object} props.requirement_type - The requirement type object.
 * @param {string} props.columnKey - The key of the column.
 * @param {Function} props.openEditModal - Function to open edit modal.
 * @param {Function} props.handleDelete - Function to delete a type.
 */
const RequirementTypeCell = ({
  requirement_type,
  columnKey,
  openEditModal,
  handleDelete,
  openModalDescription
}) => {
  const renderCell = useCallback(() => {
    switch (columnKey) {
      case "name":
        return (
          <div className="flex flex-col">
            <p className="text-sm font-medium capitalize">{requirement_type.name || "N/A"}</p>
          </div>
        );
      case "description":
        return (
          <div className="flex flex-col">
            <p className="text-sm text-gray-700">{requirement_type.description || "N/A"}</p>
          </div>
        );
      case "classification":
        return (
          <div className="flex items-center relative ml-4">
          <Tooltip content="Ver Clasificación">
            <Button
              isIconOnly
              aria-label="Ver Clasificación"
              color="primary"
              variant="light"
              onPress={() => openModalDescription(requirement_type, "classification", "Clasificación")}
            >
              <img src={watch_icon} alt="Ver" className="w-5 h-5" />
            </Button>
          </Tooltip>
        </div>
        );
      case "actions":
        return (
          <div className="relative flex items-center justify-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="light"
                  color="primary"
                  size="sm"
                  isIconOnly
                  aria-label="Opciones"
                >
                  <img src={menu_icon} alt="Opciones" className="w-6 h-6" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Acciones del tipo" variant="light">
                <DropdownItem
                  key="edit"
                  textValue="Editar tipo de requerimiento"
                  startContent={<img src={update_icon} alt="Edit" className="w-4 h-4" />}
                  className="hover:bg-primary/20"
                  onPress={() => openEditModal(requirement_type)}
                >
                  <span className="text-primary">Editar tipo de requerimiento</span>
                </DropdownItem>
                <DropdownItem
                  key="delete"
                  textValue="Eliminar tipo de requerimiento"
                  startContent={<img src={delete_icon} alt="Delete" className="w-4 h-4" />}
                  className="hover:bg-red/20"
                  onPress={() => handleDelete(requirement_type.id)}
                >
                  <span className="text-red">Eliminar tipo de requerimiento</span>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return null;
    }
  }, [requirement_type, columnKey, openEditModal, handleDelete, openModalDescription]);

  return renderCell();
};

RequirementTypeCell.propTypes = {
  requirement_type: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string,
    description: PropTypes.string,
    classification: PropTypes.string,
  }).isRequired,
  columnKey: PropTypes.string.isRequired,
  openEditModal: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default RequirementTypeCell;
