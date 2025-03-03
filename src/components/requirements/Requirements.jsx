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
      fetchRequirementsByRequirementType,
      fetchRequirementsByJurisdiction,
      fetchRequirementsByState,
      fetchRequirementsByStateAndMunicipalities,
      fetchRequirementsByMandatoryDescription,
      fetchRequirementsBySubject,
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
          await fetchRequirementsByRequirementType(value);
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
    fetchRequirementsByRequirementType,
    fetchRequirementsByJurisdiction,
    fetchRequirementsByState,
    fetchMunicipalities,
    fetchRequirementsByStateAndMunicipalities,
    fetchRequirementsBySubject,
    fetchAspects,
    fetchRequirementsByMandatoryDescription,
    fetchRequirementsByComplementaryDescription,
    fetchRequirementsByMandatorySentences,
    fetchRequirementsByComplementarySentences,
    fetchRequirementsByMandatoryKeywords,
    fetchRequirementsByComplementaryKeywords,
  ]
);


    const handleFilterByName = useCallback(
      (value) => {
        if (value.trim() === "") {
          handleClear();
          return;
        }
        setFilterByName(value);
        setFilterByNumber("");
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
          onFilterByNumber: setFilterByNumber,
          filterByName: filterByName,
          onFilterByName: handleFilterByName,
          onClear: handleClear,
          subjects: subjects,
          selectedSubject: selectedSubject,
          subjectLoading: subjectLoading,
          onFilterBySubject: setSelectedSubject,
          aspects: aspects,
          selectedAspects: selectedAspects,
          aspectsLoading: aspectsLoading,
          onFilterByAspects: setSelectedAspects,
          selectedCondition: selectedCondition,
          onFilterByCondition: setSelectedCondition,
          selectedEvidence: selectedEvidence,
          onFilterByEvidence: setSelectedEvidence,
          selectedPeriodicity: selectedPeriodicity,
          onFilterByPeriodicity: setSelectedPeriodicity,
          selectedJurisdiction: selectedJurisdiction,
          onFilterByJurisdiction: setSelectedJurisdiction,
          states: states,
          selectedState: selectedState,
          stateLoading: loadingStates,
          onFilterByState: setSelectedState,
          municipalities: municipalities, 
          selectedMunicipalities: selectedMunicipalities, 
          municipalitiesLoading: loadingMunicipalities,
          onFilterByMunicipalities: setSelectedMunicipalities,
          selectedRequirementType: selectedRequirementType,
          onFilterByRequirementType: setSelectedRequirementType,
          filterByMandatoryDescription: filterByMandatoryDescription,
          onFilterByMandatoryDescription: setFilterByMandatoryDescription,
          filterByComplementaryDescription: filterByComplementaryDescription,
          onFilterByComplementaryDescription: setFilterByComplementaryDescription,
          filterByMandatorySentences: filterByMandatorySentences,
          onFilterByMandatorySentences: setFilterByMandatorySentences,
          filterByComplementarySentences: filterByComplementarySentences,
          onFilterByComplementarySentences: setFilterByComplementarySentences,
          filterByMandatoryKeywords: filterByMandatoryKeywords,
          onFilterByMandatoryKeywords: setFilterByMandatoryKeywords,
          filterByComplementaryKeywords: filterByComplementaryKeywords,
          onFilterByComplementaryKeywords: setFilterByComplementaryKeywords,
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
        color="primary">
          <TableHeader columns={columns}>
            {(column) => <TableColumn key={column.uid} align={column.align}>{column.name}</TableColumn>}
          </TableHeader>
          <TableBody
            items={requirements.slice((page - 1) * rowsPerPage, page * rowsPerPage)}
            emptyContent="No hay requerimientos para mostrar"
          >
            {(requirement) => (
              <TableRow key={requirement.id}>
                {(columnKey) => (
                  <TableCell>
                    <RequirementCell requirement={requirement} columnKey={columnKey} />
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