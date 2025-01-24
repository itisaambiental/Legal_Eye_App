import PropTypes from "prop-types";
import { useEffect, useState, useRef } from "react";
import {
  CircularProgress,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Divider,
} from "@nextui-org/react";
import Alerts from "./Alerts.jsx";
import { ExtractArticlesErrors } from "../../../errors/articles/ExtractArticles.js";
import useExtractArticles from "../../../hooks/articles/extractArticles/useExtractArticles.jsx";
import cruz_icon from "../../../assets/cruz.png";
/**
 * Progress component to track and manage the state of a job.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.jobId - The ID of the job being tracked.
 * @param {Function} props.onComplete - Callback function for job completion.
 * @param {Function} props.onClose - Callback function to close the component.
 * @param {string} props.labelTop - Text label displayed at the top of the component.
 * @param {string} props.labelButton - Text label for the action button.
 * @returns {JSX.Element} The rendered component.
 */
const Progress = ({ jobId, onComplete, onClose, labelTop, labelButton }) => {
  const {
    progress,
    status,
    message,
    error,
    errorStatus,
    fetchJobStatus,
    cancelJobById,
    clearError,
    cleanjobStatus,
  } = useExtractArticles();
  const [isIntervalActive, setIsIntervalActive] = useState(true);
  const intervalRef = useRef(null);
  const [cancelState, setCancelState] = useState({
    isCancelling: false,
    cancelError: null,
    cancelErrorStatus: null,
    cancelMessage: null,
    isCancelled: false,
  });

  // Variable to evaluate if there is any error or cancellation error
  const hasError = !!error || !!cancelState.cancelError;

  /**
   * Handles the cancellation of a job.
   * Updates the cancel state and simulates a loading period before showing the result.
   */
  const handleCancel = async () => {
    setCancelState({
      isCancelling: true,
      cancelError: null,
      cancelErrorStatus: null,
      cancelMessage: "Cancelando extracción de artículos...",
      isCancelled: false,
    });
    cleanjobStatus();
    setIsIntervalActive(false);
    clearInterval(intervalRef.current);
    try {
      const { success, error, errorStatus } = await cancelJobById(jobId);
      setTimeout(() => {
        if (success) {
          setCancelState({
            isCancelling: false,
            cancelError: null,
            cancelErrorStatus: null,
            cancelMessage: "Extracción de artículos cancelada correctamente.",
            isCancelled: true,
          });
        } else {
          setCancelState({
            isCancelling: false,
            cancelError: error,
            cancelErrorStatus: errorStatus,
            cancelMessage: null,
            isCancelled: false,
          });
        }
      }, 5000);
    } catch (error) {
      setTimeout(() => {
        const errorStatus = ExtractArticlesErrors.handleStatus(error.message);
        setCancelState({
          isCancelling: false,
          cancelError: {
            title: "Error inesperado",
            message: error.message,
          },
          cancelErrorStatus: errorStatus,
          cancelMessage: null,
          isCancelled: false,
        });
      }, 5000);
    }
  };

  /**
   * Resets the cancel state to its initial state.
   */
  const cleanCancelState = () => {
    setCancelState({
      isCancelling: false,
      cancelError: null,
      cancelErrorStatus: null,
      cancelMessage: null,
      isCancelled: false,
    });
  };

  /**
   * useEffect to handle polling for job status.
   *
   * This effect sets up an interval to fetch the job status every 5 seconds if a job ID is provided
   * and the interval is marked as active (`isIntervalActive`). The interval is cleared when the
   * component unmounts or if `jobId`, `fetchJobStatus`, or `isIntervalActive` changes.
   *
   * Dependencies:
   * - `jobId`: The ID of the job to fetch status for. The interval will only run if this is defined.
   * - `fetchJobStatus`: Callback function to fetch the job status.
   * - `isIntervalActive`: Flag indicating whether the polling interval should be active.
   */
  useEffect(() => {
    if (jobId && isIntervalActive) {
      intervalRef.current = setInterval(() => {
        fetchJobStatus(jobId);
      }, 5000);
      return () => clearInterval(intervalRef.current);
    }
  }, [jobId, fetchJobStatus, isIntervalActive]);

  /**
   * useEffect to handle stopping the polling interval on error.
   *
   * This effect monitors the `error` state. If an error is detected, it deactivates the polling
   * interval by setting `isIntervalActive` to `false` and clears the active interval.
   *
   * Dependencies:
   * - `error`: If this changes to a truthy value, the polling interval will stop.
   */
  useEffect(() => {
    if (error) {
      setIsIntervalActive(false); // Disable the interval
      clearInterval(intervalRef.current); // Clear the existing interval
    }
  }, [error]);

  /**
   * Handles retrying the job status fetching process.
   */
  const handleRetry = () => {
    cleanCancelState();
    cleanjobStatus();
    clearError();
    setIsIntervalActive(true);
  };

  return (
    <Card className="w-full h-full border-none">
      <CardHeader className="flex">
        <p className={`text-md ${hasError ? "text-red" : "text-primary"}`}>
          {labelTop}
        </p>
        <Button
          className={`hover:${hasError ? "bg-danger/20" : "bg-primary/20"} 
          text-${hasError ? "text-red" : "text-primary"} 
          active:${hasError ? "bg-red/10" : "bg-primary/10"} 
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
            indicator: hasError ? "stroke-red" : "stroke-primary",
            track: hasError ? "stroke-red/10" : "stroke-primary/10",
            value: `text-3xl font-semibold ${
              hasError ? "text-red" : "text-primary"
            }`,
          }}
          showValueLabel={true}
          value={progress || 0}
        />
      </CardBody>
      <CardFooter>
        <Alerts
          status={status}
          cancelState={cancelState}
          error={error}
          errorStatus={errorStatus}
          message={message}
          onCancel={handleCancel}
          onRetry={handleRetry}
          onComplete={onComplete}
          onClose={onClose}
          labelButton={labelButton}
        />
      </CardFooter>
    </Card>
  );
};

Progress.propTypes = {
  jobId: PropTypes.string.isRequired,
  onComplete: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  labelTop: PropTypes.string.isRequired,
  labelButton: PropTypes.string.isRequired,
};

export default Progress;
