import { NextFunction, Request,Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";

export const ErrorMiddleWare = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Wrong mongodb id Error
  if (err.name === "CastError") {
    const message = `Resource not found . InValid: ${err.path}`;

    err = new ErrorHandler(message, 400);
  }

  //   Duplicate Key Error

  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 400);
  }

  // Json web Token error
  if (err.name === "JsonWebTokenError") {
    const message = `Json web token is invalid , try again`;
    err = new ErrorHandler(message, 400);
  }


//  Jwt expired Error
if (err.name === "TokenExpiredError") {
    const message = `Json web token is invalid , try again`;
    err = new ErrorHandler(message, 400);
  }

res.status(err.statusCode).json({
    success:false,
    message:err.message
})
};
