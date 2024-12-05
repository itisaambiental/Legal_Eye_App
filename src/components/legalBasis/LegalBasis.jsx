import { useCallback, useState, useMemo, useRef, useEffect } from "react";
import { Tooltip, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Button } from "@nextui-org/react";
import useLegalBasis from "../../hooks/legalBasis/useLegalBasis.jsx";
import useSubjects from "../../hooks/subject/useSubjects.jsx";
import useAspects from "../../hooks/aspect/useAspects.jsx";
import TopContent from "./TopContent.jsx";
import LegalBasisCell from "./LegalBasisCell.jsx";
// import DeleteModal from "./deleteModal.jsx";
import BottomContent from "./BottomContent.jsx";
import Error from "../utils/Error.jsx";
// import trash_icon from "../../assets/papelera-mas.png";
// // import CreateModal from "./CreateModal.jsx";
// import check from "../../assets/check.png"
// import { toast } from "react-toastify";
// import EditModal from "./EditModal.jsx";

const columns = [
    { name: "Fundamento Legal", uid: "legal_name" },
    { name: "Materia", uid: "subject" },
    { name: "Aspectos", uid: "aspects" },
    { name: "Abreviatura", uid: "abbreviation" },
    { name: "Clasificación", uid: "classification" },
    { name: "Jurisdicción", uid: "jurisdiction" },
    { name: "Estado", uid: "state" },
    { name: "Municipio", uid: "municipality" },
    { name: "Última Reforma", uid: "lastReform" },
    { name: "Acciones", uid: "actions" }
];
/**
 * Legal Basis component
 * 
 * This component provides a legal basis management interface, including features for listing, filtering, 
 * pagination, role-based filtering, and CRUD operations. Legal Basis can be added, edited, or deleted, 
 * with appropriate feedback displayed for each action.
 * 
 * @returns {JSX.Element} Rendered Legal Basis component, displaying the legal basis management interface with 
 * filters, pagination, and modals for adding, editing, and deleting legal basis.
 * 
 */
export default function LegalBasis() {
    const {
        legalBasis,
        loading,
        error,
        addLegalBasis,
        fetchLegalBasis,
        fetchLegalBasisByName,
        fetchLegalBasisByAbbreviation,
        fetchLegalBasisByClassification,
        fetchLegalBasisByJurisdiction,
        fetchLegalBasisByState,
        fetchLegalBasisBySubject,
        fetchLegalBasisBySubjectAndAspects

    } = useLegalBasis();
    const { subjects, error: subjectLoading, error: subjectError } = useSubjects()
    const { aspects, loading: aspectLoading, error: aspectError, clearAspects, fetchAspects } = useAspects()
    const [filterByName, setFilterByName] = useState("");
    const [filterByAbbreviation, setFilterByAbbreviation] = useState("");
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedAspects, setSelectedAspects] = useState([]);
    const [isFirstRender, setIsFirstRender] = useState(true);
    const [IsSearching, setIsSearching] = useState(false);
    const debounceTimeout = useRef(null);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [selectedKeys, setSelectedKeys] = useState(new Set());

    useEffect(() => {
        if (!loading && isFirstRender) {
            setIsFirstRender(false);
        }
    }, [loading, isFirstRender]);

    const handleClear = useCallback(() => {
        setFilterByName("");
        setFilterByAbbreviation("");
        setSelectedSubject(null);
        clearAspects();
        fetchLegalBasis();
    }, [fetchLegalBasis, clearAspects]);

    const resetSubjectAndAspects = useCallback(() => {
        if (selectedSubject) {
            setSelectedSubject(null);
            clearAspects();
        }
    }, [selectedSubject, clearAspects]);


    const handleFilter = useCallback((field, value) => {
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        debounceTimeout.current = setTimeout(async () => {
            setPage(1);
            setIsSearching(true);
            switch (field) {
                case "name":
                    await fetchLegalBasisByName(value);
                    break;
                case "abbreviation":
                    await fetchLegalBasisByAbbreviation(value);
                    break;
                case "subject":
                    await fetchLegalBasisBySubject(value);
                    await fetchAspects(value);
                    break;
                    case "subjectAndAspects": {
                        const { subjectId, aspects, aspectsIds } = value;
                        await fetchLegalBasisBySubjectAndAspects(subjectId, aspects, aspectsIds);
                        break;
                    }
                default:
                    break;
            }
            setIsSearching(false);
        }, 500);
    }, [fetchLegalBasisByName, fetchLegalBasisByAbbreviation, fetchLegalBasisBySubject, fetchAspects, fetchLegalBasisBySubjectAndAspects]);

    const handleFilterByName = useCallback((value) => {
        if (value.trim() === "") {
            handleClear();
            return;
        }
        setFilterByName(value);
        setFilterByAbbreviation("");
        resetSubjectAndAspects();
        handleFilter("name", value);
    }, [handleFilter, resetSubjectAndAspects, handleClear]);

    const handleFilterByAbbreviation = useCallback((value) => {
        if (value.trim() === "") {
            handleClear();
            return;
        }
        setFilterByAbbreviation(value);
        setFilterByName("");
        resetSubjectAndAspects();
        handleFilter("abbreviation", value);
    }, [handleFilter, resetSubjectAndAspects, handleClear]);

    const handleFilterBySubject = useCallback(
        (selectedId) => {
            if (!selectedId) {
                handleClear();
                return;
            }
            setFilterByName("");
            setFilterByAbbreviation("");
            setSelectedSubject(selectedId);
            handleFilter("subject", selectedId);
        },
        [handleFilter, handleClear]
    );

    const handleFilterByAspects = useCallback(
        (selectedIds) => {
            setSelectedAspects(selectedIds);
            if (selectedIds.size === 0) {
                if (selectedSubject) {
                    handleFilter("subject", selectedSubject);
                } else {
                    handleClear();
                }
                return;
            }
            const aspectsMap = aspects.reduce((map, aspect) => {
                map[aspect.id] = aspect.aspect_name;
                return map;
            }, {});
    
            const value = {
                subjectId: selectedSubject,
                aspects: aspectsMap,
                aspectsIds: Array.from(selectedIds),
            };
            handleFilter("subjectAndAspects", value);
        },
        [handleFilter, handleClear, selectedSubject, aspects]
    );
    
      
    const totalPages = useMemo(() => Math.ceil(legalBasis.length / rowsPerPage), [legalBasis, rowsPerPage]);

    const onRowsPerPageChange = useCallback((e) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const onPageChange = (newPage) => setPage(newPage);
    const onPreviousPage = () => setPage(prev => Math.max(prev - 1, 1));
    const onNextPage = () => setPage(prev => Math.min(prev + 1, totalPages));


    if (loading && isFirstRender) {
        return (
            <div role="status" className="fixed inset-0 flex items-center justify-center">
                <Spinner className="h-10 w-10 transform translate-x-0 lg:translate-x-28 xl:translate-x-32" color="secondary" />
            </div>
        );
    }
    if (error) return <Error title={error.title} message={error.message} />;
    if (subjectError) return <Error title={subjectError.title} message={subjectError.message} />;
    if (aspectError) return <Error title={aspectError.title} message={aspectError.message} />;

    return (
        <div className="mt-24 mb-4 -ml-60 mr-4 lg:-ml-0 lg:mr-0 xl:-ml-0 xl:mr-0 flex justify-center items-center flex-wrap">
            <TopContent
                onRowsPerPageChange={onRowsPerPageChange}
                totalLegalBasis={legalBasis.length}
                filterByName={filterByName}
                filterByAbbreviation={filterByAbbreviation}
                onFilterByName={handleFilterByName}
                onFilterByAbbreviation={handleFilterByAbbreviation}
                onClear={handleClear}
                subjects={subjects}
                selectedSubject={selectedSubject}
                subjectLoading={subjectLoading}
                onFilterBySubject={handleFilterBySubject}
                aspects={aspects}
                selectedAspects={selectedAspects}
                aspectLoading={aspectLoading}
                onFilterByAspects={handleFilterByAspects}
            />
            <>
                {IsSearching || loading ? (
                    <div role="status" className="flex justify-center items-center w-full h-40">
                        <Spinner className="h-10 w-10" color="secondary" />
                    </div>
                ) : (
                    <Table
                        aria-label="Tabla de fundamentos legales"
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
                            items={legalBasis.slice((page - 1) * rowsPerPage, page * rowsPerPage)}
                            emptyContent="No hay fundamentos para mostrar"
                        >
                            {(legalBase) => (
                                <TableRow key={legalBase.id}>
                                    {(columnKey) => (
                                        <TableCell>
                                            <LegalBasisCell legalBase={legalBase} columnKey={columnKey} />
                                        </TableCell>
                                    )}
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
                <BottomContent
                    page={page}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                    onPreviousPage={onPreviousPage}
                    onNextPage={onNextPage}
                    selectedKeys={selectedKeys}
                    filteredItems={legalBasis}
                />
            </>

        </div>
    );
}