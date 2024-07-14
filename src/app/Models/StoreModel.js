import mongoose from 'mongoose';

const Schema = new mongoose.Schema(
    {
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
export const storesModal = mongoose.model('stores', Schema);
