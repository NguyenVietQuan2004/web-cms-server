import { sizesModel } from '../Models/SizeModel.js';
import { accountsModel } from '../Models/AccountModel.js';
import { productsModel } from '../Models/ProductModel.js';

// {
//     _id:
//     storeId:
//     name:
//     value:
//     createAt:
//     updateAt
// }

// [POST] /size
export const createSize = async (req, res) => {
    try {
        const newSizeFromClient = req.body;
        if (!newSizeFromClient.storeId || !newSizeFromClient.value || !newSizeFromClient.name) {
            return res.status(401).json({
                statusCode: 401,
                message: 'Missing information size.',
                ok: false,
                data: null,
            });
        }

        let sizeExist = await sizesModel.findOne({
            name: newSizeFromClient.name,
            storeId: newSizeFromClient.storeId,
        });
        if (sizeExist) {
            return res.status(401).json({
                statusCode: 401,
                message: 'Size name is already exist.',
                ok: false,
                data: null,
            });
        }
        sizeExist = await sizesModel.findOne({
            value: newSizeFromClient.value,
            storeId: newSizeFromClient.storeId,
        });
        if (sizeExist) {
            return res.status(401).json({
                statusCode: 401,
                message: 'Size value is already exist.',
                ok: false,
                data: null,
            });
        }
        const size = await sizesModel(newSizeFromClient);
        await size.save();
        res.status(200).json({
            data: size,
            message: 'Create size success.',
            ok: true,
            statusCode: 200,
        });
    } catch (error) {
        res.status(500).json({
            data: error,
            statusCode: 500,
            message: 'Something went wrong. Create size failed.',
            ok: false,
        });
    }
};
// [GET] /size

export const getSize = async (req, res) => {
    try {
        const size = await sizesModel.findOne({
            _id: req.query._id,
            storeId: req.query.storeId,
        });
        if (!size) {
            return res.status(400).json({
                data: null,
                statusCode: 400,
                message: 'Size id or storeId is wrong.',
                ok: false,
            });
        }
        res.status(200).json({
            data: size,
            statusCode: 200,
            message: 'Get size success.',
            ok: true,
        });
    } catch (error) {
        res.status(500).json({
            data: error,
            statusCode: 500,
            message: 'Something went wrong. Get size failed.',
            ok: false,
        });
    }
};
// [GET] /size/getall

export const getAllSize = async (req, res) => {
    try {
        if (!req.query.storeId) {
            res.status(200).json({
                data: null,
                statusCode: 200,
                message: 'Store id is missing.',
                ok: true,
            });
        }
        const listSize = await sizesModel
            .find({
                storeId: req.query.storeId,
            })
            .sort({ createdAt: -1 });
        res.status(200).json({
            data: listSize,
            statusCode: 200,
            message: 'Get list size success',
            ok: true,
        });
    } catch (error) {
        res.status(500).json({
            data: error,
            statusCode: 500,
            message: 'Something went wrong. Get sizes failed.',
            ok: false,
        });
    }
};
// [PUT] /size

export const updateSize = async (req, res) => {
    try {
        const sizeId = req.body._id;
        const name = req.body.name;
        const storeId = req.body.storeId;
        const value = req.body.value;

        if (!sizeId || !name || !storeId || !value) {
            return res.status(401).json({
                statusCode: 401,
                message: 'Missing information size.',
                ok: false,
                data: null,
            });
        }

        const existSize = await sizesModel.findOne({
            _id: sizeId,
            storeId,
        });
        if (!existSize) {
            return res.status(401).json({
                statusCode: 401,
                message: 'Size id or store id is wrong.',
                ok: false,
                data: null,
            });
        }
        const newSizeUpdate = await sizesModel.findOneAndUpdate(
            {
                _id: sizeId,
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
            data: newSizeUpdate,
            statusCode: 200,
            message: 'Update size success.',
            ok: true,
        });
    } catch (error) {
        res.status(500).json({
            data: error,
            statusCode: 500,
            message: 'Something went wrong. Update size failed.',
            ok: false,
        });
    }
};
// [DELETE] /size

export const deleteSize = async (req, res) => {
    try {
        const sizeId = req.body._id;
        const storeId = req.body.storeId;
        if (!sizeId || !storeId) {
            return res.status(401).json({
                statusCode: 401,
                message: 'Size information is missing.',
                ok: false,
                data: null,
            });
        }

        const size = await sizesModel.findOne({
            _id: sizeId,
        });
        if (!size) {
            return res.status(401).json({
                statusCode: 401,
                message: 'Size id is wrong.',
                ok: false,
                data: null,
            });
        }
        const existProductConnectWithSize = await productsModel.findOne({
            storeId,
            arrayPrice: { $elemMatch: { size: size.value } },
        });
        if (existProductConnectWithSize) {
            return res.status(401).json({
                statusCode: 401,
                message: 'This size is connecting with another product.',
                ok: false,
                data: null,
            });
        }
        const sizeDeleted = await sizesModel.findOneAndDelete({
            _id: sizeId,
            storeId,
        });
        res.status(200).json({
            data: sizeDeleted,
            message: 'Delete size success.',
            ok: true,
            statusCode: 200,
        });
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: 'Something went wrong. Delete size failed.',
            ok: false,
            data: error,
        });
    }
};
