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
        storeId: {
            type: String,
            require: true,
        },
        billboardId: {
            type: String,
            require: true,
            ref: 'billboards',
        },
    },
    { timestamps: true },
);
export const categoriesModel = mongoose.model('categories', Schema);
