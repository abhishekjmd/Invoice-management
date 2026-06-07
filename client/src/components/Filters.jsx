import React from "react";

function Filters({ search, setSearch, status, setStatus }) {
  return (
    <div style={{
      display: "flex",
      gap: 8,
      padding: "12px 16px",
      borderBottom: "1px solid #e5e5e5",
      alignItems: "center",
    }}>
      <input
        type="text"
        placeholder="Search invoice / customer"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          flex: 1,
          fontSize: 13,
          padding: "7px 12px",
          border: "1px solid #d0d0d0",
          borderRadius: 6,
          outline: "none",
          fontFamily: "inherit",
          color: "#111",
          background: "#fff",
        }}
      />
      {["Status", "Tax rate", "Date"].map((label) =>
        label === "Status" ? (
          <select
            key={label}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={filterBtnStyle}
          >
            <option value="">Status</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
            <option value="overdue">Overdue</option>
          </select>
        ) : (
          <button key={label} style={filterBtnStyle}>{label}</button>
        )
      )}
    </div>
  );
}

const filterBtnStyle = {
  fontSize: 13,
  padding: "7px 14px",
  border: "1px solid #d0d0d0",
  borderRadius: 6,
  background: "#fff",
  color: "#333",
  cursor: "pointer",
  fontFamily: "inherit",
  whiteSpace: "nowrap",
};

export default Filters;