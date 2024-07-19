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
        categoryId: {
            type: String,
            require: true,
        },
        price: {
            type: Number,
            require: true,
        },
        name: {
            type: String,
            require: true,
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
        sizes: {
            type: Array,
            require: true,
        },
        colors: {
            type: Array,
            require: true,
        },
    },
    { timestamps: true },
);
export const productsModel = mongoose.model('products', Schema);
