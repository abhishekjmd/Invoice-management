import React from "react";

const columns = [
  { key: "invoiceId", label: "Invoice" },
  { key: "customer", label: "Customer" },
  { key: "amount", label: "Amount" },
  { key: "taxRate", label: "Tax%" },
  { key: "total", label: "Total" },
  { key: "status", label: "Status" },
];

function InvoiceTable({ invoices, search, status }) {
  const filtered = invoices.filter((inv) => {
    const q = (search || "").toLowerCase();
    const matchSearch =
      !q ||
      inv.invoiceId?.toLowerCase().includes(q) ||
      inv.customer?.name?.toLowerCase().includes(q);
    const matchStatus = !status || inv.status === status;
    return matchSearch && matchStatus;
  });

  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
      <thead>
        <tr
          style={{ borderBottom: "1px solid #e5e5e5", background: "#fafafa" }}
        >
          {columns.map((col) => (
            <th
              key={col.key}
              style={{
                textAlign: "left",
                padding: "10px 16px",
                fontSize: 12,
                fontWeight: 500,
                color: "#888",
                whiteSpace: "nowrap",
              }}
            >
              {col.label}{" "}
              {["Invoice", "Customer", "Amount", "Total"].includes(col.label)
                ? "↕"
                : ""}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {filtered.length === 0 ? (
          <tr>
            <td
              colSpan={6}
              style={{
                padding: "32px",
                textAlign: "center",
                color: "#bbb",
                fontSize: 13,
              }}
            >
              No invoices found
            </td>
          </tr>
        ) : (
          filtered.map((inv) => (
            <tr
              key={inv._id}
              style={{ borderBottom: "1px solid #f0f0f0", cursor: "default" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#fafafa")
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
            >
              <td style={{ padding: "11px 16px", color: "#555", fontSize: 13 }}>
                {inv.invoiceId}
              </td>
              <td style={{ padding: "11px 16px", color: "#111" }}>
                {inv.customer?.name}
              </td>
              <td style={{ padding: "11px 16px", color: "#111" }}>
                {inv.amount}
              </td>
              <td style={{ padding: "11px 16px", color: "#555" }}>
                {inv.taxRate}%
              </td>
              <td
                style={{ padding: "11px 16px", color: "#111", fontWeight: 500 }}
              >
                {inv.total}
              </td>
              <td style={{ padding: "11px 16px" }}>
                <span
                  style={{
                    display: "inline-block",
                    fontSize: 12,
                    padding: "3px 10px",
                    borderRadius: 4,
                    background: "#f0f0f0",
                    color: "#555",
                    textTransform: "capitalize",
                  }}
                >
                  {inv.status}
                </span>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default InvoiceTable;
