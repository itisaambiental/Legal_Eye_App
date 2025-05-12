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
import useRequirement from "../../hooks/requirement/useRequirements.jsx";
import useSubjects from "../../hooks/subject/useSubjects.jsx";
import useAspects from "../../hooks/aspect/useAspects.jsx";
import TopContent from "./TopContent.jsx";
import RequirementCell from "./RequirementCell.jsx";
import BottomContent from "../utils/BottomContent.jsx";
import DescriptionModal from "./TextArea/DescriptionModal.jsx";
import Error from "../utils/Error.jsx";
import CreateModal from "./CreateModal.jsx";
import EditModal from "./EditModal.jsx";
import DeleteModal from "./deleteModal.jsx";
import { toast } from "react-toastify";
import check from "../../assets/check.png";
import trash_icon from "../../assets/papelera-mas.png";

const columns = [
  { name: "Orden", uid: "requirement_number", align: "start" },
  { name: "Requerimiento/Nombre", uid: "requirement_name", align: "start" },
  { name: "Condición", uid: "requirement_condition", align: "start" },
  { name: "Evidencia", uid: "evidence", align: "start" },
  { name: "Periodicidad", uid: "periodicity", align: "start" },
  { name: "Materia", uid: "subject", align: "start" },
  { name: "Aspectos", uid: "aspects", align: "start" },
  { name: "Descripción Obligatoria", uid: "mandatory_description", align: "start" },
  { name: "Descripción Complementaria", uid: "complementary_description", align: "start" },
  { name: "Frases Obligatorias", uid: "mandatory_sentences", align: "start" },
  { name: "Frases Complementarias", uid: "complementary_sentences", align: "start" },
  { name: "Palabras Clave Obligatorias", uid: "mandatory_keywords", align: "start" },
  { name: "Palabras Clave Complementarias", uid: "complementary_keywords", align: "start" },
  { name: "Acciones", uid: "actions", align: "center" },
];

/**
 * Requirements component
 *
 * This component provides a Requirements management interface, including features for listing, filtering,
 * pagination, role-based filtering, and CRUD operations. Requirements can be added, edited, or deleted,
 * with appropriate feedback displayed for each action.
 *
 * @returns {JSX.Element} Rendered Requirements  component, displaying the requirements  management interface with
 * filters, pagination, and modals for adding, editing, and deleting Requirements.
 *
 */
export default function Requirements() {
  const {
    requirements,
    loading,
    error,
    addRequirement,
    fetchRequirements,
    fetchRequirementsByNumber,
    fetchRequirementsByName,
    fetchRequirementsByCondition,
    fetchRequirementsByEvidence,
    fetchRequirementsByPeriodicity,
    fetchRequirementsByMandatoryDescription,
    fetchRequirementsBySubject,
    fetchRequirementsBySubjectAndAspects,
    fetchRequirementsByComplementaryDescription,
    fetchRequirementsByMandatorySentences,
    fetchRequirementsByComplementarySentences,
    fetchRequirementsByMandatoryKeywords,
    fetchRequirementsByComplementaryKeywords,
    modifyRequirement,
    removeRequirement,
    removeRequirementBatch,
  } = useRequirement();
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
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [filterByNumber, setFilterByNumber] = useState("");
  const [filterByName, setFilterByName] = useState("");
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [selectedPeriodicity, setSelectedPeriodicity] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedAspects, setSelectedAspects] = useState([]);
  const [filterByMandatoryDescription, setFilterByMandatoryDescription] = useState("");
  const [filterByComplementaryDescription, setFilterByComplementaryDescription] = useState("");
  const [filterByMandatorySentences, setFilterByMandatorySentences] = useState("");
  const [filterByComplementarySentences, setFilterByComplementarySentences] = useState("");
  const [filterByMandatoryKeywords, setFilterByMandatoryKeywords] = useState("");
  const [filterByComplementaryKeywords, setFilterByComplementaryKeywords] = useState("");
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const debounceTimeout = useRef(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState(null);
  const [numberInputError, setNumberInputError] = useState("");
  const [nameInputError, setNameInputError] = useState("");
  const [conditionInputError, setConditionInputError] = useState("");
  const [evidenceInputError, setEvidenceInputError] = useState("");
  const [periodicityInputError, setPeriodicityInputError] = useState("");
  const [specifyEvidenceInputError, setSpecifyEvidenceInputError] = useState ("");
  const [subjectInputError, setSubjectInputError] = useState("");
  const [aspectInputError, setAspectInputError] = useState(null);
  const [isAspectsActive, setIsAspectsActive] = useState(false);
  const [mandatoryDescriptionInputError, setMandatoryDescriptionInputError] = useState("");
  const [complementaryDescriptionInputError, setComplementaryDescriptionInputError] = useState("");
  const [mandatorySentencesInputError, setMandatorySentencesInputError] = useState("");
  const [complementarySentencesInputError, setComplementarySentencesInputError] = useState("");
  const [mandatoryKeywordsInputError, setMandatoryKeywordsInputError] = useState("");
  const [complementaryKeywordsInputError, setComplementaryKeywordsInputError] = useState("");
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const [isDeletingBatch, setIsDeletingBatch] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    number: "",
    name: "",
    condition: "",
    evidence: "",
    specifyEvidence: "",
    periodicity: "",
    subject: "",
    aspects: [],
    mandatoryDescription: "",
    complementaryDescription: "",
    mandatorySentences: "",
    complementarySentences: "",
    mandatoryKeywords: "",
    complementaryKeywords: "",

  });

  useEffect(() => {
    if (!loading && isFirstRender) {
      setIsFirstRender(false);
    }
  }, [loading, isFirstRender]);

  const handleClear = useCallback(() => {
    setFilterByNumber("");
    setFilterByName("");
    setSelectedCondition(null);
    setSelectedEvidence(null);
    setSelectedPeriodicity(null);
    setSelectedSubject(null);
    setSelectedAspects([]);
    setFilterByMandatoryDescription("");
    setFilterByComplementaryDescription("");
    setFilterByMandatorySentences("");
    setFilterByComplementarySentences("");
    setFilterByMandatoryKeywords("");
    setFilterByComplementaryKeywords("");
    setFilterByMandatoryDescription("");
    setFilterByComplementaryDescription("");
    setFilterByMandatorySentences("");
    setFilterByComplementarySentences("");
    setFilterByMandatoryKeywords("");
    setFilterByComplementaryKeywords("");
    fetchRequirements();
  }, [fetchRequirements]);

  const resetSubjectAndAspects = useCallback(() => {
    if (selectedSubject) {
      setSelectedSubject(null);
      setSelectedAspects([]);
      clearAspects();
    }
  }, [selectedSubject, clearAspects]);


  const handleFilter = useCallback(
    (field, value) => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
      debounceTimeout.current = setTimeout(async () => {
        setPage(1);
        setIsSearching(true);
        switch (field) {
          case "number":
            await fetchRequirementsByNumber(value);
            break;
          case "name":
            await fetchRequirementsByName(value);
            break;
          case "condition":
            await fetchRequirementsByCondition(value);
            break;
          case "evidence":
            await fetchRequirementsByEvidence(value);
            break;
          case "periodicity":
            await fetchRequirementsByPeriodicity(value);
            break;
          case "subject":
            await fetchRequirementsBySubject(value);
            await fetchAspects(value);
            break;
          case "subjectAndAspects": {
            const { subjectId, aspectsIds } = value;
            await fetchRequirementsBySubjectAndAspects(subjectId, aspectsIds);
            break;
          }
          case "mandatoryDescription":
            await fetchRequirementsByMandatoryDescription(value);
            break;
          case "complementaryDescription":
            await fetchRequirementsByComplementaryDescription(value);
            break;
          case "mandatorySentences":
            await fetchRequirementsByMandatorySentences(value);
            break;
          case "complementarySentences":
            await fetchRequirementsByComplementarySentences(value);
            break;
          case "mandatoryKeywords":
            await fetchRequirementsByMandatoryKeywords(value);
            break;
          case "complementaryKeywords":
            await fetchRequirementsByComplementaryKeywords(value);
            break;
          default:
            break;
        }
        setIsSearching(false);
      }, 500);
    },
    [
      fetchRequirementsByNumber,
      fetchRequirementsByName,
      fetchRequirementsByCondition,
      fetchRequirementsByEvidence,
      fetchRequirementsByPeriodicity,
      fetchRequirementsBySubject,
      fetchAspects,
      fetchRequirementsBySubjectAndAspects,
      fetchRequirementsByMandatoryDescription,
      fetchRequirementsByComplementaryDescription,
      fetchRequirementsByMandatorySentences,
      fetchRequirementsByComplementarySentences,
      fetchRequirementsByMandatoryKeywords,
      fetchRequirementsByComplementaryKeywords,
    ]
  );

  const handleFilterByNumber = useCallback(
    (value) => {
      if (value.trim() === "") {
        handleClear();
        return;
      }
      setFilterByName("");
      setFilterByNumber(value);
      setFilterByMandatoryDescription("");
      setFilterByComplementaryDescription("");
      setFilterByMandatorySentences("");
      setFilterByComplementarySentences("");
      setFilterByMandatoryKeywords("");
      setFilterByComplementaryKeywords("");
      setSelectedCondition("");
      setSelectedEvidence("");
      setSelectedPeriodicity("");
      resetSubjectAndAspects();
      handleFilter("number", value);
    },
    [
      handleFilter,
      handleClear,
      resetSubjectAndAspects,
    ]
  );

  const handleFilterByName = useCallback(
    (value) => {
      if (value.trim() === "") {
        handleClear();
        return;
      }
      setFilterByNumber("");
      setFilterByName(value);
      setFilterByMandatoryDescription("");
      setFilterByComplementaryDescription("");
      setFilterByMandatorySentences("");
      setFilterByComplementarySentences("");
      setFilterByMandatoryKeywords("");
      setFilterByComplementaryKeywords("");
      setSelectedCondition("");
      setSelectedEvidence("");
      setSelectedPeriodicity("");
      resetSubjectAndAspects();
      handleFilter("name", value);
    },
    [
      handleFilter,
      handleClear,
      resetSubjectAndAspects,
    ]
  );

  const handleFilterByCondition = useCallback(
    (condition) => {
      if (!condition) {
        handleClear();
        return;
      }
      setFilterByNumber("");
      setFilterByName("");
      setFilterByMandatoryDescription("");
      setFilterByComplementaryDescription("");
      setFilterByMandatorySentences("");
      setFilterByComplementarySentences("");
      setFilterByMandatoryKeywords("");
      setFilterByComplementaryKeywords("");
      setSelectedCondition(condition);
      setSelectedEvidence("");
      setSelectedPeriodicity("");
      resetSubjectAndAspects();
      handleFilter("condition", condition);
    },
    [handleFilter, handleClear, resetSubjectAndAspects]
  );

  const handleFilterByEvidence = useCallback(
    (evidence) => {
      if (!evidence) {
        handleClear();
        return;
      }
      setFilterByNumber("");
      setFilterByName("");
      setFilterByMandatoryDescription("");
      setFilterByComplementaryDescription("");
      setFilterByMandatorySentences("");
      setFilterByComplementarySentences("");
      setFilterByMandatoryKeywords("");
      setFilterByComplementaryKeywords("");
      setSelectedCondition("");
      setSelectedEvidence(evidence);
      setSelectedPeriodicity("");
      resetSubjectAndAspects();
      handleFilter("evidence", evidence);
    },
    [handleFilter, handleClear, resetSubjectAndAspects]
  );

  const handleFilterByPeriodicity = useCallback(
    (periodicity) => {
      if (!periodicity) {
        handleClear();
        return;
      }
      setFilterByNumber("");
      setFilterByName("");
      setFilterByMandatoryDescription("");
      setFilterByComplementaryDescription("");
      setFilterByMandatorySentences("");
      setFilterByComplementarySentences("");
      setFilterByMandatoryKeywords("");
      setFilterByComplementaryKeywords("");
      setSelectedCondition("");
      setSelectedEvidence("");
      setSelectedPeriodicity(periodicity);
      resetSubjectAndAspects();
      handleFilter("periodicity", periodicity);
    },
    [handleFilter, handleClear, resetSubjectAndAspects]
  );

  const handleFilterBySubject = useCallback(
    (selectedId) => {
      if (!selectedId) {
        handleClear();
        return;
      }
      setFilterByName("");
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
      const value = {
        subjectId: selectedSubject,
        aspectsIds: Array.from(selectedIds),
      };
      handleFilter("subjectAndAspects", value);
    },
    [handleFilter, handleClear, selectedSubject]
  );

  const handleFilterByMandatoryDescription = useCallback(
    (value) => {
      if (value.trim() === "") {
        handleClear();
        return;
      }
      setFilterByNumber("");
      setFilterByName("");
      setSelectedCondition("");
      setSelectedEvidence("");
      setSelectedPeriodicity("");
      setFilterByComplementaryDescription("");
      setFilterByMandatorySentences("");
      setFilterByComplementarySentences("");
      setFilterByMandatoryKeywords("");
      setFilterByComplementaryKeywords("");
      resetSubjectAndAspects();
      setFilterByMandatoryDescription(value);
      handleFilter("mandatoryDescription", value);
    },
    [handleFilter, handleClear, resetSubjectAndAspects]
  );

  const handleFilterByComplementaryDescription = useCallback(
    (value) => {
      if (value.trim() === "") {
        handleClear();
        return;
      }
      setFilterByNumber("");
      setFilterByName("");
      setSelectedCondition("");
      setSelectedEvidence("");
      setSelectedPeriodicity("");
      setFilterByMandatoryDescription("");
      setFilterByMandatorySentences("");
      setFilterByComplementarySentences("");
      setFilterByMandatoryKeywords("");
      setFilterByComplementaryKeywords("");
      resetSubjectAndAspects();
      setFilterByComplementaryDescription(value);
      handleFilter("complementaryDescription", value);
    },
    [handleFilter, handleClear, resetSubjectAndAspects]
  );


  const handleFilterByMandatorySentences = useCallback(
    (value) => {
      if (value.trim() === "") {
        handleClear();
        return;
      }
      setFilterByNumber("");
      setFilterByName("");
      setSelectedCondition("");
      setSelectedEvidence("");
      setSelectedPeriodicity("");
      setFilterByMandatoryDescription("");
      setFilterByComplementaryDescription("");
      setFilterByComplementarySentences("");
      setFilterByMandatoryKeywords("");
      setFilterByComplementaryKeywords("");
      resetSubjectAndAspects();
      setFilterByMandatorySentences(value);
      handleFilter("mandatorySentences", value);
    },
    [handleFilter, handleClear, resetSubjectAndAspects]
  );

  const handleFilterByComplementarySentences = useCallback(
    (value) => {
      if (value.trim() === "") {
        handleClear();
        return;
      }
      setFilterByNumber("");
      setFilterByName("");
      setSelectedCondition("");
      setSelectedEvidence("");
      setSelectedPeriodicity("");
      setFilterByMandatoryDescription("");
      setFilterByComplementaryDescription("");
      setFilterByMandatorySentences("");
      setFilterByMandatoryKeywords("");
      setFilterByComplementaryKeywords("");
      resetSubjectAndAspects();
      setFilterByComplementarySentences(value);
      handleFilter("complementarySentences", value);
    },
    [handleFilter, handleClear, resetSubjectAndAspects]
  );

  const handleFilterByMandatoryKeywords = useCallback(
    (value) => {
      if (value.trim() === "") {
        handleClear();
        return;
      }
      setFilterByNumber("");
      setFilterByName("");
      setSelectedCondition("");
      setSelectedEvidence("");
      setSelectedPeriodicity("");
      setFilterByMandatoryDescription("");
      setFilterByComplementaryDescription("");
      setFilterByMandatorySentences("");
      setFilterByComplementarySentences("");
      setFilterByComplementaryKeywords("");
      resetSubjectAndAspects();
      setFilterByMandatoryKeywords(value);
      handleFilter("mandatoryKeywords", value);
    },
    [handleFilter, handleClear, resetSubjectAndAspects]
  );

  const handleFilterByComplementaryKeywords = useCallback(
    (value) => {
      if (value.trim() === "") {
        handleClear();
        return;
      }
      setFilterByNumber("");
      setFilterByName("");
      setSelectedCondition("");
      setSelectedEvidence("");
      setSelectedPeriodicity("");
      setFilterByMandatoryDescription("");
      setFilterByComplementaryDescription("");
      setFilterByMandatorySentences("");
      setFilterByComplementarySentences("");
      setFilterByMandatoryKeywords("");
      resetSubjectAndAspects();
      setFilterByComplementaryKeywords(value);
      handleFilter("complementaryKeywords", value);
    },
    [handleFilter, handleClear, resetSubjectAndAspects]
  );

  const openModalCreate = () => {
    setFormData({
      id: "",
      number: "",
      name: "",
      condition: "",
      evidence: "",
      specifyEvidence: "", 
      periodicity: "",
      subject: "",
      aspects: [],
      mandatoryDescription: "",
      complementaryDescription: "",
      mandatorySentences: "",
      complementarySentences: "",
      mandatoryKeywords: "",
      complementaryKeywords: "",
    });
    setIsCreateModalOpen(true);
  };  

  const closeModalCreate = () => {
    setIsCreateModalOpen(false);
    setNumberInputError("");
    setNameInputError("");
    setConditionInputError("");
    setEvidenceInputError("");
    setPeriodicityInputError("");
    setSubjectInputError(null);
    setAspectInputError(null);
    setIsAspectsActive(false);
    clearAspects();
    setMandatoryDescriptionInputError("");
    setComplementaryDescriptionInputError("");
    setMandatorySentencesInputError("");
    setComplementarySentencesInputError("");
    setMandatoryKeywordsInputError("");
    setComplementaryKeywordsInputError("");
  };

  const openEditModal = (requirement) => {
    setSelectedRequirement(requirement);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedRequirement(null);
    setNumberInputError("");
    setNameInputError("");
    setConditionInputError("");
    setEvidenceInputError("");
    setPeriodicityInputError("");
    setSubjectInputError(null);
    setAspectInputError(null);
    setIsAspectsActive(false);
    clearAspects();
    setMandatoryDescriptionInputError("");
    setComplementaryDescriptionInputError("");
    setMandatorySentencesInputError("");
    setComplementarySentencesInputError("");
    setMandatoryKeywordsInputError("");
    setComplementaryKeywordsInputError("");
  }

  const handleNumberChange = useCallback(
    (e) => {
      const { value } = e.target;
      setFormData((prevFormData) => ({
        ...prevFormData,
        number: value,
      }));
      if (numberInputError && value.trim() !== "") {
        setNumberInputError(null);
      }
    },
    [numberInputError, setFormData, setNumberInputError]
  );


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

  const handleConditionChange = useCallback(
    (value) => {
      if (!value) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          condition: "",
        }));
        if (conditionInputError) {
          setConditionInputError(null)
        }
        return;
      }
      setFormData((prevFormData) => ({
        ...prevFormData,
        condition: value,
      }));
      if (conditionInputError && value.trim() !== "") {
        setConditionInputError(null);
      }
    },
    [conditionInputError, setFormData, setConditionInputError]
  )


  const handleEvidenceChange = useCallback(
    (value) => {
      setFormData((prev) => ({
        ...prev,
        evidence: value,
        specifyEvidence: value === "Específica" ? prev.specifyEvidence : "",
      }));
      if (evidenceInputError && value.trim() !== "") {
        setEvidenceInputError(null);
      }
    },
    [evidenceInputError, setFormData, setEvidenceInputError]
  );

  const handlSpecifyEvidenceChange = useCallback((e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      specifyEvidence: value,
    }));
    if (specifyEvidenceInputError && value.trim() !== "") {
      setSpecifyEvidenceInputError(null);
    }
  }, [specifyEvidenceInputError, setFormData, setSpecifyEvidenceInputError]);

  const handlePeriodicityChange = useCallback(
    (value) => {
      setFormData((prev) => ({
        ...prev,
        periodicity: value,
      }));
      if (periodicityInputError && value.trim() !== "") {
        setPeriodicityInputError(null);
      }
    },
    [periodicityInputError, setFormData, setPeriodicityInputError]
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

  const handleMandatoryDescriptionChange = useCallback(
    (e) => {
      const { value } = e.target;
      setFormData((prevFormData) => ({
        ...prevFormData,
        mandatoryDescription: value,
      }));
      if (mandatoryDescriptionInputError && value.trim() !== "") {
        setMandatoryDescriptionInputError(null);
      }
    },
    [mandatoryDescriptionInputError, setFormData, setMandatoryDescriptionInputError]
  )

  const handleComplementaryDescriptionChange = useCallback(
    (e) => {
      const { value } = e.target;
      setFormData((prevFormData) => ({
        ...prevFormData,
        complementaryDescription: value,
      }));
      if (complementaryDescriptionInputError && value.trim() !== "") {
        setComplementaryDescriptionInputError(null);
      }
    },
    [complementaryDescriptionInputError, setFormData, setComplementaryDescriptionInputError]
  )

  const handleMandatorySentencesChange = useCallback(
    (e) => {
      const { value } = e.target;
      setFormData((prevFormData) => ({
        ...prevFormData,
        mandatorySentences: value,
      }));
      if (mandatorySentencesInputError && value.trim() !== "") {
        setMandatorySentencesInputError(null);
      }
    },
    [mandatorySentencesInputError, setFormData, setMandatorySentencesInputError]
  )

  const handleComplementarySentencesChange = useCallback(
    (e) => {
      const { value } = e.target;
      setFormData((prevFormData) => ({
        ...prevFormData,
        complementarySentences: value,
      }));
      if (complementarySentencesInputError && value.trim() !== "") {
        setComplementarySentencesInputError(null);
      }
    },
    [complementarySentencesInputError, setFormData, setComplementarySentencesInputError]
  )


  const handleMandatoryKeywordsChange = useCallback(
    (e) => {
      const { value } = e.target;
      setFormData((prevFormData) => ({
        ...prevFormData,
        mandatoryKeywords: value,
      }));
      if (mandatoryKeywordsInputError && value.trim() !== "") {
        setMandatoryKeywordsInputError(null);
      }
    },
    [mandatoryKeywordsInputError, setFormData, setMandatoryKeywordsInputError]
  )

  const handleComplementaryKeywordsChange = useCallback(
    (e) => {
      const { value } = e.target;
      setFormData((prevFormData) => ({
        ...prevFormData,
        complementaryKeywords: value,
      }));
      if (complementaryKeywordsInputError && value.trim() !== "") {
        setComplementaryKeywordsInputError(null);
      }
    },
    [complementaryKeywordsInputError, setFormData, setComplementaryKeywordsInputError]
  )


  const totalPages = useMemo(
    () => Math.ceil(requirements.length / rowsPerPage),
    [requirements, rowsPerPage]
  );

  const onRowsPerPageChange = useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const openModalDescription = (requirement, field, title) => {
    setSelectedRequirement({
      title: title,
      description: requirement[field]
    });
    setShowDescriptionModal(true);
  };


  const closeModalDescription = () => {
    setShowDescriptionModal(false);
    setSelectedRequirement(null);
  };

  const openDeleteModal = () => setShowDeleteModal(true);
  const closeDeleteModal = () => setShowDeleteModal(false);
  const onPageChange = (newPage) => setPage(newPage);
  const onPreviousPage = () => setPage((prev) => Math.max(prev - 1, 1));
  const onNextPage = () => setPage((prev) => Math.min(prev + 1, totalPages));

  const handleDelete = useCallback(
    async (requirementId) => {
      const toastId = toast.loading("Eliminando requerimiento...", {
        icon: <Spinner size="sm" />,
        progressStyle: {
          background: "#113c53",
        },
      });
      try {
        const { success, error } = await removeRequirement(requirementId);
        if (success) {
          toast.update(toastId, {
            render: "Requerimiento eliminado con éxito",
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
            "Algo mal sucedió al eliminar el requerimiento. Intente de nuevo.",
          type: "error",
          icon: null,
          progressStyle: {},
          isLoading: false,
          autoClose: 5000,
        });
      }
    },
    [removeRequirement]
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
  if (subjectError)
    return <Error title={subjectError.title} message={subjectError.message} />;
  if (aspectError && !isCreateModalOpen && !isEditModalOpen)
    return <Error title={aspectError.title} message={aspectError.message} />;

  return (
    <div className="mt-24 mb-4 -ml-60 mr-4 lg:-ml-0 lg:mr-0 xl:-ml-0 xl:mr-0 flex justify-center items-center flex-wrap">
      <TopContent
        config={{
          isCreateModalOpen: isCreateModalOpen,
          isEditModalOpen: isEditModalOpen,
          openModalCreate: openModalCreate,
          onRowsPerPageChange: onRowsPerPageChange,
          totalRequirements: requirements.length,
          filterByNumber: filterByNumber,
          onFilterByNumber: handleFilterByNumber,
          filterByName: filterByName,
          onFilterByName: handleFilterByName,
          onClear: handleClear,
          subjects: subjects,
          selectedSubject: selectedSubject,
          subjectLoading: subjectLoading,
          onFilterBySubject: handleFilterBySubject,
          aspects: aspects,
          selectedAspects: selectedAspects,
          aspectsLoading: aspectsLoading,
          onFilterByAspects: handleFilterByAspects,
          selectedCondition: selectedCondition,
          onFilterByCondition: handleFilterByCondition,
          selectedEvidence: selectedEvidence,
          onFilterByEvidence: handleFilterByEvidence,
          selectedPeriodicity: selectedPeriodicity,
          onFilterByPeriodicity: handleFilterByPeriodicity,
          onFilterByMandatoryDescription: handleFilterByMandatoryDescription,
          filterByMandatoryDescription: filterByMandatoryDescription,
          filterByComplementaryDescription: filterByComplementaryDescription,
          onFilterByComplementaryDescription: handleFilterByComplementaryDescription,
          filterByMandatorySentences: filterByMandatorySentences,
          onFilterByMandatorySentences: handleFilterByMandatorySentences,
          filterByComplementarySentences: filterByComplementarySentences,
          onFilterByComplementarySentences: handleFilterByComplementarySentences,
          filterByMandatoryKeywords: filterByMandatoryKeywords,
          onFilterByMandatoryKeywords: handleFilterByMandatoryKeywords,
          filterByComplementaryKeywords: filterByComplementaryKeywords,
          onFilterByComplementaryKeywords: handleFilterByComplementaryKeywords,
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
            aria-label="Tabla de requerimientos"
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
              items={requirements.slice(
                (page - 1) * rowsPerPage,
                page * rowsPerPage
              )}
              emptyContent="No hay requerimientos para mostrar"
            >
              {(requirement) => (
                <TableRow key={requirement.id}>
                  {(columnKey) => (
                    <TableCell>
                      <RequirementCell
                        requirement={requirement}
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
                  <img src={trash_icon} alt="delete" className="w-5 h-5" />
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
            filteredItems: requirements,
          }}
        />
        {selectedRequirement && (
          <DescriptionModal
            isOpen={showDescriptionModal}
            onClose={closeModalDescription}
            title={selectedRequirement?.title || ""}
            description={selectedRequirement?.description || ""}
          />
        )}

        {isCreateModalOpen && (
          <CreateModal
            config={{
              isOpen: isCreateModalOpen,
              closeModalCreate: closeModalCreate,
              formData: formData,
              addRequirement: addRequirement,
              numberError: numberInputError,
              setNumberError: setNumberInputError,
              handleNumberChange: handleNumberChange,
              nameError: nameInputError,
              setNameError: setNameInputError,
              handleNameChange: handleNameChange,
              conditionError: conditionInputError,
              setConditionError: setConditionInputError,
              handleConditionChange: handleConditionChange,
              evidenceError: evidenceInputError,
              setEvidenceError: setEvidenceInputError,
              handleEvidenceChange: handleEvidenceChange,
              periodicityError: periodicityInputError,
              setPeriodicityError: setPeriodicityInputError,
              handlePeriodicityChange: handlePeriodicityChange,
              specifyEvidenceError: specifyEvidenceInputError,
              setSpecifyEvidenceError: setSpecifyEvidenceInputError,
              handlSpecifyEvidenceChange:handlSpecifyEvidenceChange,
              specifyEvidence: formData.specifyEvidence,
              fetchRequirements: fetchRequirements,
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
              mandatoryDescriptionError: mandatoryDescriptionInputError,
              handleMandatoryDescriptionChange: handleMandatoryDescriptionChange,
              setMandatoryDescriptionError: setMandatoryDescriptionInputError,
              complementaryDescriptionError: complementaryDescriptionInputError,
              handleComplementaryDescriptionChange: handleComplementaryDescriptionChange,
              setComplementaryDescriptionError: setComplementaryDescriptionInputError,
              mandatorySentencesError: mandatorySentencesInputError,
              handleMandatorySentencesChange: handleMandatorySentencesChange,
              setMandatorySentencesError: setMandatorySentencesInputError,
              complementarySentencesError: complementarySentencesInputError,
              handleComplementarySentencesChange: handleComplementarySentencesChange,
              setComplementarySentencesError: setComplementarySentencesInputError,
              mandatoryKeywordsError: mandatoryKeywordsInputError,
              handleMandatoryKeywordsChange: handleMandatoryKeywordsChange,
              setMandatoryKeywordsError: setMandatoryKeywordsInputError,
              complementaryKeywordsError: complementaryKeywordsInputError,
              handleComplementaryKeywordsChange: handleComplementaryKeywordsChange,
              setComplementaryKeywordsError: setComplementaryKeywordsInputError,
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
              editRequirement: modifyRequirement,
              selectedRequirement: selectedRequirement,
              numberError: numberInputError,
              setNumberError: setNumberInputError,
              handleNumberChange: handleNumberChange,
              nameError: nameInputError,
              setNameError: setNameInputError,
              handleNameChange: handleNameChange,
              conditionError: conditionInputError,
              setConditionError: setConditionInputError,
              handleConditionChange: handleConditionChange,
              evidenceError: evidenceInputError,
              setEvidenceError: setEvidenceInputError,
              handleEvidenceChange: handleEvidenceChange,
              periodicityError: periodicityInputError,
              setPeriodicityError: setPeriodicityInputError,
              handlePeriodicityChange: handlePeriodicityChange,
              specifyEvidenceError: specifyEvidenceInputError,
              setSpecifyEvidenceError: setSpecifyEvidenceInputError,
              handlSpecifyEvidenceChange:handlSpecifyEvidenceChange,
              specifyEvidence: formData.specifyEvidence,
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
              setIsAspectsActive: setIsAspectsActive,
              clearAspects: clearAspects,
              fetchAspects: fetchAspects,
              handleAspectsChange: handleAspectsChange,
              mandatoryDescriptionError: mandatoryDescriptionInputError,
              handleMandatoryDescriptionChange: handleMandatoryDescriptionChange,
              setMandatoryDescriptionError: setMandatoryDescriptionInputError,
              complementaryDescriptionError: complementaryDescriptionInputError,
              handleComplementaryDescriptionChange: handleComplementaryDescriptionChange,
              setComplementaryDescriptionError: setComplementaryDescriptionInputError,
              mandatorySentencesError: mandatorySentencesInputError,
              handleMandatorySentencesChange: handleMandatorySentencesChange,
              setMandatorySentencesError: setMandatorySentencesInputError,
              complementarySentencesError: complementarySentencesInputError,
              handleComplementarySentencesChange: handleComplementarySentencesChange,
              setComplementarySentencesError: setComplementarySentencesInputError,
              mandatoryKeywordsError: mandatoryKeywordsInputError,
              handleMandatoryKeywordsChange: handleMandatoryKeywordsChange,
              setMandatoryKeywordsError: setMandatoryKeywordsInputError,
              complementaryKeywordsError: complementaryKeywordsInputError,
              handleComplementaryKeywordsChange: handleComplementaryKeywordsChange,
              setComplementaryKeywordsError: setComplementaryKeywordsInputError,


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
            requirements: requirements,
            deleteRequirementBatch: removeRequirementBatch,
            setSelectedKeys: setSelectedKeys,
            check: check,
          }}
        />
      )}
    </div>
  );
}