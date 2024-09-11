import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const Schema = new mongoose.Schema(
    {
        _id: {
            type: String,
            required: true,
            default: () => uuidv4(),
        },
        billboardFeature: {
            type: Array,
            require: true,
        },
        billboardBST: {
            type: String,
            required: true,
        },
        backgroundInsurance: {
            type: String,
            required: true,
        },
        storeId: {
            type: String,
            required: true,
        },
    },
    { timestamps: true },
);
export const ImagesHomePageModel = mongoose.model('imageshomepage', Schema);
