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
import useLegalVerbs from "../../hooks/legalVerbs/useLegalVerbs.jsx";
import TopContent from "./TopContent";
import LegalVerbCell from "./LegalVerbCell.jsx"
import BottomContent from "../utils/BottomContent";
import DescriptionModal from "../legalVerbs/TextArea/DescriptionModal.jsx";
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
    { name: "Traducción", uid: "translation", align: "start" },
    { name: "Acciones", uid: "actions", align: "center" },
];

/**
 * Legal Verbs component
 *
 * This component provides an interface for managing legal Verbs, including features for listing,
 * pagination, and CRUD operations. Legal Verbs can be added, edited, or deleted, with appropriate
 * feedback displayed for each action.
 *
 * @returns {JSX.Element} Rendered legal verbs component, displaying the legal verb management interface with
 * filters, pagination, and modals for adding, editing, and deleting legal verbs.
 *
 */
export default function LegalVerbs() {
    const {
        legalVerbs,
        loading,
        error,
        addLegalVerb,
        fetchLegalVerbs,
        fetchLegalVerbsByName,
        fetchLegalVerbsByTranslation,
        fetchLegalVerbsByDescription,
        modifyLegalVerb,
        removeLegalVerb,
        removeLegalVerbsBatch,
    } = useLegalVerbs();
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [isFirstRender, setIsFirstRender] = useState(true);
    const [filterByName, setFilterByName] = useState("");
    const [filterByDescription, setFilterByDescription] = useState("");
    const [filterByTranslation, setFilterByTranslation] = useState("");
    const [showDescriptionModal, setShowDescriptionModal] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState(new Set());
    const [selectedLegalVerb, setSelectedLegalVerb] = useState(null);
    const [isDeletingBatch, setIsDeletingBatch] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const debounceTimeout = useRef(null);
    const [nameInputError, setNameInputError] = useState("");
    const [descriptionInputError, setDescriptionInputError] = useState("");
    const [translationInputError, setTranslationInputError] = useState("");
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        description: "",
        translation: ""
    });

    useEffect(() => {
        if (!loading && isFirstRender) {
            setIsFirstRender(false);
        }
    }, [loading, isFirstRender]);

    const handleClear = useCallback(() => {
        setFilterByName("");
        setFilterByDescription("");
        setFilterByTranslation("");
        fetchLegalVerbs();
    }, [fetchLegalVerbs]);

    const handleFilter = useCallback(
        (type, value) => {
            if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
            debounceTimeout.current = setTimeout(async () => {
                setPage(1);
                setIsSearching(true);
                switch (type) {
                    case "name":
                        await fetchLegalVerbsByName(value);
                        break;
                    case "description":
                        await fetchLegalVerbsByDescription(value);
                        break;
                    case "translation":
                        await fetchLegalVerbsByTranslation(value);
                        break;
                    default:
                        break;
                }
                setIsSearching(false);
            }, 500);
        },
        [
            fetchLegalVerbsByName,
            fetchLegalVerbsByTranslation,
            fetchLegalVerbsByDescription
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
            setFilterByTranslation("")
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
            setFilterByTranslation("")
            handleFilter("description", value);
        },
        [
            handleFilter,
            handleClear,
        ]
    );

    const handleFilterByTranslation = useCallback(
        (value) => {
            if (value.trim() === "") {
                handleClear();
                return;
            }
            setFilterByName("");
            setFilterByDescription("");
            setFilterByTranslation(value)
            handleFilter("translation", value);
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
            translation: ""
        });
        setIsCreateModalOpen(true);
    };

    const closeModalCreate = () => {
        setIsCreateModalOpen(false);
        setNameInputError("");
        setDescriptionInputError("");
        setTranslationInputError("");

    }

    const openEditModal = (legalVerb) => {
        setSelectedLegalVerb(legalVerb);
        setFormData(legalVerb);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedLegalVerb(null);
        setNameInputError("");
        setTranslationInputError("");
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

    const handleTranslationChange = useCallback(
        (e) => {
            const { value } = e.target;
            setFormData((prevFormData) => ({
                ...prevFormData,
                translation: value,
            }));
            if (translationInputError && value.trim() !== "") {
                setTranslationInputError(null);
            }
        },
        [translationInputError, setFormData, setTranslationInputError]
    );

    const totalPages = useMemo(
        () => Math.ceil(legalVerbs.length / rowsPerPage),
        [legalVerbs, rowsPerPage]
    );

    const onRowsPerPageChange = useCallback((e) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const openModalDescription = (legalVerb, field, title) => {
        setSelectedLegalVerb({
            title: title,
            description: legalVerb[field]
        });
        setShowDescriptionModal(true);
    };

    const closeModalDescription = () => {
        setShowDescriptionModal(false);
        setSelectedLegalVerb(null);
    };

    const openDeleteModal = () => setShowDeleteModal(true);
    const closeDeleteModal = () => setShowDeleteModal(false);
    const onPageChange = (newPage) => setPage(newPage);
    const onPreviousPage = () => setPage((prev) => Math.max(prev - 1, 1));
    const onNextPage = () => setPage((prev) => Math.min(prev + 1, totalPages));

    const handleDelete = useCallback(
        async (legalVerbId) => {
            const toastId = toast.loading("Eliminando verbo legal...", {
                icon: <Spinner size="sm" />,
                progressStyle: {
                    background: "#113c53",
                },
            });
            try {
                const { success, error } = await removeLegalVerb(legalVerbId);
                if (success) {
                    toast.update(toastId, {
                        render: "Verbo Legal eliminado con éxito",
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
                        "Algo mal sucedió al eliminar el verbo legal. Intente de nuevo.",
                    type: "error",
                    icon: null,
                    progressStyle: {},
                    isLoading: false,
                    autoClose: 5000,
                });
            }
        },
        [removeLegalVerb]
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
                    totalLegalVerbs: legalVerbs.length,
                    filterByName: filterByName,
                    onFilterByName: handleFilterByName,
                    filterByDescription: filterByDescription,
                    onFilterByDescription: handleFilterByDescription,
                    filterByTranslation: filterByTranslation,
                    onFilterByTranslation: handleFilterByTranslation,
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
                        aria-label="Verbos Legales"
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
                            items={legalVerbs.slice(
                                (page - 1) * rowsPerPage,
                                page * rowsPerPage
                            )}
                            emptyContent="No hay verbos legales para mostrar"
                        >
                            {(legalVerbs) => (
                                <TableRow key={legalVerbs.id}>
                                    {(columnKey) => (
                                        <TableCell>
                                            <LegalVerbCell
                                                legal_verbs={legalVerbs}
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
                        filteredItems: legalVerbs,
                    }}
                />
                {selectedLegalVerb && (
                    <DescriptionModal
                        isOpen={showDescriptionModal}
                        onClose={closeModalDescription}
                        title={selectedLegalVerb?.title || ""}
                        description={selectedLegalVerb?.description || ""}
                    />
                )}
                {isCreateModalOpen && (
                    <CreateModal
                        config={{
                            isOpen: isCreateModalOpen,
                            closeModalCreate: closeModalCreate,
                            formData: formData,
                            addLegalVerb: addLegalVerb,
                            nameError: nameInputError,
                            setNameError: setNameInputError,
                            handleNameChange: handleNameChange,
                            descriptionError: descriptionInputError,
                            setDescriptionError: setDescriptionInputError,
                            handleDescriptionChange: handleDescriptionChange,
                            translationError: translationInputError,
                            setTranslationError: setTranslationInputError,
                            handleTranslationChange: handleTranslationChange,
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
                            editLegalVerb: modifyLegalVerb,
                            selectedLegalVerb: selectedLegalVerb,
                            nameError: nameInputError,
                            setNameError: setNameInputError,
                            handleNameChange: handleNameChange,
                            descriptionError: descriptionInputError,
                            setDescriptionError: setDescriptionInputError,
                            handleDescriptionChange: handleDescriptionChange,
                            translationError: translationInputError,
                            setTranslationError: setTranslationInputError,
                            handleTranslationChange: handleTranslationChange,

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
                        legalVerbs: legalVerbs,
                        deleteLegalVerbsBatch: removeLegalVerbsBatch,
                        setSelectedKeys: setSelectedKeys,
                        check: check,
                    }}
                />
            )}
        </div>
    );
}
