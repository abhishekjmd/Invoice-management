import React, { useEffect, useState } from "react";
import api from "../services/api";
import Filters from "../components/Filters";
import InvoiceTable from "../components/InvoiceTable";
import Pagination from "../components/Pagination";
import HeaderActions from "../components/HeaderActions";

function Dashboard() {
  const [invoices, setInvoices] = useState([]);
  const [summary, setSummary] = useState({});
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const getInvoices = async () => {
    try {
      const response = await api.get(`/invoices?page=${page}`);
      setInvoices(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getSummary = async () => {
    try {
      const response = await api.get("/invoices/summary");
      setSummary(response.data);
    } catch (error) {
      console.log(error);
    }
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
      <HeaderActions />
      
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
        <InvoiceTable invoices={invoices} search={search} status={status} />
        <Pagination page={page} setPage={setPage} total={2000} />
      </div>
    </div>
  );
}

export default Dashboard;
