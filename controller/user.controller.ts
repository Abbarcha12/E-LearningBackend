import dotenv from "dotenv";
dotenv.config();
import { Request, Response, NextFunction } from "express";
import ejs from "ejs";
import userModel, { IUser } from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import catchAsyncError from "../middlerware/catchAsyncError";
import jwt, { Secret } from "jsonwebtoken";
import path from "path";
import sendMail from "../utils/sendMail";
import { sendToken } from "../utils/jwt";
// Register User
interface userRegistration {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export const RegisterUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;
      const isEmailExist = await userModel.findOne({ email });
      if (isEmailExist) {
        return next(new ErrorHandler("User Already Exist", 400));
      }

      const user: userRegistration = {
        name,
        email,
        password,
      };
      const activationToken = createActivationToken(user);
      const activationCode = activationToken.activationCode;
      const data = { user: { name: user.name }, activationCode };
      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/activation-mail.ejs"),
        data
      );

      try {
        await sendMail({
          email: user.email,
          subject: "Active Your Account",
          template: "activation-mail.ejs",
          data: { activationCode },
          html: html,
        });
        res.status(201).json({
          success: true,
          message: `Please check your Email: ${user.email} to activate your Account`,
          activationToken: activationToken.token,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

interface IActivation {
  token: string;
  activationCode: string;
}

// Creating Token

export const createActivationToken = (user: any): IActivation => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

  const token = jwt.sign(
    {
      user,
      activationCode,
    },
    process.env.ACTIVATION_SECRET as Secret,
    {
      expiresIn: "5m",
    }
  );

  return { token, activationCode };
};

// UserActivation

interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}

export const activationUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token, activation_code } =
        req.body as IActivationRequest;

      const newUser: { user: IUser ; activationCode: string } = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET as string
      ) as { user: IUser; activationCode: string };
      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler("Invalid activation code", 400));
      }

      const { name, email, password } = newUser.user;
      const existUser = await userModel.findOne({ email });
      if (existUser) {
        return next(new ErrorHandler("Email already Exist", 400));
      }

      const user = userModel.create({
        name,
        email,
        password,
      });
      res.status(201).json({
        success: true,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);


// Login USER

interface ILoginuser{
  email:string,
  password:string
}


export const loginUser=catchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{

  try {
 
    const {email,password} = req.body as ILoginuser
    if(!email && !password){
      return next(new ErrorHandler("Please Enter email and password" ,400));
    }

    const user  = await userModel.findOne({email}).select("+password")
    if(!user){
      return next(new ErrorHandler("Invalid  email and password !" ,400));
    }
   const isPasswordMatch= await user.comparePassword(password)
   if(!isPasswordMatch){
    return next(new ErrorHandler("Invalid  Password !" ,400));
  }
   
  sendToken(user,200,res)
  } catch (error:any) {
    return next(new ErrorHandler(error.message, 400));
  }
})

// Logout the User

export const logOutUser =catchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
  try {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
       res.status(200).json({
        success:true,
        message:"Logged Out successfully"
       })

  } catch (error:any) {
    return next(new ErrorHandler(error.message, 400));
  }
})