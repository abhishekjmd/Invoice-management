import React, { useEffect } from "react";
import api from "../services/api";

function Dashboard() {
  const getInvoice = async () => {
    const resp = await api.get("/invoices");

    const data = await resp.json();

    console.log("invoice data", data);
  };

  useEffect(() => {
    getInvoice();
  }, []);

  return <div>Dashboard</div>;
}

export default Dashboard;
