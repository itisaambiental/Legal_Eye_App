import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Button,
  Tooltip,
} from "@heroui/react";
import useRequirementTypes from "../../hooks/requirementTypes/useRequirementTypes";
import TopContent from "./TopContent";
import RequirementTypeCell from "./RequirementTypeCell";
import BottomContent from "../utils/BottomContent";
import DescriptionModal from "./TextArea/DescriptionModal";
import Error from "../utils/Error";
import CreateModal from "./CreateModal";
import EditModal from "./EditModal";
import DeleteModal from "./DeleteModal";
import { toast } from "react-toastify";
import check from "../../assets/check.png";
import trashIcon from "../../assets/papelera-mas.png";

const columns = [
  { name: "Nombre", uid: "name", align: "start" },
  { name: "Descripción", uid: "description", align: "start" },
  { name: "Clasificación", uid: "classification", align: "start" },
  { name: "Acciones", uid: "actions", align: "center" },
];

/**
 * Requirements Types component
 *
 * This component provides an interface for managing requirements Types, including features for listing,
 * pagination, and CRUD operations. Requirements types can be added, edited, or deleted, with appropriate
 * feedback displayed for each action.
 *
 * @returns {JSX.Element} Rendered requirements types component, displaying the requirement type management interface with
 * filters, pagination, and modals for adding, editing, and deleting requirements types.
 *
 */
export default function RequirementTypes() {
  const {
    requirementTypes,
    loading,
    error,
    addRequirementType,
    fetchRequirementTypes,
    fetchRequirementTypesByName,
    fetchRequirementTypesByClassification,
    fetchRequirementTypesByDescription,
    modifyRequirementType,
    removeRequirementType,
    removeRequirementTypesBatch,
  } = useRequirementTypes();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [filterByName, setFilterByName] = useState("");
  const [filterByDescription, setFilterByDescription] = useState("");
  const [filterByClassification, setFilterByClassification] = useState("");
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const [selectedRequirementType, setSelectedRequirementType] = useState(null);
  const [isDeletingBatch, setIsDeletingBatch] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const debounceTimeout = useRef(null);
  const [nameInputError, setNameInputError] = useState("");
  const [descriptionInputError, setDescriptionInputError] = useState("");
  const [classificationInputError, setClassificationInputError] = useState("");
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    classification: ""
  });

  useEffect(() => {
    if (!loading && isFirstRender) {
      setIsFirstRender(false);
    }
  }, [loading, isFirstRender]);

  const handleClear = useCallback(() => {
    setFilterByName("");
    setFilterByDescription("");
    setFilterByClassification("");
    fetchRequirementTypes();
  }, [fetchRequirementTypes]);

  const handleFilter = useCallback(
    (type, value) => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
      debounceTimeout.current = setTimeout(async () => {
        setPage(1);
        setIsSearching(true);
        switch (type) {
          case "name":
            await fetchRequirementTypesByName(value);
            break;
          case "description":
            await fetchRequirementTypesByDescription(value);
            break;
          case "classification":
            await fetchRequirementTypesByClassification(value);
            break;
          default:
            break;
        }
        setIsSearching(false);
      }, 500);
    },
    [
      fetchRequirementTypesByName,
      fetchRequirementTypesByClassification,
      fetchRequirementTypesByDescription
    ]
  );


  const handleFilterByName = useCallback(
    (value) => {
      if (value.trim() === "") {
        handleClear();
        return;
      }
      setFilterByDescription("");
      setFilterByName(value);
      setFilterByClassification("")
      handleFilter("name", value);
    },
    [
      handleFilter,
      handleClear,
    ]
  );

  const handleFilterByDescription = useCallback(
    (value) => {
      if (value.trim() === "") {
        handleClear();
        return;
      }
      setFilterByName("");
      setFilterByDescription(value);
      setFilterByClassification("")
      handleFilter("description", value);
    },
    [
      handleFilter,
      handleClear,
    ]
  );

  const handleFilterByClassification = useCallback(
    (value) => {
      if (value.trim() === "") {
        handleClear();
        return;
      }
      setFilterByName("");
      setFilterByDescription("");
      setFilterByClassification(value)
      handleFilter("classification", value);
    },
    [
      handleFilter,
      handleClear,
    ]
  );

  const openModalCreate = () => {
    setFormData({
      id: "",
      name: "",
      description: "",
      classification: ""
    });
    setIsCreateModalOpen(true);
  };

  const closeModalCreate = () => {
    setIsCreateModalOpen(false);
    setNameInputError("");
    setDescriptionInputError("");
    setClassificationInputError("");

  }

  const openEditModal = (requirementType) => {
    setSelectedRequirementType(requirementType);
    setFormData(requirementType);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedRequirementType(null);
    setNameInputError("");
    setClassificationInputError("");
    setDescriptionInputError("");
  }

  const handleNameChange = useCallback(
    (e) => {
      const { value } = e.target;
      setFormData((prevFormData) => ({
        ...prevFormData,
        name: value,
      }));
      if (nameInputError && value.trim() !== "") {
        setNameInputError(null);
      }
    },
    [nameInputError, setFormData, setNameInputError]
  );

  const handleDescriptionChange = useCallback(
    (e) => {
      const { value } = e.target;
      setFormData((prevFormData) => ({
        ...prevFormData,
        description: value,
      }));
      if (descriptionInputError && value.trim() !== "") {
        setDescriptionInputError(null);
      }
    },
    [descriptionInputError, setFormData, setDescriptionInputError]
  );

  const handleClassificationChange = useCallback(
    (e) => {
      const { value } = e.target;
      setFormData((prevFormData) => ({
        ...prevFormData,
        classification: value,
      }));
      if (classificationInputError && value.trim() !== "") {
        setClassificationInputError(null);
      }
    },
    [classificationInputError, setFormData, setClassificationInputError]
  );

  const totalPages = useMemo(
    () => Math.ceil(requirementTypes.length / rowsPerPage),
    [requirementTypes, rowsPerPage]
  );

  const onRowsPerPageChange = useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const openModalDescription = (requirement, field, title) => {
    setSelectedRequirementType({
      title: title,
      description: requirement[field]
    });
    setShowDescriptionModal(true);
  };

  const closeModalDescription = () => {
    setShowDescriptionModal(false);
    setSelectedRequirementType(null);
  };

  const openDeleteModal = () => setShowDeleteModal(true);
  const closeDeleteModal = () => setShowDeleteModal(false);
  const onPageChange = (newPage) => setPage(newPage);
  const onPreviousPage = () => setPage((prev) => Math.max(prev - 1, 1));
  const onNextPage = () => setPage((prev) => Math.min(prev + 1, totalPages));

  const handleDelete = useCallback(
    async (requirementTypeId) => {
      const toastId = toast.loading("Eliminando tipo de requerimiento...", {
        icon: <Spinner size="sm" />,
        progressStyle: {
          background: "#113c53",
        },
      });
      try {
        const { success, error } = await removeRequirementType(requirementTypeId);
        if (success) {
          toast.update(toastId, {
            render: "Tipo de Requerimiento eliminado con éxito",
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
          render:
            "Algo mal sucedió al eliminar el tipo requerimiento. Intente de nuevo.",
          type: "error",
          icon: null,
          progressStyle: {},
          isLoading: false,
          autoClose: 5000,
        });
      }
    },
    [removeRequirementType]
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
          isCreateModalOpen: isCreateModalOpen,
          isEditModalOpen: isEditModalOpen,
          openModalCreate: openModalCreate,
          onRowsPerPageChange: onRowsPerPageChange,
          totalRequirementTypes: requirementTypes.length,
          filterByName: filterByName,
          onFilterByName: handleFilterByName,
          filterByDescription: filterByDescription,
          onFilterByDescription: handleFilterByDescription,
          filterByClassification: filterByClassification,
          onFilterByClassification: handleFilterByClassification,
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
            aria-label="Tipos de requerimientos"
            selectionMode="multiple"
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
            color="primary"
          >
            <TableHeader columns={columns}>
              {(col) => (
                <TableColumn key={col.uid} align={col.align || "start"}>
                  {col.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody
              items={requirementTypes.slice(
                (page - 1) * rowsPerPage,
                page * rowsPerPage
              )}
              emptyContent="No hay tipos de requerimientos para mostrar"
            >
              {(requirementTypes) => (
                <TableRow key={requirementTypes.id}>
                  {(columnKey) => (
                    <TableCell>
                      <RequirementTypeCell
                        requirement_type={requirementTypes}
                        columnKey={columnKey}
                        openEditModal={openEditModal}
                        handleDelete={handleDelete}
                        openModalDescription={openModalDescription}
                      />
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
        <div className="relative w-full">
          {(selectedKeys.size > 0 || selectedKeys === "all") && (
            <>
              <Tooltip content="Eliminar" size="sm">
                <Button
                  isIconOnly
                  size="sm"
                  className="absolute left-0 bottom-0 ml-5 bg-primary transform translate-y-32 sm:translate-y-24 md:translate-y-24 lg:translate-y-24 xl:translate-y-10"
                  aria-label="Eliminar seleccionados"
                  onPress={openDeleteModal}
                >
                  <img src={trashIcon} alt="delete" className="w-5 h-5" />
                </Button>
              </Tooltip>
            </>
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
            filteredItems: requirementTypes,
          }}
        />
        {selectedRequirementType && (
          <DescriptionModal
            isOpen={showDescriptionModal}
            onClose={closeModalDescription}
            title={selectedRequirementType?.title || ""}
            description={selectedRequirementType?.description || ""}
          />
        )}
        {isCreateModalOpen && (
          <CreateModal
            config={{
              isOpen: isCreateModalOpen,
              closeModalCreate: closeModalCreate,
              formData: formData,
              addRequirementType: addRequirementType,
              nameError: nameInputError,
              setNameError: setNameInputError,
              handleNameChange: handleNameChange,
              descriptionError: descriptionInputError,
              setDescriptionError: setDescriptionInputError,
              handleDescriptionChange: handleDescriptionChange,
              classificationError: classificationInputError,
              setClassificationError: setClassificationInputError,
              handleClassificationChange: handleClassificationChange,
            }}
          />
        )}
        {isEditModalOpen && (
          <EditModal
            config={{
              isOpen: isEditModalOpen,
              closeModalEdit: closeEditModal,
              formData: formData,
              setFormData: setFormData,
              editRequirementType: modifyRequirementType,
              selectedRequirementType: selectedRequirementType,
              nameError: nameInputError,
              setNameError: setNameInputError,
              handleNameChange: handleNameChange,
              descriptionError: descriptionInputError,
              setDescriptionError: setDescriptionInputError,
              handleDescriptionChange: handleDescriptionChange,
              classificationError: classificationInputError,
              setClassificationError: setClassificationInputError,
              handleClassificationChange: handleClassificationChange,

            }} />
        )}
      </>
      {showDeleteModal && (
        <DeleteModal
          config={{
            showDeleteModal: showDeleteModal,
            closeDeleteModal: closeDeleteModal,
            setIsDeletingBatch: setIsDeletingBatch,
            isDeletingBatch: isDeletingBatch,
            selectedKeys: selectedKeys,
            requirementTypes: requirementTypes,
            deleteRequirementTypesBatch: removeRequirementTypesBatch,
            setSelectedKeys: setSelectedKeys,
            check: check,
          }}
        />
      )}
    </div>
  );
}
