import { accountsModel } from '../Models/AccountModel.js';
import { colorsModel } from '../Models/ColorModel.js';
import { productsModel } from '../Models/ProductModel.js';

// {
//     _id:
//     storeId:
//     name:
//     value:
//     createAt:
//     updateAt
// }

// [POST] /color
export const createColor = async (req, res) => {
    try {
        const newColorFromClient = req.body;
        if (!newColorFromClient.storeId || !newColorFromClient.value || !newColorFromClient.name) {
            return res.status(400).json({
                statusCode: 400,
                message: 'Missing information color.',
                ok: false,
                data: null,
            });
        }
        const userExist = await accountsModel.findOne({
            id: req.user,
        });
        if (!userExist) {
            return res.status(403).json({
                statusCode: 403,
                message: 'You are not authenticate.',
                ok: false,
                data: null,
            });
        }
        const colorExist = await colorsModel.findOne({
            name: newColorFromClient.name,
        });
        if (colorExist) {
            return res.status(400).json({
                statusCode: 400,
                message: 'Color name is already exist.',
                ok: false,
                data: null,
            });
        }

        const color = await colorsModel(newColorFromClient);
        await color.save();
        res.status(200).json({
            data: color,
            message: 'Create color success.',
            ok: true,
            statusCode: 200,
        });
    } catch (error) {
        res.status(400).json({
            data: error,
            statusCode: 400,
            message: 'Something went wrong. Create color failed.',
            ok: false,
        });
    }
};
// [GET] /color

export const getColor = async (req, res) => {
    try {
        const color = await colorsModel.findOne({
            _id: req.query._id,
            storeId: req.query.storeId,
        });
        if (!color) {
            return res.status(400).json({
                data: null,
                statusCode: 400,
                message: 'Color id or storeId is wrong.',
                ok: false,
            });
        }
        res.status(200).json({
            data: color,
            statusCode: 200,
            message: 'Get color success.',
            ok: true,
        });
    } catch (error) {
        res.status(400).json({
            data: error,
            statusCode: 400,
            message: 'Something went wrong. Get color failed.',
            ok: false,
        });
    }
};
// [GET] /color/getall

export const getAllColor = async (req, res) => {
    try {
        if (!req.query.storeId) {
            res.status(200).json({
                data: null,
                statusCode: 200,
                message: 'Store id is missing.',
                ok: true,
            });
        }
        const listColor = await colorsModel
            .find({
                storeId: req.query.storeId,
            })
            .sort({ createdAt: -1 });
        res.status(200).json({
            data: listColor,
            statusCode: 200,
            message: 'Get color success',
            ok: true,
        });
    } catch (error) {
        res.status(400).json({
            data: error,
            statusCode: 400,
            message: 'Something went wrong. Get colors failed.',
            ok: false,
        });
    }
};
// [PUT] /color

export const updateColor = async (req, res) => {
    try {
        const colorId = req.body._id;
        const name = req.body.name;
        const storeId = req.body.storeId;
        const value = req.body.value;

        if (!colorId || !name || !storeId || !value) {
            return res.status(400).json({
                statusCode: 400,
                message: 'Missing information color.',
                ok: false,
                data: null,
            });
        }
        const userExist = await accountsModel.findOne({
            id: req.user,
        });
        if (!userExist) {
            return res.status(403).json({
                statusCode: 403,
                message: 'You are not authenticate.',
                ok: false,
                data: null,
            });
        }
        const existColor = await colorsModel.findOne({
            _id: colorId,
            storeId,
        });
        if (!existColor) {
            return res.status(400).json({
                statusCode: 400,
                message: 'Color id or store id is wrong.',
                ok: false,
                data: null,
            });
        }
        const newColorUpdate = await colorsModel.findOneAndUpdate(
            {
                _id: colorId,
                storeId,
            },
            {
                name: name,
                value: value,
            },
            {
                new: true,
            },
        );

        res.status(200).json({
            data: newColorUpdate,
            statusCode: 200,
            message: 'Update color success.',
            ok: true,
        });
    } catch (error) {
        res.status(400).json({
            data: error,
            statusCode: 400,
            message: 'Something went wrong. Update color failed.',
            ok: false,
        });
    }
};
// [DELETE] /color

export const deleteColor = async (req, res) => {
    try {
        const colorId = req.body._id;
        const storeId = req.body.storeId;
        if (!colorId || !storeId) {
            return res.status(400).json({
                statusCode: 400,
                message: 'Color information is missing.',
                ok: false,
                data: null,
            });
        }
        const userExist = await accountsModel.findOne({
            id: req.user,
        });
        if (!userExist) {
            return res.status(403).json({
                statusCode: 403,
                message: 'You are not authenticate.',
                ok: false,
                data: null,
            });
        }
        const color = await colorsModel.findOne({
            _id: colorId,
        });
        if (!color) {
            return res.status(400).json({
                statusCode: 400,
                message: 'Color id is wrong.',
                ok: false,
                data: null,
            });
        }
        const existProductConnectWithColor = await productsModel.findOne({
            storeId,
            arrayPrice: {
                $elemMatch: {
                    colors: color.name,
                },
            },
        });
        if (existProductConnectWithColor) {
            return res.status(400).json({
                statusCode: 400,
                message: 'This color is connecting with another product.',
                ok: false,
                data: null,
            });
        }
        const colorDeleted = await colorsModel.findOneAndDelete({
            _id: colorId,
            storeId,
        });
        res.status(200).json({
            data: colorDeleted,
            message: 'Delete color success.',
            ok: true,
            statusCode: 200,
        });
    } catch (error) {
        return res.status(400).json({
            statusCode: 400,
            message: 'Something went wrong. Delete color failed.',
            ok: false,
            data: error,
        });
    }
};
