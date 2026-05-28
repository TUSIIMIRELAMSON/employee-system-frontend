// src/components/Pagination.jsx
export default function Pagination({ total, page, perPage, onChange }) {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) pages.push(i);

  const start = (page - 1) * perPage + 1;
  const end   = Math.min(page * perPage, total);

  return (
    <div className="pagination">
      <span className="pagination-info">
        Showing {start}–{end} of {total} records
      </span>
      <div className="pagination-buttons">
        <button
          className="btn-page"
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
        >← Prev</button>

        {pages.map(p => (
          <button
            key={p}
            className={`btn-page ${p === page ? "active" : ""}`}
            onClick={() => onChange(p)}
          >
            {p}
          </button>
        ))}

        <button
          className="btn-page"
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
        >Next →</button>
      </div>
    </div>
  );
}