const Invoice = require("../models/invoice");
const Customer = require("../models/customer");

const getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().populate({
      path: "customer",
      populate: { path: "company" },
    });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate({
      path: "customer",
      populate: { path: "company" },
    });
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createInvoice = async (req, res) => {
  try {
    const {
      invoiceId,
      customer,
      amount,
      taxRate,
      tax,
      total,
      status,
      issueDate,
      dueDate,
    } = req.body;

    const isCustomerExist = await Customer.findById(customer);
    if (!isCustomerExist) {
      return res.status(400).json({ message: "Customer not found" });
    }
    const invoice = new Invoice.create({
      invoiceId,
      customer,
      amount,
      taxRate,
      tax,
      total,
      status,
      issueDate,
      dueDate,
    });
    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllInvoices,
  getInvoiceById,
  createInvoice,
};
