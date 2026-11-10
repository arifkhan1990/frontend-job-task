export function Pagination({ meta, onPageChange }) {
  if (!meta || meta.pages <= 1) {
    return null;
  }

  return (
    <div className="pagination">
      <button
        type="button"
        className="button ghost small"
        disabled={meta.page <= 1}
        onClick={() => onPageChange(meta.page - 1)}
      >
        Previous
      </button>
      <span className="muted small">
        Page {meta.page} of {meta.pages} · {meta.total} total
      </span>
      <button
        type="button"
        className="button ghost small"
        disabled={meta.page >= meta.pages}
        onClick={() => onPageChange(meta.page + 1)}
      >
        Next
      </button>
    </div>
  );
}
