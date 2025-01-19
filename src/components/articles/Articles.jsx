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
import CreateModal from "./CreateModal.jsx";
import Error from "../utils/Error.jsx";
import trash_icon from "../../assets/papelera-mas.png";

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
    addArticle,
    fetchArticlesByName,
    fetchArticlesByDescription
  } = useArticles();
  const { fetchLegalBasisById, error: legalBasisError } = useLegalBasis();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [filterByName, setFilterByName] = useState("");
  const [filterByDescription, setFilterByDescription] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const debounceTimeout = useRef(null);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [nameError, setNameError] = useState(null);
  const [descriptionError, setDescriptionError] = useState(null);
  const [orderError, setOrderError] = useState(null);
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
        await fetchArticles(id);
        const { success, data } = await fetchLegalBasisById(id);
        if (success && data) {
          setLegalBaseName(data.legal_name);
        } else {
          setLegalBaseName(null);
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
            await fetchArticlesByName(value);
            break;
            case "description":
            await fetchArticlesByDescription(value);
            break;
        }
        setIsSearching(false);
      }, 500);
    },
    [fetchArticlesByName, fetchArticlesByDescription]
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

  const handleFilterByAbbreviation = useCallback(
    (value) => {
      if (value.trim() === "") {
        handleClear();
        return;
      }
      setFilterByDescription(value);
      setFilterByName("");
      handleFilter("description", value);
    },
    [
      handleFilter,
      handleClear,
    ]
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

  const openModalDescription = useCallback((article) => {
    setSelectedArticle(article);
    setShowDescriptionModal(true);
  }, []);

  const closeModalDescription = useCallback(() => {
    setShowDescriptionModal(false);
    setSelectedArticle(null);
  }, []);

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

  const onPageChange = (newPage) => setPage(newPage);
  const onPreviousPage = () => setPage((prev) => Math.max(prev - 1, 1));
  const onNextPage = () => setPage((prev) => Math.min(prev + 1, totalPages));

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
  if (legalBasisError)
    return (
      <Error title={legalBasisError.title} message={legalBasisError.message} />
    );

  return (
    <div className="mt-24 mb-4 -ml-60 mr-4 lg:-ml-0 lg:mr-0 xl:-ml-0 xl:mr-0 flex justify-center items-center flex-wrap">
      <TopContent
        config={{
          legalBaseName: legalBaseName,
          onRowsPerPageChange: onRowsPerPageChange,
          totalArticles: articles.length,
          openModalCreate: openModalCreate,
          filterByName: filterByName,
          onFilterByName: handleFilterByName,
          filterByDescription: filterByDescription,
          onFilterByDescription: handleFilterByAbbreviation,
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
                        openEditModal={() => {}}
                        handleDelete={() => {}}
                        openModalDescription={openModalDescription}
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
      {selectedArticle && (
        <DescriptionModal
          isOpen={showDescriptionModal}
          onClose={closeModalDescription}
          title={selectedArticle.article_name}
          description={selectedArticle.description}
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
    </div>
  );
}
