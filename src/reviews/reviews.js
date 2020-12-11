const express = require("express")
const uniqid = require("uniqid")
const { join } = require("path")
const { readDB, writeDB } = require ("../lib/utilities")
const { check, validationResult } = require("express-validator")

const router = express.Router()

const reviewsFilePath = join(__dirname, "reviews.json")

router.get("/", async (req, res, next) => {
    try {
        const reviewsDB = await readDB(reviewsFilePath)

        let err;
        reviewsDB.length > 0 ? res.status(201).send(reviewsDB)
        : err = {} 
        err.httpStatusCode = 404
        next(err)

    } catch (err) {
        err.httpStatusCode = 404
        next(err)
    }
})


router.get("/:id", async (req, res, next) => {
    try {
        const reviewsDB = await readDB(reviewsFilePath)
        const review = reviewsDB.filter(review => review.ID === req.params.id)

        let err;

        review.length > 0 ? res.send(review)
        : err = new Error()
        err.httpStatusCode = 404
        next(err)
    } catch (err) {
        err.httpStatusCode = 404
        next(err)
    }
})

router.post("/:id",
[
   check("comment")
   .exists()
   .withMessage("Please insert a name")
   ,

   check("rate")
   .isLength({ max: 5 })
   .isDecimal()
   .exists()
   .withMessage("Rate us please!")
   ,

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
        const reviewsDB = await readDB(reviewsFilePath)
        const newReview = {
            ...req.body,
            elementID: uniqid(),
            createdAt: new Date(),
            updatedAt: new Date(),
        }
        

        reviewsDB.push(newReview)

        await writeDB(reviewsFilePath, reviewsDB)
        res.send(201).send(reviewsDB)
    }
    } catch (error) {

        next(error)
    }

}
)

module.exports = router