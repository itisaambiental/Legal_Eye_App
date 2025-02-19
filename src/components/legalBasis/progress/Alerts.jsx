import PropTypes from "prop-types";
import { Alert, Button } from "@heroui/react";
import {
  ExtractArticlesErrors,
  ExtractArticlesStatus,
} from "../../../errors/articles/ExtractArticles.js";

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
 * @param {Object} props.cancelState - The current state of the cancellation process.
 * @param {boolean} props.cancelState.isCancelling - Whether the cancellation is in progress.
 * @param {Object|null} props.cancelState.cancelError - Error details if cancellation fails.
 * @param {string|null} props.cancelState.cancelErrorStatus - The specific error status during cancellation (e.g., "JOB_NOT_FOUND").
 * @param {string|null} props.cancelState.cancelMessage - The message to display during or after cancellation.
 * @param {boolean} props.cancelState.isCancelled - Whether the job has been successfully cancelled.
 * @param {Object|null} props.error - Error details if there is an issue with the job.
 * @param {string} props.errorStatus - The specific error status of the job (e.g., "JOB_NOT_FOUND").
 * @param {string} props.message - The message describing the job's current status.
 * @param {Function} props.onCancel - Callback function to handle job cancellation.
 * @param {Function} props.onRetry - Callback function to retry job fetching.
 * @param {Function} props.onComplete - Callback function for job completion.
 * @param {Function} props.onClose - Callback function to close the alert.
 * @param {string} props.labelButton - Label text for the completion button.
 * @returns {JSX.Element} The rendered alert component.
 */
const Alerts = ({
  status,
  cancelState,
  error,
  errorStatus,
  message,
  onCancel,
  onRetry,
  onComplete,
  onClose,
  labelButton,
}) => {
  // 1. Checking if cancellation is in progress
  if (cancelState.isCancelling) {
    return (
      <Alert
        title={cancelState.cancelMessage}
        variant="faded"
        color="default"
        classNames={{
          ...AlertStyles,
          base: "bg-primary/10",
        }}
        hideIconWrapper
      />
    );
  }
  // 2. Checking if cancellation was successful
  if (cancelState.isCancelled) {
    return (
      <Alert
        title={cancelState.cancelMessage}
        color="success"
        variant="faded"
        classNames={AlertStyles}
        endContent={
          <Button onPress={onClose} color="primary">
            <span className="text-xs">Cerrar</span>
          </Button>
        }
      />
    );
  }
  // 3. Checking if there was an error during cancellation
  if (cancelState.cancelError) {
    const isRetryable =
      cancelState.cancelErrorStatus === ExtractArticlesErrors.NETWORK_ERROR;
    return (
      <Alert
        title="Error cancelando extracción de artículos"
        description={cancelState.cancelError.message}
        color="danger"
        variant="faded"
        classNames={errorAlertStyles}
        endContent={
          <div className="flex space-x-2">
            {isRetryable ? (
              <>
                <Button onPress={onCancel} color="danger">
                  <span className="text-xs">Reintentar</span>
                </Button>
                <Button onPress={onRetry} color="danger" variant="faded">
                  <span className="text-xs">Continuar</span>
                </Button>
              </>
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
  // 4. Checking if the job has completed successfully
  if (status === ExtractArticlesStatus.COMPLETED) {
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
  // 5. Checking if there is a general error
  if (error) {
    const isRetryable = errorStatus === ExtractArticlesErrors.NETWORK_ERROR;
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
  // 6. Checking if the job is still in progress
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
  // 7. Fallback
  return (
    <Alert
      title={message}
      variant="faded"
      color="default"
      classNames={AlertStyles}
      endContent={
        <Button
          onPress={onCancel}
          disabled={cancelState.isCancelling}
          color="primary"
        >
          <span className="text-xs">Cancelar</span>
        </Button>
      }
    />
  );
};

Alerts.propTypes = {
  status: PropTypes.string.isRequired,
  cancelState: PropTypes.shape({
    isCancelling: PropTypes.bool.isRequired,
    cancelError: PropTypes.object,
    cancelErrorStatus: PropTypes.string,
    cancelMessage: PropTypes.string,
    isCancelled: PropTypes.bool.isRequired,
  }).isRequired,
  error: PropTypes.object,
  errorStatus: PropTypes.string,
  message: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onRetry: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  labelButton: PropTypes.string.isRequired,
};

export default Alerts;
