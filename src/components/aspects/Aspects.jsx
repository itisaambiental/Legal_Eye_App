import { useCallback, useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Tooltip, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import useAspects from "../../hooks/aspect/useAspects.jsx";
import useSubjects from "../../hooks/subject/useSubjects.jsx";
import TopContent from "./TopContent.jsx";
import DeleteModal from "./deleteModal.jsx";
import BottomContent from "./BottomContent.jsx";
import Error from "../utils/Error.jsx";
import menu_icon from "../../assets/aplicaciones.png"
import update_icon from "../../assets/actualizar.png";
import delete_icon from "../../assets/eliminar.png";
import trash_icon from "../../assets/papelera-mas.png";
import CreateModal from "./CreateModal.jsx";
import check from "../../assets/check.png"
import { toast } from "react-toastify";
import EditModal from "./EditModal.jsx";

const columns = [
    { name: "Aspecto", uid: "aspect_name" },
    { name: "Acciones", uid: "actions" }
];

/**
 * Aspects component
 *
 * This component provides an interface for managing aspects, including features for listing,
 * pagination, and CRUD operations. Aspects can be added, edited, or deleted, with appropriate
 * feedback displayed for each action.
 *
 * @returns {JSX.Element} Rendered Aspects component, displaying the aspect management interface with
 * filters, pagination, and modals for adding, editing, and deleting aspects.
 *
 */

export default function Aspects() {
    const { id } = useParams(); 
    const [loadingAspects, setLoadingAspects] = useState(true);
    const [ subjectName, setSubjectName ] = useState(null); 
    const { aspects, loading, error,  fetchAspects, addAspect, modifyAspect, removeAspect, deleteAspectsBatch } = useAspects();
    const { fetchSubjectById, loading: subjectLoading, error: subjectError  } = useSubjects();
    const [filterValue, setFilterValue] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(1);
    const [selectedKeys, setSelectedKeys] = useState(new Set());
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedAspect, setSelectedAspect] = useState(null);
    const [nameError, setNameError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeletingBatch, setIsDeletingBatch] = useState(false);
    const [formData, setFormData] = useState({
        id: '',
        nombre: '',
        subject_id: '',
        subject_name: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            if (id) {
                setLoadingAspects(true)
                await fetchAspects(id);
                const { success, data } = await fetchSubjectById(id);
                if (success && data) {
                    setSubjectName(data.subject_name);
                } else {
                    setSubjectName(null); 
                }
                setLoadingAspects(false)
            }
        };
    
        fetchData();
    }, [id, fetchAspects, fetchSubjectById]);
    
    
    
    const filteredAspects = useMemo(() => {
        if (!filterValue) return aspects;
        return aspects.filter(aspect =>
            aspect.aspect_name.toLowerCase().includes(filterValue.toLowerCase())
        );
    }, [aspects, filterValue]);

    const totalPages = useMemo(() => Math.ceil(filteredAspects.length / rowsPerPage), [filteredAspects, rowsPerPage]);

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

    const onClear = useCallback(() => {
        setFilterValue("")
        setPage(1)
    }, [])


    const handleDelete = useCallback(async (aspectId) => {
        try {
            const { success, error } = await removeAspect(aspectId);
            if (success) {
                toast.success('Aspecto eliminado con éxito', {
                    icon: () => <img src={check} alt="Success Icon" />,
                    progressStyle: {
                        background: '#113c53',
                    }
                });
            } else {
                switch (error) {
                    case 'No autorizado para eliminar el aspecto':
                        toast.error('No tienes autorización para eliminar este aspecto.');
                        break;
                    case 'Aspecto no encontrado':
                        toast.error('El aspecto no fue encontrado.');
                        break;
                    case 'Error de conexión durante la eliminación':
                        toast.error('Ocurrió un error de red. Revisa tu conexión a internet e intenta de nuevo.');
                        break;
                    case 'Error interno del servidor':
                        toast.error('Error interno del servidor. Intenta más tarde.');
                        break;
                    default:
                        toast.error('Ocurrió un error inesperado al eliminar el aspecto. Intenta nuevamente.');
                }
            }
        } catch (error) {
            console.error(error);
            toast.error('Algo salió mal al eliminar el aspecto. Intente de nuevo');
        }
    }, [removeAspect]);

    const openDeleteModal = () => setShowDeleteModal(true);
    const closeDeleteModal = () => setShowDeleteModal(false);

    const openModalCreate = () => {
        setFormData({
            id: '',
            nombre: '',
            subject_id: id,
            subject_name: subjectName,
        });
        setIsCreateModalOpen(true)
    }


    const closeModalCreate = () => {
        setIsCreateModalOpen(false)
        setNameError(null)
    }

    const openEditModal = (aspect) => {
        setSelectedAspect(aspect);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedAspect(null);
        setNameError(null)
    };


    const onPageChange = (newPage) => setPage(newPage);
    const onPreviousPage = () => setPage(prev => Math.max(prev - 1, 1));
    const onNextPage = () => setPage(prev => Math.min(prev + 1, totalPages));

    const renderCell = useCallback((aspect, columnKey) => {
        switch (columnKey) {
            case "aspect_name":
                return <p className="text-sm font-normal">{aspect.aspect_name}</p>;
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
                                >
                                    <img src={menu_icon} alt="Menu" className="w-6 h-6" />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Opciones de aspecto" variant="light">
                                <DropdownItem
                                    aria-label="Editar Aspecto"
                                    startContent={<img src={update_icon} alt="Edit Icon" className="w-4 h-4 flex-shrink-0" />}
                                    className="hover:bg-primary/20"
                                    key="edit"
                                    onClick={() => openEditModal(aspect)}
                                    textValue="Editar Aspecto"
                                >
                                    <p className="font-normal text-primary">Editar Aspecto</p>
                                </DropdownItem>
                                <DropdownItem
                                    aria-label="Eliminar Aspecto"
                                    startContent={<img src={delete_icon} alt="Delete Icon" className="w-4 h-4 flex-shrink-0" />}
                                    className="hover:bg-red/20"
                                    key="delete"
                                    onClick={() => handleDelete(aspect.id)}
                                    textValue="Eliminar Aspecto"
                                >
                                    <p className="font-normal text-red">Eliminar Aspecto</p>
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

    if (loading || subjectLoading || loadingAspects) {
        return (
            <div role="status" className="fixed inset-0 flex items-center justify-center">
                <Spinner className="h-10 w-10 transform translate-x-0 lg:translate-x-28 xl:translate-x-32" color="secondary" />
            </div>
        );
    }

    if (error) {
        return <Error message={error} />;
    }
    if (subjectError) {
        return <Error message={error} />;
    }
    return (
        <div className="mt-24 mb-4 -ml-60 mr-4 lg:-ml-0 lg:mr-0 xl:-ml-0 xl:mr-0 flex justify-center items-center flex-wrap">
            <TopContent
                subjectName={subjectName}
                onRowsPerPageChange={onRowsPerPageChange}
                totalAspects={filteredAspects.length}
                openModalCreate={openModalCreate}
                onFilterChange={handleFilterChange}
                onClear={onClear}
            />


            <Table
                aria-label="Tabla de Aspectos"
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
                    items={filteredAspects.slice((page - 1) * rowsPerPage, page * rowsPerPage)}
                    emptyContent="No hay aspectos para mostrar"
                >
                    {(aspect) => (
                        <TableRow key={aspect.id}>
                            {(columnKey) => (
                                <TableCell>{renderCell(aspect, columnKey)}</TableCell>
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
                filteredItems={aspects}
            />
            {isCreateModalOpen && (
                <CreateModal
                    closeModalCreate={closeModalCreate}
                    isOpen={isCreateModalOpen}
                    addAspect={addAspect}
                    formData={formData}
                    nameError={nameError}
                    setNameError={setNameError}
                    handleNameChange={handleNameChange}

                />
            )}
             {isEditModalOpen && (
                <EditModal
                    formData={formData}
                    setFormData={setFormData}
                    selectedAspect={selectedAspect}
                    closeModalEdit={closeEditModal}
                    isOpen={isEditModalOpen}
                    updateAspect={modifyAspect}
                    nameError={nameError}
                    setNameError={setNameError}
                    handleNameChange={handleNameChange}
                />
            )}
 
            {showDeleteModal && (
                <DeleteModal
                    showDeleteModal={showDeleteModal}
                    closeDeleteModal={closeDeleteModal}
                    setIsDeletingBatch={setIsDeletingBatch}
                    isDeletingBatch={isDeletingBatch}
                    selectedKeys={selectedKeys}
                    aspects={aspects}
                    deleteAspectsBatch={deleteAspectsBatch}
                    setShowDeleteModal={setShowDeleteModal}
                    setSelectedKeys={setSelectedKeys}
                    check={check}

                />
            )}  
        </div>

    );
}