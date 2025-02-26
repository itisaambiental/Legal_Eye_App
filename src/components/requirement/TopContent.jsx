import PropTypes from "prop-types";
import {
  Input,
  Button,
  Autocomplete,
  AutocompleteItem,
  Select,
  SelectItem,
  Tooltip,
} from "@heroui/react";
import search_icon from "../../assets/busqueda_blue.png";
import mas_icon from "../../assets/mas.png";

/**
 * TopContent component for filtering requirements.
 *
 * This component provides filtering options for requirements,
 * including searching by name, number, condition, evidence, periodicity, and jurisdiction.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Object} props.config - Configuration object for the component.
 * @returns {JSX.Element} Rendered filter component.
 */
function TopContent({ config }) {
  const {
    //isCreateModalOpen,
    onRowsPerPageChange,
    totalRequirements,
    openModalCreate,
    filterByNumber,
    filterByName,
    onFilterByNumber,
    onFilterByName,
    onClear,
    selectedCondition,
    onFilterByCondition,
    selectedEvidence,
    onFilterByEvidence,
    selectedPeriodicity,
    onFilterByPeriodicity,
    selectedJurisdiction,
    onFilterByJurisdiction,
    selectedState,
    states,
    onFilterByState,
    selectedMunicipalities,
    municipalities,
    municipalitiesLoading,
    onFilterByMunicipalities,
  } = config;

  return (
    <div className="flex flex-col gap-4 mb-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        
        {/* Filtro por Número de Requisito */}
        <Input
          color="primary"
          variant="faded"
          isClearable
          value={filterByNumber}
          className="w-full"
          placeholder="Buscar por número..."
          startContent={<img src={search_icon} alt="Search" className="w-4 h-4" />}
          onClear={onClear}
          onValueChange={onFilterByNumber}
        />

        {/* Filtro por Nombre */}
        <Input
          color="primary"
          variant="faded"
          isClearable
          value={filterByName}
          className="w-full"
          placeholder="Buscar por nombre..."
          startContent={<img src={search_icon} alt="Search" className="w-4 h-4" />}
          onClear={onClear}
          onValueChange={onFilterByName}
        />

        {/* Filtro por Condición */}
        <Autocomplete
          color="primary"
          variant="faded"
          placeholder="Filtrar por condición..."
          startContent={<img src={search_icon} alt="Search" className="w-4 h-4" />}
          className="w-full"
          selectedKey={selectedCondition}
          listboxProps={{ emptyContent: "Condición no encontrada" }}
          onSelectionChange={onFilterByCondition}
        >
          <AutocompleteItem key="Crítica">Crítica</AutocompleteItem>
          <AutocompleteItem key="Operativa">Operativa</AutocompleteItem>
          <AutocompleteItem key="Recomendación">Recomendación</AutocompleteItem>
          <AutocompleteItem key="Pendiente">Pendiente</AutocompleteItem>
        </Autocomplete>

        {/* Filtro por Evidencia */}
        <Autocomplete
          color="primary"
          variant="faded"
          placeholder="Filtrar por evidencia..."
          startContent={<img src={search_icon} alt="Search" className="w-4 h-4" />}
          className="w-full"
          selectedKey={selectedEvidence}
          listboxProps={{ emptyContent: "Evidencia no encontrada" }}
          onSelectionChange={onFilterByEvidence}
        >
          <AutocompleteItem key="Trámite">Trámite</AutocompleteItem>
          <AutocompleteItem key="Registro">Registro</AutocompleteItem>
          <AutocompleteItem key="Específico">Específico</AutocompleteItem>
          <AutocompleteItem key="Documento">Documento</AutocompleteItem>
        </Autocomplete>

        {/* Filtro por Periodicidad */}
        <Autocomplete
          color="primary"
          variant="faded"
          placeholder="Filtrar por periodicidad..."
          startContent={<img src={search_icon} alt="Search" className="w-4 h-4" />}
          className="w-full"
          selectedKey={selectedPeriodicity}
          listboxProps={{ emptyContent: "Periodicidad no encontrada" }}
          onSelectionChange={onFilterByPeriodicity}
        >
          <AutocompleteItem key="Anual">Anual</AutocompleteItem>
          <AutocompleteItem key="2 años">2 años</AutocompleteItem>
          <AutocompleteItem key="Por evento">Por evento</AutocompleteItem>
          <AutocompleteItem key="Única vez">Única vez</AutocompleteItem>
        </Autocomplete>

        {/* Filtro por Jurisdicción */}
        <Autocomplete
          color="primary"
          variant="faded"
          placeholder="Filtrar por jurisdicción..."
          startContent={<img src={search_icon} alt="Search" className="w-4 h-4" />}
          className="w-full"
          selectedKey={selectedJurisdiction}
          listboxProps={{ emptyContent: "Jurisdicción no encontrada" }}
          onSelectionChange={onFilterByJurisdiction}
        >
          <AutocompleteItem key="Federal">Federal</AutocompleteItem>
          <AutocompleteItem key="Estatal">Estatal</AutocompleteItem>
          <AutocompleteItem key="Local">Local</AutocompleteItem>
        </Autocomplete>

        {/* Filtro por Estado */}
        <Autocomplete
          color="primary"
          variant="faded"
          defaultItems={states.map((estado) => ({ id: estado, name: estado }))}
          placeholder="Filtrar por estado..."
          startContent={<img src={search_icon} alt="Search" className="w-4 h-4" />}
          className="w-full"
          selectedKey={selectedState}
          listboxProps={{ emptyContent: "Estado no encontrado" }}
          onSelectionChange={onFilterByState}
        >
          {(estado) => (
            <AutocompleteItem key={estado.id} value={estado.id}>
              {estado.name}
            </AutocompleteItem>
          )}
        </Autocomplete>

        {/* Filtro por Municipio */}
        <Tooltip content="Debes seleccionar un estado" isDisabled={!!selectedState}>
          <div className="w-full">
            <Select
              color="primary"
              items={municipalities.map((municipio) => ({
                id: municipio,
                name: municipio,
              }))}
              variant="faded"
              placeholder="Filtrar por municipio..."
              startContent={<img src={search_icon} alt="Search" className="w-4 h-4" />}
              className="w-full"
              isLoading={municipalitiesLoading}
              selectionMode="multiple"
              selectedKeys={selectedMunicipalities}
              listboxProps={{ emptyContent: "Municipios no encontrados" }}
              isDisabled={!selectedState}
              onSelectionChange={onFilterByMunicipalities}
            >
              {(municipio) => (
                <SelectItem key={municipio.id} value={municipio.id}>
                  {municipio.name}
                </SelectItem>
              )}
            </Select>
          </div>
        </Tooltip>
      </div>

      {/* Barra inferior con controles */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <span className="text-default-400">Total de Requerimientos: {totalRequirements}</span>
        <div className="flex items-center gap-4 w-full sm:w-auto sm:ml-auto">
          <label className="flex items-center text-default-400 gap-2">
            Filas por página:
            <select className="bg-transparent outline-none text-default-400" onChange={onRowsPerPageChange}>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="40">40</option>
            </select>
          </label>
          <Button
            color="primary"
            onPress={openModalCreate}
            endContent={<img src={mas_icon} alt="Add Icon" className="w-4 h-4" />}
          >
            Nuevo Requerimiento
          </Button>
        </div>
      </div>
    </div>
  );
}

TopContent.propTypes = {
  config: PropTypes.object.isRequired,
};

export default TopContent;
