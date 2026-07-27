export default function LoadingSpinner({
  message = "Loading...",
  fullScreen = false,
}) {
  const content = (
    <div className="flex flex-col items-center gap-4 text-heading/70">
      <div
        className="w-10 h-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin"
        role="status"
        aria-label="Loading"
      />
      <p className="text-sm">{message}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        {content}
      </div>
    );
  }

  return <div className="flex items-center justify-center py-12">{content}</div>;
}
