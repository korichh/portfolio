import "dotenv/config"
import express from "express"
import { setSession } from "./middleware"
import adminRouter from "./admin/routes"
import mainRouter from "./routes"
import sequelize from "./config/connection"

const app = express()
const PORT = process.env.PORT

// import path from "path"
// app.use("/", express.static(path.join(process.cwd(), "client/public")))
// app.use("/admin", express.static(path.join(process.cwd(), "client/admin/public")))

app.set('trust proxy', 1)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(setSession)
app.use(adminRouter)
app.use(mainRouter)

sequelize.sync({ force: false, alter: false, logging: false }).then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`)
    })
})