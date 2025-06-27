const isError = (error: unknown): error is { message: string } => {
  return typeof error === 'object' && error !== null && 'message' in error;
};

const getErrorMessage = (
  error: unknown,
  fallbackMessage = 'Unknown error'
): string => {
  if (isError(error)) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return fallbackMessage;
};

export { getErrorMessage };
