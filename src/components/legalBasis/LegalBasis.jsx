import { useCallback, useState, useMemo, useRef } from "react";
import { Tooltip, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Button } from "@nextui-org/react";
import useLegalBasis from "../../hooks/legalBasis/useLegalBasis.jsx";
import TopContent from "./TopContent.jsx";
import RenderCell from "./LegalBasisCell.jsx";
// import DeleteModal from "./deleteModal.jsx";
import BottomContent from "./BottomContent.jsx";
import Error from "../utils/Error.jsx";
// import useRoles from "../../hooks/user/roles.jsx";
import trash_icon from "../../assets/papelera-mas.png";
// import CreateModal from "./CreateModal.jsx";
import check from "../../assets/check.png"
import { toast } from "react-toastify";
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
        fetchLegalBasisById,
        fetchLegalBasisByName,
        fetchLegalBasisByAbbreviation,
        fetchLegalBasisByClassification,
        fetchLegalBasisByJurisdiction,
        fetchLegalBasisByState
    } = useLegalBasis();
    const [filterValue, setFilterValue] = useState("");
    const [filterField, setFilterField] = useState(null);
    const debounceTimeout = useRef(null);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [selectedKeys, setSelectedKeys] = useState(new Set());
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [nameError, setNameError] = useState(null);
    const [emailError, setEmailError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeletingBatch, setIsDeletingBatch] = useState(false);
    const [fileError, setFileError] = useState(null);
    const [formData, setFormData] = useState({
        id: '',
        legal_name: '',
        subject: '',
        aspects: [],
        abbreviation: '',
        classification: '',
        jurisdiction: '',
        state: '',
        municipality: '',
        lastReform: '',
        document: null
    });

    const handleFilterChange = useCallback((field, value) => {
        setFilterValue(value);
        setFilterField(field);
        setPage(1);
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
        debounceTimeout.current = setTimeout(() => {
            if (value) {
                switch (field) {
                    case "legal_name":
                        fetchLegalBasisByName(value);
                        break;
                    case "abbreviation":
                        fetchLegalBasisByAbbreviation(value);
                        break;
                    default:
                        break;
                }
            } else {
                fetchLegalBasis();
            }
        }, 500);
    }, [fetchLegalBasis, fetchLegalBasisByName, fetchLegalBasisByAbbreviation]);


    const onClear = useCallback(() => {
        setFilterValue("");
        setFilterField(null);
        setPage(1);
        fetchLegalBasis();
    }, [fetchLegalBasis]);

    const totalPages = useMemo(() => Math.ceil(legalBasis.length / rowsPerPage), [legalBasis, rowsPerPage]);

    const onRowsPerPageChange = useCallback((e) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const onPageChange = (newPage) => setPage(newPage);
    const onPreviousPage = () => setPage(prev => Math.max(prev - 1, 1));
    const onNextPage = () => setPage(prev => Math.min(prev + 1, totalPages));

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
                totalLegalBasis={legalBasis.length}
                // openModalCreate={openModalCreate}
                onFilterChange={handleFilterChange}
                onClear={onClear}
                value={filterValue}
            />


            <Table
                aria-label="Tabla de usuarios"
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
                                    <RenderCell legalBase={legalBase} columnKey={columnKey} />
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
                filteredItems={legalBasis}
            />
            {/* {isCreateModalOpen && (
        <CreateModal
          closeModalCreate={closeModalCreate}
          isOpen={isCreateModalOpen}
          addUser={addUser}
          handleEmailChange={handleEmailChange}
          formData={formData}
          usertypeError={usertypeError}
          setusertypeError={setusertypeError}
          handleTypeChange={handleTypeChange}
          nameError={nameError}
          setNameError={setNameError}
          handleNameChange={handleNameChange}
          handleFileChange={handleFileChange}
          fileError={fileError}
          handleRemoveImage={handleRemoveImage}
          setEmailError={setEmailError}
          emailError={emailError}
          roles={roles}
          translateRole={translateRole}
        />
      )} */}


            {/* {isEditModalOpen && (
        <EditModal
          formData={formData}
          setFormData={setFormData}
          selectedUser={selectedUser}
          closeModalEdit={closeEditModal}
          isOpen={isEditModalOpen}
          updateUserDetails={updateUserDetails}
          handleEmailChange={handleEmailChange}
          usertypeError={usertypeError}
          setusertypeError={setusertypeError}
          handleTypeChange={handleTypeChange}
          nameError={nameError}
          setNameError={setNameError}
          handleNameChange={handleNameChange}
          handleFileChange={handleFileChange}
          fileError={fileError}
          handleRemoveImage={handleRemoveImage}
          setEmailError={setEmailError}
          emailError={emailError}
          roles={roles}
          translateRole={translateRole}
        />
      )}

      {showDeleteModal && (
        <DeleteModal
          showDeleteModal={showDeleteModal}
          closeDeleteModal={closeDeleteModal}
          setIsDeletingBatch={setIsDeletingBatch}
          isDeletingBatch={isDeletingBatch}
          selectedKeys={selectedKeys}
          users={users}
          deleteUsersBatch={deleteUsersBatch}
          setShowDeleteModal={setShowDeleteModal}
          setSelectedKeys={setSelectedKeys}
          check={check}

        />
      )} */}
        </div>

    );
}
