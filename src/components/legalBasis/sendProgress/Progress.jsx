import PropTypes from "prop-types";
import { useEffect, useState, useRef } from "react";
import {
    CircularProgress,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Divider,
} from "@heroui/react";
import Alerts from "./Alerts.jsx";
import useSendLegalBasis from "../../../hooks/legalBasis/useSendLegalBasis.jsx";

/**
 * Progress component to track and manage the state of a job..
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
        clearError,
        cleanjobStatus,
    } = useSendLegalBasis();
    const [isIntervalActive, setIsIntervalActive] = useState(true);
    const intervalRef = useRef(null);


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
        cleanjobStatus();
        clearError();
        setIsIntervalActive(true);
    };

    return (
    <Card className="w-full h-full border-none">
      <CardHeader className="flex">
        <p className={`text-md ${error ? "text-red" : "text-primary"}`}>
          {labelTop}
        </p>
      </CardHeader>
      <Divider />
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
      <CardFooter>
        <Alerts
          status={status}
          error={error}
          errorStatus={errorStatus}
          message={message}
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
