"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controller/user.controller");
const auth_1 = require("../middlerware/auth");
const userRouter = express_1.default.Router();
userRouter.post("/registration", user_controller_1.RegisterUser);
userRouter.post("/activate-user", user_controller_1.activationUser);
userRouter.post("/login", user_controller_1.loginUser);
userRouter.get("/logout", auth_1.isAuthenticated, user_controller_1.logOutUser);
exports.default = userRouter;
