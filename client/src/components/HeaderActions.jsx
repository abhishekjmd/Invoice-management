import React from "react";

function HeaderActions({ onNewInvoice, onSummary }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
      }}
    >
      <span style={{ fontSize: 15, fontWeight: 600, color: "#111" }}>
        Invoices
      </span>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={onSummary} style={outlineBtn}>
          Summary
        </button>
        <button onClick={onNewInvoice} style={primaryBtn}>
          + New invoice
        </button>
      </div>
    </div>
  );
}

const outlineBtn = {
  fontSize: 13,
  padding: "6px 14px",
  border: "1px solid #d0d0d0",
  borderRadius: 6,
  background: "#fff",
  color: "#333",
  cursor: "pointer",
  fontFamily: "inherit",
};
const primaryBtn = {
  fontSize: 13,
  padding: "6px 14px",
  border: "1px solid #3b5bdb",
  borderRadius: 6,
  background: "#fff",
  color: "#3b5bdb",
  cursor: "pointer",
  fontFamily: "inherit",
  fontWeight: 500,
};

export default HeaderActions;
