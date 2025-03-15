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
//import { useNavigate } from "react-router-dom";
import useRequirement from "../../hooks/requirement/useRequirements.jsx";
import useSubjects from "../../hooks/subject/useSubjects.jsx";
import useAspects from "../../hooks/aspect/useAspects.jsx";
import useCopomex from "../../hooks/copomex/useCopomex.jsx";
import TopContent from "./TopContent.jsx";
import RequirementCell from "./RequirementCell.jsx";
import BottomContent from "../utils/BottomContent.jsx";
import Error from "../utils/Error.jsx";
import CreateModal from "./CreateModal.jsx";
import EditModal from "./EditModal.jsx";
import DeleteModal from "./deleteModal.jsx";
import { toast } from "react-toastify";
import check from "../../assets/check.png";
import trash_icon from "../../assets/papelera-mas.png";

const columns = [
  { name: "Número", uid: "requirement_number", align: "start" },
  { name: "Nombre", uid: "requirement_name", align: "start" },
  { name: "Condición", uid: "requirement_condition", align: "start" },
  { name: "Evidencia", uid: "evidence", align: "start" },
  { name: "Periodicidad", uid: "periodicity", align: "start" },
  { name: "Tipo", uid: "requirement_type", align: "start" },
  { name: "Jurisdicción", uid: "jurisdiction", align: "start" },
  { name: "Estado", uid: "state", align: "start" },
  { name: "Municipio", uid: "municipality", align: "start" },
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
export default function Requirement() {
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
    fetchRequirementsByType,
    fetchRequirementsByJurisdiction,
    fetchRequirementsByState,
    fetchRequirementsByStateAndMunicipalities,
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
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [filterByNumber, setFilterByNumber] = useState("");
  const [filterByName, setFilterByName] = useState("");
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [selectedPeriodicity, setSelectedPeriodicity] = useState(null);
  const [selectedRequirementType, setSelectedRequirementType] = useState(null);
  const [selectedJurisdiction, setSelectedJurisdiction] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedMunicipalities, setSelectedMunicipalities] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedAspects, setSelectedAspects] = useState([]);
  const [filterByMandatoryDescription, setFilterByMandatoryDescription] = useState("");
  const [filterByComplementaryDescription, setFilterByComplementaryDescription] = useState("");
  const [filterByMandatorySentences, setFilterByMandatorySentences] = useState("");
  const [filterByComplementarySentences, setFilterByComplementarySentences] = useState("");
  const [filterByMandatoryKeywords, setFilterByMandatoryKeywords] = useState("");
  const [filterByComplementaryKeywords, setFilterByComplementaryKeywords] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const debounceTimeout = useRef(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState(null);
  const [numberInputError, setNumberInputError] = useState("");
  const [nameInputError, setNameInputError] = useState("");
  const [conditionInputError, setConditionInputError] = useState("");
  const [evidenceInputError, setEvidenceInputError] = useState("");
  const [periodicityInputError, setPeriodicityInputError] = useState("");
  const [requirementTypeInputError, setRequirementTypeInputError] = useState("");
  const [jurisdictionInputError, setJurisdictionInputError] = useState("");
  const [stateInputError, setStateInputError] = useState("");
  const [municipalityInputError, setMunicipalityInputError] = useState("");
  const [isStateActive, setIsStateActive] = useState(false);
  const [isMunicipalityActive, setIsMunicipalityActive] = useState(false);
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
  const [formData, setFormData] = useState({
    id: "",
    number: "",
    name: "",
    condition: "",
    evidence: "",
    periodicity: "",
    requirementType: "",
    jurisdiction: "",
    state: "",
    municipality: "",
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
    setSelectedRequirementType(null);
    setSelectedJurisdiction(null);
    setSelectedState(null);
    clearAspects();
    clearMunicipalities();
    setSelectedMunicipalities([]);
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
  }, [fetchRequirements, clearMunicipalities, clearAspects]);

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
      console.log(field, value)
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
          case "requirementType":
            await fetchRequirementsByType(value);
            break;
          case "jurisdiction":
            await fetchRequirementsByJurisdiction(value);
            break;
          case "state":
            await fetchRequirementsByState(value);
            await fetchMunicipalities(value);
            break;
          case "stateAndMunicipalities": {
            const { state, municipalities } = value;
            await fetchRequirementsByStateAndMunicipalities(
              state, 
              municipalities
            );
            break;
          }
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
      fetchRequirementsByType,
      fetchRequirementsByJurisdiction,
      fetchRequirementsByState,
      fetchMunicipalities,
      fetchRequirementsByStateAndMunicipalities,
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
      setSelectedRequirementType("");
      setSelectedJurisdiction("");
      setSelectedState("");
      setSelectedMunicipalities([]);
      resetSubjectAndAspects();
      resetStatesAndMunicipalities();
      handleFilter("number", value);
    },
    [
      handleFilter,
      handleClear,
      resetSubjectAndAspects,
      resetStatesAndMunicipalities,
    ]
  );

  const handleFilterByName = useCallback(
    (value) => {
      console.log("Name", value)
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
      setSelectedRequirementType("");
      setSelectedJurisdiction("");
      setSelectedState("");
      setSelectedMunicipalities([]);
      resetSubjectAndAspects();
      resetStatesAndMunicipalities();
      handleFilter("name", value);
    },
    [
      handleFilter,
      handleClear,
      resetSubjectAndAspects,
      resetStatesAndMunicipalities,
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
      setSelectedRequirementType("");
      setSelectedJurisdiction("");
      setSelectedState("");
      setSelectedMunicipalities([]);
      resetSubjectAndAspects();
      resetStatesAndMunicipalities();
      handleFilter("condition", condition);
    },
    [handleFilter, handleClear, resetSubjectAndAspects, resetStatesAndMunicipalities]
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
      setSelectedRequirementType("");
      setSelectedJurisdiction("");
      setSelectedState("");
      setSelectedMunicipalities([]);
      resetSubjectAndAspects();
      resetStatesAndMunicipalities();
      handleFilter("evidence", evidence);
    },
    [handleFilter, handleClear, resetSubjectAndAspects, resetStatesAndMunicipalities]
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
      setSelectedRequirementType("");
      setSelectedJurisdiction("");
      setSelectedState("");
      setSelectedMunicipalities([]);
      resetSubjectAndAspects();
      resetStatesAndMunicipalities();
      handleFilter("periodicity", periodicity);
    },
    [handleFilter, handleClear, resetSubjectAndAspects, resetStatesAndMunicipalities]
  );

  const handleFilterByRequirementType = useCallback(
    (requirementType) => {
      if (!requirementType) {
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
      setSelectedPeriodicity("");
      setSelectedRequirementType(requirementType);
      setSelectedJurisdiction("");
      setSelectedState("");
      setSelectedMunicipalities([]);
      resetSubjectAndAspects();
      resetStatesAndMunicipalities();
      handleFilter("requirementType", requirementType);
    },
    [handleFilter, handleClear, resetSubjectAndAspects, resetStatesAndMunicipalities]
  );

  const handleFilterByJurisdiction = useCallback(
    (jurisdiction) => {
      if (!jurisdiction) {
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
      setSelectedPeriodicity("");
      setSelectedRequirementType("");
      setSelectedJurisdiction(jurisdiction);
      setSelectedState("");
      setSelectedMunicipalities([]);
      resetSubjectAndAspects();
      resetStatesAndMunicipalities();
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
      setSelectedPeriodicity("");
      setSelectedRequirementType("");
      setSelectedJurisdiction("");
      setSelectedState(state);
      setSelectedMunicipalities([]);
      resetSubjectAndAspects();
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

  const handleFilterBySubject = useCallback(
    (selectedId) => {
      if (!selectedId) {
        handleClear();
        return;
      }
      setFilterByName("");
      setSelectedJurisdiction("");
      resetStatesAndMunicipalities();
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
      setSelectedRequirementType("");
      setSelectedJurisdiction("");
      setSelectedState("");
      setSelectedMunicipalities([]);
      setFilterByComplementaryDescription("");
      setFilterByMandatorySentences("");
      setFilterByComplementarySentences("");
      setFilterByMandatoryKeywords("");
      setFilterByComplementaryKeywords("");
      resetSubjectAndAspects();
      resetStatesAndMunicipalities();
      setFilterByMandatoryDescription(value);
      handleFilter("mandatoryDescription", value);
    },
    [handleFilter, handleClear, resetSubjectAndAspects, resetStatesAndMunicipalities]
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
      setSelectedRequirementType("");
      setSelectedJurisdiction("");
      setSelectedState("");
      setSelectedMunicipalities([]);
      setFilterByMandatoryDescription("");
      setFilterByMandatorySentences("");
      setFilterByComplementarySentences("");
      setFilterByMandatoryKeywords("");
      setFilterByComplementaryKeywords("");
      resetSubjectAndAspects();
      resetStatesAndMunicipalities();
      setFilterByComplementaryDescription(value);
      handleFilter("complementaryDescription", value);
    },
    [handleFilter, handleClear, resetSubjectAndAspects, resetStatesAndMunicipalities]
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
      setSelectedRequirementType("");
      setSelectedJurisdiction("");
      setSelectedState("");
      setSelectedMunicipalities([]);
      setFilterByMandatoryDescription("");
      setFilterByComplementaryDescription("");
      setFilterByComplementarySentences("");
      setFilterByMandatoryKeywords("");
      setFilterByComplementaryKeywords("");
      resetSubjectAndAspects();
      resetStatesAndMunicipalities();
      setFilterByMandatorySentences(value);
      handleFilter("mandatorySentences", value);
    },
    [handleFilter, handleClear, resetSubjectAndAspects, resetStatesAndMunicipalities]
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
      setSelectedRequirementType("");
      setSelectedJurisdiction("");
      setSelectedState("");
      setSelectedMunicipalities([]);
      setFilterByMandatoryDescription("");
      setFilterByComplementaryDescription("");
      setFilterByMandatorySentences("");
      setFilterByMandatoryKeywords("");
      setFilterByComplementaryKeywords("");
      resetSubjectAndAspects();
      resetStatesAndMunicipalities();
      setFilterByComplementarySentences(value);
      handleFilter("complementarySentences", value);
    },
    [handleFilter, handleClear, resetSubjectAndAspects, resetStatesAndMunicipalities]
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
      setSelectedRequirementType("");
      setSelectedJurisdiction("");
      setSelectedState("");
      setSelectedMunicipalities([]);
      setFilterByMandatoryDescription("");
      setFilterByComplementaryDescription("");
      setFilterByMandatorySentences("");
      setFilterByComplementarySentences("");
      setFilterByComplementaryKeywords("");
      resetSubjectAndAspects();
      resetStatesAndMunicipalities();
      setFilterByMandatoryKeywords(value);
      handleFilter("mandatoryKeywords", value);
    },
    [handleFilter, handleClear, resetSubjectAndAspects, resetStatesAndMunicipalities]
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
      setSelectedRequirementType("");
      setSelectedJurisdiction("");
      setSelectedState("");
      setSelectedMunicipalities([]);
      setFilterByMandatoryDescription("");
      setFilterByComplementaryDescription("");
      setFilterByMandatorySentences("");
      setFilterByComplementarySentences("");
      setFilterByMandatoryKeywords("");
      resetSubjectAndAspects();
      resetStatesAndMunicipalities();
      setFilterByComplementaryKeywords(value);
      handleFilter("complementaryKeywords", value);
    },
    [handleFilter, handleClear, resetSubjectAndAspects, resetStatesAndMunicipalities]
  );

  const openModalCreate = () => {
    setFormData({
      id: "",
      number: "",
      name: "",
      condition: "",
      evidence: "",
      periodicity: "",
      requirementType: "",
      jurisdiction: "",
      state: "",
      municipality: "",
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
    setRequirementTypeInputError("");
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
    setRequirementTypeInputError("");
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
      setFormData((prevFormData) => ({
        ...prevFormData,
        evidence: value,
      }));
      if (evidenceInputError && value.trim() !== "") {
        setEvidenceInputError(null);
      }
    },
    [evidenceInputError, setFormData, setEvidenceInputError]
  );

  const handlePeriodicityChange = useCallback(
    (value) => {
      setFormData((prevFormData) => ({
        ...prevFormData,
        periodicity: value,
      }));
      if (periodicityInputError && value.trim() !== "") {
        setPeriodicityInputError(null);
      }
    },
    [periodicityInputError, setFormData, setPeriodicityInputError]
  );


  const handleRequirementType = useCallback(

    (value) => {
      setFormData((prevFormData) => ({
        ...prevFormData,
        requirementType: value,
      }));
      if (requirementTypeInputError && value.trim() !== "") {
        setRequirementTypeInputError(null);
      }
    },
    [requirementTypeInputError, setFormData, setRequirementTypeInputError]
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
      <div role="status" 
      className="fixed inset-0 flex items-center justify-center"
      >
        <Spinner 
        className="h-10 w-10 transform translate-x-0 lg:translate-x-28 xl:translate-x-32" 
        color="secondary" />
      </div>
    );
  }

  if (error) return <Error title={error.title} message={error.message} />;
  if (subjectError)
    return <Error title={subjectError.title} message={subjectError.message} />;
  if (aspectError)
    return <Error title={aspectError.title} message={aspectError.message} />;
  if (errorStates)
    return <Error title={errorStates.title} message={errorStates.message} />;

  if (errorMunicipalities) {
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
          selectedRequirementType: selectedRequirementType,
          onFilterByMandatoryDescription: handleFilterByMandatoryDescription,
          onFilterByRequirementType: handleFilterByRequirementType,
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
              requirementTypeError: requirementTypeInputError,
              setRequirementTypeError: setRequirementTypeInputError,
              handleRequirementType: handleRequirementType,
              jurisdictionError: jurisdictionInputError,
              setJurisdictionError: setJurisdictionInputError,
              handleJurisdictionChange: handleJurisdictionChange,
              states: states,
              stateError: stateInputError,
              setStateError: setStateInputError,
              fetchRequirements: fetchRequirements,
              isStateActive: isStateActive,
              handleStateChange: handleStateChange,
              clearMunicipalities: clearMunicipalities,
              municipalities: municipalities,
              municipalityError: municipalityInputError,
              setMunicipalityError: setMunicipalityInputError,
              isMunicipalityActive: isMunicipalityActive,
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
              editRequirement:modifyRequirement, 
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
              requirementTypeError: requirementTypeInputError,
              setRequirementTypeError: setRequirementTypeInputError,
              handleRequirementType: handleRequirementType,
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
              setIsStateActive: setIsStateActive,
              setIsMunicipalityActive: setIsMunicipalityActive,
              setIsAspectsActive: setIsAspectsActive,
              clearAspects: clearAspects,
              fetchMunicipalities: fetchMunicipalities,
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
            requirement: requirements,
            deleteRequirementBatch: removeRequirementBatch,
            setSelectedKeys: setSelectedKeys,
            check: check,
          }}
        />
      )}
    </div>
  );
}