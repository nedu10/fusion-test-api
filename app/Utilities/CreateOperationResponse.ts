/**
 * Provides a response for an operation either successful or failed.
 * This method by default assumes the operation failed - a real pessimist.
 *
 * @param {Object}
 *
 * @returns {Object}
 */

export default function CreateOperationResponse({
  error = { message: "", status: "" },
  status = "Error",
  label,
  statusCode = 400,
  message,
  results,
}) {
  if (error && error.message)
    console.log(
      `${label} Error ==> encountered a fatal error: `,
      error ? error.message : ""
    );

  return {
    status_code: statusCode,
    status,
    message,
    results,
  };
}
