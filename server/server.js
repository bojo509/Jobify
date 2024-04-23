import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import morgan from "morgan"
import bodyParser from "body-parser"
import xss from "xss-clean"
import mongoSanitize from "express-mongo-sanitize"
import dbConnection from "./dbConfig/dbConnection.js"
import router from "./Routes/index.js"
import errorMiddleware from "./middlewares/errorMiddleware.js"

dotenv.config()
const app = express()
const PORT = process.env.PORT || 8800

dbConnection()

// Eliminates cors errors
app.use(cors())
app.use(xss())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(mongoSanitize())
// Max json size
app.use(express.json({ limit: "100mb" }))
app.use(express.urlencoded({ extended: true }))
app.use(morgan("dev"))
app.use(router)
app.use(errorMiddleware)


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})