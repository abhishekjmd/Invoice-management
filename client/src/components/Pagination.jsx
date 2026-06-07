import React from "react";

function Pagination({ page, setPage, total = 2000, perPage = 20 }) {
  const totalPages = Math.ceil(total / perPage);
  const start = (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, total);

  const getPages = () => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 3) return [1, 2, 3, "...", totalPages];
    if (page >= totalPages - 2)
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 16px",
        borderTop: "1px solid #e5e5e5",
        fontSize: 13,
        color: "#888",
      }}
    >
      <span>
        Showing {start}–{end} of {total.toLocaleString()}
      </span>
      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          style={navBtn}
        >
          ‹
        </button>
        {getPages().map((p, i) =>
          p === "..." ? (
            <span key={`dots-${i}`} style={{ padding: "0 4px", color: "#bbb" }}>
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => setPage(p)}
              style={{
                ...pageBtn,
                background: page === p ? "#111" : "#fff",
                color: page === p ? "#fff" : "#555",
                border: page === p ? "1px solid #111" : "1px solid #d0d0d0",
              }}
            >
              {p}
            </button>
          ),
        )}
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          style={navBtn}
        >
          ›
        </button>
      </div>
    </div>
  );
}

const pageBtn = {
  fontSize: 13,
  width: 30,
  height: 30,
  borderRadius: 6,
  cursor: "pointer",
  fontFamily: "inherit",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const navBtn = {
  ...pageBtn,
  border: "1px solid #d0d0d0",
  background: "#fff",
  color: "#555",
  width: 30,
  height: 30,
};

export default Pagination;
