import { ErrorMiddleWare } from './middlerware/error';
import express, { NextFunction, Request,Response } from  "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import userRouter from './routes/user.route';
dotenv.config()
export const app = express()

app.use(express.json({limit:"50mb"}))
app.use(cookieParser())
app.use(cors({
    origin:process.env.ORIGIN
}))


// Routes

app.use('/api/v1',userRouter)



// testing our api

app.get('/test',(req:Request,res:Response)=>{
    res.status(200).json({
        success:true,
        message:"Good job !"
    })
})

app.all('*',(req:Request,res:Response,next:NextFunction)=>{
   const err = new Error(`Route ${req.originalUrl} not found`) as any   
   err.statusCode=404;
   next(err)
})
app.use(ErrorMiddleWare)