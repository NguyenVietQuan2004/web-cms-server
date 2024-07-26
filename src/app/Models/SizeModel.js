import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const Schema = new mongoose.Schema(
    {
        _id: {
            type: String,
            required: true,
            default: () => uuidv4(),
        },
        storeId: {
            type: String,
            require: true,
        },
        name: {
            type: String,
            require: true,
        },
        value: {
            type: String,
            require: true,
        },
    },
    { timestamps: true },
);
export const sizesModel = mongoose.model('sizes', Schema);
