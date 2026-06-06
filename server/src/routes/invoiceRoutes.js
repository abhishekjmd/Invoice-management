const express = require("express");
const {
  getAllInvoices,
  getInvoiceById,
  createInvoice,
} = require("../controllers/invoiceController");

const router = express.Router();

router.get("/", getAllInvoices);
router.get("/:id", getInvoiceById);
router.post("/", createInvoice);

module.exports = router;
