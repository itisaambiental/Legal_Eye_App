import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Input,
  Spinner,
  Textarea,
  Button,
  Radio,
  RadioGroup,
} from "@heroui/react";
import { toast } from "react-toastify";
import check from "../../assets/check.png";
import Progress from "./reqIdentificationProgress/Progress";
import useReqIdentifications from "../../hooks/reqIdentifications/useReqIdentifications";

/**
 * ReqIdentificationModal.jsx
 *
 * Modal for creating a Requirement Identification based on selected Legal Basis records.
 * @param {Object} props - Component properties.
 * @param {boolean} props.isOpen - Controls whether the modal is open.
 * @param {Function} props.closeModal - Function to close the modal.
 * @param {Object[]} props.selectLegalBasis - Array of selected legal basis.
 */

const ReqIdentificationModal = ({ isOpen, closeModal, selectLegalBasis }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    intelligenceLevel: "",
  });

  const [formValues, setFormValues] = useState({
    legalBasisIds: [],
    jurisdiction: "",
    state: "",
    municipality: "",
    subject: "",
    aspects: [],
  });

  const [errors, setErrors] = useState({
    name: "",
    description: "",
    intelligenceLevel: "",
  });
  const { addReqIdentification } = useReqIdentifications();
  const [isLoading, setIsLoading] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [reqIdentificationId, setReqIdentificationId] = useState(null);
  const [jobId, setJobId] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    if (!selectLegalBasis || selectLegalBasis.length === 0) {
      toast.error("Debe seleccionar al menos un fundamento legal.");
    }
    const [legalBase] = selectLegalBasis;
    const legalBasisIds = selectLegalBasis.map((legalBase) => legalBase.id);
    const aspects = Array.from(
      new Set(
        selectLegalBasis.flatMap(
          (legalBase) =>
            legalBase.aspects?.map((aspect) => aspect.aspect_name) || []
        )
      )
    );
    setFormValues({
      legalBasisIds: legalBasisIds,
      jurisdiction: legalBase.jurisdiction || "",
      state: legalBase.state || "",
      municipality: legalBase.municipality || "",
      subject: legalBase.subject?.subject_name || "",
      aspects: aspects,
    });
  }, [isOpen, selectLegalBasis]);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  const onClose = () => {
    setJobId(null);
    setShowProgress(false);
    setReqIdentificationId(null);
    closeModal();
  };

  const onComplete = () => {
    setJobId(null);
    setShowProgress(false);
    closeModal();
    toast.error(
      `SE DEBE IMPLEMENTAR LA REDIRECCIÓN A LA PÁGINA DE LA IDENTIFICACIÓN DE REQUERIMIENTO (ID: ${reqIdentificationId})`
    );
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    if (!form.name.trim()) {
      setErrors({
        name: "Este campo es obligatorio.",
        description: "",
        intelligenceLevel: "",
      });
      setIsLoading(false);
      return;
    }
    if (!form.description.trim()) {
      setErrors({
        name: "",
        description: "Este campo es obligatorio.",
        intelligenceLevel: "",
      });
      setIsLoading(false);
      return;
    }
    if (!form.intelligenceLevel.trim()) {
      setErrors({
        name: "",
        description: "",
        intelligenceLevel: "Debe seleccionar un nivel de inteligencia.",
      });
      setIsLoading(false);
      return;
    }
    try {
      const { success, error, reqIdentificationId, jobId } =
        await addReqIdentification({
          reqIdentificationName: form.name,
          reqIdentificationDescription: form.description,
          legalBasisIds: formValues.legalBasisIds,
          intelligenceLevel: form.intelligenceLevel,
        });
      if (success) {
        toast.info(
          "La identificación de requerimientos ha comenzado correctamente.",
          {
            icon: () => <img src={check} alt="Success Icon" />,
            progressStyle: {
              background: "#113c53",
            },
          }
        );

        if (!jobId) {
          onClose();
        } else {
          setJobId(jobId);
          setShowProgress(true);
          setReqIdentificationId(reqIdentificationId);
        }
      } else {
        toast.error(error);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        "Algo mal sucedió al comenzar la identificación de requerimientos. Intente de nuevo."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      backdrop="opaque"
      placement="center"
      isDismissable={false}
      isKeyboardDismissDisabled={false}
      classNames={{
        closeButton: "hover:bg-primary/20 text-primary active:bg-primary/10",
      }}
    >
      <ModalContent>
        {showProgress ? (
          <Progress
            jobId={jobId}
            onComplete={onComplete}
            onClose={onClose}
            labelTop="Cuando se complete la identificación, podrás ver los resultados de la identificación de requerimientos."
            labelButton="Ver resultados"
          />
        ) : (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Identificación de Requerimientos
            </ModalHeader>

            <ModalBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2 relative z-0 w-full group">
                  <input
                    type="text"
                    id="floating_name"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer"
                    placeholder=""
                  />
                  <label
                    htmlFor="floating_name"
                    className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 peer-focus:left-0 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Nombre
                  </label>
                  {errors.name && (
                    <p className="mt-2 text-sm text-red">{errors.name}</p>
                  )}
                </div>

                <div className="col-span-2 w-full">
                  <Textarea
                    disableAnimation
                    disableAutosize
                    id="floating_description"
                    value={form.description}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    classNames={{
                      base: "max-w",
                      input:
                        "resize-y min-h-[80px] py-1 px-2 w-full text-xs text-gray-900 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-primary peer",
                    }}
                    label="Descripción de la identificación de requerimientos"
                    placeholder=""
                    variant="bordered"
                  />
                  {errors.description && (
                    <p className="mt-2 text-sm text-red">
                      {errors.description}
                    </p>
                  )}
                </div>

                <Input
                  isReadOnly
                  label="Jurisdicción"
                  value={formValues.jurisdiction}
                  variant="bordered"
                  className="w-full"
                />

                {formValues.state && (
                  <Input
                    isReadOnly
                    label="Estado"
                    value={formValues.state}
                    variant="bordered"
                    className="w-full"
                  />
                )}

                {formValues.municipality && (
                  <Input
                    isReadOnly
                    label="Municipio"
                    value={formValues.municipality}
                    variant="bordered"
                    className="w-full"
                  />
                )}

                <Input
                  isReadOnly
                  label="Materia"
                  value={formValues.subject}
                  variant="bordered"
                  className="w-full"
                />

                <div className="col-span-2">
                  <Textarea
                    isReadOnly
                    label="Aspectos"
                    value={formValues.aspects.join(", ")}
                    variant="bordered"
                    className="w-full"
                  />
                </div>

                <div className="col-span-2 w-full mt-2 mb-4 flex items-start">
                  <div className="flex flex-col">
                    <RadioGroup
                      classNames={{ label: "text-md text-black" }}
                      size="md"
                      orientation="horizontal"
                      label="Nivel de Inteligencia:"
                      value={form.intelligenceLevel}
                      onValueChange={(value) =>
                        handleChange("intelligenceLevel", value)
                      }
                    >
                      <Radio
                        description="Inteligencia baja: más rápida, pero menos precisa."
                        value="Low"
                      >
                        Bajo
                      </Radio>
                      <Radio
                        description="Inteligencia alta: más lenta, pero más precisa."
                        value="High"
                      >
                        Alto
                      </Radio>
                    </RadioGroup>
                    {errors.intelligenceLevel && (
                      <p className="mt-1 text-sm text-red">
                        {errors.intelligenceLevel}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="w-full mt-2">
                <Button
                  type="submit"
                  color="primary"
                  onPress={handleSubmit}
                  className="w-full rounded border mb-4 border-primary bg-primary p-3 text-white transition hover:bg-opacity-90"
                >
                  {isLoading ? (
                    <Spinner size="sm" color="white" />
                  ) : (
                    "Comenzar Identificación de Requerimientos"
                  )}
                </Button>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

ReqIdentificationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  selectLegalBasis: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      legal_name: PropTypes.string,
      abbreviation: PropTypes.string,
      classification: PropTypes.string,
      jurisdiction: PropTypes.string,
      state: PropTypes.string,
      municipality: PropTypes.string,
      last_reform: PropTypes.string,
      url: PropTypes.string,
      subject: PropTypes.shape({
        id: PropTypes.number,
        subject_name: PropTypes.string,
      }),
      aspects: PropTypes.arrayOf(
        PropTypes.shape({
          aspect_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
            .isRequired,
          aspect_name: PropTypes.string.isRequired,
        })
      ),
    })
  ).isRequired,
};

export default ReqIdentificationModal;
