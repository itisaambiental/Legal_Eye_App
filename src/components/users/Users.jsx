import { useCallback, useState, useMemo, useEffect, useRef } from "react";
import {
  Tooltip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Button,
} from "@nextui-org/react";
import useUsers from "../../hooks/user/useUsers.jsx";
import TopContent from "./TopContent";
import DeleteModal from "./deleteModal.jsx";
import BottomContent from "../utils/BottomContent.jsx";
import UserCell from "./UsersCell.jsx";
import Error from "../utils/Error.jsx";
import useRoles from "../../hooks/user/useRoles.jsx";
import trash_icon from "../../assets/papelera-mas.png";
import CreateModal from "./CreateModal.jsx";
import check from "../../assets/check.png";
import { toast } from "react-toastify";
import EditModal from "./EditModal.jsx";

const columns = [
  { name: "Nombre", uid: "name", align: "start" },
  { name: "Rol", uid: "role", align: "start" },
  { name: "Acciones", uid: "actions", align: "center" },
];

function translateRole(role) {
  const roleTranslations = {
    Admin: "Admin",
    Analyst: "Analista",
  };
  return roleTranslations[role] || role;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Users component
 *
 * This component provides a user management interface, including features for listing, filtering,
 * pagination, role-based filtering, and CRUD operations. Users can be added, edited, or deleted,
 * with appropriate feedback displayed for each action.
 *
 * @returns {JSX.Element} Rendered Users component, displaying the user management interface with
 * filters, pagination, and modals for adding, editing, and deleting users.
 *
 */
export default function Users() {
  const {
    users,
    loading,
    error,
    addUser,
    updateUserDetails,
    deleteUser,
    deleteUsersBatch,
    fetchUsersByRole,
    fetchUsersByNameOrGmail,
    fetchUsers,
  } = useUsers();
  const { roles, roles_error } = useRoles();
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [filterByNameOrGmail, setFilterByNameOrGmail] = useState("");
  const [selectedRoleKeys, setSelectedRoleKeys] = useState(new Set(["0"]));
  const [selectedRole, setSelectedRole] = useState("Todos los Roles");
  const [isSearching, setIsSearching] = useState(false);
  const debounceTimeout = useRef(null);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [usertypeError, setusertypeError] = useState(null);
  const [nameError, setNameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeletingBatch, setIsDeletingBatch] = useState(false);
  const [fileError, setFileError] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    user_type: "",
    name: "",
    email: "",
    profile_picture: null,
  });

  useEffect(() => {
    if (!loading && isFirstRender) {
      setIsFirstRender(false);
    }
  }, [loading, isFirstRender]);

  const handleNameChange = (e) => {
    const { value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      name: value,
    }));
    if (nameError && value.trim() !== "") {
      setNameError(null);
    }
  };

  const handleEmailChange = (e) => {
    const { value, name } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    if (emailError && value.trim() !== "") {
      setEmailError(null);
    }
  };

  const handleTypeChange = (value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      user_type: value,
    }));
    if (usertypeError && value !== "") {
      setusertypeError(null);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const validTypes = ["image/png", "image/jpeg"];

    if (file && validTypes.includes(file.type)) {
      setFileError(null);
      const imageUrl = URL.createObjectURL(file);

      setFormData((prevFormData) => ({
        ...prevFormData,
        profile_picture: {
          file: file,
          previewUrl: imageUrl,
        },
      }));
    } else {
      setFileError("Solo se permiten archivos PNG y JPEG.");
      setFormData((prevFormData) => ({
        ...prevFormData,
        profile_picture: null,
      }));
    }
  };

  const handleRemoveImage = () => {
    setFormData({
      ...formData,
      profile_picture: null,
    });
    setFileError(null);
  };

  const handleClear = useCallback(() => {
    setFilterByNameOrGmail("");
    setSelectedRole("Todos los Roles");
    setSelectedRoleKeys(new Set(["0"]));
    fetchUsers();
  }, [fetchUsers]);

  const handleFilter = useCallback(
    (field, value) => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
      debounceTimeout.current = setTimeout(async () => {
        setPage(1);
        setIsSearching(true);
        if (field === "nameOrGmail") {
          await fetchUsersByNameOrGmail(value);
        } else if (field === "role") {
          await fetchUsersByRole(value);
        }
        setIsSearching(false);
      }, 500);
    },
    [fetchUsersByNameOrGmail, fetchUsersByRole]
  );

  const handleFilterByNameOrGmail = useCallback(
    (value) => {
      if (value.trim() === "") {
        handleClear();
        return;
      }
      setFilterByNameOrGmail(value);
      setSelectedRole("Todos los Roles");
      setSelectedRoleKeys(new Set(["0"]));
      handleFilter("nameOrGmail", value);
    },
    [handleClear, handleFilter]
  );

  const handleFilterByRole = useCallback(
    (selectedRole) => {
      if (selectedRole === "0" || !selectedRole) {
        handleClear();
      } else {
        setFilterByNameOrGmail("");
        handleFilter("role", selectedRole);
        const roleName =
          roles.find((role) => role.id.toString() === selectedRole)?.role ||
          "Todos los Roles";
        setSelectedRole(capitalize(translateRole(roleName)));
      }
    },
    [roles, handleClear, handleFilter]
  );

  const onRoleChange = (keys) => {
    const selectedArray = Array.from(keys);
    const selectedRole = selectedArray[0];
    setSelectedRoleKeys(keys);
    handleFilterByRole(selectedRole);
  };

  const openModalCreate = () => {
    setFormData({
      id: "",
      user_type: "",
      name: "",
      email: "",
      profile_picture: null,
    });
    setIsCreateModalOpen(true);
  };

  const closeModalCreate = () => {
    setIsCreateModalOpen(false);
    setFileError(null);
    setNameError(null);
    setEmailError(null);
    setusertypeError(null);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
    setFileError(null);
    setNameError(null);
    setEmailError(null);
    setusertypeError(null);
  };

  const totalPages = useMemo(
    () => Math.ceil(users.length / rowsPerPage),
    [users, rowsPerPage]
  );

  const onRowsPerPageChange = useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const openDeleteModal = () => setShowDeleteModal(true);
  const closeDeleteModal = () => setShowDeleteModal(false);
  const onPageChange = (newPage) => setPage(newPage);
  const onPreviousPage = () => setPage((prev) => Math.max(prev - 1, 1));
  const onNextPage = () => setPage((prev) => Math.min(prev + 1, totalPages));

  const handleDelete = useCallback(
    async (userId) => {
      const toastId = toast.loading("Eliminando usuario...", {
        icon: <Spinner size="sm" />,
        progressStyle: {
          background: "#113c53",
        },
      });
      try {
        const { success, error } = await deleteUser(userId);
        if (success) {
          toast.update(toastId, {
            render: "Usuario eliminado con éxito",
            type: "info",
            icon: <img src={check} alt="Success Icon" />,
            progressStyle: {
              background: "#113c53",
            },
            isLoading: false,
            autoClose: 3000,
          });
        } else {
          toast.update(toastId, {
            render: error,
            type: "error",
            icon: null,
            progressStyle: {},
            isLoading: false,
            autoClose: 5000,
          });
        }
      } catch (error) {
        console.error(error);
        toast.update(toastId, {
          render: "Algo mal sucedió al eliminar el usuario. Intente de nuevo.",
          type: "error",
          icon: null,
          progressStyle: {},
          isLoading: false,
          autoClose: 5000,
        });
      }
    },
    [deleteUser]
  );

  if (loading && isFirstRender) {
    return (
      <div
        role="status"
        className="fixed inset-0 flex items-center justify-center"
      >
        <Spinner
          className="h-10 w-10 transform translate-x-0 lg:translate-x-28 xl:translate-x-32"
          color="secondary"
        />
      </div>
    );
  }

  if (error) return <Error title={error.title} message={error.message} />;
  if (roles_error)
    return <Error title={roles_error.title} message={roles_error.message} />;

  return (
    <div className="mt-24 mb-4 -ml-60 mr-4 lg:-ml-0 lg:mr-0 xl:-ml-0 xl:mr-0 flex justify-center items-center flex-wrap">
      <TopContent
        config={{
          roles: roles,
          onRowsPerPageChange: onRowsPerPageChange,
          totalUsers: users.length,
          capitalize: capitalize,
          openModalCreate: openModalCreate,
          onFilterByNameOrEmail: handleFilterByNameOrGmail,
          onFilterByRole: onRoleChange,
          onClear: handleClear,
          filterByNameOrEmail: filterByNameOrGmail,
          filterByRole: selectedRole,
          selectedRoleKeys: selectedRoleKeys,
          translateRole: translateRole,
        }}
      />

      <>
        {isSearching || loading ? (
          <div
            role="status"
            className="flex justify-center items-center w-full h-40"
          >
            <Spinner className="h-10 w-10" color="secondary" />
          </div>
        ) : (
          <Table
            aria-label="Tabla de usuarios"
            selectionMode="multiple"
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
            color="primary"
          >
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn key={column.uid} align={column.align}>
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody
              items={users.slice((page - 1) * rowsPerPage, page * rowsPerPage)}
              emptyContent="No hay usuarios para mostrar"
            >
              {(user) => (
                <TableRow key={user.id}>
                  {(columnKey) => (
                    <TableCell>
                      <UserCell
                        user={user}
                        columnKey={columnKey}
                        openEditModal={openEditModal}
                        handleDelete={handleDelete}
                      />
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </>
      <div className="relative w-full">
        {(selectedKeys.size > 0 || selectedKeys === "all") && (
          <Tooltip content="Eliminar" size="sm">
            <Button
              isIconOnly
              size="sm"
              className="absolute left-0 bottom-0 ml-5 bg-primary transform translate-y-32 sm:translate-y-24 md:translate-y-10 lg:translate-y-10 xl:translate-y-10"
              aria-label="Eliminar seleccionados"
              onPress={openDeleteModal}
            >
              <img src={trash_icon} alt="delete" className="w-5 h-5" />
            </Button>
          </Tooltip>
        )}
      </div>
      <BottomContent
        config={{
          page: page,
          totalPages: totalPages,
          onPageChange: onPageChange,
          onPreviousPage: onPreviousPage,
          onNextPage: onNextPage,
          selectedKeys: selectedKeys,
          filteredItems: users,
        }}
      />
      {isCreateModalOpen && (
        <CreateModal
          config={{
            isOpen: isCreateModalOpen,
            closeModalCreate: closeModalCreate,
            addUser: addUser,
            handleEmailChange: handleEmailChange,
            formData: formData,
            usertypeError: usertypeError,
            setusertypeError: setusertypeError,
            handleTypeChange: handleTypeChange,
            nameError: nameError,
            setNameError: setNameError,
            handleNameChange: handleNameChange,
            handleFileChange: handleFileChange,
            fileError: fileError,
            handleRemoveImage: handleRemoveImage,
            setEmailError: setEmailError,
            emailError: emailError,
            roles: roles,
            translateRole: translateRole,
          }}
        />
      )}
      {isEditModalOpen && (
        <EditModal
          config={{
            formData: formData,
            setFormData: setFormData,
            selectedUser: selectedUser,
            closeModalEdit: closeEditModal,
            isOpen: isEditModalOpen,
            updateUserDetails: updateUserDetails,
            usertypeError: usertypeError,
            setusertypeError: setusertypeError,
            handleTypeChange: handleTypeChange,
            nameError: nameError,
            setNameError: setNameError,
            handleNameChange: handleNameChange,
            handleFileChange: handleFileChange,
            fileError: fileError,
            handleRemoveImage: handleRemoveImage,
            roles: roles,
            translateRole: translateRole,
          }}
        />
      )}
      <DeleteModal
        config={{
          showDeleteModal: showDeleteModal,
          closeDeleteModal: closeDeleteModal,
          setIsDeletingBatch: setIsDeletingBatch,
          isDeletingBatch: isDeletingBatch,
          selectedKeys: selectedKeys,
          users: users,
          deleteUsersBatch: deleteUsersBatch,
          setSelectedKeys: setSelectedKeys,
          check: check,
        }}
      />
    </div>
  );
}
