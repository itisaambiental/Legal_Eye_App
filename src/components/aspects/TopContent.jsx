/* eslint-disable react/prop-types */
import { Input, Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import search_icon from "../../assets/busqueda_blue.png";
import mas_icon from "../../assets/mas.png";
import flecha_icon from "../../assets/flecha_izquierda.png"

/**
 * TopContent component for Aspects Management
 * 
 * This component renders the top section of an aspects management interface. It provides options
 * for navigation back to the subject list, search functionality, and control over the number
 * of rows displayed per page. Additionally, it includes a button to create a new aspect.
 * 
 * @component
 * @param {Object} props - Component properties.
 * @param {string} props.subjectName - The name of the subject associated with the aspects.
 * @param {Function} props.onRowsPerPageChange - Callback function triggered when the number of rows per page changes.
 * @param {number} props.totalAspects - The total number of aspects being managed.
 * @param {Function} props.openModalCreate - Function to open the modal for creating a new aspect.
 * @param {Function} props.onFilterChange - Callback function triggered when the search input changes.
 * @param {Function} props.onClear - Callback function to clear the search input.
 * 
 * @returns {JSX.Element} Rendered TopContent component for managing aspects, with options for filtering, pagination, and creating aspects.
 */

function TopContent({ subjectName, onRowsPerPageChange, totalAspects, openModalCreate, onFilterChange, onClear}) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/subjects");
  };

  return (
    <div>
        <div className="text-center text-black text-xl font-normal -mt-12 mb-8">
          <div>
            Aspectos de la materia: {subjectName}
          </div>
        </div>
      <div className="ml-1 mb-12 xl:-ml-64 xl:mb-0">
        <Button
          color="primary"
          radius="md"
          variant="solid"
          className="flex w-auto items-center h-9 flex-shrink-0"
          startContent={<img src={flecha_icon} alt="Back Icon" className="w-6 h-6 flex-shrink-0" />}
          onPress={handleBack}
        >
          Volver
        </Button>
      </div>

      <div className="flex flex-col gap-4 mb-4 -mt-10">
        <div className="flex justify-between gap-16 items-end">
          <Input
            color="primary"
            variant="faded"
            isClearable
            className="w-full"
            placeholder="Buscar por nombre..."
            startContent={<img src={search_icon} alt="Search Icon" className="w-4 h-4 flex-shrink-0" />}
            onClear={onClear}
            onValueChange={onFilterChange}
          />
          <div className="flex gap-3 ml-auto">
            <Button
              color="primary"
              onPress={openModalCreate}
              endContent={<img src={mas_icon} alt="Add Icon" className="w-4 h-4 flex-shrink-0" />}
            >
              Nuevo Aspecto
            </Button>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <span className="text-default-400">Aspectos Totales: {totalAspects}</span>
          <label className="flex items-center text-default-400">
            Filas por página:
            <select
              className="bg-transparent outline-none text-default-400 ml-2"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}

export default TopContent;
