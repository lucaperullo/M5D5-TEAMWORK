const express = require("express")
const uniqid = require("uniqid")
const { join } = require("path")
const { readDB, writeDB } = require ("../lib/utilities")
const { check, validationResult } = require("express-validator")

const router = express.Router()

const productsFilePath = join(__dirname, "products.json")


router.get("/", async (req, res, next) => {
    try {
        const productsDB = await readDB(productsFilePath)

        let filteredProducts;

        req.query && req.query.name ? 
        filteredProducts = productsDB.filter(
            product =>
            product.hasOwnProperty("name") &&
            product.name.toLowerCase() === req.query.name.toLowerCase()
        )
        && res.send(filteredProducts) : res.send(productsDB)

    } catch (error) {
        next(error)
    }
})


router.get("/:id", async (req, res, next) => {
    try {
        const productsDB = await readDB(productsFilePath)
        const product = productsDB.filter(product => product.ID === req.params.id)

        let err;

        product.length > 0 ? res.send(product)
        : err = new Error()
        err.httpStatusCode = 404
        next(err)
    } catch (error) {
        next(error)
    }
})


router.post("/",
[
   check("name")
   .exists()
   .withMessage("Please insert a name")
   ,

   check("description")
   .isLength({ min: 10 })
   .exists()
   .withMessage("Please provide a description for your product")
   ,

   check("price")
   .isDecimal()
   .exists()
   .withMessage("Insert a valid price"),

   check("brand")
   .exists()
   .withMessage("Please provide the name of the product's brand"),
],
async (req, res, next) => {
    try {
        const errors = validationResult(req)

        if(!errors.isEmpty()) {
           const err = new Error() 
           err.message = errors
           err.httpStatusCode = 400 
          next(err)
        } else {
        const productsDB = await readDB(productsFilePath)
        const newProduct = {
            ...req.body,
            ID: uniqid(),
            createdAt: new Date(),
            updatedAt: new Date(),
        
        }
        

        productsDB.push(newProduct)

        await writeDB(productsFilePath, productsDB)
        res.send(201).send({ newProduct })
    }
    } catch (error) {

        next(error)
    }

}
)


router.delete("/:id", async (req, res, next) => {
    try {
        const productsDB = await readDB(productsFilePath)
        const newDB = productsDB.filter(product => product.ID !== req.params.id)
        
        await writeDB(productsFilePath, newDB)
        
        res.sendStatus(204).send()
        
    } catch (error) {
        next(error)
    }
}
)


router.put("/:id", async (req, res, next) => {
    try {
        const productsDB = await readDB(productsFilePath)
        const newDB = productsDB.filter(product => product.ID !== req.params.id)

        const modifiedProduct = {
            ...req.body,
            ID: req.params.id,
            modifiedAt: new Date(),
        }

        newDB.push(modifiedProduct)
        await writeDB(productsFilePath, newDB)

        res.send({ modifiedProduct })

    } catch (error) {
        next(error)
    }
})


module.exports = router