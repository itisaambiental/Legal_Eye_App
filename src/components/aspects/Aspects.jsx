import { useCallback, useState, useMemo, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
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
} from "@heroui/react";
import useAspects from "../../hooks/aspect/useAspects.jsx";
import useSubjects from "../../hooks/subject/useSubjects.jsx";
import TopContent from "./TopContent.jsx";
import DeleteModal from "./deleteModal.jsx";
import BottomContent from "../utils/BottomContent.jsx";
import Error from "../utils/Error.jsx";
import AspectCell from "./AspectsCell.jsx";
import trash_icon from "../../assets/papelera-mas.png";
import CreateModal from "./CreateModal.jsx";
import check from "../../assets/check.png";
import { toast } from "react-toastify";
import EditModal from "./EditModal.jsx";

const columns = [
  { name: "Orden", uid: "aspect_order", align: "start" },
  { name: "Aspecto", uid: "aspect_name", align: "start" },
  { name: "Abreviatura", uid: "aspect_abbreviation", align: "start" },
  { name: "Acciones", uid: "actions", align: "center" },
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
  const {
    aspects,
    loading,
    error,
    fetchAspects,
    addAspect,
    fetchAspectsByName,
    modifyAspect,
    removeAspect,
    deleteAspectsBatch,
  } = useAspects();
  const { fetchSubjectById } = useSubjects();
  const [subjectError, setSubjectError] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const [filterByName, setFilterByName] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const debounceTimeout = useRef(null);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAspect, setSelectedAspect] = useState(null);
  const [nameError, setNameError] = useState(null);
  const [orderError, setOrderError] = useState(null);
  const [abbreviationError, setAbbreviationError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeletingBatch, setIsDeletingBatch] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    order: "",
    abbreviation: "",
    subject_id: id,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const { success, data, error } = await fetchSubjectById(id);
        await fetchAspects(id);
        if (success && data) {
          setSubjectName(data.subject_name);
          setSubjectError(null);
        } else {
          setSubjectName(null);
          setSubjectError(error)
        }
      }
    };
    fetchData();
  }, [id, fetchAspects, fetchSubjectById]);

  useEffect(() => {
    if (!loading && isFirstRender) {
      setIsFirstRender(false);
    }
  }, [loading, isFirstRender]);

  const handleClear = useCallback(() => {
    setFilterByName("");
    fetchAspects(id);
  }, [fetchAspects, id]);

  const handleFilter = useCallback(
    (field, value) => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
      debounceTimeout.current = setTimeout(async () => {
        setPage(1);
        setIsSearching(true);
        switch (field) {
          case "name":
            await fetchAspectsByName(id, value);
            break;
        }
        setIsSearching(false);
      }, 500);
    },
    [fetchAspectsByName, id]
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

  const handleOrderChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      order: value,
    }));
    if (orderError && value.trim() !== "") {
      setOrderError(null);
    }
  };

  const handleAbbreviationChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      abbreviation: value,
    }));
    if (abbreviationError && value.trim() !== "") {
      setAbbreviationError(null);
    }
  };

  const openModalCreate = () => {
    setFormData({
      id: "",
      name: "",
      order: "",
      abbreviation: "",
      subject_id: id,
    });
    setIsCreateModalOpen(true);
  };

  const closeModalCreate = () => {
    setIsCreateModalOpen(false);
    setNameError(null);
    setOrderError(null);
    setAbbreviationError(null);
  };

  const openEditModal = (aspect) => {
    setSelectedAspect(aspect);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedAspect(null);
    setNameError(null);
    setOrderError(null);
    setAbbreviationError(null);
  };

  const totalPages = useMemo(
    () => Math.ceil(aspects.length / rowsPerPage),
    [aspects, rowsPerPage]
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
    async (aspectId) => {
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
    },
    [removeAspect]
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
      {subjectError ? (
        <Error
          title={subjectError.title}
          message={subjectError.message}
        />
      ) : (
        <>
          <TopContent
            config={{
              subjectName: subjectName,
              onRowsPerPageChange: onRowsPerPageChange,
              totalAspects: aspects.length,
              openModalCreate: openModalCreate,
              onFilterByName: handleFilterByName,
              filterByName: filterByName,
              onClear: handleClear,
            }}
          />
          <>
            {isSearching || loading ? (
              <div
                role="status"
                className="flex justify-center items-center w-full h-40"
              >
                <Spinner className="h-10 w-10" color="secondary" />
              </div>
            ) : (
              <Table
                aria-label="Tabla de Aspectos"
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
                  items={aspects.slice(
                    (page - 1) * rowsPerPage,
                    page * rowsPerPage
                  )}
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
              filteredItems: aspects,
            }}
          />
          {isCreateModalOpen && (
            <CreateModal
              config={{
                isOpen: isCreateModalOpen,
                closeModalCreate: closeModalCreate,
                addAspect: addAspect,
                formData: formData,
                nameError: nameError,
                setNameError: setNameError,
                orderError: orderError,
                setOrderError: setOrderError,
                handleOrderChange: handleOrderChange,
                abbreviationError: abbreviationError,
                setAbbreviationError: setAbbreviationError,
                handleAbbreviationChange: handleAbbreviationChange,
                handleNameChange: handleNameChange,
              }}
            />
          )}
          {isEditModalOpen && (
            <EditModal
              config={{
                formData: formData,
                setFormData: setFormData,
                selectedAspect: selectedAspect,
                closeModalEdit: closeEditModal,
                isOpen: isEditModalOpen,
                updateAspect: modifyAspect,
                nameError: nameError,
                setNameError: setNameError,
                orderError: orderError,
                setOrderError: setOrderError,
                handleOrderChange: handleOrderChange,
                abbreviationError: abbreviationError,
                setAbbreviationError: setAbbreviationError,
                handleAbbreviationChange: handleAbbreviationChange,
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
                aspects: aspects,
                deleteAspectsBatch: deleteAspectsBatch,
                setSelectedKeys: setSelectedKeys,
                check: check,
              }}
            />
          )}
        </>
      )}
    </div>
  );
}
