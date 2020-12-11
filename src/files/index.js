const express = require("express");
const multer = require("multer");
const { writeFile, createReadStream } = require("fs-extra");
const { pipeline } = require("stream");
const { join, extname } = require("path");

const router = express.Router();

const upload = multer({});

const productsImagePath = join(__dirname, "../../public/img/products");

router.post(
  "/:id/uploadPhoto",
  upload.single("projectImg"),
  async (req, res, next) => {
    console.log(req.params.id);
    console.log(req.file.originalname);
    try {
      await writeFile(
        join(productsImagePath, req.params.id + extname(req.file.originalname)),
        req.file.buffer
      );
      res.send("ok");
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

module.exports = router;
