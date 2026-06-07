import React, { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import Filters from "../components/Filters";
import InvoiceTable from "../components/InvoiceTable";
import Pagination from "../components/Pagination";
import HeaderActions from "../components/HeaderActions";
import NewInvoiceModal from "../components/NewInvoiceModal";
import SummaryModal from "../components/SummaryModal";

const defaultFilters = {
  search: "",
  status: "",
  customer: "",
  issueDateFrom: "",
  issueDateTo: "",
  dueDateFrom: "",
  dueDateTo: "",
};

function Dashboard() {
  const [invoices, setInvoices] = useState([]);
  const [total, setTotal] = useState(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState(defaultFilters);
  const [sortBy, setSortBy] = useState("");
  const [order, setOrder] = useState("asc");
  const [showModal, setShowModal] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [editInvoice, setEditInvoice] = useState(null);

  const buildParams = (
    currentPage,
    currentFilters,
    currentSortBy,
    currentOrder,
  ) => {
    const params = new URLSearchParams();
    params.append("page", currentPage);
    params.append("limit", 20);
    if (currentFilters.status) params.append("status", currentFilters.status);
    if (currentFilters.customer)
      params.append("customer", currentFilters.customer);
    if (currentFilters.issueDateFrom)
      params.append("issueDateFrom", currentFilters.issueDateFrom);
    if (currentFilters.issueDateTo)
      params.append("issueDateTo", currentFilters.issueDateTo);
    if (currentFilters.dueDateFrom)
      params.append("dueDateFrom", currentFilters.dueDateFrom);
    if (currentFilters.dueDateTo)
      params.append("dueDateTo", currentFilters.dueDateTo);
    if (currentSortBy) {
      params.append("sortBy", currentSortBy);
      params.append("order", currentOrder);
    }
    return params.toString();
  };

  const getInvoices = useCallback(
    async (currentPage, currentFilters, currentSortBy, currentOrder) => {
      try {
        const qs = buildParams(
          currentPage,
          currentFilters,
          currentSortBy,
          currentOrder,
        );
        const response = await api.get(`/invoices?${qs}`);
        setInvoices(response.data);
      } catch (error) {
        console.log(error);
      }
    },
    [],
  );

  const getTotal = useCallback(async (currentFilters) => {
    try {
      const hasFilter = Object.entries(currentFilters)
        .filter(([k]) => k !== "search")
        .some(([, v]) => v);

      if (!hasFilter) {
        const res = await api.get("/invoices/summary");
        setTotal(res.data.totalInvoices ?? null);
      } else {
        const params = new URLSearchParams();
        params.append("limit", 10000);
        if (currentFilters.status)
          params.append("status", currentFilters.status);
        if (currentFilters.customer)
          params.append("customer", currentFilters.customer);
        if (currentFilters.issueDateFrom)
          params.append("issueDateFrom", currentFilters.issueDateFrom);
        if (currentFilters.issueDateTo)
          params.append("issueDateTo", currentFilters.issueDateTo);
        if (currentFilters.dueDateFrom)
          params.append("dueDateFrom", currentFilters.dueDateFrom);
        if (currentFilters.dueDateTo)
          params.append("dueDateTo", currentFilters.dueDateTo);
        const res = await api.get(`/invoices?${params.toString()}`);
        setTotal(res.data.length);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  // when filters change reset to page 1
  useEffect(() => {
    setPage(1);
    getInvoices(1, filters, sortBy, order);
    getTotal(filters);
  }, [filters, sortBy, order]);

  // when page changes
  useEffect(() => {
    getInvoices(page, filters, sortBy, order);
  }, [page]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setOrder("asc");
    }
  };

  const handleSaved = () => {
    getInvoices(page, filters, sortBy, order);
    getTotal(filters);
  };

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
        onSummary={() => setShowSummary(true)}
      />
      <div
        style={{
          border: "1px solid #e5e5e5",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <Filters filters={filters} setFilters={setFilters} />
        <InvoiceTable
          invoices={invoices}
          search={filters.search}
          sortBy={sortBy}
          order={order}
          onSort={handleSort}
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
      {showSummary && <SummaryModal onClose={() => setShowSummary(false)} />}
    </div>
  );
}

export default Dashboard;
