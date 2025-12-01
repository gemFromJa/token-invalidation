import { ErrorContext } from "@/store/ErrorStore";
import { useContext, useEffect } from "react";

const DEFAULT_TIMER_MS = 5000;

export default function ErrorMessage({ withTimer }: { withTimer?: boolean }) {
  const { hasError, errorMessage, clearError } = useContext(ErrorContext);
  useEffect(() => {
    if (!hasError) return;

    const timerId = withTimer
      ? setTimeout(() => {
          // Clear error message logic here
          clearError();
        }, DEFAULT_TIMER_MS)
      : null;

    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [withTimer, hasError]);

  if (!hasError) return null;

  return (
    <div className="w-full bg-gray-100 py-4 px-8 text-center text-red-500">
      {errorMessage}
    </div>
  );
}
