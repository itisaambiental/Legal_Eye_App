/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react";
import {
  CircularProgress,
  Card,
  CardBody,
  CardFooter,
  Alert,
  Button,
} from "@nextui-org/react";
import useWorker from "../../hooks/worker/useWorker";

const HTTP_ERRORS = [
  "Solicitud inválida",
  "No autorizado",
  "Proceso no encontrado",
  "Error interno del servidor",
  "Error de conexión",
];
/**
 * Progress component to display the progress of a job.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {string} props.jobId - The ID of the job to track progress.
 * @param {Function} props.onComplete - Callback function to be called when the job is complete.
 * @returns {JSX.Element} The rendered Progress component.
 */


const Progress = ({ jobId, onComplete }) => {
  const { progress, message, error, fetchJobStatus, clearError } = useWorker();
  const [isActive, setIsActive] = useState(true);
  const intervalRef = useRef(null);

  const isHttpError = (errorTitle) => HTTP_ERRORS.includes(errorTitle);

  useEffect(() => {
    if (jobId && isActive) {
      intervalRef.current = setInterval(() => {
        fetchJobStatus(jobId);
      }, 5000);
      return () => clearInterval(intervalRef.current);
    }
  }, [jobId, fetchJobStatus, isActive]);

  useEffect(() => {
    if (error) {
      setIsActive(false);
      clearInterval(intervalRef.current);
    }
  }, [error]);

  const handleRetry = () => {
    clearError();
    setIsActive(true);
  };

  const renderEndContent = () => {
    if (error) {
      return (
        <Button
          color="danger"
          size="sm"
          variant="faded"
          className="mt-1"
          onPress={isHttpError(error?.title) ? handleRetry : onComplete}
        >
          {isHttpError(error?.title) ? "Reintentar" : "Finalizar"}
        </Button>
      );
    }
    if (progress === 100) {
      return (
        <Button
          color="primary"
          size="md"
          variant="faded"
          aria-label="Ver artículos extraídos"
          className="mt-1"
        >
         <span className="text-xs">Ver articulos</span>
        </Button>
      );
    }
    return null;
  };

  return (
    <Card className="w-full h-full border-none">
      <CardBody className="justify-center items-center">
        <CircularProgress
          classNames={{
            svg: `w-36 h-36 drop-shadow-md`,
            indicator: error ? "stroke-red" : "stroke-primary",
            track: error ? "stroke-red/10" : "stroke-primary/10",
            value: `text-3xl font-semibold ${
              error ? "text-red" : "text-primary"
            }`,
          }}
          showValueLabel={true}
          value={progress || 0}
        />
      </CardBody>
      <CardFooter className="flex flex-col items-center">
        {!message && progress === null && !error && (
          <Alert
            title={"Procesando..."}
            variant="faded"
            classNames={{
              base: "bg-primary/10",
              title: "text-primary text-md",
              iconWrapper: "bg-primary/20",
              alertIcon: "text-primary",
            }}
            hideIconWrapper
          />
        )}
        {progress === 100 && !error && (
          <Alert
            color="primary"
            title={message || "Extracción de artículos completada."}
            variant="faded"
            classNames={{
              base: "bg-primary/10 border-primary",
              title: "text-primary text-md",
              iconWrapper: "bg-primary/20",
              alertIcon: "text-primary",
            }}
            endContent={renderEndContent()}
          />
        )}
        {message && !error && (progress === undefined || progress < 100) && (
          <Alert
            title={message || "Procesando..."}
            variant="faded"
            classNames={{
              base: "bg-primary/10",
              title: "text-primary text-md",
              iconWrapper: "bg-primary/20",
              alertIcon: "text-primary",
            }}
            hideIconWrapper
          />
        )}
        {error && (
          <Alert
            color="warning"
            title={error?.title || "Error Desconocido"}
            description={
              error?.description ||
              "Error desconocido, comuníquese con los administradores del sistema."
            }
            variant="faded"
            classNames={{
              base: "bg-red/10 border-red",
              title: "text-red text-md",
              description: "text-red text-sm",
              iconWrapper: "bg-red/20",
              alertIcon: "text-red",
            }}
            endContent={renderEndContent()}
          />
        )}
      </CardFooter>
    </Card>
  );
};

export default Progress;
