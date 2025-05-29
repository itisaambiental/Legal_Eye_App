import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    Input,
    Textarea,
    Button,
    Radio,
    RadioGroup,
} from "@heroui/react";

/**
 * IdentificationModal.jsx
 *
 * Modal for creating a Requirement Identification (analysis) based on selected Legal Basis records.
 * This component replicates the visual and structural logic of CreateModal.jsx to ensure UI consistency.
 *
 * @param {boolean} isOpen - Controls the modal visibility.
 * @param {function} onClose - Function to close the modal.
 * @param {Array<Object>} selectedLegalBases - List of selected legal bases to pre-fill jurisdictional data.
 * @param {function} [onSuccess] - Optional callback triggered when the form is successfully submitted.
 */

const IdentificationModal = ({
    isOpen,
    onClose,
    selectedLegalBases,
    onSuccess }) => {

    const [form, setForm] = useState({
        name: "",
        description: "",
    });

    const [formValues, setFormValues] = useState({
        jurisdiction: "",
        state: "",
        municipality: "",
        subject: "",
        aspects: [],
    });

    const [errors, setErrors] = useState({
        name: "",
        description: "",
    });
    const [intelligenceLevel, setIntelligenceLevel] = useState("");
    const [intelligenceLevelInputError, setIntelligenceLevelInputError] = useState("");
    useEffect(() => {
        if (!isOpen || selectedLegalBases.length === 0) return;

        const [first] = selectedLegalBases;

        const uniqueAspects = Array.from(
            new Set(
                selectedLegalBases.flatMap((base) =>
                    base.aspects?.map((a) => a.aspect_name) || []
                )
            )
        );

        setFormValues({
            jurisdiction: first.jurisdiction || "",
            state: first.state || "",
            municipality: first.municipality || "",
            subject: first.subject?.subject_name || "",
            aspects: uniqueAspects,
        });
    }, [isOpen, selectedLegalBases]);

    const handleChange = (field, value) => {
        setForm({ ...form, [field]: value });
        setErrors({ ...errors, [field]: "" });
    };
    const validate = () => {
        if (!form.name.trim()) {
            setErrors({ name: "Este campo es obligatorio.", description: "" });
            return false;
        }
        if (!form.description.trim()) {
            setErrors({ name: "", description: "Este campo es obligatorio." });
            return false;
        }
        if (!intelligenceLevel) {
            setIntelligenceLevelInputError("Este campo es obligatorio.");
            return false;
        }

        setErrors({ name: "", description: "" });
        setIntelligenceLevelInputError("");
        return true;
    };


    const handleSubmit = () => {
        if (!validate()) return;

        onSuccess?.({
            ...form,
            ...formValues,
            intelligenceLevel,
        });


        onClose();
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
                            {errors.name && <p className="mt-2 text-sm text-red">{errors.name}</p>}
                        </div>
                        <div className="col-span-2 w-full">
                            <Textarea
                                disableAnimation
                                disableAutosize
                                id="floating_description"
                                value={form.description}
                                onChange={(e) => handleChange("description", e.target.value)}
                                classNames={{
                                    base: "max-w",
                                    input:
                                        "resize-y min-h-[80px] py-1 px-2 w-full text-xs text-gray-900 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-primary peer",
                                }}
                                label="Descripción del Análisis"
                                placeholder=""
                                variant="bordered"
                            />
                            {errors.description && <p className="mt-2 text-sm text-red">{errors.description}</p>}
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
                        <div className=" col-span-2 w-full mt-2 mb-4 flex items-start">
                            <div className="flex flex-col">
                                <RadioGroup
                                    classNames={{ label: "text-md text-black" }}
                                    size="md"
                                    orientation="horizontal"
                                    label="Nivel de Inteligencia:"
                                    value={intelligenceLevel}
                                    onValueChange={setIntelligenceLevel}
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
                                {intelligenceLevelInputError && (
                                    <p className="mt-1 text-sm text-red">{intelligenceLevelInputError}</p>
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
                            Confirmar
                        </Button>
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

IdentificationModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    selectedLegalBases: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            jurisdiction: PropTypes.string,
            state: PropTypes.string,
            municipality: PropTypes.string,
            subject: PropTypes.shape({
                id: PropTypes.number,
                subject_name: PropTypes.string,
            }),
            aspects: PropTypes.arrayOf(
                PropTypes.shape({
                    aspect_id: PropTypes.number,
                    aspect_name: PropTypes.string,
                })
            ),
        })
    ).isRequired,
    onSuccess: PropTypes.func,
};

export default IdentificationModal;
