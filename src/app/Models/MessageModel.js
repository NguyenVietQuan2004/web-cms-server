import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const Schema = new mongoose.Schema(
    {
        _id: {
            type: String,
            required: true,
            default: () => uuidv4(),
        },
        chatId: {
            type: String,
            required: true,
            ref: 'chat',
        },
        text: {
            type: String,
            required: true,
        },
        senderId: {
            type: String,
            required: true,
            ref: 'accounts',
        },
    },
    { timestamps: true },
);
export const messageModel = mongoose.model('message', Schema);
