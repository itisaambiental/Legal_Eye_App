import PropTypes from "prop-types";
import { useCallback } from "react";
import {
  Dropdown,
  DropdownItem,
  Button,
  DropdownTrigger,
  DropdownMenu,
} from "@heroui/react";
import menu_icon from "../../assets/aplicaciones.png";
import watch_icon from "../../assets/ver.png";
import update_icon from "../../assets/actualizar.png";
import delete_icon from "../../assets/eliminar.png";

/**
 * SubjectCell component
 *
 * Functional component used for rendering table cells for the "subject" data type.
 * It supports rendering based on specific column keys such as "subject_order", "subject_name", "subject_abbreviation" and "actions".
 * Actions include navigating to aspects, editing, and deleting subjects.
 *
 * @component
 *
 * @param {Object} props - The component's props.
 * @param {Object} props.subject - The subject data object containing all relevant details for a row.
 * @param {string} props.columnKey - The column key that determines which data should be rendered in the cell.
 * @param {Function} props.goToAspects - Function to navigate to aspects of the subject.
 * @param {Function} props.openEditModal - Function to open the edit modal for the subject.
 * @param {Function} props.handleDelete - Function to handle deletion of the subject.
 *
 * @returns {JSX.Element|null} - Returns the JSX element for the cell content based on the column key, or null if no match is found.
 */
const SubjectCell = ({
  subject,
  columnKey,
  goToAspects,
  openEditModal,
  handleDelete,
}) => {
  const renderCell = useCallback(() => {
    switch (columnKey) {
      case "subject_order":
        return (
          <p className="text-sm font-normal">{subject.order_index || 0}</p>
        );
      case "subject_name":
        return (
          <p className="text-sm font-normal">{subject.subject_name || "N/A"}</p>
        );

      case "subject_abbreviation":
        return (
          <p className="text-sm font-normal">{subject.abbreviation || "N/A"}</p>
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
              <DropdownMenu aria-label="Opciones de materia" variant="light">
                <DropdownItem
                  aria-label="Ver Aspectos"
                  startContent={
                    <img
                      src={watch_icon}
                      alt="Watch Icon"
                      className="w-4 h-4 flex-shrink-0"
                    />
                  }
                  className="hover:bg-primary/20"
                  key="watch"
                  onPress={() => goToAspects(subject.id)}
                  textValue="Ver Aspectos"
                >
                  <p className="font-normal text-primary">Ver Aspectos</p>
                </DropdownItem>
                <DropdownItem
                  aria-label="Editar Materia"
                  startContent={
                    <img
                      src={update_icon}
                      alt="Edit Icon"
                      className="w-4 h-4 flex-shrink-0"
                    />
                  }
                  className="hover:bg-primary/20"
                  key="edit"
                  onPress={() => openEditModal(subject)}
                  textValue="Editar Materia"
                >
                  <p className="font-normal text-primary">Editar Materia</p>
                </DropdownItem>
                <DropdownItem
                  aria-label="Eliminar Materia"
                  startContent={
                    <img
                      src={delete_icon}
                      alt="Delete Icon"
                      className="w-4 h-4 flex-shrink-0"
                    />
                  }
                  className="hover:bg-red/20"
                  key="delete"
                  onPress={() => handleDelete(subject.id)}
                  textValue="Eliminar Materia"
                >
                  <p className="font-normal text-red">Eliminar Materia</p>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );

      default:
        return null;
    }
  }, [subject, columnKey, goToAspects, openEditModal, handleDelete]);

  return renderCell();
};

SubjectCell.propTypes = {
  subject: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    subject_name: PropTypes.string,
    order_index: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    abbreviation: PropTypes.string,
  }).isRequired,
  columnKey: PropTypes.string.isRequired,
  goToAspects: PropTypes.func.isRequired,
  openEditModal: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default SubjectCell;
