import { useState,useRef } from "react";
import TopContentRequirementTypes from "./TopContentRequirementTypes";


// Datos de ejemplo
const mockTypes = [
  { id: 1, name: "Legal", description: "Requisitos normativos", classification: "Legal" },
  { id: 2, name: "Técnico", description: "Aspectos técnicos aplicables", classification: "Técnico" },
  { id: 3, name: "Administrativo", description: "Requisitos internos", classification: "Administrativo" },
];

export default function RequirementTypes() {
  const [requirementTypes, setRequirementTypes] = useState(mockTypes);
  const [filterByName, setFilterByName] = useState("");
  const [filterByDescription, setFilterByDescription] = useState("");
  const [filterByClassification, setFilterByClassification] = useState("");
  const debounceTimeout = useRef(null);

  const handleClear = () => {
    setFilterByName("");
    setFilterByDescription("");
    setFilterByClassification("");
    setRequirementTypes(mockTypes);
  };

  const handleFilter = (field, value) => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      let filtered = mockTypes;

      if (field === "name") {
        filtered = mockTypes.filter((item) =>
          item.name.toLowerCase().includes(value.toLowerCase())
        );
      }
      if (field === "description") {
        filtered = mockTypes.filter((item) =>
          item.description.toLowerCase().includes(value.toLowerCase())
        );
      }
      if (field === "classification") {
        filtered = mockTypes.filter((item) =>
          item.classification.toLowerCase().includes(value.toLowerCase())
        );
      }

      setRequirementTypes(filtered);
    }, 300);
  };

  const handleFilterByName = (value) => {
    setFilterByName(value);
    if (value.trim() === "") return handleClear();
    handleFilter("name", value);
  };

  const handleFilterByDescription = (value) => {
    setFilterByDescription(value);
    if (value.trim() === "") return handleClear();
    handleFilter("description", value);
  };

  const handleFilterByClassification = (value) => {
    setFilterByClassification(value);
    if (value.trim() === "") return handleClear();
    handleFilter("classification", value);
  };

 
  const onRowsPerPageChange = () => {}; // Mock handler


  return (
    <div className="mt-24 px-6">
      <TopContentRequirementTypes
        config={{
          filterByName,
          filterByDescription,
          filterByClassification,
          onFilterByName: handleFilterByName,
          onFilterByDescription: handleFilterByDescription,
          onFilterByClassification: handleFilterByClassification,
          onClear: handleClear,
          totalTypes: requirementTypes.length,
          onRowsPerPageChange,
       
        }}
      />
    </div>
  );
}
