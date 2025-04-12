import { useCallback, useState, useMemo, useRef, useEffect } from "react";
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
import { useNavigate } from "react-router-dom";
import useLegalBasis from "../../hooks/legalBasis/useLegalBasis.jsx";
import useSubjects from "../../hooks/subject/useSubjects.jsx";
import useAspects from "../../hooks/aspect/useAspects.jsx";
import useCopomex from "../../hooks/copomex/useCopomex.jsx";
import { useFiles } from "../../hooks/files/useFiles.jsx";
import TopContent from "./TopContent.jsx";
import LegalBasisCell from "./LegalBasisCell.jsx";
import FilterModal from "./FilterModal.jsx";
import BottomContent from "../utils/BottomContent.jsx";
import Error from "../utils/Error.jsx";
import CreateModal from "./CreateModal.jsx";
import EditModal from "./EditModal.jsx";
import DeleteModal from "./deleteModal.jsx";
import { toast } from "react-toastify";
import check from "../../assets/check.png";
import trash_icon from "../../assets/papelera-mas.png";
import think_icon from "../../assets/cerebro.png";
import send_icon from "../../assets/enviar.png";

const columns = [
  { name: "Fundamento Legal", uid: "legal_name", align: "start" },
  { name: "Abreviatura", uid: "abbreviation", align: "start" },
  { name: "Clasificación", uid: "classification", align: "start" },
  { name: "Jurisdicción", uid: "jurisdiction", align: "start" },
  { name: "Estado", uid: "state", align: "start" },
  { name: "Municipio", uid: "municipality", align: "start" },
  { name: "Última Reforma", uid: "lastReform", align: "start" },
  { name: "Materia", uid: "subject", align: "start" },
  { name: "Aspectos", uid: "aspects", align: "start" },
  { name: "Acciones", uid: "actions", align: "center" },
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
    fetchLegalBasisByStateAndMunicipalities,
    fetchLegalBasisByLastReform,
    fetchLegalBasisBySubject,
    fetchLegalBasisBySubjectAndAspects,
    fetchLegalBasisBySubjectAndFilters,
    modifyLegalBasis,
    removeLegalBasis,
    removeLegalBasisBatch,
  } = useLegalBasis();
  const {
    subjects,
    loading: subjectLoading,
    error: subjectError,
  } = useSubjects();
  const {
    aspects,
    loadingState: aspectsLoading,
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
  const { downloadFile, downloadBase64File } = useFiles();
  const navigate = useNavigate();
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
  const [isSearching, setIsSearching] = useState(false);
  const debounceTimeout = useRef(null);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLegalBase, setSelectedLegalBase] = useState(null);
  const [nameInputError, setNameInputError] = useState(null);
  const [abbreviationInputError, setAbbreviationInputError] = useState(null);
  const [classificationInputError, setClassificationInputError] =
    useState(null);
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
  const [extractArticlesInputError, setExtractArticlesInputError] =
    useState(null);
  const [isExtracArticlesChecked, setIsExtracArticlesChecked] = useState(false);
  const [intelligenceLevelInputError, setIntelligenceLevelInputError] =
    useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeletingBatch, setIsDeletingBatch] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
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
    intelligenceLevel: "",
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
            await fetchLegalBasisBySubjectAndAspects(subjectId, aspectsIds);
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

  const openModalCreate = () => {
    setFormData({
      id: "",
      name: "",
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
      intelligenceLevel: "",
      removeDocument: false,
    });
    setIsCreateModalOpen(true);
  };

  const closeModalCreate = () => {
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
    setLastReformInputError(null);
    setFileError(null);
    setExtractArticlesInputError(null);
    setIsExtracArticlesChecked(false);
    setIntelligenceLevelInputError(null);
  };

  const openEditModal = (legalBase) => {
    setSelectedLegalBase(legalBase);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedLegalBase(null);
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
    setLastReformInputError(null);
    setFileError(null);
    setExtractArticlesInputError(null);
    setIsExtracArticlesChecked(false);
    setIntelligenceLevelInputError(null);
  };

  const openFilterModal = () => {
    setFormData({
      jurisdiction: "",
      state: "",
      municipality: "",
      subject: "",
      aspects: [],
    });
    setIsFilterModalOpen(true);
  };

  const closeFilterModal = () => {
    setIsFilterModalOpen(false);
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
  };


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

  const handleFileChange = useCallback(
    (e) => {
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
        setExtractArticlesInputError(null);
      } else {
        setFileError(
          "Solo se permiten documentos en formatos PDF, PNG y JPEG."
        );
        setFormData((prevFormData) => ({
          ...prevFormData,
          document: null,
        }));
      }
    },
    [setFormData, setFileError, setExtractArticlesInputError]
  );

  const handleRemoveDocument = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      document: null,
    }));
    setIsExtracArticlesChecked(false);
    setExtractArticlesInputError(null);
    setFileError(null);
  };

  const handleExtractArticlesChange = useCallback(
    (isChecked) => {
      setIsExtracArticlesChecked(isChecked);
      setFormData((prevFormData) => ({
        ...prevFormData,
        extractArticles: isChecked,
        intelligenceLevel: "",
      }));
      setExtractArticlesInputError(null);
      setIntelligenceLevelInputError(null);
    },
    [setIsExtracArticlesChecked, setFormData, setExtractArticlesInputError]
  );

  const handleIntelligenceLevelChange = useCallback(
    (value) => {
      setFormData((prevFormData) => ({
        ...prevFormData,
        intelligenceLevel: value,
      }));
      if (intelligenceLevelInputError && value.trim() !== "") {
        setIntelligenceLevelInputError(null);
      }
    },
    [intelligenceLevelInputError, setFormData, setIntelligenceLevelInputError]
  );

  const totalPages = useMemo(
    () => Math.ceil(legalBasis.length / rowsPerPage),
    [legalBasis, rowsPerPage]
  );

  const onRowsPerPageChange = useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const goToArticles = (legalBaseId) => {
    navigate(`/legal_basis/${legalBaseId}/articles`);
  };

  const openDeleteModal = () => setShowDeleteModal(true);
  const closeDeleteModal = () => setShowDeleteModal(false);
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
    const toastId = toast.loading("Descargando documento...", {
      icon: <Spinner size="sm" />,
      progressStyle: {
        background: "#113c53",
      },
    });
    try {
      const { success, file, contentType, error } = await downloadFile(url);
      if (success) {
        if (!contentType) {
          toast.update(toastId, {
            render:
              "No se pudo determinar el tipo de documento. Contacte a los administradores del sistema.",
            type: "error",
            isLoading: false,
            autoClose: 5000,
          });
          return;
        }
        downloadBase64File(file, contentType, fileName);
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
  if (aspectError && !isCreateModalOpen && !isEditModalOpen)
    return <Error title={aspectError.title} message={aspectError.message} />;
  if (errorStates)
    return <Error title={errorStates.title} message={errorStates.message} />;

  if (errorMunicipalities && !isCreateModalOpen && !isEditModalOpen) {
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
        config={{
          isCreateModalOpen: isCreateModalOpen,
          isEditModalOpen: isEditModalOpen,
          openFilterModal: openFilterModal,
          onRowsPerPageChange: onRowsPerPageChange,
          totalLegalBasis: legalBasis.length,
          openModalCreate: openModalCreate,
          filterByName: filterByName,
          filterByAbbreviation: filterByAbbreviation,
          onFilterByName: handleFilterByName,
          onFilterByAbbreviation: handleFilterByAbbreviation,
          onClear: handleClear,
          subjects: subjects,
          selectedSubject: selectedSubject,
          subjectLoading: subjectLoading,
          onFilterBySubject: handleFilterBySubject,
          aspects: aspects,
          selectedAspects: selectedAspects,
          aspectsLoading: aspectsLoading,
          onFilterByAspects: handleFilterByAspects,
          selectedClassification: selectedClassification,
          onFilterByClassification: handleFilterByClassification,
          selectedJurisdiction: selectedJurisdiction,
          onFilterByJurisdiction: handleFilterByJurisdiction,
          states: states,
          selectedState: selectedState,
          stateLoading: loadingStates,
          onFilterByState: handleFilterByState,
          municipalities: municipalities,
          selectedMunicipalities: selectedMunicipalities,
          municipalitiesLoading: loadingMunicipalities,
          onFilterByMunicipalities: handleFilterByMunicipalities,
          lastReformRange: lastReformRange,
          lastReformIsInvalid: lastReformIsInvalid,
          lastReformError: lastReformError,
          onFilterByLastReformRange: handleFilterByLastReformRange,
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
            aria-label="Tabla de fundamentos legales"
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
                        openEditModal={openEditModal}
                        goToArticles={goToArticles}
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
                  <img src={trash_icon} alt="delete" className="w-5 h-5" />
                </Button>
              </Tooltip>
              <Tooltip content="Identificar Requerimientos" size="sm">
                <Button
                  isIconOnly
                  size="sm"
                  className="absolute left-12 bottom-0 ml-5 bg-secondary transform translate-y-32 sm:translate-y-24 md:translate-y-24 lg:translate-y-24 xl:translate-y-10"
                  aria-label="Identificar"
                >
                  <img src={think_icon} alt="edit" className="w-5 h-5" />
                </Button>
              </Tooltip>
              <Tooltip content="Enviar a ACM Suite" size="sm">
                <Button
                  isIconOnly
                  size="sm"
                  className="absolute left-24 bottom-0 ml-5 bg-primary transform translate-y-32 sm:translate-y-24 md:translate-y-24 lg:translate-y-24 xl:translate-y-10"
                  aria-label="Enviar a ACM Suite"
                >
                  <img src={send_icon} alt="send" className="w-5 h-5" />
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
            filteredItems: legalBasis,
          }}
        />
        {isCreateModalOpen && (
          <CreateModal
            config={{
              isOpen: isCreateModalOpen,
              closeModalCreate: closeModalCreate,
              formData: formData,
              goToArticles: goToArticles,
              addLegalBasis: addLegalBasis,
              nameError: nameInputError,
              setNameError: setNameInputError,
              handleNameChange: handleNameChange,
              abbreviationError: abbreviationInputError,
              setAbbreviationError: setAbbreviationInputError,
              handleAbbreviationChange: handleAbbreviationChange,
              classificationError: classificationInputError,
              setClassificationError: setClassificationInputError,
              handleClassificationChange: handleClassificationChange,
              jurisdictionError: jurisdictionInputError,
              setJurisdictionError: setJurisdictionInputError,
              handleJurisdictionChange: handleJurisdictionChange,
              states: states,
              stateError: stateInputError,
              setStateError: setStateInputError,
              isStateActive: isStateActive,
              handleStateChange: handleStateChange,
              clearMunicipalities: clearMunicipalities,
              municipalities: municipalities,
              municipalityError: municipalityInputError,
              setMunicipalityError: setMunicipalityInputError,
              isMunicipalityActive: isMunicipalityActive,
              loadingMunicipalities: loadingMunicipalities,
              errorMunicipalities: errorMunicipalities,
              handleMunicipalityChange: handleMunicipalityChange,
              subjects: subjects,
              subjectInputError: subjectInputError,
              setSubjectError: setSubjectInputError,
              handleSubjectChange: handleSubjectChange,
              aspects: aspects,
              aspectError: aspectInputError,
              setAspectInputError: setAspectInputError,
              isAspectsActive: isAspectsActive,
              aspectsLoading: aspectsLoading,
              errorAspects: aspectError,
              handleAspectsChange: handleAspectsChange,
              lastReformError: lastReformInputError,
              setLastReformError: setLastReformInputError,
              handleLastReformChange: handleLastReformChange,
              handleFileChange: handleFileChange,
              fileError: fileError,
              handleRemoveDocument: handleRemoveDocument,
              extractArticlesInputError: extractArticlesInputError,
              setExtractArticlesInputError: setExtractArticlesInputError,
              isExtracArticlesChecked: isExtracArticlesChecked,
              handleExtractArticlesChange: handleExtractArticlesChange,
              intelligenceLevelInputError: intelligenceLevelInputError,
              setIntelligenceLevelInputError: setIntelligenceLevelInputError,
              handleIntelligenceLevelChange: handleIntelligenceLevelChange,
            }}
          />
        )}
        {isEditModalOpen && (
          <EditModal
            config={{
              isOpen: isEditModalOpen,
              closeModalEdit: closeEditModal,
              formData: formData,
              goToArticles: goToArticles,
              setFormData: setFormData,
              editLegalBasis: modifyLegalBasis,
              selectedLegalBase: selectedLegalBase,
              nameError: nameInputError,
              setNameError: setNameInputError,
              handleNameChange: handleNameChange,
              abbreviationError: abbreviationInputError,
              setAbbreviationError: setAbbreviationInputError,
              handleAbbreviationChange: handleAbbreviationChange,
              classificationError: classificationInputError,
              setClassificationError: setClassificationInputError,
              handleClassificationChange: handleClassificationChange,
              jurisdictionError: jurisdictionInputError,
              setJurisdictionError: setJurisdictionInputError,
              handleJurisdictionChange: handleJurisdictionChange,
              states: states,
              stateError: stateInputError,
              setStateError: setStateInputError,
              isStateActive: isStateActive,
              handleStateChange: handleStateChange,
              clearMunicipalities: clearMunicipalities,
              municipalities: municipalities,
              municipalityError: municipalityInputError,
              setMunicipalityError: setMunicipalityInputError,
              isMunicipalityActive: isMunicipalityActive,
              loadingMunicipalities: loadingMunicipalities,
              errorMunicipalities: errorMunicipalities,
              handleMunicipalityChange: handleMunicipalityChange,
              subjects: subjects,
              subjectInputError: subjectInputError,
              setSubjectError: setSubjectInputError,
              handleSubjectChange: handleSubjectChange,
              aspects: aspects,
              aspectError: aspectInputError,
              setAspectInputError: setAspectInputError,
              isAspectsActive: isAspectsActive,
              aspectsLoading: aspectsLoading,
              errorAspects: aspectError,
              handleAspectsChange: handleAspectsChange,
              lastReformError: lastReformInputError,
              setLastReformError: setLastReformInputError,
              handleLastReformChange: handleLastReformChange,
              handleFileChange: handleFileChange,
              fileError: fileError,
              handleRemoveDocument: handleRemoveDocument,
              extractArticlesInputError: extractArticlesInputError,
              setExtractArticlesInputError: setExtractArticlesInputError,
              isExtracArticlesChecked: isExtracArticlesChecked,
              handleExtractArticlesChange: handleExtractArticlesChange,
              setIsStateActive: setIsStateActive,
              setIsMunicipalityActive: setIsMunicipalityActive,
              setIsAspectsActive: setIsAspectsActive,
              clearAspects: clearAspects,
              fetchMunicipalities: fetchMunicipalities,
              fetchAspects: fetchAspects,
              intelligenceLevelInputError: intelligenceLevelInputError,
              setIntelligenceLevelInputError: setIntelligenceLevelInputError,
              handleIntelligenceLevelChange: handleIntelligenceLevelChange,
            }}
          />
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
            legalBasis: legalBasis,
            deleteLegalBasisBatch: removeLegalBasisBatch,
            setSelectedKeys: setSelectedKeys,
            check: check,
          }}
        />
      )}
      {isFilterModalOpen && (
        <FilterModal
          config={{
            formData: formData,
            getLegalBasisBySubjectAndFilters: fetchLegalBasisBySubjectAndFilters,
            isOpen: openFilterModal,
            onClose: closeFilterModal,
            jurisdictionError: jurisdictionInputError,
            setJurisdictionError: setJurisdictionInputError,
            handleJurisdictionChange: handleJurisdictionChange,
            states: states,
            stateError: stateInputError,
            setStateError: setStateInputError,
            isStateActive: isStateActive,
            handleStateChange: handleStateChange,
            clearMunicipalities: clearMunicipalities,
            municipalities: municipalities,
            municipalityError: municipalityInputError,
            setMunicipalityError: setMunicipalityInputError,
            isMunicipalityActive: isMunicipalityActive,
            loadingMunicipalities: loadingMunicipalities,
            errorMunicipalities: errorMunicipalities,
            handleMunicipalityChange: handleMunicipalityChange,
            subjects: subjects,
            subjectInputError: subjectInputError,
            setSubjectError: setSubjectInputError,
            handleSubjectChange: handleSubjectChange,
            aspects: aspects,
            aspectError: aspectInputError,
            setAspectInputError: setAspectInputError,
            isAspectsActive: isAspectsActive,
            aspectsLoading: aspectsLoading,
            errorAspects: aspectError,
            handleAspectsChange: handleAspectsChange,
          }}
        />
      )}


    </div>
  );
}
