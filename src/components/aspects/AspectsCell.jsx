import PropTypes from "prop-types";
import { useCallback } from "react";
import {
  Dropdown,
  DropdownItem,
  Button,
  DropdownTrigger,
  DropdownMenu,
} from "@nextui-org/react";
import menu_icon from "../../assets/aplicaciones.png";
import update_icon from "../../assets/actualizar.png";
import delete_icon from "../../assets/eliminar.png";

/**
 * AspectCell component
 *
 * Functional component used for rendering table cells for the "aspect" data type.
 * It supports rendering based on specific column keys such as "aspect_name" and "actions".
 * Actions include editing and deleting aspects.
 *
 * @component
 *
 * @param {Object} props - The component's props.
 * @param {Object} props.aspect - The aspect data object containing all relevant details for a row.
 * @param {string} props.columnKey - The column key that determines which data should be rendered in the cell.
 * @param {Function} props.openEditModal - Function to open the edit modal for the aspect.
 * @param {Function} props.handleDelete - Function to handle deletion of the aspect.
 *
 * @returns {JSX.Element|null} - Returns the JSX element for the cell content based on the column key, or null if no match is found.
 */
const AspectCell = ({ aspect, columnKey, openEditModal, handleDelete }) => {
  const renderCell = useCallback(() => {
    switch (columnKey) {
      case "aspect_name":
        return (
          <p className="text-sm font-normal">{aspect.aspect_name || "N/A"}</p>
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
                  <img src={menu_icon} alt="Menu" className="w-6 h-6" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Opciones de aspecto" variant="light">
                <DropdownItem
                  aria-label="Editar Aspecto"
                  startContent={
                    <img
                      src={update_icon}
                      alt="Edit Icon"
                      className="w-4 h-4 flex-shrink-0"
                    />
                  }
                  className="hover:bg-primary/20"
                  key="edit"
                  onPress={() => openEditModal(aspect)}
                  textValue="Editar Aspecto"
                >
                  <p className="font-normal text-primary">Editar Aspecto</p>
                </DropdownItem>
                <DropdownItem
                  aria-label="Eliminar Aspecto"
                  startContent={
                    <img
                      src={delete_icon}
                      alt="Delete Icon"
                      className="w-4 h-4 flex-shrink-0"
                    />
                  }
                  className="hover:bg-red/20"
                  key="delete"
                  onPress={() => handleDelete(aspect.id)}
                  textValue="Eliminar Aspecto"
                >
                  <p className="font-normal text-red">Eliminar Aspecto</p>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );

      default:
        return null;
    }
  }, [aspect, columnKey, openEditModal, handleDelete]);

  return renderCell();
};

AspectCell.propTypes = {
  aspect: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    aspect_name: PropTypes.string,
  }).isRequired,
  columnKey: PropTypes.string.isRequired,
  openEditModal: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default AspectCell;
