"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const catchAsyncError_1 = __importDefault(require("./catchAsyncError"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const redis_1 = require("../utils/redis");
// Authenticated Users
exports.isAuthenticated = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const access_token = req.cookies.access_token; // Use the correct cookie name
    if (!access_token) {
        return next(new ErrorHandler_1.default("Please login to get the Access", 404));
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(access_token, process.env.ACCESS_TOKEN);
        const user = yield redis_1.redis.get(decoded.id);
        console.log(user, "user");
        if (!user) {
            return next(new ErrorHandler_1.default("User Not found", 404));
        }
        req.user = JSON.parse(user);
        next();
    }
    catch (error) {
        // Handle token verification errors
        return next(new ErrorHandler_1.default("Access Token is not valid", 404));
    }
}));
