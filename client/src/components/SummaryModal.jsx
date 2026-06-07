import React, { useEffect, useState } from "react";
import api from "../services/api";

function SummaryModal({ onClose }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/invoices/summary")
      .then((res) => setSummary(res.data))
      .catch(console.log)
      .finally(() => setLoading(false));
  }, []);

  const cards = summary
    ? [
        {
          label: "Total billed",
          value: `${summary.totalBilled?.toFixed(2) ?? "—"}`,
        },
        {
          label: "Total tax",
          value: `${summary.totalTax?.toFixed(2) ?? "—"}`,
        },
        {
          label: "# Invoices",
          value: summary.totalInvoices?.toLocaleString() ?? "—",
        },
        { label: "# Customers", value: summary.totalCustomers ?? "—" },
      ]
    : [];

  const topCustomers = summary?.topCustomers || [];
  const maxValue = topCustomers[0]?.totalValue || 1;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 10,
          padding: "28px",
          width: 620,
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: 13,
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 600, color: "#111" }}>
            Summary / analytics
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: 20,
              color: "#888",
              cursor: "pointer",
              lineHeight: 1,
              padding: 0,
            }}
          >
            ×
          </button>
        </div>

        {loading ? (
          <div style={{ color: "#888", fontSize: 13, padding: "20px 0" }}>
            Loading...
          </div>
        ) : !summary ? (
          <div style={{ color: "#888", fontSize: 13, padding: "20px 0" }}>
            Failed to load summary.
          </div>
        ) : (
          <>
            {/* Summary cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                gap: 12,
                marginBottom: 20,
              }}
            >
              {cards.map((c) => (
                <div
                  key={c.label}
                  style={{
                    border: "1px solid #e5e5e5",
                    borderRadius: 8,
                    padding: "14px 16px",
                  }}
                >
                  <div style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>
                    {c.label}
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 600, color: "#111" }}>
                    {c.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Top customers by value */}
            <div
              style={{
                border: "1px solid #e5e5e5",
                borderRadius: 8,
                padding: "16px",
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#111",
                  marginBottom: 14,
                }}
              >
                Top customers by value
              </div>

              {topCustomers.length === 0 ? (
                <div style={{ color: "#bbb", fontSize: 13 }}>
                  No data available.
                </div>
              ) : (
                topCustomers.map((tc, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: i < topCustomers.length - 1 ? 12 : 0,
                    }}
                  >
                    {/* Customer name */}
                    <div
                      style={{
                        width: 150,
                        fontSize: 12,
                        color: "#555",
                        flexShrink: 0,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {tc.customer?.name || "—"}
                    </div>

                    {/* Bar */}
                    <div
                      style={{
                        flex: 1,
                        background: "#f0f0f0",
                        borderRadius: 3,
                        height: 8,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `{(tc.totalValue / maxValue) * 100}%`,
                          height: "100%",
                          background: "#a8c4e0",
                          borderRadius: 3,
                        }}
                      />
                    </div>

                    {/* Value */}
                    <div
                      style={{
                        fontSize: 12,
                        color: "#555",
                        minWidth: 80,
                        textAlign: "right",
                        flexShrink: 0,
                      }}
                    >
                      {tc.totalValue?.toFixed(2)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SummaryModal;
