import { useCallback, useState } from "react";
import { Tooltip, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Spinner, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import useUsers from "../../hooks/user/users.jsx"; 
import TopContent from "./TopContent"; 
import BottomContent from "./BottomContent";
import Error from "../utils/Error.jsx";
import defaultAvatar from "../../assets/usuario.png";
import puntosIcon from "../../assets/menu-puntos.png";
import edit_user from "../../assets/editar_usuario.png";
import delete_user from "../../assets/borrar-usuario.png";
import useRoles from "../../hooks/user/roles.jsx";
import trash_icon from "../../assets/papelera-mas.png";

export default function Users() {
  const columns = [
    { name: "Nombre", uid: "name" },
    { name: "Rol", uid: "role" },
    { name: "Acciones", uid: "actions" }
  ];

  const { users, loading, error } = useUsers();
  const { roles, roles_loading, roles_error } = useRoles();
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [selectedKeys, setSelectedKeys] = useState(new Set()); 
  const totalPages = Math.ceil(users.length / rowsPerPage);

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

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
                <Button variant="bordered" color="danger" isIconOnly auto aria-label="Opciones">
                  <img src={puntosIcon} alt="Menu" className="w-6 h-6" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Opciones de usuario" variant="light">
                <DropdownItem startContent={<img src={edit_user} alt="Edit Icon" className="w-4 h-4 flex-shrink-0" />} className="hover:bg-blue/20" key="edit">
                  <p className="font-normal text-blue">Editar Usuario</p>
                </DropdownItem>
                <DropdownItem startContent={<img src={delete_user} alt="Delete Icon" className="w-4 h-4 flex-shrink-0" />} className="hover:bg-red/20" key="delete">
                  <p className="font-normal text-red ">Eliminar Usuario</p>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return null;
    }
  }, []);

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
        totalUsers={users.length} 
        selectedKeys={selectedKeys} 
        capitalize={capitalize} 
      />

    
        <Table 
          aria-label="Tabla de usuarios"
          selectionMode="multiple"
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
          color="danger"
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={users.slice((page - 1) * rowsPerPage, page * rowsPerPage)}>
            {(user) => (
              <TableRow key={user.id}>
                {(columnKey) => <TableCell>{renderCell(user, columnKey)}</TableCell>}
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
              className="absolute left-0 bottom-0 ml-5 bg-blue transform translate-y-24 md:translate-y-10 lg:translate-y-10 xl:translate-y-10"
              aria-label="Eliminar seleccionados"
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
    
      </div>

  );
}
