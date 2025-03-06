import { useCallback, useState, useMemo, useRef, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
} from "@heroui/react";
import useRequirement from "../../hooks/requirement/useRequirements.jsx";
import RequirementCell from "./RequirementCell.jsx";
import useCopomex from "../../hooks/copomex/useCopomex.jsx";
import useAspects from "../../hooks/aspect/useAspects.jsx";
import useSubjects from "../../hooks/subject/useSubjects.jsx";
import TopContent from "./TopContent.jsx";
import BottomContent from "../utils/BottomContent.jsx";
import Error from "../utils/Error.jsx";

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
      const [selectedKeys, setSelectedKeys] = useState(new Set());
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
  
  
    useEffect(() => {
      if (!loading && isFirstRender) {
        setIsFirstRender(false);
      }
    }, [loading, isFirstRender]);
  
    const handleClear = useCallback (() => {
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
          await fetchRequirementsByStateAndMunicipalities(state, municipalities);
          break;
        }
        case "subject":
          await fetchRequirementsBySubject(value);
          await fetchAspects(value);
          break;
        case "subjectAndAspects": {
          const { subjectId, aspectsIds } = value;
          await fetchRequirementsBySubjectAndAspects (subjectId, aspectsIds);
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
    
    
    


    const totalPages = useMemo(
      () => Math.ceil(requirements.length / rowsPerPage),
      [requirements, rowsPerPage]
    );
   
      const onRowsPerPageChange = useCallback((e) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
      }, []);

    const onPageChange = (newPage) => setPage(newPage);
    const onPreviousPage = () => setPage((prev) => Math.max(prev - 1, 1));
    const onNextPage = () => setPage((prev) => Math.min(prev + 1, totalPages));
 
    if (loading && isFirstRender) {
      return (
        <div role="status" className="fixed inset-0 flex items-center justify-center">
          <Spinner className="h-10 w-10 transform translate-x-0 lg:translate-x-28 xl:translate-x-32" color="secondary" />
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
          onFilterByPeriodicity:handleFilterByPeriodicity,
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
                 />
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
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
                </>
      </div>
    );
  }