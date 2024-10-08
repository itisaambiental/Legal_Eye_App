import { useCallback, useState, useMemo } from "react";
import { Tooltip, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Spinner, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import useUsers from "../../hooks/user/users.jsx";
import TopContent from "./TopContent";
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
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const columns = [
  { name: "Nombre", uid: "name" },
  { name: "Rol", uid: "role" },
  { name: "Acciones", uid: "actions" }
];


export default function Users() {
  const { users, loading, error, addUser, deleteUser, deleteUsersBatch } = useUsers();
  const [filterValue, setFilterValue] = useState("");
  const { roles, roles_loading, roles_error } = useRoles();
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const [isopenCreateModal, setIsModalOpenCreate] = useState(false);
  const [usertypeError, setusertypeError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeletingBatch, setIsDeletingBatch] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [fileError, setFileError] = useState(null);
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


  const onClear = useCallback(() => {
    setFilterValue("")
    setPage(1)
  }, [])


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
        toast.success('Usuarios eliminados con éxito', {
          icon: () => <img src={check} alt="Success Icon" />,
          progressStyle: { background: '#113c53' },
        });
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

    if (file && !validTypes.includes(file.type)) {
      setFileError("Solo se permiten archivos PNG, JPG, o WEBP.");
      setFormData({ ...formData, profile_picture: null });
    } else {
      setFileError(null);
      setFormData({ ...formData, profile_picture: file });
    }
  };


  const openModalCreate = () => {
    setFormData({
      id: '',
      user_type: '',
      nombre: '',
      email: '',
      profile_picture: null,
    });
    setIsModalOpenCreate(true)
  }


  const closeModalCreate = () => {
    setIsModalOpenCreate(false)
  }

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
                <DropdownItem startContent={<img src={edit_user} alt="Edit Icon" className="w-4 h-4 flex-shrink-0" />} className="hover:bg-primary/20" key="edit">
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
        rolesOptions={roles}
        onRowsPerPageChange={onRowsPerPageChange}
        totalUsers={filteredUsers.length}
        capitalize={capitalize}
        openModalCreate={openModalCreate}
        onFilterChange={handleFilterChange}
        onClear={onClear}
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
        <TableBody items={filteredUsers.slice((page - 1) * rowsPerPage, page * rowsPerPage)}>
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
      {isopenCreateModal && (
        <CreateModal
          closeModalCreate={closeModalCreate}
          addUser={addUser}
          handleChange={handleChange}
          formData={formData}
          usertypeError={usertypeError}
          setusertypeError={setusertypeError}
          handleTypeChange={handleTypeChange}
          handleFileChange={handleFileChange}
          fileError={fileError}
          setEmailError={setEmailError}
          emailError={emailError}
        />
      )}

      {showDeleteModal && (
        <div id="popup-modal" className="fixed top-0 right-0 left-0 bottom-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow w-full max-w-md">
            <div className="p-4 md:p-5 text-center">
              <h3 className="mb-5 text-lg font-normal text-primary">
                {selectedKeys === "all"
                  ? "¿Estás seguro de que deseas eliminar TODOS los usuarios?"
                  : "¿Estás seguro de que deseas eliminar estos usuarios?"}
              </h3>

              <button onClick={handleDeleteBatch} type="button" className="text-white bg-primary hover:bg-primary/90 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-3">
                {isDeletingBatch ? <Spinner size='sm' color="primary" /> : 'Sí, estoy seguro'}
              </button>
              <button onClick={closeDeleteModal} type="button" className="py-2.5 px-5 text-sm font-medium text-primary focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-primary/10 hover:text-primary focus:z-10">No, cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>

  );
}
