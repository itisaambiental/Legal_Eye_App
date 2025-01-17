import { useCallback, useState, useMemo, useRef, useEffect } from "react";
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
import useSubjects from "../../hooks/subject/useSubjects.jsx";
import TopContent from "./TopContent.jsx";
import DeleteModal from "./deleteModal.jsx";
import BottomContent from "../utils/BottomContent.jsx";
import Error from "../utils/Error.jsx";
import SubjectCell from "./SubjectCell.jsx";
import trash_icon from "../../assets/papelera-mas.png";
import CreateModal from "./CreateModal.jsx";
import check from "../../assets/check.png";
import { toast } from "react-toastify";
import EditModal from "./EditModal.jsx";
import { useNavigate } from "react-router-dom";

const columns = [
  { name: "Materia", uid: "subject_name", align: "start" },
  { name: "Acciones", uid: "actions", align: "center" },
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
  const {
    subjects,
    loading,
    error,
    addSubject,
    fetchSubjects,
    fetchSubjectsByName,
    modifySubject,
    removeSubject,
    deleteSubjectsBatch,
  } = useSubjects();
  const navigate = useNavigate();
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [filterByName, setFilterByName] = useState("");
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [IsSearching, setIsSearching] = useState(false);
  const debounceTimeout = useRef(null);
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [nameError, setNameError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeletingBatch, setIsDeletingBatch] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
  });

  useEffect(() => {
    if (!loading && isFirstRender) {
      setIsFirstRender(false);
    }
  }, [loading, isFirstRender]);

  const handleClear = useCallback(() => {
    setFilterByName("");
    fetchSubjects();
  }, [fetchSubjects]);

  const handleFilter = useCallback(
    (field, value) => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
      debounceTimeout.current = setTimeout(async () => {
        setPage(1);
        setIsSearching(true);
        switch (field) {
          case "name":
            await fetchSubjectsByName(value);
            break;
        }
        setIsSearching(false);
      }, 500);
    },
    [fetchSubjectsByName]
  );

  const handleFilterByName = useCallback(
    (value) => {
      if (value.trim() === "") {
        handleClear();
        return;
      }
      setFilterByName(value);
      handleFilter("name", value);
    },
    [handleFilter, handleClear]
  );

  const handleNameChange = (e) => {
    const { value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      name: value,
    }));
    if (nameError && value.trim() !== "") {
      setNameError(null);
    }
  };

  const openModalCreate = () => {
    setFormData({
      id: "",
      name: "",
    });
    setIsCreateModalOpen(true);
  };

  const closeModalCreate = () => {
    setIsCreateModalOpen(false);
    setNameError(null);
  };

  const openEditModal = (subject) => {
    setSelectedSubject(subject);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedSubject(null);
    setNameError(null);
  };

  const goToAspects = (subjectId) => {
    navigate(`/subjects/${subjectId}/aspects`);
  };

  const totalPages = useMemo(
    () => Math.ceil(subjects.length / rowsPerPage),
    [subjects, rowsPerPage]
  );

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
    async (subjectId) => {
      const toastId = toast.loading("Eliminando materia...", {
        icon: <Spinner size="sm" />,
        progressStyle: {
          background: "#113c53",
        },
      });
      try {
        const { success, error } = await removeSubject(subjectId);
        if (success) {
          toast.update(toastId, {
            render: "Materia eliminada con éxito",
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
          render: "Algo salió mal al eliminar la materia. Intente de nuevo.",
          type: "error",
          icon: null,
          progressStyle: {},
          isLoading: false,
          autoClose: 5000,
        });
      }
    },
    [removeSubject]
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
  return (
    <div className="mt-24 mb-4 -ml-60 mr-4 lg:-ml-0 lg:mr-0 xl:-ml-0 xl:mr-0 flex justify-center items-center flex-wrap">
      <TopContent
        config={{
          onRowsPerPageChange: onRowsPerPageChange,
          totalSubjects: subjects.length,
          openModalCreate: openModalCreate,
          onFilterByName: handleFilterByName,
          filterByName: filterByName,
          onClear: handleClear,
        }}
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
            aria-label="Tabla de Materias"
            selectionMode="multiple"
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
            color="primary"
          >
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn key={column.uid} align={column.align}>
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody
              items={subjects.slice(
                (page - 1) * rowsPerPage,
                page * rowsPerPage
              )}
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
        config={{
          page: page,
          totalPages: totalPages,
          onPageChange: onPageChange,
          onPreviousPage: onPreviousPage,
          onNextPage: onNextPage,
          selectedKeys: selectedKeys,
          filteredItems: subjects,
        }}
      />
      {isCreateModalOpen && (
        <CreateModal
          config={{
            isOpen: isCreateModalOpen,
            closeModalCreate: closeModalCreate,
            addSubject: addSubject,
            formData: formData,
            nameError: nameError,
            setNameError: setNameError,
            handleNameChange: handleNameChange,
          }}
        />
      )}
      {isEditModalOpen && (
        <EditModal
          config={{
            formData: formData,
            setFormData: setFormData,
            isOpen: isEditModalOpen,
            updateSubject: modifySubject,
            closeModalEdit: closeEditModal,
            selectedSubject: selectedSubject,
            nameError: nameError,
            setNameError: setNameError,
            handleNameChange: handleNameChange,
          }}
        />
      )}
      {showDeleteModal && (
        <DeleteModal
          config={{
            showDeleteModal: showDeleteModal,
            closeDeleteModal: closeDeleteModal,
            setIsDeletingBatch: setIsDeletingBatch,
            isDeletingBatch: isDeletingBatch,
            selectedKeys: selectedKeys,
            subjects: subjects,
            deleteSubjectsBatch: deleteSubjectsBatch,
            setSelectedKeys: setSelectedKeys,
            check: check,
          }}
        />
      )}
    </div>
  );
}
