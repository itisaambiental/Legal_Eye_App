import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Input,
  Select,
  SelectItem,
  Button,
  Spinner,
} from "@heroui/react";
import { toast } from "react-toastify";
import check from "../../assets/check.png";

/**
 * EditModal component for Requirements
 *
 * Allows users to edit an existing requirement.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Object} props.config - Configuration object for the component.
 * @returns {JSX.Element} - Rendered EditModal component.
 * 
 */

const EditModal = ({ config }) => {
  const {
    isOpen,
    closeModalEdit,
    formData,
    setFormData,
    selectedRequirement,
    editRequirement,
    fetchRequirements,
    numberError,
    setNumberError,
    handleNumberChange,
    nameError,
    setNameError,
    handleNameChange,
    conditionError,
    handleConditionChange,
    evidenceError,
    handleEvidenceChange,
    periodicityError,
    handlePeriodicityChange,
    requirementTypeError,
    handleRequirementType,
  } = config;

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedRequirement) {
      setFormData({
        id: selectedRequirement.id,
        number: selectedRequirement.requirement_number || "",
        name: selectedRequirement.requirement_name || "",
        condition: selectedRequirement.requirement_condition || "",
        evidence: selectedRequirement.evidence || "",
        periodicity: selectedRequirement.periodicity || "",
        requirementType: selectedRequirement.requirement_type || "",
      });
    }
  }, [selectedRequirement, setFormData]);

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      await editRequirement(formData);
      toast.success("Requerimiento actualizado con éxito", {
        icon: <img src={check} alt="Success" />,
      });

      fetchRequirements();
      closeModalEdit();
    } catch (error) {
      toast.error("Error al actualizar el requerimiento.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModalEdit}>
      <ModalContent>
        <ModalHeader>Editar Requerimiento</ModalHeader>
        <ModalBody>
          <Input
            label="Número"
            value={formData.number}
            onChange={handleNumberChange}
            isInvalid={!!numberError}
            errorMessage={numberError}
            onBlur={() => {
              if (!formData.number.trim()) {
                setNumberError("El número es obligatorio.");
              }
            }}
          />

          <Input
            label="Nombre"
            value={formData.name}
            onChange={handleNameChange}
            isInvalid={!!nameError}
            errorMessage={nameError}
            onBlur={() => {
              if (!formData.name.trim()) {
                setNameError("El nombre es obligatorio.");
              }
            }}
          />

          <Select
            label="Condición"
            value={formData.condition}
            onChange={handleConditionChange}
            isInvalid={!!conditionError}
            errorMessage={conditionError}
          >
            <SelectItem value="Obligatorio">Obligatorio</SelectItem>
            <SelectItem value="Opcional">Opcional</SelectItem>
          </Select>

          <Select
            label="Evidencia"
            value={formData.evidence}
            onChange={handleEvidenceChange}
            isInvalid={!!evidenceError}
            errorMessage={evidenceError}
          >
            <SelectItem value="Documento">Documento</SelectItem>
            <SelectItem value="Certificado">Certificado</SelectItem>
          </Select>

          <Select
            label="Periodicidad"
            value={formData.periodicity}
            onChange={handlePeriodicityChange}
            isInvalid={!!periodicityError}
            errorMessage={periodicityError}
          >
            <SelectItem value="Diario">Diario</SelectItem>
            <SelectItem value="Semanal">Semanal</SelectItem>
            <SelectItem value="Mensual">Mensual</SelectItem>
          </Select>

          <Select
            label="Tipo de Requerimiento"
            value={formData.requirementType}
            onChange={handleRequirementType}
            isInvalid={!!requirementTypeError}
            errorMessage={requirementTypeError}
          >
            <SelectItem value="Legal">Legal</SelectItem>
            <SelectItem value="Normativo">Normativo</SelectItem>
          </Select>

          <div className="flex justify-end gap-2 mt-4">
            <Button onPress={closeModalEdit} variant="ghost">
              Cancelar
            </Button>
            <Button onPress={handleSubmit} isDisabled={isLoading}>
              {isLoading ? <Spinner size="sm" /> : "Guardar Cambios"}
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

EditModal.propTypes = {
  config: PropTypes.shape({
    isOpen: PropTypes.bool.isRequired,
    closeModalEdit: PropTypes.func.isRequired,
    formData: PropTypes.object.isRequired,
    setFormData: PropTypes.func.isRequired,
    selectedRequirement: PropTypes.object,
    editRequirement: PropTypes.func.isRequired,
    fetchRequirements: PropTypes.func.isRequired,
    numberError: PropTypes.string,
    setNumberError: PropTypes.func.isRequired,
    handleNumberChange: PropTypes.func.isRequired,
    nameError: PropTypes.string,
    setNameError: PropTypes.func.isRequired,
    handleNameChange: PropTypes.func.isRequired,
    conditionError: PropTypes.string,
    handleConditionChange: PropTypes.func.isRequired,
    evidenceError: PropTypes.string,
    handleEvidenceChange: PropTypes.func.isRequired,
    periodicityError: PropTypes.string,
    handlePeriodicityChange: PropTypes.func.isRequired,
    requirementTypeError: PropTypes.string,
    handleRequirementType: PropTypes.func.isRequired,
  }).isRequired,
};

export default EditModal;
