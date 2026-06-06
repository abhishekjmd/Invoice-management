const express = require("express");
const {
  getAllInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoiceById,
  getInvoiceSummary,
} = require("../controllers/invoiceController");

const router = express.Router();

router.get("/", getAllInvoices);
router.get("/:id", getInvoiceById);
router.post("/", createInvoice);
router.patch("/:id", updateInvoiceById);
router.get("/summary", getInvoiceSummary);
module.exports = router;
