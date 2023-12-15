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
require("dotenv").config();
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const emailRegexPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Please Enter your name!"]
    },
    email: {
        type: String,
        required: [true, "Please Enter your email!"],
        validate: {
            validator: function (value) {
                return emailRegexPattern.test(value);
            }
        },
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please provide a password!"],
        minLength: [8, "Your password must be at least 8 characters!"],
        select: false
    },
    avatar: {
        public_id: String,
        url: String
    },
    role: {
        type: String,
        default: 'user'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    course: [{
            courseId: String
        }]
}, { timestamps: true });
// Hashing Password before Saving 
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified('password')) {
            next();
        }
        this.password = yield bcryptjs_1.default.hash(this.password, 10);
        next();
    });
});
// Sign In Access Token
userSchema.methods.SignAccessToken = function () {
    let payload = {
        id: this._id,
    };
    return jsonwebtoken_1.default.sign(payload, process.env.ACCESS_TOKEN || " ", {
        expiresIn: "20m"
    });
};
// Sign In Refresh Token
userSchema.methods.SignRefreshToken = function () {
    let payload = {
        id: this._id,
    };
    return jsonwebtoken_1.default.sign(payload, process.env.REFRESH_TOKEN || " ", {
        expiresIn: '3d'
    });
};
// Comparing Password 
userSchema.methods.comparePassword = function (enteredPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcryptjs_1.default.compare(enteredPassword, this.password);
    });
};
const userModel = mongoose_1.default.model('User', userSchema);
exports.default = userModel;
