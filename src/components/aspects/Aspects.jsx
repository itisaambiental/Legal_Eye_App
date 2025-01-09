import { useCallback, useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Tooltip, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Button } from "@nextui-org/react";
import useAspects from "../../hooks/aspect/useAspects.jsx";
import useSubjects from "../../hooks/subject/useSubjects.jsx";
import TopContent from "./TopContent.jsx";
import DeleteModal from "./deleteModal.jsx";
import BottomContent from "./BottomContent.jsx";
import Error from "../Error.jsx";
import AspectCell from "./AspectsCell.jsx";
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
    const [subjectName, setSubjectName] = useState(null);
    const { aspects, loading, error, fetchAspects, addAspect, modifyAspect, removeAspect, deleteAspectsBatch } = useAspects();
    const { fetchSubjectById, error: subjectError } = useSubjects();
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
                await fetchAspects(id);
                const { success, data } = await fetchSubjectById(id);
                if (success && data) {
                    setSubjectName(data.subject_name);
                } else {
                    setSubjectName(null);
                }
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

    const onRowsPerPageChange = useCallback((e) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const openDeleteModal = () => setShowDeleteModal(true);
    const closeDeleteModal = () => setShowDeleteModal(false);
    const onPageChange = (newPage) => setPage(newPage);
    const onPreviousPage = () => setPage(prev => Math.max(prev - 1, 1));
    const onNextPage = () => setPage(prev => Math.min(prev + 1, totalPages));

    const handleDelete = useCallback(async (aspectId) => {
        const toastId = toast.loading("Eliminando aspecto...", {
          icon: <Spinner size="sm" />,
          progressStyle: {
            background: "#113c53",
          },
        });
        try {
          const { success, error } = await removeAspect(aspectId);
          if (success) {
            toast.update(toastId, {
              render: "Aspecto eliminado con éxito",
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
            render: "Algo salió mal al eliminar el aspecto. Intente de nuevo.",
            type: "error",
            icon: null, 
            progressStyle: {},
            isLoading: false,
            autoClose: 5000,
          });
        }
      }, [removeAspect]);
      

    if (loading) {
        return (
            <div role="status" className="fixed inset-0 flex items-center justify-center">
                <Spinner className="h-10 w-10 transform translate-x-0 lg:translate-x-28 xl:translate-x-32" color="secondary" />
            </div>
        );
    }
    if (error) return <Error title={error.title} message={error.message} />;
    if (subjectError) return <Error title={subjectError.title} message={subjectError.message} />;
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
                                <TableCell>
                                    <AspectCell
                                        aspect={aspect}
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
                filteredItems={filteredAspects}
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
                    aspects={filteredAspects}
                    deleteAspectsBatch={deleteAspectsBatch}
                    setSelectedKeys={setSelectedKeys}
                    check={check}

                />
            )}
        </div>

    );
}
