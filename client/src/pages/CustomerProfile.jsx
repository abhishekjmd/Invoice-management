import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function CustomerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customerRes, invoicesRes] = await Promise.all([
          api.get(`/customers/${id}`),
          api.get(`/invoices?customer=${id}&limit=100`),
        ]);
        setCustomer(customerRes.data);
        setInvoices(invoicesRes.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading)
    return (
      <div style={{ padding: "32px 40px", fontSize: 13, color: "#888" }}>
        Loading...
      </div>
    );
  if (!customer)
    return (
      <div style={{ padding: "32px 40px", fontSize: 13, color: "#888" }}>
        Customer not found
      </div>
    );

  const initials = customer.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const totalBilled = invoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
  const totalTax = invoices.reduce((sum, inv) => sum + (inv.tax || 0), 0);
  const outstanding = invoices
    .filter((inv) => inv.status === "Unpaid" || inv.status === "Overdue")
    .reduce((sum, inv) => sum + (inv.total || 0), 0);

  const statusCounts = invoices.reduce((acc, inv) => {
    acc[inv.status] = (acc[inv.status] || 0) + 1;
    return acc;
  }, {});

  const summaryCards = [
    { label: "Total billed", value: `${totalBilled.toFixed(2)}` },
    { label: "Total tax", value: `${totalTax.toFixed(2)}` },
    { label: "Outstanding", value: `${outstanding.toFixed(2)}` },
    { label: "# Invoices", value: invoices.length },
  ];

  const statusList = ["Paid", "Unpaid", "Overdue", "Draft"];

  return (
    <div
      style={{
        padding: "24px 32px",
        fontFamily: "'Inter', system-ui, sans-serif",
        background: "#fff",
        minHeight: "100vh",
        color: "#111",
      }}
    >
      {/* Breadcrumb */}
      <div style={{ fontSize: 12, color: "#888", marginBottom: 20 }}>
        <span
          style={{ cursor: "pointer", textDecoration: "underline" }}
          onClick={() => navigate("/")}
        >
          Invoices
        </span>
        {" / "}
        <span>Customer</span>
      </div>

      {/* Customer header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "#e8eaf6",
            color: "#3b5bdb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            fontWeight: 600,
            flexShrink: 0,
          }}
        >
          {initials}
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#111" }}>
            {customer.name}
          </div>
          <div style={{ fontSize: 13, color: "#888", marginTop: 2 }}>
            {customer.company?.name} (1:1)
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 12,
          marginBottom: 20,
        }}
      >
        {summaryCards.map((c) => (
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

      {/* Status counts */}
      <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
        {statusList.map((s) => (
          <div
            key={s}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              color: "#555",
            }}
          >
            <span>{s}</span>
            <span
              style={{
                fontSize: 11,
                background: "#f0f0f0",
                color: "#555",
                borderRadius: 4,
                padding: "1px 7px",
                fontWeight: 500,
              }}
            >
              {statusCounts[s] || 0}
            </span>
          </div>
        ))}
      </div>

      {/* Invoice history */}
      <div
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: "#111",
          marginBottom: 12,
        }}
      >
        Invoice history
      </div>

      <div
        style={{
          border: "1px solid #e5e5e5",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
        >
          <thead>
            <tr
              style={{
                borderBottom: "1px solid #e5e5e5",
                background: "#fafafa",
              }}
            >
              {["Invoice", "Total", "Status", "Issued"].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: "left",
                    padding: "10px 16px",
                    fontSize: 12,
                    fontWeight: 500,
                    color: "#888",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {invoices.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  style={{
                    padding: "32px",
                    textAlign: "center",
                    color: "#bbb",
                  }}
                >
                  No invoices found
                </td>
              </tr>
            ) : (
              invoices.map((inv) => (
                <tr
                  key={inv._id}
                  style={{ borderBottom: "1px solid #f0f0f0" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#fafafa")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "#fff")
                  }
                >
                  <td style={{ padding: "11px 16px", color: "#555" }}>
                    {inv.invoiceId}
                  </td>
                  <td style={{ padding: "11px 16px", fontWeight: 500 }}>
                    {inv.total?.toFixed(2)}
                  </td>
                  <td style={{ padding: "11px 16px" }}>
                    <span
                      style={{
                        fontSize: 12,
                        padding: "3px 10px",
                        borderRadius: 4,
                        color: "#555",
                        textTransform: "capitalize",
                      }}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td style={{ padding: "11px 16px", color: "#888" }}>
                    {inv.issueDate
                      ? new Date(inv.issueDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CustomerProfile;
