import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
  origin: "https://ciaan-assignment-kapil.netlify.app",
  credentials: true
}));

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

import userRouter from './routes/user.routes.js'
import healthcheckRouter from "./routes/healthcheck.routes.js"
import postRouter from "./routes/post.routes.js"
import likeRouter from "./routes/like.routes.js"
import commentRouter from "./routes/comment.routes.js"
import connectionsRouter from "./routes/connections.routes.js"

app.use("/api/healthcheck", healthcheckRouter)
app.use("/api/users", userRouter)
app.use("/api/posts", postRouter)
app.use("/api/likes", likeRouter)
app.use("/api/comments", commentRouter)
app.use("/api/connections", connectionsRouter)


export { app }