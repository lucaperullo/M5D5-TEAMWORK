const express = require("express")
const { join } = require("path")
const cors = require("cors")
const productsRouter = require("./products/productsDB")
const reviesRouter = require('./reviews/reviews')
const {
    notFoundHandler,
    unauthorizedHandler,
    forbiddenHandler,
    badRequestHandler,
    catchAllHandler
} = require("../errorHandler")

const server = express()

const port = process.env.PORT || 3005

const loggerMiddleware = (req, res, next) => {
    console.log(`Logged ${req.url} ${req.method} -- ${new Date()} `)
    next()
}

server.use(cors())
server.use(express.json())
server.use(loggerMiddleware)

server.use("/products", productsRouter)
server.use("/reviews", reviesRouter)


server.use(notFoundHandler)
server.use(unauthorizedHandler)
server.use(badRequestHandler)
server.use(forbiddenHandler)
server.use(catchAllHandler)


server.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})