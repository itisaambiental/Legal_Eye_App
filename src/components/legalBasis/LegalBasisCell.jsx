import { useCallback } from "react";
import {
  Dropdown,
  DropdownItem,
  Button,
  DropdownTrigger,
  DropdownMenu,
} from "@nextui-org/react";
import download_icon from "../../assets/descargar.png";
import menu_icon from "../../assets/aplicaciones.png";
import watch_icon from "../../assets/ver.png";
import update_icon from "../../assets/actualizar.png";
import delete_icon from "../../assets/eliminar.png";
import send_icon from "../../assets/enviar_blue.png";
/**
 * LegalBasisCell component
 *
 * Functional component used for rendering table cells based on column keys.
 * It handles various types of data in the table, including legal name, abbreviation, classification, jurisdiction,
 * state, municipality, last reform, subject, aspects, and actions.
 * Each case checks for the corresponding column key and returns the appropriate JSX to display the cell's content.
 *
 * @component
 *
 * @param {Object} props - The component's props.
 * @param {Object} props.legalBase - The legal basis data object containing all relevant details for a row.
 * @param {string} props.columnKey - The column key that determines which data should be rendered in the cell.
 *  * @param {Function} props.openEditModal - Function to open the edit modal for the legal Base.
 * @param {Function} props.handleDelete - Function to handle deletion of the legal basis.
 * @param {Function} props.handleDownloadDocument - Function to handle the download of the legal base document.
 * 
 * @returns {JSX.Element|null} - Returns the JSX element for the cell content based on the column key, or null if no match is found.
 */

const LegalBasisCell = ({ legalBase, columnKey, openEditModal, handleDelete, handleDownloadDocument }) => {
  const renderCell = useCallback(() => {
    switch (columnKey) {
      case "legal_name":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">
              {legalBase.legal_name || "N/A"}
            </p>
          </div>
        );

      case "abbreviation":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">
              {legalBase.abbreviation || "N/A"}
            </p>
          </div>
        );

      case "classification":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">
              {legalBase.classification || "N/A"}
            </p>
          </div>
        );

      case "jurisdiction":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">
              {legalBase.jurisdiction || "N/A"}
            </p>
          </div>
        );

      case "state":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">
              {legalBase.state || "N/A"}
            </p>
          </div>
        );

      case "municipality":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">
              {legalBase.municipality || "N/A"}
            </p>
          </div>
        );

      case "lastReform":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">
              {legalBase.last_reform || "N/A"}
            </p>
          </div>
        );

      case "subject":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">
              {legalBase.subject?.subject_name || "N/A"}
            </p>
          </div>
        );

      case "aspects":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">
              {legalBase.aspects?.map((aspect, index) => (
                <span key={aspect.aspect_id}>
                  {aspect.aspect_name}
                  {index < legalBase.aspects.length - 1 ? ", " : ""}
                </span>
              )) || "N/A"}
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
                aria-label="Opciones de fundamento legal"
                variant="light"
              >
                <DropdownItem
                  aria-label="Ver Articulos"
                  startContent={
                    <img
                      src={watch_icon}
                      alt="Watch Icon"
                      className="w-4 h-4 flex-shrink-0"
                    />
                  }
                  className="hover:bg-primary/20"
                  key="watch"
                  textValue="Ver Articulos"
                >
                  <p className="font-normal text-primary">Ver Articulos</p>
                </DropdownItem>
                <DropdownItem
                  aria-label="Descargar Documento"
                  startContent={
                    <img
                      src={download_icon}
                      alt="Download Icon"
                      className="w-4 h-4 flex-shrink-0"
                    />
                  }
                  className="hover:bg-primary/20"
                  key="download"
                  textValue="Descargar Documento"
                  onPress={() => handleDownloadDocument(legalBase.url, legalBase.legal_name)}
                >
                  <p className="font-normal text-primary">
                    Descargar Documento
                  </p>
                </DropdownItem>
                <DropdownItem
                  aria-label="Enviar Fundamento"
                  startContent={
                    <img
                      src={send_icon}
                      alt="Send Icon"
                      className="w-4 h-4 flex-shrink-0"
                    />
                  }
                  className="hover:bg-primary/20"
                  key="send"
                  textValue="Enviar Fundamento"
                >
                  <p className="font-normal text-primary">Enviar Fundamento</p>
                </DropdownItem>
                <DropdownItem
                  aria-label="Editar Fundamento"
                  startContent={
                    <img
                      src={update_icon}
                      alt="Edit Icon"
                      className="w-4 h-4 flex-shrink-0"
                    />
                  }
                  className="hover:bg-primary/20"
                  key="update"
                  textValue="Editar Fundamento"
                  onPress={() => openEditModal(legalBase)}
                >
                  <p className="font-normal text-primary">
                    Editar Fundamento
                  </p>
                </DropdownItem>
                <DropdownItem
                  aria-label="Eliminar Fundamento"
                  startContent={
                    <img
                      src={delete_icon}
                      alt="Delete Icon"
                      className="w-4 h-4 flex-shrink-0"
                    />
                  }
                  className="hover:bg-red/20"
                  key="delete"
                  textValue="Eliminar Fundamento"
                  onPress={() => handleDelete(legalBase.id)}
                >
                  <p className="font-normal text-red">Eliminar Fundamento</p>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );

      default:
        return null;
    }
  }, [legalBase, columnKey, openEditModal, handleDelete, handleDownloadDocument]);

  return renderCell();
};

export default LegalBasisCell;
