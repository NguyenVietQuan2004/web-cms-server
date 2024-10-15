import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const Schema = new mongoose.Schema(
    {
        _id: {
            type: String,
            required: true,
            default: () => uuidv4(),
        },
        members: {
            type: Array,
            require: true,
        },
        user_unread: {
            type: Object,
            require: true,
        },
    },
    { timestamps: true },
);
export const chatModel = mongoose.model('chat', Schema);
