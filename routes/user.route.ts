import express from "express"
import { RegisterUser, activationUser, logOutUser, loginUser } from "../controller/user.controller"
import { isAuthenticated } from "../middlerware/auth"
const userRouter=express.Router()


userRouter.post("/registration",RegisterUser)
userRouter.post("/activate-user",activationUser)
userRouter.post("/login",loginUser)
userRouter.get("/logout",isAuthenticated, logOutUser)





export default userRouter