import PropTypes from "prop-types";
import { useCallback } from "react";
import {
  Dropdown,
  DropdownItem,
  Button,
  DropdownTrigger,
  DropdownMenu,
  User,
} from "@heroui/react";
import defaultAvatar from "../../assets/usuario.png";
import menu_icon from "../../assets/aplicaciones.png";
import edit_user from "../../assets/editar_usuario.png";
import delete_user from "../../assets/borrar-usuario.png";

/**
 * UserCell component
 *
 * Functional component used for rendering table cells for the "user" data type.
 * It supports rendering based on specific column keys such as "name", "role", and "actions".
 * Actions include editing and deleting users.
 *
 * @component
 *
 * @param {Object} props - The component's props.
 * @param {Object} props.user - The user data object containing all relevant details for a row.
 * @param {string} props.columnKey - The column key that determines which data should be rendered in the cell.
 * @param {Function} props.openEditModal - Function to open the edit modal for the user.
 * @param {Function} props.handleDelete - Function to handle deletion of the user.
 *
 * @returns {JSX.Element|null} - Returns the JSX element for the cell content based on the column key, or null if no match is found.
 */
const UserCell = ({ user, columnKey, openEditModal, handleDelete }) => {
  const renderCell = useCallback(() => {
    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{
              radius: "lg",
              src: user.profile_picture || defaultAvatar,
            }}
            description={user.gmail || "N/A"}
            name={user.name || "N/A"}
          />
        );

      case "role":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">
              {user.roleId === 1
                ? "Admin"
                : user.roleId === 2
                ? "Analista"
                : "Usuario"}
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
                  aria-label="Opciones"
                >
                  <img src={menu_icon} alt="Menu" className="w-6 h-6" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Opciones de usuario" variant="light">
                <DropdownItem
                  aria-label="Editar Usuario"
                  startContent={
                    <img
                      src={edit_user}
                      alt="Edit Icon"
                      className="w-4 h-4 flex-shrink-0"
                    />
                  }
                  className="hover:bg-primary/20"
                  key="edit"
                  onPress={() => openEditModal(user)}
                  textValue="Editar Usuario"
                >
                  <p className="font-normal text-primary">Editar Usuario</p>
                </DropdownItem>
                <DropdownItem
                  aria-label="Eliminar Usuario"
                  startContent={
                    <img
                      src={delete_user}
                      alt="Delete Icon"
                      className="w-4 h-4 flex-shrink-0"
                    />
                  }
                  className="hover:bg-red/20"
                  key="delete"
                  onPress={() => handleDelete(user.id)}
                  textValue="Eliminar Usuario"
                >
                  <p className="font-normal text-red">Eliminar Usuario</p>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );

      default:
        return null;
    }
  }, [user, columnKey, openEditModal, handleDelete]);

  return renderCell();
};

UserCell.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string,
    gmail: PropTypes.string,
    roleId: PropTypes.number.isRequired,
    profile_picture: PropTypes.string,
  }).isRequired,
  columnKey: PropTypes.string.isRequired,
  openEditModal: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default UserCell;
