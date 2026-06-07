import React, { useEffect, useState } from "react";
import api from "../services/api";

function NewInvoiceModal({ onClose, onSaved, invoice }) {
  const isEdit = !!invoice;
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({
    customer: invoice?.customer?._id || "",
    amount: invoice?.amount || "",
    taxRate: invoice?.taxRate || "",
    issueDate: invoice?.issueDate ? invoice.issueDate.slice(0, 10) : "",
    dueDate: invoice?.dueDate ? invoice.dueDate.slice(0, 10) : "",
    status: invoice?.status || "Draft",
  });
  const [company, setCompany] = useState(
    invoice?.customer?.company?.name || "",
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/customers")
      .then((res) => setCustomers(res.data))
      .catch(console.log);
  }, []);

  const handleCustomerChange = (e) => {
    const customerId = e.target.value;
    const selected = customers.find((c) => c._id === customerId);
    setForm((f) => ({ ...f, customer: customerId }));
    setCompany(selected?.company?.name || "");
  };

  const amount = parseFloat(form.amount) || 0;
  const taxRate = parseFloat(form.taxRate) || 0;
  const tax = parseFloat(((amount * taxRate) / 100).toFixed(2));
  const total = parseFloat((amount + tax).toFixed(2));

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    setError("");
    if (
      !form.customer ||
      !form.amount ||
      !form.taxRate ||
      !form.issueDate ||
      !form.dueDate
    ) {
      setError("Please fill all required fields.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        customer: form.customer,
        amount,
        taxRate,
        tax,
        total,
        status: form.status,
        issueDate: form.issueDate,
        dueDate: form.dueDate,
      };

      if (isEdit) {
        await api.patch(`/invoices/${invoice._id}`, payload);
      } else {
        await api.post("/invoices", {
          ...payload,
          invoiceId: "INV-" + Date.now(),
        });
      }

      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save invoice.");
    } finally {
      setSaving(false);
    }
  };

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
          padding: "28px 28px 24px",
          width: 460,
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: 13,
        }}
      >
        <div
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: "#111",
            marginBottom: 20,
          }}
        >
          {isEdit ? "Edit invoice" : "New invoice"}
        </div>

        <div style={fieldWrap}>
          <label style={labelStyle}>Customer</label>
          <select
            name="customer"
            value={form.customer}
            onChange={handleCustomerChange}
            style={inputStyle}
          >
            <option value="">Select customer</option>
            {customers.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div style={fieldWrap}>
          <label style={labelStyle}>Company (auto-filled)</label>
          <input
            type="text"
            value={company}
            readOnly
            style={{
              ...inputStyle,
              background: "#f5f5f5",
              color: "#888",
              cursor: "default",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Amount</label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="0.00"
              style={inputStyle}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Tax rate</label>
            <select
              name="taxRate"
              value={form.taxRate}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">Select</option>
              {[0, 5, 10, 12, 18, 28].map((r) => (
                <option key={r} value={r}>
                  {r}%
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Issue date</label>
            <input
              type="date"
              name="issueDate"
              value={form.issueDate}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Due date</label>
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
        </div>

        <div style={fieldWrap}>
          <label style={labelStyle}>Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            style={inputStyle}
          >
            {["Draft", "Sent", "Paid", "Unpaid", "Overdue", "Void"].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div
          style={{
            background: "#f9f9f9",
            border: "1px solid #e5e5e5",
            borderRadius: 6,
            padding: "10px 14px",
            fontSize: 13,
            color: "#555",
            display: "flex",
            gap: 16,
            marginBottom: 20,
          }}
        >
          <span>
            Tax <strong style={{ color: "#111" }}>{tax.toFixed(2)}</strong>
          </span>
          <span>·</span>
          <span>
            Total <strong style={{ color: "#111" }}>{total.toFixed(2)}</strong>{" "}
            (computed)
          </span>
        </div>

        {error && (
          <div style={{ fontSize: 12, color: "#c0392b", marginBottom: 12 }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button onClick={onClose} style={cancelBtn}>
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={saving} style={saveBtn}>
            {saving ? "Saving..." : isEdit ? "Update invoice" : "Save invoice"}
          </button>
        </div>
      </div>
    </div>
  );
}

const fieldWrap = { marginBottom: 14 };
const labelStyle = {
  display: "block",
  fontSize: 12,
  color: "#888",
  marginBottom: 5,
};
const inputStyle = {
  width: "100%",
  fontSize: 13,
  padding: "8px 10px",
  border: "1px solid #d0d0d0",
  borderRadius: 6,
  outline: "none",
  fontFamily: "inherit",
  color: "#111",
  background: "#fff",
  boxSizing: "border-box",
};
const cancelBtn = {
  fontSize: 13,
  padding: "7px 16px",
  border: "1px solid #d0d0d0",
  borderRadius: 6,
  background: "#fff",
  color: "#333",
  cursor: "pointer",
  fontFamily: "inherit",
};
const saveBtn = {
  fontSize: 13,
  padding: "7px 16px",
  border: "1px solid #111",
  borderRadius: 6,
  background: "#111",
  color: "#fff",
  cursor: "pointer",
  fontFamily: "inherit",
};

export default NewInvoiceModal;
