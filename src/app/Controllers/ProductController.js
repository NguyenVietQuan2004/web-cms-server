import { sizesModel } from '../Models/SizeModel.js';
import { colorsModel } from '../Models/ColorModel.js';
import { ordersModel } from '../Models/OrderModel.js';
import { productsModel } from '../Models/ProductModel.js';
import { accountsModel } from '../Models/AccountModel.js';
import { categoriesModel } from '../Models/CategoryModel.js';
import { isMissingInformationProduct } from '../../utils/isMissingInformationProduct.js';

import { v4 as uuidv4 } from 'uuid';

// {
//     _id:
//     storeId:
//     categoryId:
//     arrayPrice:
//              [
//              {
//                  price: 4, amount:10}
//      ]
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
            return res.status(401).json({
                statusCode: 401,
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
            categoryId: newProductFromClient.categoryId,
        });
        if (existProduct) {
            return res.status(401).json({
                statusCode: 401,
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
        res.status(500).json({
            data: error,
            statusCode: 500,
            message: 'Something went wrong. Create product failed.',
            ok: false,
        });
    }
};
// [GET] /product

export const getProduct = async (req, res) => {
    try {
        const product = await productsModel
            .findOne({
                _id: req.query._id,
                storeId: req.query.storeId,
            })
            .populate('categoryId');

        const listColor = await colorsModel
            .find({
                storeId: req.query.storeId,
            })
            .sort({ createdAt: -1 });
        const listCategory = await categoriesModel
            .find({
                storeId: req.query.storeId,
            })
            .sort({ createdAt: -1 });
        const listSize = await sizesModel
            .find({
                storeId: req.query.storeId,
            })
            .sort({ createdAt: -1 });
        const productsRelative = await productsModel
            .find({
                categoryId: req.query.categoryId,
            })
            .populate('categoryId');
        if (!product) {
            return res.status(400).json({
                data: {
                    listColor,
                    listSize,
                    listCategory,
                    productsRelative,
                },
                statusCode: 400,
                message: 'Product id or store id is wrong.',
                ok: false,
            });
        }
        res.status(200).json({
            data: {
                product,
                listColor,
                listSize,
                listCategory,
                productsRelative,
            },
            statusCode: 200,
            message: 'Get product success.',
            ok: true,
        });
    } catch (error) {
        res.status(500).json({
            data: error,
            statusCode: 500,
            message: 'Something went wrong. Get product failed.',
            ok: false,
        });
    }
};
// [GET] /product/getall

export const getAllProduct = async (req, res) => {
    // const product = await productsModel({
    //     storeId: '203f904e-e8e5-434a-9f22-b339029556f6',
    //     images: ['https://res.cloudinary.com/dvyi5jxrm/image/upload/v1723339667/ibatfwoa7qo2iz40rwjv.jpg'],
    //     categoryId: {
    //         _id: '094dd029-63fa-4f13-a9d6-79b3480d0da7',
    //         name: 'category2',
    //         storeId: '203f904e-e8e5-434a-9f22-b339029556f6',
    //         billboardId: '1e071c61-375a-41f1-bae9-4179a39a1b5c',
    //         createdAt: '2024-07-28T04:27:19.671Z',
    //         updatedAt: '2024-07-28T04:27:19.671Z',
    //         __v: 0,
    //     },
    //     arrayPrice: [
    //         { size: 'S', price: 1, colors: ['black', 'pink'] },
    //         { size: 'L', price: 2, colors: ['red', 'black'] },
    //     ],
    //     isFeature: true,
    //     isArchive: false,
    // });
    // await product.save();

    const limit = parseInt(req.query.limit) || 100;
    const page = parseInt(req.query.page) || 1;
    const skip = limit * (page - 1);
    try {
        if (!req.query.storeId) {
            return res.status(401).json({
                data: null,
                statusCode: 200,
                message: 'Store id is missing.',
                ok: true,
            });
        }
        const query = {
            storeId: req.query.storeId,
        };
        if (req.query.categoryId) {
            query['categoryId'] = req.query.categoryId;
        }
        const arrayPriceQuery = {};
        if (req.query.sizeId) {
            const size = await sizesModel.findOne({
                _id: req.query.sizeId,
            });
            arrayPriceQuery.size = size.value;
        }
        if (req.query.colorId) {
            const color = await colorsModel.findOne({
                _id: req.query.colorId,
            });
            arrayPriceQuery.colors = { $in: [color.value] };
        }
        if (req.query.isFeature) {
            query['isFeature'] = true;
        }
        if (req.query.isArchive) {
            query['isArchive'] = false;
        }
        query['arrayPrice'] = { $elemMatch: arrayPriceQuery };
        const totalProduct = await productsModel.countDocuments(query);
        const listProduct = await productsModel
            .find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('categoryId');
        res.status(200).json({
            data: {
                listProduct,
                totalProduct,
            },
            statusCode: 200,
            message: 'Get list product success',
            ok: true,
        });
    } catch (error) {
        res.status(500).json({
            data: error,
            statusCode: 500,
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
            return res.status(401).json({
                statusCode: 401,
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
            return res.status(401).json({
                statusCode: 401,
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
        res.status(500).json({
            data: error,
            statusCode: 500,
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
            return res.status(401).json({
                statusCode: 401,
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
        const existOrderConnectWithProduct = await ordersModel.findOne({
            storeId,
            listProductOrder: { $elemMatch: { _id: productId } },
        });
        if (existOrderConnectWithProduct) {
            return res.status(401).json({
                statusCode: 401,
                message: 'This product is connecting with another order.',
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
        return res.status(500).json({
            statusCode: 500,
            message: 'Something went wrong. Delete product failed',
            ok: false,
            data: error,
        });
    }
};
