import { useCallback, useState, useMemo, useEffect } from "react";
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
import BottomContent from "./BottomContent";
import UserCell from "./UsersCell.jsx";
import Error from "../Error.jsx";
import useRoles from "../../hooks/user/useRoles.jsx";
import trash_icon from "../../assets/papelera-mas.png";
import CreateModal from "./CreateModal.jsx";
import check from "../../assets/check.png";
import { toast } from "react-toastify";
import EditModal from "./EditModal.jsx";

const columns = [
  { name: "Nombre", uid: "name" },
  { name: "Rol", uid: "role" },
  { name: "Acciones", uid: "actions" },
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
    fetchUsers,
  } = useUsers();
  const [filterValue, setFilterValue] = useState("");
  const { roles, roles_error } = useRoles();
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [IsSearching, setIsSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [usertypeError, setusertypeError] = useState(null);
  const [nameError, setNameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeletingBatch, setIsDeletingBatch] = useState(false);
  const [fileError, setFileError] = useState(null);
  const [selectedRoleKeys, setSelectedRoleKeys] = useState(new Set(["0"]));
  const [selectedValue, setSelectedValue] = useState("Todos los Roles");
  const [formData, setFormData] = useState({
    id: "",
    user_type: "",
    nombre: "",
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
      nombre: value,
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

  const handleRoleSelection = useCallback(
    (selectedRole) => {
      if (selectedRole === "0" || !selectedRole) {
        fetchUsers();
        setSelectedValue("Todos los Roles");
      } else {
        setIsSearching(true);
        fetchUsersByRole(selectedRole);
        const roleName =
          roles.find((role) => role.id.toString() === selectedRole)?.role ||
          "Todos los Roles";
        setSelectedValue(capitalize(translateRole(roleName)));
        setIsSearching(false);
      }
    },
    [roles, fetchUsers, fetchUsersByRole]
  );

  const onRoleChange = (keys) => {
    const selectedArray = Array.from(keys);
    const selectedRole = selectedArray[0];
    setSelectedRoleKeys(keys);
    handleRoleSelection(selectedRole);
    setFilterValue("");
  };

  const filteredUsers = useMemo(() => {
    if (!filterValue) return users;
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(filterValue.toLowerCase()) ||
        user.gmail.toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [users, filterValue]);

  const totalPages = useMemo(
    () => Math.ceil(filteredUsers.length / rowsPerPage),
    [filteredUsers, rowsPerPage]
  );

  const handleFilterChange = useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const openModalCreate = () => {
    setFormData({
      id: "",
      user_type: "",
      nombre: "",
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
              background: '#113c53',
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
        roles={roles}
        onRowsPerPageChange={onRowsPerPageChange}
        totalUsers={filteredUsers.length}
        capitalize={capitalize}
        openModalCreate={openModalCreate}
        value={filterValue}
        onFilterChange={handleFilterChange}
        onClear={onClear}
        selectedValue={selectedValue}
        selectedRoleKeys={selectedRoleKeys}
        onRoleChange={onRoleChange}
        translateRole={translateRole}
      />

      <>
        {IsSearching || loading ? (
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
                <TableColumn
                  key={column.uid}
                  align={column.uid === "actions" ? "center" : "start"}
                >
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody
              items={filteredUsers.slice(
                (page - 1) * rowsPerPage,
                page * rowsPerPage
              )}
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
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
        onPreviousPage={onPreviousPage}
        onNextPage={onNextPage}
        selectedKeys={selectedKeys}
        filteredItems={filteredUsers}
      />

      {isCreateModalOpen && (
        <CreateModal
          closeModalCreate={closeModalCreate}
          isOpen={isCreateModalOpen}
          addUser={addUser}
          handleEmailChange={handleEmailChange}
          formData={formData}
          usertypeError={usertypeError}
          setusertypeError={setusertypeError}
          handleTypeChange={handleTypeChange}
          nameError={nameError}
          setNameError={setNameError}
          handleNameChange={handleNameChange}
          handleFileChange={handleFileChange}
          fileError={fileError}
          handleRemoveImage={handleRemoveImage}
          setEmailError={setEmailError}
          emailError={emailError}
          roles={roles}
          translateRole={translateRole}
        />
      )}

      {isEditModalOpen && (
        <EditModal
          formData={formData}
          setFormData={setFormData}
          selectedUser={selectedUser}
          closeModalEdit={closeEditModal}
          isOpen={isEditModalOpen}
          updateUserDetails={updateUserDetails}
          usertypeError={usertypeError}
          setusertypeError={setusertypeError}
          handleTypeChange={handleTypeChange}
          nameError={nameError}
          setNameError={setNameError}
          handleNameChange={handleNameChange}
          handleFileChange={handleFileChange}
          fileError={fileError}
          handleRemoveImage={handleRemoveImage}
          roles={roles}
          translateRole={translateRole}
        />
      )}

      {showDeleteModal && (
        <DeleteModal
          showDeleteModal={showDeleteModal}
          closeDeleteModal={closeDeleteModal}
          setIsDeletingBatch={setIsDeletingBatch}
          isDeletingBatch={isDeletingBatch}
          selectedKeys={selectedKeys}
          users={filteredUsers}
          deleteUsersBatch={deleteUsersBatch}
          setSelectedKeys={setSelectedKeys}
          check={check}
        />
      )}
    </div>
  );
}
