import { chatModel } from '../Models/ChatModel.js';
import { colorsModel } from '../Models/ColorModel.js';
import { messageModel } from '../Models/MessageModel.js';
import { productsModel } from '../Models/ProductModel.js';

//{
//  _id:
//  storeId:
//  name:
//   value:
//  createAt:
//  updateAt
//}

// [POST] /message
export const createMessage = async (req, res) => {
    const senderId = req.body.senderId;
    const receiverId = req.body.receiverId;
    const text = req.body.text;
    try {
        let chat = await chatModel.findOne({
            members: { $all: [senderId, receiverId] },
        });
        if (chat) {
            if (Object.keys(chat.user_unread)[0] === 'null') {
                await chatModel.updateOne(
                    {
                        _id: chat._id,
                    },
                    {
                        $set: {
                            user_unread: { [receiverId]: 1 },
                        },
                    },
                );
            } else {
                await chatModel.updateOne(
                    {
                        _id: chat._id,
                    },
                    {
                        $inc: {
                            [`user_unread.${receiverId}`]: 1,
                        },
                    },
                );
            }
        }
        if (!chat) {
            chat = await chatModel({
                members: [senderId, receiverId],
                user_unread: { [receiverId]: 1 },
            });
            await chat.save();
        }
        const chatId = chat._id;
        const newMessage = await messageModel({
            chatId,
            senderId,
            text,
        });
        await newMessage.save();
        res.status(200).json({
            data: newMessage,
            statusCode: 200,
            message: 'Create message success.',
            ok: true,
        });
    } catch (error) {
        res.status(500).json({
            data: error,
            statusCode: 500,
            message: 'Something went wrong. Create message failed.',
            ok: false,
        });
    }
};

// [GET] /message/:id
export const getMessagesChatUser = async (req, res) => {
    const _id = req.params._id;

    try {
        const chatUser = await chatModel.findOne({
            members: _id,
        });
        if (!chatUser) {
            return res.status(200).json({
                data: [],
                statusCode: 200,
                message: 'Get chatUser success.',
                ok: true,
            });
        }
        const messages = await messageModel
            .find({
                chatId: chatUser._id,
            })
            .sort({ createdAt: 1 });
        res.status(200).json({
            data: messages,
            statusCode: 200,
            message: 'Get chatUser success.',
            ok: true,
        });
    } catch (error) {
        res.status(500).json({
            data: error,
            statusCode: 500,
            message: 'Something went wrong. Get color failed.',
            ok: false,
        });
    }
};

// [GET] /message/:id/getall
export const getAllChats = async (req, res) => {
    const _id = req.params._id;
    const chats = await chatModel.find({
        members: _id,
    });
    try {
        res.status(200).json({
            data: chats,
            statusCode: 200,
            message: 'Get all chats success',
            ok: true,
        });
    } catch (error) {
        res.status(500).json({
            data: error,
            statusCode: 500,
            message: 'Something went wrong. Get all chats failed.',
            ok: false,
        });
    }
};

// [POST] /message/markunread
export const markUnread = async (req, res) => {
    const _id = req.body._id;
    const chatId = req.body.chatId;

    try {
        let chat = await chatModel.findOne({
            _id: chatId,
            members: _id,
        });
        console.log(chat, _id);
        if (chat) {
            await chatModel.updateOne(
                {
                    _id: chatId,
                    members: _id,
                },
                {
                    $set: {
                        user_unread: { null: 0 },
                    },
                },
            );
        }
        res.status(200).json({
            data: null,
            statusCode: 200,
            message: 'Mark unread success',
            ok: true,
        });
    } catch (error) {
        res.status(500).json({
            data: error,
            statusCode: 500,
            message: 'Something went wrong. Mark unread failed.',
            ok: false,
        });
    }
};
// [GET] /:room_id

export const room = async (req, res) => {
    const chatId = req.params.room_id;
    try {
        let chat = await chatModel.findOne({
            _id: chatId,
        });
        const messages = await messageModel
            .find({
                chatId,
            })
            .sort({ createdAt: 1 });

        res.status(200).json({
            data: {
                room: chat,
                messages,
            },
            statusCode: 200,
            message: 'Get room success.',
            ok: true,
        });
    } catch (error) {
        res.status(500).json({
            data: error,
            statusCode: 500,
            message: 'Something went wrong. Get room failed.',
            ok: false,
        });
    }
};
