export type StorageWarningProps = {
  message: string;
};

function StorageWarning({ message }: StorageWarningProps) {
  return (
    <div
      className="status-warning rounded-lg border p-4 text-sm leading-6"
      role="status"
    >
      <p className="font-semibold">Storage warning</p>
      <p className="mt-1">
        {message} You can keep using this list, but recent changes may only be
        available until this page is refreshed.
      </p>
    </div>
  );
}

export default StorageWarning;
