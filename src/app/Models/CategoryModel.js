import mongoose from 'mongoose';

const Schema = new mongoose.Schema(
    {
        name: {
            type: String,
            require: true,
        },
        storeId: {
            type: String,
            require: true,
        },
        billBoardId: {
            type: String,
            require: true,
        },
    },
    { timestamps: true },
);
export const categoriesModel = mongoose.model('categories', Schema);
