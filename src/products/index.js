const express = require("express");
const { readDB, writeDB } = require("../lib/utilities");
const path = require("path");
const uniqid = require("uniqid");
const { check, validationResult } = require("express-validator");
const router = express.Router();

const productFilePath = path.join(__dirname, "products.json"); //GETTING FILEPATH TO JSON

router.get("/", async (req, res, next) => {
  try {
    const productDataBase = await readDB(productFilePath); //RUNS FUNCTION TO GET DATABASE
    if (productDataBase.length > 0) {
      res.status(201).send(productDataBase); //SENDS RESPONSE WITH GOOD CODE AND WHOLE DATABSE
    } else {
      const err = {};
      err.httpStatusCode = 404;
      next(err);
    }
  } catch (err) {
    err.httpStatusCode = 404;
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const productDataBase = await readDB(productFilePath); //RUNS FUNCTION TO GET DATABASE
    const singleproduct = productDataBase.filter(
      (product) => product.ID === req.params.id
    );
    if (singleproduct.length > 0) {
      res.status(201).send(singleproduct); //SENDS RESPONSE WITH GOOD CODE AND WHOLE DATABSE
    } else {
      const err = {};
      err.httpStatusCode = 404;
      next(err);
    }
  } catch (err) {
    err.httpStatusCode = 404;
    next(err);
  }
});

router.post(
  "/",
  [
    check("name")
      .exists()
      .isLength({ min: 1 })
      .withMessage("Give it a name, you bitch"),
    check("description")
      .exists()
      .isLength({ min: 1 })
      .withMessage("Gimmie a description man"),
    check("brand")
      .exists()
      .isLength({ min: 1 })
      .withMessage("You have to give a brand for the product"),
    check("imageUrl")
      .exists()
      .isLength({ min: 1 })
      .withMessage("You need to have a live demo of your product"),
    check("price")
      .exists()
      .isLength({ min: 1 })
      .withMessage("You need to set a price for your product"),
    check("category")
      .exists()
      .isLength({ min: 1 })
      .withMessage("The product must have a category to be placed on!"),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = {};
      err.message = errors;
      err.httpStatusCode = 400;
      next(err);
    } else {
      const productDataBase = await readDB(productFilePath);
      const newproduct = req.body;
      newproduct.ID = uniqid();
      newproduct.CreationDate = new Date();
      productDataBase.push(newproduct);
      await writeDB(productFilePath, productDataBase);
      res.status(201).send(productDataBase);
    }
  }
);

router.put("/:id", async (req, res, next) => {
  try {
    const productDataBase = await readDB(productFilePath); //RUNS FUNCTION TO GET DATABASE
    const singleproduct = productDataBase.filter(
      (product) => product.ID === req.params.id
    );
    if (singleproduct.length > 0) {
      const filteredDB = productDataBase.filter(
        (product) => product.ID !== req.params.id
      );
      console.log(singleproduct);
      const editedproduct = {
        ...req.body,
        ID: singleproduct[0].ID,
        ProductID: singleproduct[0].ProductID,
        CreationDate: singleproduct[0].CreationDate,
        ModifiedDate: new Date(),
      };
      filteredDB.push(editedproduct);
      await writeDB(productFilePath, filteredDB);
      res.status(201).send(filteredDB); //SENDS RESPONSE WITH GOOD CODE AND WHOLE DATABSE
    } else {
      const err = {};
      err.httpStatusCode = 404;
      next(err);
    }
  } catch (err) {
    err.httpStatusCode = 404;
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const productDataBase = await readDB(productFilePath); //RUNS FUNCTION TO GET DATABASE
    const singleproduct = productDataBase.filter(
      (product) => product.ID === req.params.id
    );
    if (singleproduct.length > 0) {
      const filteredDB = productDataBase.filter(
        (product) => product.ID !== req.params.id
      );
      await writeDB(productFilePath, filteredDB);
      res.status(201).send(filteredDB); //SENDS RESPONSE WITH GOOD CODE AND WHOLE DATABSE
    } else {
      const err = {};
      err.httpStatusCode = 404;
      next(err);
    }
  } catch (err) {
    err.httpStatusCode = 404;
    next(err);
  }
});

module.exports = router;
