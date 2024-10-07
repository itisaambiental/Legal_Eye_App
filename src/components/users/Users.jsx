import { useCallback } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Spinner, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Pagination } from "@nextui-org/react";
import useUsers from "../../hooks/user/users.jsx"; 
import defaultAvatar from "../../assets/usuario.png";  
import puntosIcon from "../../assets/menu-puntos.png"; 
import edit_user from "../../assets/editar_usuario.png"
import delete_user from "../../assets/borrar-usuario.png"
import Error from "../utils/Error.jsx";
export default function Users() {
  const columns = [
    { name: "Nombre", uid: "name" },
    { name: "Rol", uid: "role" },
    { name: "Acciones", uid: "actions" }
  ];

  const { users, loading, error } = useUsers(); 

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
                  variant="light"
                  isIconOnly 
                  auto
                  aria-label="Opciones"
                >
                  <img src={puntosIcon} alt="Menu" className="w-8 h-8" /> 
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Opciones de usuario" variant="light">
                <DropdownItem startContent={<img src={edit_user} alt="CSV Icon" className="w-4 h-4 flex-shrink-0" />}   className="text-blue hover:bg-blue/30" key="edit">
                <p className="font-normal text-blue">Editar Usuario</p> 
                </DropdownItem>
                <DropdownItem startContent={<img src={delete_user} alt="CSV Icon" className="w-4 h-4 flex-shrink-0" />}  key="delete" className="hover:bg-red/20">
                <p className="font-normal text-red">Eliminar Usuario</p>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return null;
    }
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <Spinner className="h-10 w-10 transform translate-x-0 lg:translate-x-28 xl:translate-x-32"  color="primary" />
      </div>
    );
  }


if (error) {
  return <Error message={error} />;
}
  return (
    <div>
    <div className="mt-24 mb-4 -ml-60 mr-4 lg:-ml-0 lg:mr-0 xl:-ml-0 xl:mr-0 flex justify-center items-center flex-wrap">

    <Table aria-label="Tabla de usuarios" >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={users}>
        {(user) => (
          <TableRow key={user.id}>
            {(columnKey) => <TableCell>{renderCell(user, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
    
    </div>
  
    </div>
    
  );
}
