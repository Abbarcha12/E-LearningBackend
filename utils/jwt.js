"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToken = void 0;
require("dotenv").config();
const redis_1 = require("./redis");
const sendToken = (user, statusCode, res) => {
    const accessToken = user.SignAccessToken();
    console.log(accessToken);
    const refreshToken = user.SignRefreshToken();
    //upload Session  to redis
    redis_1.redis.set(user._id, JSON.stringify(user));
    // pare .env variables  to integrate with fallback values
    // option for Cookies
    const accessTokenOptions = {
        httpOnly: true,
        sameSite: "lax",
    };
    const RefreshTokenOptions = {
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
exports.sendToken = sendToken;
