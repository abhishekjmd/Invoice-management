import React, { useEffect, useState } from "react";
import api from "../services/api";

function Filters({ filters, setFilters }) {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    api
      .get("/customers")
      .then((res) => setCustomers(res.data))
      .catch(console.log);
  }, []);

  const handle = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const inputStyle = {
    fontSize: 13,
    padding: "7px 10px",
    border: "1px solid #d0d0d0",
    borderRadius: 6,
    outline: "none",
    fontFamily: "inherit",
    background: "#fff",
    color: "#111",
    height: 34,
    boxSizing: "border-box",
  };

  const labelStyle = {
    fontSize: 11,
    color: "#888",
    marginBottom: 3,
    display: "block",
  };

  return (
    <div style={{ borderBottom: "1px solid #e5e5e5", padding: "12px 16px" }}>
      {/* Row 1 — search + status + customer */}
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <input
          type="text"
          placeholder="Search invoice / customer"
          value={filters.search}
          onChange={(e) => handle("search", e.target.value)}
          style={{ ...inputStyle, flex: 1 }}
        />
        <select
          value={filters.status}
          onChange={(e) => handle("status", e.target.value)}
          style={{ ...inputStyle, cursor: "pointer" }}
        >
          <option value="">All statuses</option>
          <option value="Sent">Sent</option>
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
          <option value="Overdue">Overdue</option>
          <option value="Void">Void</option>
          <option value="Draft">Draft</option>
        </select>
        <select
          value={filters.customer}
          onChange={(e) => handle("customer", e.target.value)}
          style={{ ...inputStyle, cursor: "pointer", maxWidth: 180 }}
        >
          <option value="">All customers</option>
          {customers.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Row 2 — date ranges */}
      <div style={{ display: "flex", gap: 16, alignItems: "flex-end" }}>
        <div>
          <label style={labelStyle}>Issue date from</label>
          <input
            type="date"
            value={filters.issueDateFrom}
            onChange={(e) => handle("issueDateFrom", e.target.value)}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Issue date to</label>
          <input
            type="date"
            value={filters.issueDateTo}
            onChange={(e) => handle("issueDateTo", e.target.value)}
            style={inputStyle}
          />
        </div>
        <div
          style={{
            width: 1,
            background: "#e5e5e5",
            height: 34,
            alignSelf: "flex-end",
          }}
        />
        <div>
          <label style={labelStyle}>Due date from</label>
          <input
            type="date"
            value={filters.dueDateFrom}
            onChange={(e) => handle("dueDateFrom", e.target.value)}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Due date to</label>
          <input
            type="date"
            value={filters.dueDateTo}
            onChange={(e) => handle("dueDateTo", e.target.value)}
            style={inputStyle}
          />
        </div>
        {/* Clear filters */}
        {Object.values(filters).some(Boolean) && (
          <button
            onClick={() =>
              setFilters({
                search: "",
                status: "",
                customer: "",
                issueDateFrom: "",
                issueDateTo: "",
                dueDateFrom: "",
                dueDateTo: "",
              })
            }
            style={{
              ...inputStyle,
              color: "#888",
              border: "none",
              background: "none",
              cursor: "pointer",
              alignSelf: "flex-end",
            }}
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

export default Filters;
