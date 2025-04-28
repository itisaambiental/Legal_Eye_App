import PropTypes from "prop-types";
import { Alert, Button } from "@heroui/react";
import {
    SendLegalBasisErrors,
    SendLegalBasisStatus
} from "../../../errors/legalBasis/sendLegalBasis/SendLegalBasis";

const AlertStyles = {
    base: "bg-primary/10 border-primary",
    title: "text-primary text-md",
    description: "text-primary text-sm",
    iconWrapper: "bg-primary/20",
    alertIcon: "text-primary",
};

const errorAlertStyles = {
    base: "bg-red/10 border-red",
    title: "text-red text-md",
    description: "text-red text-sm",
    iconWrapper: "bg-red/20",
    alertIcon: "text-red",
};

/**
 * Renders alert messages based on the current job status and state.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.status - The current status of the job.
 * @param {Object|null} props.error - Error details if there is an issue with the job.
 * @param {string} props.errorStatus - The specific error status of the job (e.g., "JOB_NOT_FOUND").
 * @param {string} props.message - The message describing the job's current status.
 * @param {Function} props.onRetry - Callback function to retry job fetching.
 * @param {Function} props.onComplete - Callback function for job completion.
 * @param {Function} props.onClose - Callback function to close the alert.
 * @param {string} props.labelButton - Label text for the completion button.
 * @returns {JSX.Element} The rendered alert component.
 */
const Alerts = ({
    status,
    error,
    errorStatus,
    message,
    onRetry,
    onComplete,
    onClose,
    labelButton,
}) => {

    // 1. Checking if the job has completed successfully
    if (status === SendLegalBasisStatus.COMPLETED) {
        return (
            <Alert
                color="success"
                title={message}
                variant="faded"
                classNames={AlertStyles}
                endContent={
                    <Button onPress={onComplete} color="primary">
                        <span className="text-xs">{labelButton}</span>
                    </Button>
                }
            />
        );
    }
    // 2. Checking if there is a general error
    if (error) {
        const isRetryable = errorStatus === SendLegalBasisErrors.NETWORK_ERROR;
        return (
            <Alert
                title={error.title}
                description={error.message}
                color="danger"
                variant="faded"
                classNames={errorAlertStyles}
                endContent={
                    <div className="flex space-x-2">
                        {isRetryable ? (
                            <Button onPress={onRetry} color="danger">
                                <span className="text-xs">Reintentar</span>
                            </Button>
                        ) : (
                            <Button onPress={onClose} color="danger">
                                <span className="text-xs">Cerrar</span>
                            </Button>
                        )}
                    </div>
                }
            />
        );
    }
    // 3. Checking if the job is still in progress
    if (!status && !message && !error) {
        return (
            <Alert
                title={"Procesando..."}
                variant="faded"
                color="default"
                classNames={{
                    ...AlertStyles,
                    base: "bg-primary/10",
                }}
            />
        );
    }
    // 4. Fallback
    return (
        <Alert
            title={message}
            variant="faded"
            color="default"
            classNames={AlertStyles}
        />
    );
};

Alerts.propTypes = {
    status: PropTypes.string.isRequired,
    error: PropTypes.object,
    errorStatus: PropTypes.string,
    message: PropTypes.string.isRequired,
    onRetry: PropTypes.func.isRequired,
    onComplete: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    labelButton: PropTypes.string.isRequired,
};

export default Alerts;
