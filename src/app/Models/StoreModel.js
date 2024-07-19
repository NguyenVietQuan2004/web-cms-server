import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const Schema = new mongoose.Schema(
    {
        _id: {
            type: String,
            required: true,
            default: () => uuidv4(),
        },
        name: {
            type: String,
            require: true,
        },
        userId: {
            type: String,
            require: true,
        },
    },
    { timestamps: true },
);
export const storesModel = mongoose.model('stores', Schema);
