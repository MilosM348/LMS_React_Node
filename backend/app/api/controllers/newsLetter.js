const newsLetterModel = require("../models/newsLetter");

module.exports = {
  create: async function (req, res, next) {
    const newsLetter = req.body;
    await newsLetterModel.create(newsLetter, function (err, result) {
      if (err) {
        if (err.errors) {
          res.status(400).json({ message: 'Require data', errors: err.errors });
        } else {
          res.status(500).json({ message: "Internal server error", data: null });
        }
      } else {
        res.status(200).json({
          message: "NewsLetter added successfully!!!",
          data: { id: result._id },
        });
      }
    });
  },
  getAll: async function (req, res, next) {
    let newsLetters = await newsLetterModel.find();
    res.status(200).json({ message: null, data: newsLetters });
  },
  getFilter: async function (req, res, next) {
    const filter = req.body;
    let newsLetters = await newsLetterModel.find(filter);
    res.status(200).json({ message: null, data: newsLetters });
  },
  getById: function (req, res, next) {
    newsLetterModel.findById(req.params.id, function (err, newsLetter) {
      if (err) {
        res.status(404).json({ message: "NewsLetter not found", data: null });
      } else {
        res.status(200).json({ message: null, data: newsLetter });
      }
    });
  },
  updateById: function (req, res, next) {
    const newsLetter = req.body;
    newsLetterModel.findByIdAndUpdate(req.params.id, newsLetter, function (
      err,
      newsLetterInfo
    ) {
      if (err) res.status(400).json({ message: "Update failed", data: null });
      else {
        res
          .status(200)
          .json({ message: "NewsLetter updated successfully!", data: newsLetterInfo });
      }
    });
  },
  deleteById: function (req, res, next) {
    newsLetterModel.findByIdAndRemove(req.params.id, function (err, newsLetterInfo) {
      if (err) res.status(400).json({ message: "Delete failed", data: null });
      else {
        res.status(200).json({ message: "NewsLetter deleted successfully!", data: null });
      }
    });
  },
};
