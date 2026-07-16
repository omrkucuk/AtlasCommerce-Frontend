interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message = "Bir hata oluştu.", onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3">
      <p className="text-red-500 text-sm">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="text-sm text-slate-900 underline hover:no-underline">
          Tekrar dene
        </button>
      )}
    </div>
  );
}
