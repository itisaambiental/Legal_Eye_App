import { useCallback, useState, useMemo, useRef, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
} from "@nextui-org/react";
import useLegalBasis from "../../hooks/legalBasis/useLegalBasis.jsx";
import useSubjects from "../../hooks/subject/useSubjects.jsx";
import useAspects from "../../hooks/aspect/useAspects.jsx";
import useCopomex from "../../hooks/copomex/useCopomex.jsx";
import { useFiles } from "../../hooks/files/useFiles.jsx";
import TopContent from "./TopContent.jsx";
import LegalBasisCell from "./LegalBasisCell.jsx";
import BottomContent from "./BottomContent.jsx";
import Error from "../utils/Error.jsx";
import CreateModal from "./CreateModal.jsx";
import { toast } from "react-toastify";
import check from "../../assets/check.png";
import { saveAs } from "file-saver";

const columns = [
  { name: "Fundamento Legal", uid: "legal_name" },
  { name: "Abreviatura", uid: "abbreviation" },
  { name: "Clasificación", uid: "classification" },
  { name: "Jurisdicción", uid: "jurisdiction" },
  { name: "Estado", uid: "state" },
  { name: "Municipio", uid: "municipality" },
  { name: "Última Reforma", uid: "lastReform" },
  { name: "Materia", uid: "subject" },
  { name: "Aspectos", uid: "aspects" },
  { name: "Acciones", uid: "actions" },
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
    classifications,
    classificationsLoading,
    classificationsError,
    jurisdictions,
    jurisdictionsLoading,
    jurisdictionsError,
    addLegalBasis,
    fetchLegalBasis,
    fetchLegalBasisByName,
    fetchLegalBasisByAbbreviation,
    fetchLegalBasisByClassification,
    fetchLegalBasisByJurisdiction,
    fetchLegalBasisByState,
    fetchLegalBasisByStateAndMunicipalities,
    fetchLegalBasisByLastReform,
    fetchLegalBasisBySubject,
    fetchLegalBasisBySubjectAndAspects,
    removeLegalBasis
  } = useLegalBasis();
  const {
    subjects,
    error: subjectLoading,
    error: subjectError,
  } = useSubjects();
  const {
    aspects,
    loading: aspectLoading,
    error: aspectError,
    clearAspects,
    fetchAspects,
  } = useAspects();
  const {
    states,
    loadingStates,
    errorStates,
    municipalities,
    loadingMunicipalities,
    fetchMunicipalities,
    errorMunicipalities,
    clearMunicipalities,
  } = useCopomex();
  const {
     downloadFile
  } = useFiles();
  const [filterByName, setFilterByName] = useState("");
  const [filterByAbbreviation, setFilterByAbbreviation] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedAspects, setSelectedAspects] = useState([]);
  const [selectedClassification, setSelectedClassification] = useState("");
  const [selectedJurisdiction, setSelectedJurisdiction] = useState("");
  const [selectedState, setSelectedState] = useState(null);
  const [selectedMunicipalities, setSelectedMunicipalities] = useState([]);
  const [lastReformRange, setLastReformRange] = useState(null);
  const [lastReformIsInvalid, setLastReformIsInvalid] = useState(false);
  const [lastReformError, setLastReformError] = useState("");
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [IsSearching, setIsSearching] = useState(false);
  const debounceTimeout = useRef(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [nameInputError, setNameInputError] = useState(null);
  const [abbreviationInputError, setAbbreviationInputError] = useState(null);
  const [classificationInputError, setClassificationInputError] = useState(null);
  const [jurisdictionInputError, setJurisdictionInputError] = useState(null);
  const [stateInputError, setStateInputError] = useState(null);
  const [municipalityInputError, setMunicipalityInputError] = useState(null);
  const [subjectInputError, setSubjectInputError] = useState(null);
  const [aspectInputError, setAspectInputError] = useState(null);
  const [lastReformInputError, setLastReformInputError] = useState(null);
  const [isStateActive, setIsStateActive] = useState(false);
  const [isMunicipalityActive, setIsMunicipalityActive] = useState(false);
  const [isAspectsActive, setIsAspectsActive] = useState(false);
  const [fileError, setFileError] = useState(null);
  const [checkboxInputError, setCheckboxInputError] = useState(null);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const [formData, setFormData] = useState({
    id: "",
    nombre: "",
    abbreviation: "",
    classification: "",
    jurisdiction: "",
    state: "",
    municipality: "",
    subject: "",
    aspects: [],
    lastReform: null,
    document: null,
    extractArticles: false,
    removeDocument: false,
  });

  useEffect(() => {
    if (!loading && isFirstRender) {
      setIsFirstRender(false);
    }
  }, [loading, isFirstRender]);

  const handleClear = useCallback(() => {
    setFilterByName("");
    setFilterByAbbreviation("");
    setSelectedClassification("");
    setSelectedJurisdiction("");
    setSelectedSubject(null);
    setSelectedState(null);
    clearAspects();
    clearMunicipalities();
    setLastReformRange(null);
    setLastReformIsInvalid(false);
    setLastReformError("");
    fetchLegalBasis();
  }, [fetchLegalBasis, clearAspects, clearMunicipalities]);

  const resetSubjectAndAspects = useCallback(() => {
    if (selectedSubject) {
      setSelectedSubject(null);
      setSelectedAspects([]);
      clearAspects();
    }
  }, [selectedSubject, clearAspects]);

  const resetStatesAndMunicipalities = useCallback(() => {
    if (selectedState) {
      setSelectedState(null);
      setSelectedMunicipalities([]);
      clearMunicipalities();
    }
  }, [selectedState, clearMunicipalities]);

  const handleFilter = useCallback(
    (field, value) => {
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
            const { subjectId, aspectsIds } = value;
            await fetchLegalBasisBySubjectAndAspects(
              subjectId,
              aspectsIds
            );
            break;
          }
          case "classification":
            await fetchLegalBasisByClassification(value);
            break;
          case "jurisdiction":
            await fetchLegalBasisByJurisdiction(value);
            break;
          default:
            break;
          case "state":
            await fetchLegalBasisByState(value);
            await fetchMunicipalities(value);
            break;
          case "stateAndMunicipalities": {
            const { state, municipalities } = value;
            await fetchLegalBasisByStateAndMunicipalities(
              state,
              municipalities
            );
            break;
          }
        }
        setIsSearching(false);
      }, 500);
    },
    [
      fetchLegalBasisByName,
      fetchLegalBasisByAbbreviation,
      fetchLegalBasisBySubject,
      fetchAspects,
      fetchLegalBasisBySubjectAndAspects,
      fetchLegalBasisByClassification,
      fetchLegalBasisByJurisdiction,
      fetchLegalBasisByState,
      fetchMunicipalities,
      fetchLegalBasisByStateAndMunicipalities,
    ]
  );

  const handleFilterByName = useCallback(
    (value) => {
      if (value.trim() === "") {
        handleClear();
        return;
      }
      setFilterByName(value);
      setFilterByAbbreviation("");
      setSelectedClassification("");
      setSelectedJurisdiction("");
      resetSubjectAndAspects();
      resetStatesAndMunicipalities();
      setLastReformRange(null);
      setLastReformIsInvalid(false);
      setLastReformError("");
      handleFilter("name", value);
    },
    [
      handleFilter,
      resetSubjectAndAspects,
      handleClear,
      resetStatesAndMunicipalities,
    ]
  );

  const handleFilterByAbbreviation = useCallback(
    (value) => {
      if (value.trim() === "") {
        handleClear();
        return;
      }
      setFilterByAbbreviation(value);
      setFilterByName("");
      setSelectedClassification("");
      setSelectedJurisdiction("");
      resetSubjectAndAspects();
      resetStatesAndMunicipalities();
      setLastReformRange(null);
      setLastReformIsInvalid(false);
      setLastReformError("");
      handleFilter("abbreviation", value);
    },
    [
      handleFilter,
      resetSubjectAndAspects,
      handleClear,
      resetStatesAndMunicipalities,
    ]
  );

  const handleFilterBySubject = useCallback(
    (selectedId) => {
      if (!selectedId) {
        handleClear();
        return;
      }
      setFilterByName("");
      setFilterByAbbreviation("");
      setSelectedClassification("");
      setSelectedJurisdiction("");
      resetStatesAndMunicipalities();
      setLastReformRange(null);
      setLastReformIsInvalid(false);
      setLastReformError("");
      setSelectedSubject(selectedId);
      handleFilter("subject", selectedId);
    },
    [handleFilter, handleClear, resetStatesAndMunicipalities]
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
      const value = {
        subjectId: selectedSubject,
        aspectsIds: Array.from(selectedIds),
      };
      handleFilter("subjectAndAspects", value);
    },
    [handleFilter, handleClear, selectedSubject]
  );

  const handleFilterByClassification = useCallback(
    (classification) => {
      if (!classification) {
        handleClear();
        return;
      }
      setFilterByName("");
      setFilterByAbbreviation("");
      setSelectedJurisdiction("");
      resetSubjectAndAspects();
      resetStatesAndMunicipalities();
      setLastReformRange(null);
      setLastReformIsInvalid(false);
      setLastReformError("");
      setSelectedClassification(classification);
      handleFilter("classification", classification);
    },
    [
      handleClear,
      handleFilter,
      resetSubjectAndAspects,
      resetStatesAndMunicipalities,
    ]
  );

  const handleFilterByJurisdiction = useCallback(
    (jurisdiction) => {
      if (!jurisdiction) {
        handleClear();
        return;
      }
      setFilterByName("");
      setFilterByAbbreviation("");
      setSelectedClassification("");
      resetSubjectAndAspects();
      resetStatesAndMunicipalities();
      setLastReformRange(null);
      setLastReformIsInvalid(false);
      setLastReformError("");
      setSelectedJurisdiction(jurisdiction);
      handleFilter("jurisdiction", jurisdiction);
    },
    [
      handleClear,
      handleFilter,
      resetSubjectAndAspects,
      resetStatesAndMunicipalities,
    ]
  );

  const handleFilterByState = useCallback(
    (state) => {
      if (!state) {
        handleClear();
        return;
      }
      setFilterByName("");
      setFilterByAbbreviation("");
      setSelectedClassification("");
      setSelectedJurisdiction("");
      resetSubjectAndAspects();
      setLastReformRange(null);
      setLastReformIsInvalid(false);
      setLastReformError("");
      setSelectedState(state);
      handleFilter("state", state);
    },
    [handleFilter, handleClear, resetSubjectAndAspects]
  );

  const handleFilterByMunicipalities = useCallback(
    (selectedIds) => {
      setSelectedMunicipalities(selectedIds);
      if (selectedIds.size === 0) {
        if (selectedState) {
          handleFilter("state", selectedState);
        } else {
          handleClear();
        }
        return;
      }
      const municipalitiesArray = Array.from(selectedIds);
      const value = {
        state: selectedState,
        municipalities: municipalitiesArray,
      };
      handleFilter("stateAndMunicipalities", value);
    },
    [handleFilter, handleClear, selectedState]
  );

  const handleFilterByLastReformRange = useCallback(
    (values) => {
      if (values) {
        if (values.start.compare(values.end) > 0) {
          setLastReformIsInvalid(true);
          setLastReformError("Fecha inicio debe ser antes que fecha fin.");
        } else {
          setLastReformIsInvalid(false);
          setLastReformError("");
        }

        const { start, end } = values;
        fetchLegalBasisByLastReform(start.toString(), end.toString());
        setLastReformRange(values);
      } else {
        handleClear();
        setLastReformRange(null);
        setLastReformIsInvalid(false);
        setLastReformError("");
      }
    },
    [fetchLegalBasisByLastReform, handleClear]
  );

  const openModalCreate = useCallback(() => {
    setFormData({
      id: "",
      nombre: "",
      abbreviation: "",
      classification: "",
      jurisdiction: "",
      state: "",
      municipality: "",
      subject: "",
      aspects: [],
      lastReform: null,
      document: null,
      extractArticles: false,
      removeDocument: false,
    });
    setIsCreateModalOpen(true);
  }, [setFormData, setIsCreateModalOpen]);
  
  const closeModalCreate = useCallback(() => {
    setIsCreateModalOpen(false);
    setNameInputError(null);
    setAbbreviationInputError(null);
    setClassificationInputError(null);
    setJurisdictionInputError(null);
    setStateInputError(null);
    setMunicipalityInputError(null);
    setSubjectInputError(null);
    setAspectInputError(null);
    setIsStateActive(false);
    setIsMunicipalityActive(false);
    setIsAspectsActive(false);
    clearMunicipalities();
    clearAspects();
    setLastReformInputError(null)
    setFileError(null)
    setCheckboxInputError(null)
    setIsCheckboxChecked(false)
  }, [
    setIsCreateModalOpen,
    setNameInputError,
    setAbbreviationInputError,
    setClassificationInputError,
    setJurisdictionInputError,
    setStateInputError,
    setMunicipalityInputError,
    setSubjectInputError,
    setAspectInputError,
    setIsStateActive,
    setIsMunicipalityActive,
    setIsAspectsActive,
    clearMunicipalities,
    clearAspects,
  ]);
  
  const handleNameChange = useCallback(
    (e) => {
      const { value } = e.target;
      setFormData((prevFormData) => ({
        ...prevFormData,
        nombre: value,
      }));
      if (nameInputError && value.trim() !== "") {
        setNameInputError(null);
      }
    },
    [nameInputError, setFormData, setNameInputError]
  );
  
  const handleAbbreviationChange = useCallback(
    (e) => {
      const { value } = e.target;
      setFormData((prevFormData) => ({
        ...prevFormData,
        abbreviation: value,
      }));
      if (abbreviationInputError && value.trim() !== "") {
        setAbbreviationInputError(null);
      }
    },
    [abbreviationInputError, setFormData, setAbbreviationInputError]
  );
  
  const handleClassificationChange = useCallback(
    (value) => {
      if (!value) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          classification: "",
        }));
        if (classificationInputError) {
          setClassificationInputError(null);
        }
        return;
      }
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
  
  const handleJurisdictionChange = useCallback(
    (value) => {
      if (!value) {
        setStateInputError(null);
        setMunicipalityInputError(null);
        setFormData((prevFormData) => ({
          ...prevFormData,
          jurisdiction: "",
          state: "",
          municipality: "",
        }));
        setIsStateActive(false);
        setIsMunicipalityActive(false);
        clearMunicipalities();
        if (jurisdictionInputError) {
          setJurisdictionInputError(null);
        }
        return;
      }
      setStateInputError(null);
      setMunicipalityInputError(null);
      setFormData((prevFormData) => ({
        ...prevFormData,
        jurisdiction: value,
        state: "",
        municipality: "",
      }));
      if (jurisdictionInputError && value.trim() !== "") {
        setJurisdictionInputError(null);
      }
      switch (value) {
        case "Federal":
          setIsStateActive(false);
          setIsMunicipalityActive(false);
          clearMunicipalities();
          break;
        case "Estatal":
          setIsStateActive(true);
          setIsMunicipalityActive(false);
          clearMunicipalities();
          break;
        case "Local":
          setIsStateActive(true);
          setIsMunicipalityActive(false);
          clearMunicipalities();
          break;
        default:
          setIsStateActive(false);
          setIsMunicipalityActive(false);
          clearMunicipalities();
          break;
      }
    },
    [
      clearMunicipalities,
      jurisdictionInputError,
      setFormData,
      setIsMunicipalityActive,
      setIsStateActive,
      setJurisdictionInputError,
      setMunicipalityInputError,
      setStateInputError,
    ]
  );
  
  const handleStateChange = useCallback(
    async (value) => {
      if (!value) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          state: "",
          municipality: "",
        }));
        if (stateInputError) {
          setStateInputError(null);
        }
        if (municipalityInputError) {
          setMunicipalityInputError(null);
        }
        clearMunicipalities();
        setIsMunicipalityActive(false);
        return;
      }
      setFormData((prevFormData) => ({
        ...prevFormData,
        state: value,
        municipality: "",
      }));
      if (stateInputError && value.trim() !== "") {
        setStateInputError(null);
      }
      if (formData.jurisdiction === "Local") {
        setIsMunicipalityActive(true);
        await fetchMunicipalities(value);
      } else {
        setIsMunicipalityActive(false);
        clearMunicipalities();
      }
    },
    [
      clearMunicipalities,
      fetchMunicipalities,
      formData.jurisdiction,
      municipalityInputError,
      setFormData,
      setIsMunicipalityActive,
      setMunicipalityInputError,
      setStateInputError,
      stateInputError,
    ]
  );
  
  const handleMunicipalityChange = useCallback(
    (value) => {
      if (!value) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          municipality: "",
        }));
        if (municipalityInputError) {
          setMunicipalityInputError(null);
        }
        return;
      }
      setFormData((prevFormData) => ({
        ...prevFormData,
        municipality: value,
      }));
  
      if (municipalityInputError && value.trim() !== "") {
        setMunicipalityInputError(null);
      }
    },
    [municipalityInputError, setFormData, setMunicipalityInputError]
  );
  
  const handleSubjectChange = useCallback(
    async (value) => {
      if (!value) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          subject: "",
          aspects: [],
        }));
        if (subjectInputError) {
          setSubjectInputError(null);
        }
        clearAspects();
        setIsAspectsActive(false);
        setAspectInputError(null);
        return;
      }
      setFormData((prevFormData) => ({
        ...prevFormData,
        subject: value,
        aspects: [],
      }));
      if (subjectInputError && value.trim() !== "") {
        setSubjectInputError(null);
      }
      setAspectInputError(null);
      setIsAspectsActive(true);
      await fetchAspects(value);
    },
    [
      clearAspects,
      fetchAspects,
      setAspectInputError,
      setFormData,
      setIsAspectsActive,
      setSubjectInputError,
      subjectInputError,
    ]
  );
  
  const handleAspectsChange = useCallback(
    (selectedIds) => {
      setFormData((prevFormData) => ({
        ...prevFormData,
        aspects: Array.from(selectedIds),
      }));
      if (aspectInputError && selectedIds.size > 0) {
        setAspectInputError(null);
      }
    },
    [aspectInputError, setFormData, setAspectInputError]
  );
  
  const handleLastReformChange = useCallback(
    (value) => {
      if (!value) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          lastReform: null,
        }));
        return;
      }
      setFormData((prevFormData) => ({
        ...prevFormData,
        lastReform: value,
      }));
      if (lastReformInputError) {
        setLastReformInputError(null);
      }
    },
    [lastReformInputError, setFormData, setLastReformInputError]
  );

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    const validTypes = ["application/pdf", "image/png", "image/jpeg"];
    if (file && validTypes.includes(file.type)) {
      setFileError(null);
      const fileUrl = URL.createObjectURL(file);
      setFormData((prevFormData) => ({
        ...prevFormData,
        document: {
          file: file,
          previewUrl: fileUrl,
        },
      }));
      setCheckboxInputError(null);

    } else {
      setFileError("Solo se permiten archivos PDF, PNG y JPEG.");
      setFormData((prevFormData) => ({
        ...prevFormData,
        document: null,
      }));
    }
  }, [setFormData, setFileError]);
  

  const handleRemoveDocument = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      document: null,
    }));
    setFileError(null);
  };

  const handleCheckboxChange = useCallback(
    (isChecked) => {
      setIsCheckboxChecked(isChecked);
      setFormData((prevFormData) => ({
        ...prevFormData,
        extractArticles: isChecked,
      }));
        setCheckboxInputError(null);
      
    },
    [setIsCheckboxChecked, setFormData, setCheckboxInputError]
  );
  

  const totalPages = useMemo(
    () => Math.ceil(legalBasis.length / rowsPerPage),
    [legalBasis, rowsPerPage]
  );

  const onRowsPerPageChange = useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onPageChange = (newPage) => setPage(newPage);
  const onPreviousPage = () => setPage((prev) => Math.max(prev - 1, 1));
  const onNextPage = () => setPage((prev) => Math.min(prev + 1, totalPages));

  const handleDelete = useCallback(
    async (legalBasisId) => {
      const toastId = toast.loading("Eliminando fundamento legal...", {
        icon: <Spinner size="sm" />,
        progressStyle: {
          background: "#113c53",
        },
      });
      try {
        const { success, error } = await removeLegalBasis(legalBasisId);
        if (success) {
          toast.update(toastId, {
            render: "Fundamento legal eliminado con éxito",
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
            "Algo mal sucedió al eliminar el fundamento legal. Intente de nuevo.",
          type: "error",
          icon: null,
          progressStyle: {},
          isLoading: false,
          autoClose: 5000,
        });
      }
    },
    [removeLegalBasis]
  );

  const handleDownloadDocument = async (url, fileName) => {
    if (!url) {
      toast.error("No hay Documento disponible para este fundamento.");
      return;
    }
    const toastId = toast.loading("Descargando archivo...", {
      icon: <Spinner size="sm" />,
      progressStyle: {
        background: "#113c53",
      },
    });
    try {
      const { success, fileBlob, error } = await downloadFile(url);
      if (success) {
        const mimeType = fileBlob.type;
        const extension = mimeType.split("/")[1]; 
  
        if (!extension) {
          toast.update(toastId, {
            render: "No se pudo determinar el tipo de archivo. Inténtelo nuevamente.",
            type: "error",
            isLoading: false,
            autoClose: 5000,
          });
          return;
        }
        saveAs(fileBlob, fileName);
        toast.update(toastId, {
          render: "Documento descargado con éxito.",
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
        render: "Ocurrió un error inesperado. Inténtelo nuevamente.",
        type: "error",
        icon: null,
        progressStyle: {},
        isLoading: false,
        autoClose: 5000,
      });
    }
  };
  

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
  if (subjectError)
    return <Error title={subjectError.title} message={subjectError.message} />;
  if (aspectError && !isCreateModalOpen)
    return <Error title={aspectError.title} message={aspectError.message} />;
  if (classificationsError)
    return (
      <Error
        title={classificationsError.title}
        message={classificationsError.message}
      />
    );
  if (jurisdictionsError)
    return (
      <Error
        title={jurisdictionsError.title}
        message={jurisdictionsError.message}
      />
    );
  if (errorStates)
    return <Error title={errorStates.title} message={errorStates.message} />;

  if (errorMunicipalities && !isCreateModalOpen) {
    return (
      <Error
        title={errorMunicipalities.title}
        message={errorMunicipalities.message}
      />
    );
  }

  return (
    <div className="mt-24 mb-4 -ml-60 mr-4 lg:-ml-0 lg:mr-0 xl:-ml-0 xl:mr-0 flex justify-center items-center flex-wrap">
      <TopContent
        isCreateModalOpen={isCreateModalOpen}
        onRowsPerPageChange={onRowsPerPageChange}
        totalLegalBasis={legalBasis.length}
        openModalCreate={openModalCreate}
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
        classifications={classifications}
        selectedClassification={selectedClassification}
        classificationsLoading={classificationsLoading}
        onFilterByClassification={handleFilterByClassification}
        jurisdictions={jurisdictions}
        selectedJurisdiction={selectedJurisdiction}
        jurisdictionsLoading={jurisdictionsLoading}
        onFilterByJurisdiction={handleFilterByJurisdiction}
        states={states}
        selectedState={selectedState}
        stateLoading={loadingStates}
        onFilterByState={handleFilterByState}
        municipalities={municipalities}
        selectedMunicipalities={selectedMunicipalities}
        municipalitiesLoading={loadingMunicipalities}
        onFilterByMunicipalities={handleFilterByMunicipalities}
        lastReformRange={lastReformRange}
        setLastReformRange={setLastReformRange}
        lastReformIsInvalid={lastReformIsInvalid}
        lastReformError={lastReformError}
        onFilterByLastReformRange={handleFilterByLastReformRange}
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
            aria-label="Tabla de fundamentos legales"
            selectionMode="multiple"
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
            color="primary"
          >
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn
                  key={column.uid}
                  align={column.uid === "actions" ? "center" : "start"}
                >
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody
              items={legalBasis.slice(
                (page - 1) * rowsPerPage,
                page * rowsPerPage
              )}
              emptyContent="No hay fundamentos para mostrar"
            >
              {(legalBase) => (
                <TableRow key={legalBase.id}>
                  {(columnKey) => (
                    <TableCell>
                      <LegalBasisCell
                        legalBase={legalBase}
                        columnKey={columnKey}
                        handleDelete={handleDelete}
                        handleDownloadDocument={handleDownloadDocument}
                      />
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
        {isCreateModalOpen && (
          <CreateModal
            closeModalCreate={closeModalCreate}
            isOpen={isCreateModalOpen}
            formData={formData}
            addLegalBasis={addLegalBasis}
            nameError={nameInputError}
            setNameError={setNameInputError}
            handleNameChange={handleNameChange}
            abbreviationError={abbreviationInputError}
            setAbbreviationError={setAbbreviationInputError}
            handleAbbreviationChange={handleAbbreviationChange}
            classificationError={classificationInputError}
            setClassificationError={setClassificationInputError}
            handleClassificationChange={handleClassificationChange}
            jurisdictionError={jurisdictionInputError}
            setJurisdictionError={setJurisdictionInputError}
            handleJurisdictionChange={handleJurisdictionChange}
            states={states}
            stateError={stateInputError}
            setStateError={setStateInputError}
            isStateActive={isStateActive}
            handleStateChange={handleStateChange}
            clearMunicipalities={clearMunicipalities}
            municipalities={municipalities}
            municipalityError={municipalityInputError}
            setMunicipalityError={setMunicipalityInputError}
            isMunicipalityActive={isMunicipalityActive}
            loadingMunicipalities={loadingMunicipalities}
            errorMunicipalities={errorMunicipalities}
            handleMunicipalityChange={handleMunicipalityChange}
            subjects={subjects}
            subjectInputError={subjectInputError}
            setSubjectError={setSubjectInputError}
            handleSubjectChange={handleSubjectChange}
            aspects={aspects}
            aspectError={aspectInputError}
            setAspectInputError={setAspectInputError}
            isAspectsActive={isAspectsActive}
            loadingAspects={aspectLoading}
            errorAspects={aspectError}
            handleAspectsChange={handleAspectsChange}
            lastReformError={lastReformInputError}
            setLastReformError={setLastReformInputError}
            handleLastReformChange={handleLastReformChange}
            handleFileChange={handleFileChange}
            fileError={fileError}
            handleRemoveDocument={handleRemoveDocument}
            checkboxInputError={checkboxInputError}
            setCheckboxInputError={setCheckboxInputError}
            isCheckboxChecked={isCheckboxChecked}
            handleCheckboxChange={handleCheckboxChange}
            
          />
        )}
      </>
    </div>
  );
}
