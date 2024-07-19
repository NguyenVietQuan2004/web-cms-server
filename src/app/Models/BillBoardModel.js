import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const Schema = new mongoose.Schema(
    {
        _id: {
            type: String,
            required: true,
            default: () => uuidv4(),
        },
        label: {
            type: String,
            require: true,
        },
        image: {
            type: String,
            require: true,
        },
        storeId: {
            type: String,
            require: true,
        },
        categoryId: {
            type: String,
            default: '',
        },
    },
    { timestamps: true },
);
export const billBoardsModel = mongoose.model('billboards', Schema);
