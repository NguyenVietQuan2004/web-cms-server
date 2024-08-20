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
        listProductOrder: {
            type: Array,
            require: true,
            ref: 'products',
        },
        isPaid: {
            type: Boolean,
            require: true,
        },
        amount: {
            type: Number,
            require: true,
        },
        phone: {
            type: String,
            require: true,
            default: '',
        },
        address: {
            type: String,
            require: true,
            default: '',
        },
    },
    { timestamps: true },
);
export const ordersModel = mongoose.model('orders', Schema);
