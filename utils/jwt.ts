require("dotenv").config();
import { Response } from "express";
import { IUser } from "../models/user.model";
import { redis } from "./redis";

interface ITokenOption {
  httpOnly: boolean;
  sameSite: "lax" | "strict" | "none" | undefined;
  secure?: boolean;
}

export const sendToken = (user: IUser, statusCode: number, res: Response) => {
  const accessToken = user.SignAccessToken();
  console.log(accessToken)
  const refreshToken = user.SignRefreshToken();
  //upload Session  to redis
  redis.set(user._id,JSON.stringify(user) as any)
  // pare .env variables  to integrate with fallback values



  // option for Cookies

  const accessTokenOptions: ITokenOption = {
    httpOnly: true,
    sameSite: "lax",
  };

  const RefreshTokenOptions: ITokenOption = {
    httpOnly: true,
    sameSite: "lax",
  };

  if (process.env.NODE_ENV === "production") {
    accessTokenOptions.secure = true;
  }

  res.cookie("access_token", accessToken, accessTokenOptions);

  res.cookie("refresh_token", refreshToken, RefreshTokenOptions);

  res.status(statusCode).json({
    success: true,
    user,
    accessToken,
  });
};
