const companyModel = require("../models/company");

module.exports = {
  create: async function (req, res, next) {
    let company = req.body;
    let endDate = new Date()
    endDate.setDate(endDate.getDate() + 30);
    company = {...company, endDate}
    await companyModel.create(company, function (err, result) {
      if (err) {
        if (err.errors) {
          res.status(400).json({ message: 'Require data', errors: err.errors });
        } else {
          res.status(500).json({ message: "Internal server error", data: null });
        }
      } else {
        res.status(200).json({
          message: "Subject added successfully!!!",
          data: { id: result._id },
        });
      }
    });
  },
  getAll: async function (req, res, next) {
    let companys = await companyModel.find();
    res.status(200).json({ message: null, data: companys });
  },
  getFilter: async function (req, res, next) {
    const filter = req.body;
    let companys = await companyModel.find(filter);
    res.status(200).json({ message: null, data: companys });
  },
  getById: function (req, res, next) {
    companyModel.findById(req.params.id, function (err, company) {
      if (err) {
        res.status(404).json({ message: "Company not found", data: null });
      } else {
        res.status(200).json({ message: null, data: company });
      }
    });
  },
  updateById: function (req, res, next) {
    const company = req.body;
    companyModel.findByIdAndUpdate(req.params.id, company, function (
      err,
      companyInfo
    ) {
      if (err) res.status(400).json({ message: "Update failed", data: null });
      else {
        res
          .status(200)
          .json({ message: "Company updated successfully!", data: companyInfo });
      }
    });
  },
  deleteById: function (req, res, next) {
    companyModel.findByIdAndRemove(req.params.id, function (err, companyInfo) {
      if (err) res.status(400).json({ message: "Delete failed", data: null });
      else {
        res.status(200).json({ message: "Company deleted successfully!", data: null });
      }
    });
  },
};
