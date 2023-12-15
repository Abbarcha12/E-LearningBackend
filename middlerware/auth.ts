import { IUser } from './../models/user.model';
import jwt, { JwtPayload } from "jsonwebtoken";
import { Response, Request, NextFunction } from "express";
import catchAsyncError from "./catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import { redis } from "../utils/redis";

// Authenticated Users

export const isAuthenticated = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    
    const access_token = req.cookies.access_token; // Use the correct cookie name
    

    if (!access_token) {
      return next(new ErrorHandler("Please login to get the Access", 404));
    }

    try {
      const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN as string) as JwtPayload;
      

      const user = await redis.get(decoded.id);
      console.log(user, "user");

      if (!user) {
        return next(new ErrorHandler("User Not found", 404));
      }

      req.user = JSON.parse(user);
      next();
    } catch (error) {
      // Handle token verification errors
      return next(new ErrorHandler("Access Token is not valid", 404));
    }
  }
);
