import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
const Schema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true,
            default: uuidv4(),
        },
        email: {
            type: String,
            require: true,
            default: uuidv4(),
        },
        password: {
            type: String,
            require: false,
            default: uuidv4(),
        },
        userName: {
            type: String,
            require: true,
        },
    },
    { timestamps: true },
);
export const accountsModel = mongoose.model('accounts', Schema);
