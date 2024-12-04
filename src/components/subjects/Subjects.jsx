import { useCallback, useState, useMemo } from "react";
import { Tooltip, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Button } from "@nextui-org/react";
import useSubjects from "../../hooks/subject/useSubjects.jsx";
import TopContent from "./TopContent.jsx";
import DeleteModal from "./deleteModal.jsx";
import BottomContent from "./BottomContent.jsx";
import Error from "../utils/Error.jsx";
import SubjectCell from "./SubjectCell.jsx";
import trash_icon from "../../assets/papelera-mas.png";
import CreateModal from "./CreateModal.jsx";
import check from "../../assets/check.png"
import { toast } from "react-toastify";
import EditModal from "./EditModal.jsx";
import { useNavigate } from "react-router-dom";

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
    const { subjects, loading, error, addSubject, modifySubject, removeSubject, deleteSubjectsBatch } = useSubjects();
    const navigate = useNavigate();
    const [filterValue, setFilterValue] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(1);
    const [selectedKeys, setSelectedKeys] = useState(new Set());
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [nameError, setNameError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeletingBatch, setIsDeletingBatch] = useState(false);
    const [formData, setFormData] = useState({
        id: '',
        nombre: '',
    });
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
        });
        setIsCreateModalOpen(true)
    }

    const closeModalCreate = () => {
        setIsCreateModalOpen(false)
        setNameError(null)
    }

    const openEditModal = (subject) => {
        setSelectedSubject(subject);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedSubject(null);
        setNameError(null)
    };

    const goToAspects = (subjectId) => { 
        navigate(`/subjects/${subjectId}/aspects`);
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

 

    const handleDelete = useCallback(async (subjectId) => {
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
                toast.error(error)
            }
        } catch (error) {
            console.error(error);
            toast.error('Algo salió mal al eliminar la materia. Intente de nuevo');
        }
    }, [removeSubject]);

    if (loading) {
        return (
            <div role="status" className="fixed inset-0 flex items-center justify-center">
                <Spinner className="h-10 w-10 transform translate-x-0 lg:translate-x-28 xl:translate-x-32" color="secondary" />
            </div>
        );
    }

    if (error) {
        return <Error title={error.title} message={error.message} />;
    }
    return (
        <div className="mt-24 mb-4 -ml-60 mr-4 lg:-ml-0 lg:mr-0 xl:-ml-0 xl:mr-0 flex justify-center items-center flex-wrap">
            <TopContent
                onRowsPerPageChange={onRowsPerPageChange}
                totalSubjects={filteredSubjects.length}
                openModalCreate={openModalCreate}
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
                                <TableCell>
                                    <SubjectCell
                                        subject={subject}
                                        columnKey={columnKey}
                                        goToAspects={goToAspects}
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
                            className="absolute left-0 bottom-0 ml-5 bg-primary transform translate-y-24 md:translate-y-10 lg:translate-y-10 xl:translate-y-10"
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
                filteredItems={subjects}
            />
            {isCreateModalOpen && (
                <CreateModal
                    closeModalCreate={closeModalCreate}
                    isOpen={isCreateModalOpen}
                    addSubject={addSubject}
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
                    selectedSubject={selectedSubject}
                    closeModalEdit={closeEditModal}
                    isOpen={isEditModalOpen}
                    updateSubject={modifySubject}
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
                    subjects={subjects}
                    deleteSubjectsBatch={deleteSubjectsBatch}
                    setShowDeleteModal={setShowDeleteModal}
                    setSelectedKeys={setSelectedKeys}
                    check={check}

                />
            )}
        </div>

    );
}
