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
} from "@nextui-org/react";
import useArticles from "../../hooks/articles/useArticles.jsx";
import useLegalBasis from "../../hooks/legalBasis/useLegalBasis.jsx";
import ArticleCell from "./ArticleCell.jsx";
import TopContent from "./TopContent.jsx";
import BottomContent from "../utils/BottomContent.jsx";
import DescriptionModal from "./DescriptionModal.jsx";
import DeleteModal from "./deleteModal.jsx";
import CreateModal from "./CreateModal.jsx";
import EditModal from "./EditModal.jsx";
import Error from "../utils/Error.jsx";
import trash_icon from "../../assets/papelera-mas.png";
import { toast } from "react-toastify";
import check from "../../assets/check.png";

const columns = [
  { name: "Orden", uid: "article_order", align: "start" },
  { name: "Articulo", uid: "article_name", align: "start" },
  { name: "Descripción", uid: "article_description", align: "center" },
  { name: "Acciones", uid: "actions", align: "center" },
];

/**
 * Articles component
 *
 * This component provides an interface for managing articles, including features for listing,
 * pagination, and CRUD operations. Articles can be added, edited, or deleted, with appropriate
 * feedback displayed for each action.
 *
 * @component
 * @returns {JSX.Element} Rendered Articles component, displaying the article management interface with
 * filters, pagination, and modals for adding, editing, and deleting articles.
 */
export default function Articles() {
  const { id } = useParams();
  const [legalBaseName, setLegalBaseName] = useState(null);
  const {
    articles,
    loading,
    error,
    fetchArticles,
    modifyArticle,
    removeArticle,
    deleteArticlesBatch,
    addArticle,
    fetchArticlesByName,
    fetchArticlesByDescription,
  } = useArticles();
  const { fetchLegalBasisById } = useLegalBasis();
  const [legalBasisError, setLegalBasisError] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [selectArticle, setSelectArticle] = useState(null);
  const [filterByName, setFilterByName] = useState("");
  const [filterByDescription, setFilterByDescription] = useState("");
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [IsSearching, setIsSearching] = useState(false);
  const debounceTimeout = useRef(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [nameError, setNameError] = useState(null);
  const [descriptionError, setDescriptionError] = useState(null);
  const [orderError, setOrderError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeletingBatch, setIsDeletingBatch] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    legalBaseId: "",
    name: "",
    description: "",
    order: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const { success, data, error } = await fetchLegalBasisById(id);
        await fetchArticles(id);
        if (success && data) {
          setLegalBaseName(data.legal_name);
          setLegalBasisError(null);
        } else {
          setLegalBaseName(null);
          setLegalBasisError(error);
        }
      }
    };
    fetchData();
  }, [id, fetchArticles, fetchLegalBasisById]);

  useEffect(() => {
    if (!loading && isFirstRender) {
      setIsFirstRender(false);
    }
  }, [loading, isFirstRender]);

  const handleClear = useCallback(() => {
    setFilterByName("");
    setFilterByDescription("");
    fetchArticles(id);
  }, [fetchArticles, id]);

  const handleFilter = useCallback(
    (field, value) => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
      debounceTimeout.current = setTimeout(async () => {
        setPage(1);
        setIsSearching(true);
        switch (field) {
          case "name":
            await fetchArticlesByName(id, value);
            break;
          case "description":
            await fetchArticlesByDescription(id, value);
            break;
        }
        setIsSearching(false);
      }, 500);
    },
    [fetchArticlesByName, fetchArticlesByDescription, id]
  );

  const handleFilterByName = useCallback(
    (value) => {
      if (value.trim() === "") {
        handleClear();
        return;
      }
      setFilterByName(value);
      setFilterByDescription("");
      handleFilter("name", value);
    },
    [handleFilter, handleClear]
  );

  const handleFilterByDescription = useCallback(
    (value) => {
      if (value.trim() === "") {
        handleClear();
        return;
      }
      setFilterByDescription(value);
      setFilterByName("");
      handleFilter("description", value);
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

  const handleDescriptionChange = (e) => {
    const { value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      description: value,
    }));
    if (descriptionError && value.trim() !== "") {
      setDescriptionError(null);
    }
  };

  const handleClearDescription = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      description: "",
    }));
    if (descriptionError) {
      setDescriptionError(null);
    }
  };

  const handleOrderChange = (e) => {
    const { value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      order: value,
    }));
    if (orderError && value.trim() !== "") {
      setOrderError(null);
    }
  };

  const totalPages = useMemo(
    () => Math.ceil(articles.length / rowsPerPage),
    [articles, rowsPerPage]
  );

  const onRowsPerPageChange = useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const openModalDescription = (article) => {
    setSelectArticle(article);
    setShowDescriptionModal(true);
  };

  const closeModalDescription = () => {
    setShowDescriptionModal(false);
    setSelectArticle(null);
  };

  const openModalCreate = () => {
    setFormData({
      id: "",
      legalBaseId: id,
      name: "",
      description: "",
      order: "",
    });
    setIsCreateModalOpen(true);
  };

  const closeModalCreate = () => {
    setIsCreateModalOpen(false);
    setNameError(null);
    setDescriptionError(null);
    setOrderError(null);
  };

  const openEditModal = (article) => {
    setSelectedArticle(article);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedArticle(null);
    setNameError(null);
  };

  const openDeleteModal = () => setShowDeleteModal(true);
  const closeDeleteModal = () => setShowDeleteModal(false);
  const onPageChange = (newPage) => setPage(newPage);
  const onPreviousPage = () => setPage((prev) => Math.max(prev - 1, 1));
  const onNextPage = () => setPage((prev) => Math.min(prev + 1, totalPages));

  const handleDelete = useCallback(
    async (articleId) => {
      const toastId = toast.loading("Eliminando artículo...", {
        icon: <Spinner size="sm" />,
        progressStyle: {
          background: "#113c53",
        },
      });
      try {
        const { success, error } = await removeArticle(articleId);
        if (success) {
          toast.update(toastId, {
            render: "Artículo eliminado con éxito",
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
          render: "Algo salió mal al eliminar el artículo. Intente de nuevo.",
          type: "error",
          icon: null,
          progressStyle: {},
          isLoading: false,
          autoClose: 5000,
        });
      }
    },
    [removeArticle]
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
      {legalBasisError ? (
        <Error
          title={legalBasisError.title}
          message={legalBasisError.message}
        />
      ) : (
        <>
          <TopContent
            config={{
              legalBaseName: legalBaseName,
              onRowsPerPageChange: onRowsPerPageChange,
              totalArticles: articles.length,
              openModalCreate: openModalCreate,
              filterByName: filterByName,
              onFilterByName: handleFilterByName,
              filterByDescription: filterByDescription,
              onFilterByDescription: handleFilterByDescription,
              onClear: handleClear,
            }}
          />
          {IsSearching || loading ? (
            <div
              role="status"
              className="flex justify-center items-center w-full h-40"
            >
              <Spinner className="h-10 w-10" color="secondary" />
            </div>
          ) : (
            <Table
              aria-label="Tabla de Articulos"
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
                items={articles.slice(
                  (page - 1) * rowsPerPage,
                  page * rowsPerPage
                )}
                emptyContent="No hay articulos para mostrar"
              >
                {(article) => (
                  <TableRow key={article.id}>
                    {(columnKey) => (
                      <TableCell>
                        <ArticleCell
                          article={article}
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
              filteredItems: articles,
            }}
          />
          {selectArticle && (
            <DescriptionModal
              isOpen={showDescriptionModal}
              onClose={closeModalDescription}
              title={selectArticle.article_name}
              description={selectArticle.description}
            />
          )}
          {isCreateModalOpen && (
            <CreateModal
              config={{
                isOpen: isCreateModalOpen,
                closeModalCreate: closeModalCreate,
                addArticle: addArticle,
                formData: formData,
                nameError: nameError,
                setNameError: setNameError,
                descriptionError: descriptionError,
                setDescriptionError: setDescriptionError,
                orderError: orderError,
                setOrderError: setOrderError,
                handleNameChange: handleNameChange,
                handleDescriptionChange: handleDescriptionChange,
                clearDescription: handleClearDescription,
                handleOrderChange: handleOrderChange,
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
                selectedArticle: selectedArticle,
                updateArticle: modifyArticle,
                nameError: nameError,
                setNameError: setNameError,
                descriptionError: descriptionError,
                setDescriptionError: setDescriptionError,
                orderError: orderError,
                setOrderError: setOrderError,
                handleNameChange: handleNameChange,
                handleDescriptionChange: handleDescriptionChange,
                clearDescription: handleClearDescription,
                handleOrderChange: handleOrderChange,
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
                articles: articles,
                deleteArticlesBatch: deleteArticlesBatch,
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
