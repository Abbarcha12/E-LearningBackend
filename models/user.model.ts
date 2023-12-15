require("dotenv").config()
import mongoose, { Document, Model, Schema } from "mongoose"
import bcrypt from "bcryptjs"
import  jwt  from "jsonwebtoken"


const emailRegexPattern: RegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/


export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    avatar: {
        public_id: string;
        url: string;
    };
    role: string;
    isVerified: Boolean;
    course: Array<{ courseId: string }>;
    comparePassword: (password: string) => Promise<boolean>;
    SignAccessToken:()=>string;
    SignRefreshToken:()=>string;



}

const userSchema: Schema<IUser> = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter your name!"]
    },
    email: {
        type: String,
        required: [true, "Please Enter your email!"],
        validate: {
            validator: function (value: string) {
                return emailRegexPattern.test(value)
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

userSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }
    this.password = await bcrypt.hash(this.password, 10);
    next()
})
// Sign In Access Token
userSchema.methods.SignAccessToken = function (){
    let payload = {
        id: this._id,
      }
    return jwt.sign(payload,process.env.ACCESS_TOKEN || " ",{
        expiresIn:"20m"
    })
}

// Sign In Refresh Token

userSchema.methods.SignRefreshToken = function (){
    let payload = {
        id: this._id,
      }
    return jwt.sign(payload,process.env.REFRESH_TOKEN || " ",{
        expiresIn:'3d'
    } )
}

// Comparing Password 
userSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password)
}

const userModel: Model<IUser> = mongoose.model('User', userSchema)

export default userModel;