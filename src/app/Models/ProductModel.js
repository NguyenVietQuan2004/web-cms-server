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
        images: {
            type: Array,
            require: true,
        },
        categoryId: {
            type: String,
            require: true,
            ref: 'categories',
        },
        arrayPrice: {
            type: Array,
            require: true,
        },
        name: {
            type: String,
            require: true,
            default: () => new Date().getSeconds(),
        },
        isFeature: {
            type: Boolean,
            require: true,
            default: false,
        },
        isArchive: {
            type: Boolean,
            require: true,
            default: false,
        },
    },
    { timestamps: true },
);
export const productsModel = mongoose.model('products', Schema);
