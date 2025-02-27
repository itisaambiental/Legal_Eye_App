import { useState, useEffect } from "react";
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
import TopContent from "./TopContent.jsx";
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
  { name: "Descripción Obligatoria", uid: "mandatory_description", align: "start" },
  { name: "Descripción Complementaria", uid: "complementary_description", align: "start" },
  { name: "Frases Obligatorias", uid: "mandatory_sentences", align: "start" },
  { name: "Frases Complementarias", uid: "complementary_sentences", align: "start" },
  { name: "Palabras Clave Obligatorias", uid: "mandatory_keywords", align: "start" },
  { name: "Palabras Clave Complementarias", uid: "complementary_keywords", align: "start" },
  { name: "Acciones", uid: "actions", align: "center" },
];

export default function Requirement() {
    const { requirements, loading, error, fetchRequirements } = useRequirement();
    const [page] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isFirstRender, setIsFirstRender] = useState(true);
    const [filterByNumber, setFilterByNumber] = useState("");
    const [filterByName, setFilterByName] = useState("");
    const [selectedCondition, setSelectedCondition] = useState(null);
    const [selectedEvidence, setSelectedEvidence] = useState(null);
    const [selectedPeriodicity, setSelectedPeriodicity] = useState(null);
    const [selectedJurisdiction, setSelectedJurisdiction] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedMunicipalities, setSelectedMunicipalities] = useState([]);
  
    useEffect(() => {
      if (!loading && isFirstRender) {
        setIsFirstRender(false);
      }
    }, [loading, isFirstRender]);
  
    const handleClear = () => {
      setFilterByNumber("");
      setFilterByName("");
      setSelectedCondition(null);
      setSelectedEvidence(null);
      setSelectedPeriodicity(null);
      setSelectedJurisdiction(null);
      setSelectedState(null);
      setSelectedMunicipalities([]);
      fetchRequirements();
    };
  
    const topContentConfig = {
      isCreateModalOpen: false,
      onRowsPerPageChange: (e) => setRowsPerPage(Number(e.target.value)),
      totalRequirements: requirements.length,
      openModalCreate: () => console.log("Abrir modal de creación"),
      filterByNumber,
      onFilterByNumber: setFilterByNumber,
      filterByName,
      onFilterByName: setFilterByName,
      onClear: handleClear,
      selectedCondition,
      onFilterByCondition: setSelectedCondition,
      selectedEvidence,
      onFilterByEvidence: setSelectedEvidence,
      selectedPeriodicity,
      onFilterByPeriodicity: setSelectedPeriodicity,
      selectedJurisdiction,
      onFilterByJurisdiction: setSelectedJurisdiction,
      selectedState,
      states: ["Estado 1", "Estado 2", "Estado 3"], // Esto debería venir de tu API
      onFilterByState: setSelectedState,
      selectedMunicipalities,
      municipalities: ["Municipio 1", "Municipio 2", "Municipio 3"], // Esto debería venir de tu API
      municipalitiesLoading: false,
      onFilterByMunicipalities: setSelectedMunicipalities,
    };
  
    if (loading && isFirstRender) {
      return (
        <div role="status" className="fixed inset-0 flex items-center justify-center">
          <Spinner className="h-10 w-10 transform translate-x-0 lg:translate-x-28 xl:translate-x-32" color="secondary" />
        </div>
      );
    }
  
    if (error) return <Error title={error.title} message={error.message} />;
  
    return (
      <div className="mt-24 mb-4 -ml-60 mr-4 lg:-ml-0 lg:mr-0 xl:-ml-0 xl:mr-0 flex justify-center items-center flex-wrap">
        <TopContent config={topContentConfig} />
  
        <Table aria-label="Tabla de requerimientos" selectionMode="multiple" color="primary">
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
      </div>
    );
  }