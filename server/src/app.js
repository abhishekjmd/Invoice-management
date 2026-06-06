const express = require("express");
const cors = require("cors");
const invoiceRoutes = require("./routes/invoiceRoutes");

const app = express();
app.use(express.json())
app.use(cors());

app.use("/api/invoices", invoiceRoutes);

module.exports = app;