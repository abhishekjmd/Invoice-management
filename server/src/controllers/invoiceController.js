const Invoice = require("../models/invoice");
const Customer = require("../models/customer");

const getAllInvoices = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status,
    customer,
    issueDateFrom,
    issueDateTo,
    dueDateFrom,
    dueDateTo,
    sortBy,
    order,
  } = req.query;
  const query = {};
  const sortOptions = {};
  try {
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const skip = (pageNumber - 1) * limitNumber;

    if (status) {
      query.status = status;
    }

    if (customer) {
      query.customer = customer;
    }
    if (issueDateFrom || issueDateTo) {
      query.issueDate = {};
    }

    if (issueDateFrom) {
      query.issueDate.$gte = new Date(issueDateFrom);
    }

    if (issueDateTo) {
      query.issueDate.$lte = new Date(issueDateTo);
    }
    if (dueDateFrom || dueDateTo) {
      query.dueDate = {};
    }

    if (dueDateFrom) {
      query.dueDate.$gte = new Date(dueDateFrom);
    }

    if (dueDateTo) {
      query.dueDate.$lte = new Date(dueDateTo);
    }

    if (sortBy) {
      sortOptions[sortBy] = order === "desc" ? -1 : 1;
    }

    const invoices = await Invoice.find(query)
      .populate({
        path: "customer",
        populate: { path: "company" },
      })
      .skip(skip)
      .limit(limitNumber)
      .sort(sortOptions);

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
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
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
    const invoice = await Invoice.create({
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

const updateInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findById(id);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const updatedInvoice = await Invoice.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(updatedInvoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getInvoiceSummary = async (req, res) => {
  try {
    const summary = await Invoice.aggregate([
      {
        $group: {
          _id: null,
          totalBilled: {
            $sum: "$total",
          },

          totalTax: {
            $sum: "$tax",
          },

          totalInvoices: {
            $sum: 1,
          },

          customers: {
            $addToSet: "$customer",
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalBilled: 1,
          totalTax: 1,
          totalInvoices: 1,
          totalCustomers: {
            $size: "$customers",
          },
        },
      },
    ]);

    const topCustomers = await Invoice.aggregate([
      { $group: { _id: "$customer", totalValue: { $sum: "$total" } } },
      { $sort: { totalValue: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "customers",
          localField: "_id",
          foreignField: "_id",
          as: "customer",
        },
      },
      { $unwind: "$customer" },
    ]);

    res.json({
      ...summary[0],
      topCustomers, 
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getAllInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoiceById,
  getInvoiceSummary,
};
