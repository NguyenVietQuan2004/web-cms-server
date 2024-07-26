import { isMissingInformationProduct } from '../../utils/isMissingInformationProduct.js';
import { productsModel } from '../Models/ProductModel.js';
import { accountsModel } from '../Models/AccountModel.js';

// {
//     _id:
//     storeId:
//     categoryObject:
//     arrayPrice:
//     name:
//     isFeature:
//     isArchive:
//     createAt:
//     updateAt
// }

// [POST] /product
export const createProduct = async (req, res) => {
    try {
        const newProductFromClient = req.body;
        if (isMissingInformationProduct(newProductFromClient)) {
            return res.status(400).json({
                statusCode: 400,
                message: 'Missing information product.',
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
        const existProduct = await productsModel.findOne({
            name: { $regex: newProductFromClient.name, $options: 'i' },
            storeId: newProductFromClient.storeId,
            'categoryObject.categoryId': newProductFromClient.categoryObject.categoryId,
        });
        if (existProduct) {
            return res.status(400).json({
                statusCode: 400,
                message: 'Product name is already exist.',
                ok: false,
                data: null,
            });
        }
        const product = await productsModel(newProductFromClient);
        await product.save();
        res.status(200).json({
            data: product,
            message: 'Create product success.',
            ok: true,
            statusCode: 200,
        });
    } catch (error) {
        res.status(400).json({
            data: error,
            statusCode: 400,
            message: 'Something went wrong. Create product failed.',
            ok: false,
        });
    }
};
// [GET] /product

export const getProduct = async (req, res) => {
    try {
        const product = await productsModel.findOne({
            _id: req.query._id,
            storeId: req.query.storeId,
        });
        if (!product) {
            return res.status(400).json({
                data: null,
                statusCode: 400,
                message: 'Product id or store id is wrong.',
                ok: false,
            });
        }
        res.status(200).json({
            data: product,
            statusCode: 200,
            message: 'Get product success.',
            ok: true,
        });
    } catch (error) {
        res.status(400).json({
            data: error,
            statusCode: 400,
            message: 'Something went wrong. Get product failed.',
            ok: false,
        });
    }
};
// [GET] /product/getall

export const getAllProduct = async (req, res) => {
    try {
        if (!req.query.storeId) {
            res.status(200).json({
                data: null,
                statusCode: 200,
                message: 'Store id is missing.',
                ok: true,
            });
        }
        const listProduct = await productsModel
            .find({
                storeId: req.query.storeId,
            })
            .sort({ createdAt: -1 });
        res.status(200).json({
            data: listProduct,
            statusCode: 200,
            message: 'Get list product success',
            ok: true,
        });
    } catch (error) {
        res.status(400).json({
            data: error,
            statusCode: 400,
            message: 'Something went wrong. Get products failed.',
            ok: false,
        });
    }
};
// [PUT] /product
export const updateProduct = async (req, res) => {
    try {
        const newProductFromClient = req.body;
        if (isMissingInformationProduct(newProductFromClient)) {
            return res.status(400).json({
                statusCode: 400,
                message: 'Missing information billboard .',
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

        const existProduct = await productsModel.findOne({
            _id: newProductFromClient._id,
            storeId: newProductFromClient.storeId,
        });
        if (!existProduct) {
            return res.status(400).json({
                statusCode: 400,
                message: 'Product id or store id is wrong.',
                ok: false,
                data: null,
            });
        }
        const { _id, ...orthers } = newProductFromClient;
        const newProductUpdate = await productsModel.findOneAndUpdate(
            {
                _id: newProductFromClient._id,
                storeId: newProductFromClient.storeId,
            },
            {
                ...orthers,
            },
            {
                new: true,
            },
        );

        res.status(200).json({
            data: newProductUpdate,
            statusCode: 200,
            message: 'Update product success.',
            ok: true,
        });
    } catch (error) {
        res.status(400).json({
            data: error,
            statusCode: 400,
            message: 'Something went wrong. Update product failed.',
            ok: false,
        });
    }
};
// [DELETE] /product

export const deleteProduct = async (req, res) => {
    const productId = req.body._id;
    const storeId = req.body.storeId;
    try {
        if (!productId || !storeId) {
            return res.status(400).json({
                statusCode: 400,
                message: 'Product id or store id  is missing.',
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

        const productDeleted = await productsModel.findOneAndDelete({
            _id: productId,
            storeId,
        });
        res.status(200).json({
            data: productDeleted,
            message: 'Delete product success.',
            ok: true,
            statusCode: 200,
        });
    } catch (error) {
        return res.status(400).json({
            statusCode: 400,
            message: 'Something went wrong. Delete product failed',
            ok: false,
            data: error,
        });
    }
};
