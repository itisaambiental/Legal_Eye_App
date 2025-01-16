import { useCallback } from "react";
import PropTypes from "prop-types";
import {
  Dropdown,
  DropdownItem,
  Button,
  DropdownTrigger,
  DropdownMenu,
  Tooltip,
} from "@nextui-org/react";
import menu_icon from "../../assets/aplicaciones.png";
import update_icon from "../../assets/actualizar.png";
import delete_icon from "../../assets/eliminar.png";
import watch_icon from "../../assets/ver.png";

/**
 * ArticleCell component
 * 
 * Functional component used for rendering table cells for the "article" data type.
 * It supports rendering based on specific column keys such as "article_order", "article_name", 
 * "article_description", and "actions".
 * 
 * @component
 * 
 * @param {Object} props - The component's props.
 * @param {Object} props.article - The article data object containing all relevant details for a row.
 * @param {string} props.columnKey - The column key that determines which data should be rendered in the cell.
 * @param {Function} props.openEditModal - Function to open the edit modal for the article.
 * @param {Function} props.handleDelete - Function to handle deletion of the article.
 * @param {Function} props.openModalDescription - Function to open the modal for viewing the article description.
 * 
 * @returns {JSX.Element|null} - Returns the JSX element for the cell content based on the column key, or null if no match is found.
 */
const ArticleCell = ({
  article,
  columnKey,
  openEditModal,
  handleDelete,
  openModalDescription,
}) => {
  const renderCell = useCallback(() => {
    switch (columnKey) {
      case "article_order":
        return <p className="text-sm font-normal">{article.article_order || "N/A"}</p>;
      case "article_name":
        return <p className="text-sm font-normal">{article.article_name || "N/A"}</p>;
      case "article_description":
        return (
          <Tooltip content="Ver Descripción">
            <Button
              isIconOnly
              aria-label="Ver Descripción"
              color="primary"
              variant="light"
              onPress={() => openModalDescription(article)}
            >
              <img src={watch_icon} alt="Ver" className="w-5 h-5" />
            </Button>
          </Tooltip>
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
              <DropdownMenu aria-label="Opciones de artículo" variant="light">
                <DropdownItem
                  aria-label="Editar Artículo"
                  startContent={<img src={update_icon} alt="Edit Icon" className="w-4 h-4 flex-shrink-0" />}
                  className="hover:bg-primary/20"
                  key="edit"
                  textValue="Editar Artículo"
                  onPress={() => openEditModal(article)}
                >
                  <p className="font-normal text-primary">Editar Artículo</p>
                </DropdownItem>
                <DropdownItem
                  aria-label="Eliminar Artículo"
                  startContent={<img src={delete_icon} alt="Delete Icon" className="w-4 h-4 flex-shrink-0" />}
                  className="hover:bg-red/20"
                  key="delete"
                  textValue="Eliminar Artículo"
                  onPress={() => handleDelete(article.id)}
                >
                  <p className="font-normal text-red">Eliminar Artículo</p>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );

      default:
        return null;
    }
  }, [article, columnKey, openEditModal, handleDelete, openModalDescription]);

  return renderCell();
};

ArticleCell.propTypes = {
  article: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    article_order: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    article_name: PropTypes.string,
    article_description: PropTypes.string,
  }).isRequired,
  columnKey: PropTypes.string.isRequired,
  openEditModal: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  openModalDescription: PropTypes.func.isRequired,
};

export default ArticleCell;
