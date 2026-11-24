export type StorageWarningProps = {
  message: string;
};

function StorageWarning({ message }: StorageWarningProps) {
  return (
    <div
      className="status-warning rounded-lg border p-4 text-sm leading-6"
      role="status"
    >
      <p className="font-semibold">Storage is unavailable.</p>
      <p className="mt-1">
        {message} Todos may not remain after you refresh this browser.
      </p>
    </div>
  );
}

export default StorageWarning;
