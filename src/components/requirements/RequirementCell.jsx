import PropTypes from "prop-types";
import { useCallback } from "react";
import {
  Dropdown,
  DropdownItem,
  Button,
  DropdownTrigger,
  DropdownMenu,
  Tooltip,
} from "@heroui/react";
import menu_icon from "../../assets/aplicaciones.png";
import update_icon from "../../assets/actualizar.png";
import delete_icon from "../../assets/eliminar.png";
import watch_icon from "../../assets/ver.png";

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
  handleDelete,
  openModalDescription
}) => {
  const renderCell = useCallback(() => {
    switch (columnKey) {
      case "requirement_number":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">
              {requirement.requirement_number || "N/A"}
            </p>
          </div>
        );

      case "requirement_name":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">
              {requirement.requirement_name || "N/A"}
            </p>
          </div>
        );

      case "requirement_condition":
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
              {requirement.formatted_evidence || requirement.evidence || "N/A"}
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
      case "subject":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">
              {requirement.subject?.subject_name || "N/A"}
            </p>
          </div>
        );
      case "aspects":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">
              {requirement.aspects?.map((aspect, index) => (
                <span key={aspect.aspect_id}>
                  {aspect.aspect_name}
                  {index < requirement.aspects.length - 1 ? ", " : ""}
                </span>
              )) || "N/A"}
            </p>
          </div>
        );
        case "acceptance_criteria":
        return (
          <div className="flex items-center justify-center">
            <Tooltip content="Ver Criterio de Aceptación">
              <Button
                isIconOnly
                aria-label="Ver Criterio de Aceptación"
                color="primary"
                variant="light"
                onPress={() => openModalDescription(requirement, "acceptance_criteria", "Criterio de Aceptación")}
              >
                <img src={watch_icon} alt="Ver" className="w-5 h-5" />
              </Button>
            </Tooltip>
          </div>
        );

      case "mandatory_description":
        return (
          <div className="flex items-center justify-center">
            <Tooltip content="Ver Descripción Obligatoria">
              <Button
                isIconOnly
                aria-label="Ver Descripción Obligatoria"
                color="primary"
                variant="light"
                onPress={() => openModalDescription(requirement, "mandatory_description", "Descripción Obligatoria")}
              >
                <img src={watch_icon} alt="Ver" className="w-5 h-5" />
              </Button>
            </Tooltip>
          </div>
        );

      case "complementary_description":
        return (
          <div className="flex items-center justify-center">
            <Tooltip content="Ver Descripción Complementaria">
              <Button
                isIconOnly
                aria-label="Ver Descripción Complementaria"
                color="primary"
                variant="light"
                onPress={() => openModalDescription(requirement, "complementary_description", "Descripción Complementaria")}
              >
                <img src={watch_icon} alt="Ver" className="flex items-center w-5 h-5" />
              </Button>
            </Tooltip>
          </div>
        );

      case "mandatory_sentences":
        return (
          <div className="flex items-center justify-center">
            <Tooltip content="Ver Frases Obligatorias">
              <Button
                isIconOnly
                aria-label="Ver Frases Obligatorias"
                color="primary"
                variant="light"
                onPress={() => openModalDescription(requirement, "mandatory_sentences", "Frases Obligatorias")}
              >
                <img src={watch_icon} alt="Ver" className="flex items-center w-5 h-5" />
              </Button>
            </Tooltip>
          </div>
        );

      case "complementary_sentences":
        return (
          <div className="flex items-center justify-center">
            <Tooltip content="Ver Frases Complementarias">
              <Button
                isIconOnly
                aria-label="Ver Frases Complementarias"
                color="primary"
                variant="light"
                onPress={() => openModalDescription(requirement, "complementary_sentences", "Frases Complementarias")}
              >
                <img src={watch_icon} alt="Ver" className="flex items-center w-5 h-5" />
              </Button>
            </Tooltip>
          </div>
        );

      case "mandatory_keywords":
        return (
          <div className="flex items-center justify-center">
            <Tooltip content="Ver Palabras Clave Obligatorias">
              <Button
                isIconOnly
                aria-label="Ver Palabras Clave Obligatorias"
                color="primary"
                variant="light"
                onPress={() => openModalDescription(requirement, "mandatory_keywords", "Palabras Clave Obligatorias")}
              >
                <img src={watch_icon} alt="Ver" className="flex items-center w-5 h-5" />
              </Button>
            </Tooltip>
          </div>
        );

      case "complementary_keywords":
        return (
          <div className="flex items-center justify-center">
            <Tooltip content="Ver Palabras Clave Complementarias">
              <Button
                isIconOnly
                aria-label="Ver Palabras Clave Complementarias"
                color="primary"
                variant="light"
                onPress={() => openModalDescription(requirement, "complementary_keywords", "Palabras Clave Complementarias")}
              >
                <img src={watch_icon} alt="Ver" className="flex items-center w-5 h-5" />
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
  }, [requirement, columnKey, openEditModal, handleDelete, openModalDescription]);

  return renderCell();
};

RequirementCell.propTypes = {
  requirement: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    requirement_number: PropTypes.string,
    requirement_name: PropTypes.string,
    requirement_condition: PropTypes.string,
    evidence: PropTypes.string,
    periodicity: PropTypes.string,
    subject: PropTypes.shape({
      subject_name: PropTypes.string,
    }),
    aspects: PropTypes.arrayOf(
      PropTypes.shape({
        aspect_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
        aspect_name: PropTypes.string.isRequired,
      })
    ),
    acceptance_criteria: PropTypes.string,
    mandatory_description: PropTypes.string,
    complementary_description: PropTypes.string,
    mandatory_sentences: PropTypes.string,
    complementary_sentences: PropTypes.string,
    mandatory_keywords: PropTypes.string,
    complementary_keywords: PropTypes.string,
  }).isRequired,
  columnKey: PropTypes.string.isRequired,
  openEditModal: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default RequirementCell;
