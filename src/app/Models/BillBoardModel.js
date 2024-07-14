import mongoose from 'mongoose';

const Schema = new mongoose.Schema(
    {
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
    },
    { timestamps: true },
);
export const billBoardsModel = mongoose.model('billboards', Schema);
