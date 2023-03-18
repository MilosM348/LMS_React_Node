const ipfsAPI = require("ipfs-api");

const ipfs = ipfsAPI("ipfs.infura.io", "5001", { protocol: "https" });
module.exports = {
  create: function (req, res, next) {
    const file = req.files.file;
    ipfs.files.add(file.data, function (err, result) {
      if (err) {
        res.status(400).json({ message: "error", errors: err });
        return
      }
      let path = ''
      if (result.length !== 0)
        path = `https://ipfs.infura.io/ipfs/${result[0].path}`;
      res.status(200).json({
        message: "File uploaded successfully!!!",
        data: {path: path},
      });
    });
  },
};
