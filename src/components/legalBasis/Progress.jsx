/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react";
import {
  CircularProgress,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Alert,
  Button,
  Divider 
} from "@nextui-org/react";
import useWorker from "../../hooks/worker/useWorker";
import cruz_icon from "../../assets/cruz.png"

const HTTP_ERRORS = [
  "Solicitud inválida",
  "No autorizado",
  "Proceso no encontrado",
  "Error interno del servidor",
  "Error de conexión",
];

/**
 * Progress component that tracks the progress of a job and displays status messages.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {string} props.jobId - The ID of the job to track.
 * @param {Function} props.onComplete - Callback function to be called when the job is complete.
 * @param {Function} props.onClose - Callback function to be called when the parent component is closed.
  * @param {string} props.labelTop - Dynamic text displayed on the top.
 * @param {string} props.labelButton - Dynamic text displayed on the button.
 * @returns {JSX.Element} The rendered component.
 *
 */
const Progress = ({ jobId, onComplete, onClose, labelTop, labelButton }) => {
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
    if (progress === 100 && !error) {
      setIsActive(false);
      clearInterval(intervalRef.current);
    }
  }, [progress, error]);

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
          className="mt-4"
          onPress={isHttpError(error?.title) ? handleRetry : onComplete}
        >
          {isHttpError(error?.title) ? "Reintentar" : "Finalizar e intentar de nuevo"}
        </Button>
      );
    }
    if (progress === 100) {
      return (
        <Button
          color="primary"
          size="md"
          variant="faded"
          aria-label={labelButton}
          onPress={onComplete}
          className={`${error ? "mt-4" : "mt-2"}`}
        >
          <span className="text-xs">{labelButton}</span>
        </Button>
      );
    }
    return null;
  };

  return (
    <Card className="w-full h-full border-none">
      <CardHeader className="flex">
        <p className={`text-md ${error ? "text-red" : "text-primary"}`}>{labelTop}</p>
        <Button
            className={`hover:${error ? "bg-danger/20" : "bg-primary/20"} 
              text-${error ? "text-red" : "text-primary"} 
              active:${error ? "bg-red/10" : "bg-primary/10"} 
              -mt-6`}
          color="white"
          radius="full"
          size="sm"
          onPress={onClose}
          isIconOnly
        >
            <img src={cruz_icon} alt="Menu" className="w-3 h-3" />
        </Button>
      </CardHeader>
      <Divider />
      <CardBody className="justify-center items-center">
        <CircularProgress
          classNames={{
            svg: `w-36 h-36 drop-shadow-md`,
            indicator: error ? "stroke-red" : "stroke-primary",
            track: error ? "stroke-red/10" : "stroke-primary/10",
            value: `text-3xl font-semibold ${error ? "text-red" : "text-primary"
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
            title={message}
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
            title={message}
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
            title={error.title}
            description={
              error.description
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
