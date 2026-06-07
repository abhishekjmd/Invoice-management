import React from "react";
import { useNavigate } from "react-router-dom";

function InvoiceTable({ invoices, search, status }) {
  const navigate = useNavigate();

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
          {[
            "Invoice",
            "Customer",
            "Company",
            "Amount",
            "Tax%",
            "Total",
            "Status",
          ].map((h) => (
            <th
              key={h}
              style={{
                textAlign: "left",
                padding: "10px 16px",
                fontSize: 12,
                fontWeight: 500,
                color: "#888",
                whiteSpace: "nowrap",
              }}
            >
              {h}{" "}
              {["Invoice", "Customer", "Amount", "Total"].includes(h)
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
              colSpan={7}
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
              style={{ borderBottom: "1px solid #f0f0f0" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#fafafa")
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
            >
              <td style={{ padding: "11px 16px", color: "#555", fontSize: 13 }}>
                {inv.invoiceId}
              </td>
              <td
                style={{
                  padding: "11px 16px",
                  color: "#111",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
                onClick={() => navigate(`/customers/${inv.customer?._id}`)}
              >
                {inv.customer?.name}
              </td>
              <td style={{ padding: "11px 16px", color: "#555" }}>
                {inv.customer?.company?.name}
              </td>
              <td style={{ padding: "11px 16px", color: "#111" }}>
                {inv.amount}
              </td>
              <td style={{ padding: "11px 16px", color: "#555" }}>
                {inv.taxRate}%
              </td>
              <td style={{ padding: "11px 16px", fontWeight: 500 }}>
                {inv.total}
              </td>
              <td style={{ padding: "11px 16px" }}>
                <span
                  style={{
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
