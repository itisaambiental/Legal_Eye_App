import { useCallback, useState, useMemo } from "react";
import { Tooltip, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import useSubjects from "../../hooks/subject/useSubjects.jsx";
import TopContent from "./TopContent";
// import DeleteModal from "./deleteModal.jsx";
import BottomContent from "./BottomContent";
import Error from "../utils/Error.jsx";
import menu_icon from "../../assets/aplicaciones.png"
import update_icon from "../../assets/actualizar.png";
import delete_icon from "../../assets/eliminar.png";
import watch_icon from "../../assets/ver.png";
import trash_icon from "../../assets/papelera-mas.png";
// import CreateModal from "./CreateModal.jsx";
import check from "../../assets/check.png"
import { toast } from "react-toastify";
// import EditModal from "./EditModal.jsx";

const columns = [
    { name: "Materia", uid: "subject_name" },
    { name: "Acciones", uid: "actions" }
  ];


/**
 * Subjects component
 * 
 * This component provides an interface for managing subjects, including features for listing, 
 * pagination, and CRUD operations. Subjects can be added, edited, or deleted, with appropriate 
 * feedback displayed for each action.
 * 
 * @returns {JSX.Element} Rendered Subjects component, displaying the subject management interface with 
 * filters, pagination, and modals for adding, editing, and deleting subjects.
 * 
 */
export default function Subjects() {
  const { subjects, loading, error , removeSubject } = useSubjects();
  const [filterValue, setFilterValue] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [selectedKeys, setSelectedKeys] = useState(new Set());
//   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [usertypeError, setusertypeError] = useState(null);
//   const [nameError, setNameError] = useState(null);
//   const [emailError, setEmailError] = useState(null);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [isDeletingBatch, setIsDeletingBatch] = useState(false);
  const [deletingSubjectId, setDeletingSubjectId] = useState(null);
//   const [fileError, setFileError] = useState(null);
//   const [formData, setFormData] = useState({
//     id: '',
//     user_type: '',
//     nombre: '',
//     email: '',
//     profile_picture: null,
//   });


  const filteredSubjects = useMemo(() => {
    if (!filterValue) return subjects;

    return subjects.filter(subject =>
      subject.subject_name.toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [subjects, filterValue]);


  const totalPages = useMemo(() => Math.ceil(filteredSubjects.length / rowsPerPage), [filteredSubjects, rowsPerPage]);

  const handleFilterChange = useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);


//   const handleNameChange = (e) => {
//     const { value } = e.target;
//     setFormData(prevFormData => ({
//       ...prevFormData,
//       nombre: value
//     }));
//     if (nameError && value.trim() !== '') {
//       setNameError(null);
//     }
//   };

  const onClear = useCallback(() => {
    setFilterValue("")
    setPage(1)
  }, [])


  const handleDelete = useCallback(async (subjectId) => {
    setDeletingSubjectId(subjectId);

    try {
      const { success, error } = await removeSubject(subjectId);

      if (success) {
        toast.success('Materia eliminada con éxito', {
          icon: () => <img src={check} alt="Success Icon" />,
          progressStyle: {
            background: '#113c53',
          }
        });
      } else {
        switch (error) {
          case 'No autorizado para eliminar el subject':
            toast.error('No tienes autorización para eliminar esta materia.');
            break;
          case 'Subject no encontrado':
            toast.error('La materia no fue encontrada.');
            break;
          case 'Error de conexión durante la eliminación':
            toast.error('Ocurrió un error de red. Revisa tu conexión a internet e intenta de nuevo.');
            break;
          case 'Error interno del servidor':
            toast.error('Error interno del servidor. Intenta más tarde.');
            break;
          default:
            toast.error('Ocurrió un error inesperado al eliminar la materia. Intenta nuevamente.');
        }
      }
    } catch (error) {
      console.error(error);
      toast.error('Algo salió mal al eliminar la materia. Intente de nuevo');
    } finally {
      setDeletingSubjectId(null);
    }
  }, [removeSubject]);

//   const openDeleteModal = () => setShowDeleteModal(true);
//   const closeDeleteModal = () => setShowDeleteModal(false);

//   const openModalCreate = () => {
//     setFormData({
//       id: '',
//       user_type: '',
//       nombre: '',
//       email: '',
//       profile_picture: null,
//     });
//     setIsCreateModalOpen(true)
//   }


//   const closeModalCreate = () => {
//     setIsCreateModalOpen(false)
//     setFileError(null)
//     setNameError(null)
//     setEmailError(null)
//     setusertypeError(null)
//   }

//   const openEditModal = (user) => {
//     setSelectedUser(user);
//     setIsEditModalOpen(true);
//   };

//   const closeEditModal = () => {
//     setIsEditModalOpen(false);
//     setSelectedUser(null);
//     setFileError(null)
//     setNameError(null)
//     setEmailError(null)
//     setusertypeError(null)
//   };


  const onPageChange = (newPage) => setPage(newPage);
  const onPreviousPage = () => setPage(prev => Math.max(prev - 1, 1));
  const onNextPage = () => setPage(prev => Math.min(prev + 1, totalPages));

  const renderCell = useCallback((subject, columnKey) => {
    switch (columnKey) {
      case "subject_name":
        return <p className="text-sm font-normal">{subject.subject_name}</p>;
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
                  auto
                  aria-label="Opciones"
                  disabled={deletingSubjectId === subject.id}
                >
                  {deletingSubjectId === subject.id ? (
                    <Spinner size="sm" color="primary" />
                  ) : (
                    <img src={menu_icon} alt="Menu" className="w-6 h-6" />
                  )}
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Opciones de materia" variant="light">
              <DropdownItem
                  aria-label="Ver Aspectos"
                  startContent={<img src={watch_icon} alt="Edit Icon" className="w-4 h-4 flex-shrink-0" />}
                   className="hover:bg-primary/20"
                  key="edit"
                  textValue="Ver Aspectos"
                >
                  <p className="font-normal text-primary">Ver Aspectos</p>
                </DropdownItem>
                <DropdownItem
                  aria-label="Editar Materia"
                  startContent={<img src={update_icon} alt="Edit Icon" className="w-4 h-4 flex-shrink-0" />}
                   className="hover:bg-primary/20"
                  key="edit"
                  textValue="Editar Materia"
                >
                  <p className="font-normal text-primary">Editar Materia</p>
                </DropdownItem>
                <DropdownItem
                  aria-label="Eliminar Materia"
                  startContent={<img src={delete_icon} alt="Delete Icon" className="w-4 h-4 flex-shrink-0" />}
                   className="hover:bg-red/20"
                  key="delete"
                  onClick={() => handleDelete(subject.id)}
                  textValue="Eliminar Materia"
                >
                  <p className="font-normal text-red">Eliminar Materia</p>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return null;
    }
  }, [deletingSubjectId, handleDelete]);

  const onRowsPerPageChange = useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <Spinner className="h-10 w-10 transform translate-x-0 lg:translate-x-28 xl:translate-x-32" color="secondary" />
      </div>
    );
  }

  if (error) {
    return <Error message={error} />;
  }
  return (
    <div className="mt-24 mb-4 -ml-60 mr-4 lg:-ml-0 lg:mr-0 xl:-ml-0 xl:mr-0 flex justify-center items-center flex-wrap">

      <TopContent
        onRowsPerPageChange={onRowsPerPageChange}
        totalSubjects={filteredSubjects.length}
        // openModalCreate={openModalCreate}
        onFilterChange={handleFilterChange}
        onClear={onClear}
      />


      <Table
        aria-label="Tabla de Materias"
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
          items={filteredSubjects.slice((page - 1) * rowsPerPage, page * rowsPerPage)}
          emptyContent="No hay materias para mostrar"
        >
          {(subject) => (
            <TableRow key={subject.id}>
              {(columnKey) => (
                <TableCell>{renderCell(subject, columnKey)}</TableCell>
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
            //   onClick={openDeleteModal}
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
        filteredItems={subjects}
      />
      {/* {isCreateModalOpen && (
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
      )} */}
{/* 

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
      )} */}

      {/* {showDeleteModal && (
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
      )} */}
    </div>

  );
}
