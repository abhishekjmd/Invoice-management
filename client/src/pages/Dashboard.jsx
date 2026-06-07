import React, { useEffect, useState } from "react";
import api from "../services/api";
import Filters from "../components/Filters";
import InvoiceTable from "../components/InvoiceTable";
import Pagination from "../components/Pagination";
import HeaderActions from "../components/HeaderActions";
import NewInvoiceModal from "../components/NewInvoiceModal";

function Dashboard() {
  const [invoices, setInvoices] = useState([]);
  const [summary, setSummary] = useState({});
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editInvoice, setEditInvoice] = useState(null);

  const getInvoices = async () => {
    try {
      const response = await api.get(`/invoices?page=${page}&limit=20`);
      setInvoices(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getSummary = async () => {
    try {
      const response = await api.get("/invoices/summary");
      setSummary(response.data);
      setTotal(response.data.totalInvoices || 0);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSaved = () => {
    getInvoices();
    getSummary(); // this updates total count immediately
  };

  useEffect(() => {
    getInvoices();
  }, [page]);
  useEffect(() => {
    getSummary();
  }, []);

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
      <HeaderActions
        onNewInvoice={() => {
          setEditInvoice(null);
          setShowModal(true);
        }}
      />
      <div
        style={{
          border: "1px solid #e5e5e5",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <Filters
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
        />
        <InvoiceTable
          invoices={invoices}
          search={search}
          status={status}
          onEdit={(inv) => {
            setEditInvoice(inv);
            setShowModal(true);
          }}
        />
        <Pagination page={page} setPage={setPage} total={total} />
      </div>

      {showModal && (
        <NewInvoiceModal
          invoice={editInvoice}
          onClose={() => {
            setShowModal(false);
            setEditInvoice(null);
          }}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}

export default Dashboard;
