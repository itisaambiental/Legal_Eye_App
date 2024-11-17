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
    const { value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      nombre: value
    }));
    if (nameError && value.trim() !== '') {
      setNameError(null);
    }
  };

  const handleEmailChange = (e) => {
    const { value, name } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
    if (emailError && value.trim() !== '') {
      setEmailError(null);
    }
  };


  const handleTypeChange = (value) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      user_type: value
    }));
    if (usertypeError && value !== '') {
      setusertypeError(null);
    }
  };



  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const validTypes = ["image/png", "image/jpeg", "image/webp"];

    if (file && validTypes.includes(file.type)) {
      setFileError(null);
      const imageUrl = URL.createObjectURL(file);

      setFormData(prevFormData => ({
        ...prevFormData,
        profile_picture: {
          file: file,
          previewUrl: imageUrl
        }
      }));
    } else {
      setFileError("Solo se permiten archivos PNG, JPG, o WEBP.");
      setFormData(prevFormData => ({
        ...prevFormData,
        profile_picture: null
      }));
    }
  };


  const handleRemoveImage = () => {
    setFormData({
      ...formData,
      profile_picture: null
    });
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
        toast.error(error);
      }
    } catch (error) {
      console.error(error);
      toast.error('Algo mal sucedió al eliminar el usuario. Intente de nuevo');
    }
  }, [deleteUser]);
  
  const openDeleteModal = () => setShowDeleteModal(true);
  const closeDeleteModal = () => setShowDeleteModal(false);

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
    setFileError(null)
    setNameError(null)
    setEmailError(null)
    setusertypeError(null)
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
            <Dropdown
            >
              <DropdownTrigger>
                <Button
                  variant="light"
                  color="primary"
                  size="sm"
                  isIconOnly={false} // Prueba deshabilitarlo temporalmente
                  auto={false} // Prueba deshabilitar esto también temporalmente
                  key="options"
                  aria-label="Opciones"
                 
                >
                <img src={menu_icon} alt="Menu" className="w-6 h-6" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Opciones de usuario" variant="light">
                <DropdownItem
                  aria-label="Editar Usuario"
                  startContent={<img src={edit_user} alt="Edit Icon"
                  className="w-4 h-4 flex-shrink-0" />}
                  className="hover:bg-primary/20"
                  key="edit"
                  onClick={() => openEditModal(user)}
                  textValue="Editar Usuario"
                >

                  <p className="font-normal text-primary">Editar Usuario</p>
                </DropdownItem>
                <DropdownItem
                  aria-label="Eliminar Usuario"
                  startContent={<img src={delete_user} alt="Delete Icon" className="w-4 h-4 flex-shrink-0" />}
                  className="hover:bg-red/20"
                  key="delete"
                  onClick={() => handleDelete(user.id)}
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
  }, [handleDelete]);

  const onRowsPerPageChange = useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  if (loading || roles_loading) {
    return (
      <div role="status" className="fixed inset-0 flex items-center justify-center">
        <Spinner className="h-10 w-10 transform translate-x-0 lg:translate-x-28 xl:translate-x-32" color="secondary" />
      </div>
    );
  }

  if (error) {
    return <Error title={error.title} message={error.message} />;
  }
  if (roles_error) {
    return <Error title={roles_error.message} message={roles_error.message} />;
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
          handleEmailChange={handleEmailChange}
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
          setIsDeletingBatch={setIsDeletingBatch}
          isDeletingBatch={isDeletingBatch}
          selectedKeys={selectedKeys}
          users={users}
          deleteUsersBatch={deleteUsersBatch}
          setShowDeleteModal={setShowDeleteModal}
          setSelectedKeys={setSelectedKeys}
          check={check}

        />
      )}
    </div>

  );
}
