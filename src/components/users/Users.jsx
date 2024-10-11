import { useCallback, useState, useMemo } from "react";
import { Tooltip, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Spinner, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import useUsers from "../../hooks/user/users.jsx";
import TopContent from "./TopContent";
import DeleteModal from "./deleteModal.jsx";
import BottomContent from "./BottomContent";
import Error from "../utils/Error.jsx";
import defaultAvatar from "../../assets/usuario.png";
import menu_icon from "../../assets/aplicaciones.png"
import edit_user from "../../assets/editar_usuario.png";
import delete_user from "../../assets/borrar-usuario.png";
import useRoles from "../../hooks/user/roles.jsx";
import trash_icon from "../../assets/papelera-mas.png";
import CreateModal from "./CreateModal.jsx";
import check from "../../assets/check.png"
import { toast } from "react-toastify";
import EditModal from "./EditModal.jsx";


const columns = [
  { name: "Nombre", uid: "name" },
  { name: "Rol", uid: "role" },
  { name: "Acciones", uid: "actions" }
];

function translateRole(role) {
  const roleTranslations = {
    "Admin": "Admin",
    "Analyst": "Analista",
  };
  return roleTranslations[role] || role;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function Users() {
  const { users, loading, error, addUser, updateUserDetails, deleteUser, deleteUsersBatch, fetchUsersByRole, fetchUsers } = useUsers();
  const [filterValue, setFilterValue] = useState("");
  const { roles, roles_loading, roles_error } = useRoles();
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [usertypeError, setusertypeError] = useState(null);
  const [nameError, setNameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeletingBatch, setIsDeletingBatch] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [selectedRoleKeys, setSelectedRoleKeys] = useState(new Set(["0"]));
  const [selectedValue, setSelectedValue] = useState("Todos los Roles");
  const [formData, setFormData] = useState({
    id: '',
    user_type: '',
    nombre: '',
    email: '',
    profile_picture: null,
  });

  console.log(users)

  const filteredUsers = useMemo(() => {
    if (!filterValue) return users;

    return users.filter(user =>
      user.name.toLowerCase().includes(filterValue.toLowerCase()) ||
      user.gmail.toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [users, filterValue]);


  const totalPages = useMemo(() => Math.ceil(filteredUsers.length / rowsPerPage), [filteredUsers, rowsPerPage]);

  const handleFilterChange = useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);


  const handleNameChange = (e) => {
    handleChange(e);
    if (nameError && e.target.value.trim() !== '') {
      setNameError(null);
    }
  };



  const onClear = useCallback(() => {
    setFilterValue("")
    setPage(1)
  }, [])

  const handleRoleSelection = useCallback((selectedRole) => {
    if (selectedRole === "0" || !selectedRole) {
      fetchUsers();
      setSelectedValue("Todos los Roles");
    } else {
      fetchUsersByRole(selectedRole);
      const roleName = roles.find(role => role.id.toString() === selectedRole)?.role || "Todos los Roles";
      setSelectedValue(capitalize(translateRole(roleName)));
    }
  }, [roles, fetchUsers, fetchUsersByRole]);

  const onRoleChange = (keys) => {
    const selectedArray = Array.from(keys);
    const selectedRole = selectedArray[0];
    setSelectedRoleKeys(keys);
    handleRoleSelection(selectedRole);
    setFilterValue("");
  };



  const handleDelete = useCallback(async (userId) => {
    setDeletingUserId(userId);

    try {
      const { success, error } = await deleteUser(userId);

      if (success) {
        toast.success('Usuario eliminado con éxito', {
          icon: () => <img src={check} alt="Success Icon" />,
          progressStyle: {
            background: '#113c53',
          }
        });
      } else {
        if (error === 'User not found') {
          toast.error('El usuario no fue encontrado.');
        } else if (error === 'Unauthorized') {
          toast.error('No tienes autorización para eliminar este usuario.');
        } else if (error === 'Network error occurred while deleting') {
          toast.error('Ocurrió un error de red. Revisa tu conexión e intenta de nuevo.');
        } else if (error === 'Internal server error') {
          toast.error('Error interno del servidor. Intenta más tarde.');
        } else {
          toast.error('Ocurrió un error inesperado al eliminar el usuario. Intenta nuevamente.');
        }
      }
    } catch (error) {
      console.error(error);
      toast.error('Algo mal sucedió al eliminar el usuario. Intente de nuevo');
    } finally {
      setDeletingUserId(null);
    }
  }, [deleteUser]);


  const handleDeleteBatch = useCallback(async () => {
    setIsDeletingBatch(true);
    const userIds = selectedKeys === "all"
      ? users.map(user => user.id)
      : Array.from(selectedKeys).map(id => Number(id));

    try {
      const { success, error } = await deleteUsersBatch(userIds);

      if (success) {
        if (userIds.length <= 1) {
          toast.success('Usuario eliminado con éxito', {
            icon: () => <img src={check} alt="Success Icon" />,
            progressStyle: { background: '#113c53' },
          });
        } else {
          toast.success('Usuarios eliminados con éxito', {
            icon: () => <img src={check} alt="Success Icon" />,
            progressStyle: { background: '#113c53' },
          });
        }
        setSelectedKeys(new Set());
        setShowDeleteModal(false);
      } else {
        const errorMessage = error || 'Ocurrió un error inesperado al eliminar los usuarios. Intenta nuevamente.';
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error(error);
      toast.error('Algo mal sucedió al eliminar los usuarios. Intente de nuevo');
    } finally {
      setIsDeletingBatch(false);
    }
  }, [selectedKeys, deleteUsersBatch, users]);



  const openDeleteModal = () => setShowDeleteModal(true);
  const closeDeleteModal = () => setShowDeleteModal(false);



  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const validTypes = ["image/png", "image/jpeg", "image/webp"];

    if (file && validTypes.includes(file.type)) {
      setFileError(null);
      const imageUrl = URL.createObjectURL(file);

      setFormData({
        ...formData,
        profile_picture: {
          file: file,
          previewUrl: imageUrl
        }
      });
    } else {
      setFileError("Solo se permiten archivos PNG, JPG, o WEBP.");
      setFormData({
        ...formData,
        profile_picture: null
      });
    }
  };


  const handleRemoveImage = () => {
    setFormData({
      ...formData,
      profile_picture: null
    });
  };



  const openModalCreate = () => {
    setFormData({
      id: '',
      user_type: '',
      nombre: '',
      email: '',
      profile_picture: null,
    });
    setIsCreateModalOpen(true)
  }


  const closeModalCreate = () => {
    setIsCreateModalOpen(false)
    setFileError(null)
    setNameError(null)
    setEmailError(null)
    setusertypeError(null)
  }

  const openEditModal = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  const handleChange = (e) => {
    let value = e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
    setEmailError(null);
  };

  const handleTypeChange = (value) => {
    if (value !== '') {
      setusertypeError(null);
    }
    setFormData({
      ...formData,
      user_type: value
    });
  };

  const onPageChange = (newPage) => setPage(newPage);
  const onPreviousPage = () => setPage(prev => Math.max(prev - 1, 1));
  const onNextPage = () => setPage(prev => Math.min(prev + 1, totalPages));

  const renderCell = useCallback((user, columnKey) => {
    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{ radius: "lg", src: user.profile_picture || defaultAvatar }}
            description={user.gmail}
            name={user.name}
          />
        );
      case "role":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">
              {user.roleId === 1 ? "Admin" : user.roleId === 2 ? "Analista" : "Usuario"}
            </p>
          </div>
        );
      case "actions":
        return (
          <div className="relative flex items-center justify-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="bordered"
                  color="primary"
                  size="sm"
                  isIconOnly
                  auto
                  aria-label="Opciones"
                  disabled={deletingUserId === user.id}
                >
                  {deletingUserId === user.id ? (
                    <Spinner size="sm" color="primary" />
                  ) : (
                    <img src={menu_icon} alt="Menu" className="w-4 h-4" />
                  )}
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Opciones de usuario" variant="light">
                <DropdownItem
                  startContent={<img src={edit_user} alt="Edit Icon"
                    className="w-4 h-4 flex-shrink-0" />}
                  className="hover:bg-primary/20"
                  key="edit"
                  onClick={() => openEditModal(user)}
                >

                  <p className="font-normal text-primary">Editar Usuario</p>
                </DropdownItem>
                <DropdownItem
                  startContent={<img src={delete_user} alt="Delete Icon" className="w-4 h-4 flex-shrink-0" />}
                  className="hover:bg-red/20"
                  key="delete"
                  onClick={() => handleDelete(user.id)}
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
  }, [deletingUserId, handleDelete]);

  const onRowsPerPageChange = useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  if (loading || roles_loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <Spinner className="h-10 w-10 transform translate-x-0 lg:translate-x-28 xl:translate-x-32" color="secondary" />
      </div>
    );
  }

  if (error) {
    return <Error message={error} />;
  }
  if (roles_error) {
    return <Error message={roles_error} />;
  }

  return (
    <div className="mt-24 mb-4 -ml-60 mr-4 lg:-ml-0 lg:mr-0 xl:-ml-0 xl:mr-0 flex justify-center items-center flex-wrap">

      <TopContent
        roles={roles}
        onRowsPerPageChange={onRowsPerPageChange}
        totalUsers={filteredUsers.length}
        capitalize={capitalize}
        openModalCreate={openModalCreate}
        onFilterChange={handleFilterChange}
        onClear={onClear}
        fetchUsers={fetchUsers}
        fetchUsersByRole={fetchUsersByRole}
        users={users}
        selectedValue={selectedValue}
        selectedRoleKeys={selectedRoleKeys}
        onRoleChange={onRoleChange}
        translateRole={translateRole}

      />


      <Table
        aria-label="Tabla de usuarios"
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        color="primary"
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={filteredUsers.slice((page - 1) * rowsPerPage, page * rowsPerPage)}
          emptyContent="No hay usuarios para mostrar"
        >
          {(user) => (
            <TableRow key={user.id}>
              {(columnKey) => (
                <TableCell>{renderCell(user, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="relative w-full">
        {(selectedKeys.size > 0 || selectedKeys === "all") && (
          <Tooltip content="Eliminar" size="sm">
            <Button
              isIconOnly
              size="sm"
              className="absolute left-0 bottom-0 ml-5 bg-primary transform translate-y-24 md:translate-y-10 lg:translate-y-10 xl:translate-y-10"
              aria-label="Eliminar seleccionados"
              onClick={openDeleteModal}
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
        filteredItems={users}
      />
      {isCreateModalOpen && (
        <CreateModal
          closeModalCreate={closeModalCreate}
          isOpen={isCreateModalOpen}
          addUser={addUser}
          handleChange={handleChange}
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
          handleChange={handleChange}
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

      {showDeleteModal && (
        <DeleteModal
          showDeleteModal={showDeleteModal}
          closeDeleteModal={closeDeleteModal}
          handleDeleteBatch={handleDeleteBatch}
          isDeletingBatch={isDeletingBatch}
          selectedKeys={selectedKeys}
        />
      )}
    </div>

  );
}
