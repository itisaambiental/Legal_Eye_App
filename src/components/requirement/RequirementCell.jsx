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
 * RequirementCell component
 *
 * Functional component used for rendering table cells based on column keys.
 * It handles various types of data in the table, including requirement details and actions.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Object} props.requirement - The requirement data object containing all relevant details for a row.
 * @param {string} props.columnKey - The column key that determines which data should be rendered in the cell.
 * @param {Function} props.openEditModal - Function to open the edit modal for the requirement.
 * @param {Function} props.viewRequirementDetails - Function to navigate to requirement details.
 * @param {Function} props.handleDelete - Function to handle deletion of the requirement.
 * @returns {JSX.Element|null} Rendered cell content based on the column key.
 */
const RequirementCell = ({
  requirement,
  columnKey,
  openEditModal,
  viewRequirementDetails,
  handleDelete,
}) => {
  const renderCell = useCallback(() => {
    switch (columnKey) {
      case "requirementNumber":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">
              {requirement.requirementNumber || "N/A"}
            </p>
          </div>
        );

      case "requirementName":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">
              {requirement.requirementName || "N/A"}
            </p>
          </div>
        );

      case "mandatoryDescription":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">
              {requirement.mandatoryDescription || "N/A"}
            </p>
          </div>
        );

      case "condition":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">
              {requirement.condition || "N/A"}
            </p>
          </div>
        );

      case "evidence":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">
              {requirement.evidence || "N/A"}
            </p>
          </div>
        );

      case "periodicity":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">
              {requirement.periodicity || "N/A"}
            </p>
          </div>
        );

      case "jurisdiction":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">
              {requirement.jurisdiction || "N/A"}
            </p>
          </div>
        );

      case "state":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">
              {requirement.state || "N/A"}
            </p>
          </div>
        );

      case "municipality":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">
              {requirement.municipality || "N/A"}
            </p>
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
                  key="options"
                  aria-label="Opciones"
                >
                  <img src={menu_icon} alt="Menu" className="w-6 h-6" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Opciones de requerimiento"
                variant="light"
              >
                <DropdownItem
                  aria-label="Ver Detalles"
                  startContent={
                    <img
                      src={watch_icon}
                      alt="Watch Icon"
                      className="w-4 h-4 flex-shrink-0"
                    />
                  }
                  className="hover:bg-primary/20"
                  key="watch"
                  textValue="Ver Detalles"
                  onPress={() => viewRequirementDetails(requirement.id)}
                >
                  <p className="font-normal text-primary">Ver Detalles</p>
                </DropdownItem>
                <DropdownItem
                  aria-label="Editar Requerimiento"
                  startContent={
                    <img
                      src={update_icon}
                      alt="Edit Icon"
                      className="w-4 h-4 flex-shrink-0"
                    />
                  }
                  className="hover:bg-primary/20"
                  key="update"
                  textValue="Editar Requerimiento"
                  onPress={() => openEditModal(requirement)}
                >
                  <p className="font-normal text-primary">Editar Requerimiento</p>
                </DropdownItem>
                <DropdownItem
                  aria-label="Eliminar Requerimiento"
                  startContent={
                    <img
                      src={delete_icon}
                      alt="Delete Icon"
                      className="w-4 h-4 flex-shrink-0"
                    />
                  }
                  className="hover:bg-red/20"
                  key="delete"
                  textValue="Eliminar Requerimiento"
                  onPress={() => handleDelete(requirement.id)}
                >
                  <p className="font-normal text-red">Eliminar Requerimiento</p>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );

      default:
        return null;
    }
  }, [requirement, columnKey, openEditModal, viewRequirementDetails, handleDelete]);

  return renderCell();
};

RequirementCell.propTypes = {
  requirement: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    requirementNumber: PropTypes.string,
    requirementName: PropTypes.string,
    mandatoryDescription: PropTypes.string,
    condition: PropTypes.string,
    evidence: PropTypes.string,
    periodicity: PropTypes.string,
    requirementType: PropTypes.string,
    jurisdiction: PropTypes.string,
    state: PropTypes.string,
    municipality: PropTypes.string,
  }).isRequired,
  columnKey: PropTypes.string.isRequired,
  openEditModal: PropTypes.func.isRequired,
  viewRequirementDetails: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default RequirementCell;
