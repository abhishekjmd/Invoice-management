const Customer = require("../models/customer");
const Company = require("../models/company");

const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().populate("company");
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).populate("company");
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCustomer = async (req, res) => {
  try {
    const { name, company } = req.body;
    const existingCompany = await Company.findById(company);
    
    if (!existingCompany) {
        return res.status(404).json({ message: "Company not found" });
    }
    
    const existingCustomer = await Customer.findOne({ name, company });
    
    if (existingCustomer) {
      return res.status(400).json({ message: "Customer already exists" });
    }
    const customer = await Customer.create({ name, company });
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllCustomers,
  getCustomerById,
  createCustomer
};
