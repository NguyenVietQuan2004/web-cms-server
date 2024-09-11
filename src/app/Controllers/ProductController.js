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

        const productsRelative = await productsModel.aggregate([
            {
                $match: { categoryId: req.query.categoryId },
            },
            {
                $sample: { size: 10 },
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'categoryId',
                    foreignField: '_id',
                    as: 'category',
                },
            },
            {
                $unwind: '$category',
            },
            {
                $addFields: { categoryId: '$category' },
            },
            {
                $project: { category: 0 },
            },
        ]);
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
    const limit = parseInt(req.query.limit) || 100;
    const page = parseInt(req.query.page) || 1;
    const skip = limit * (page - 1);
    const { storeId, categoryId, colorId, sizeId, isArchive, sortBy, value } = req.query;
    try {
        const size = await sizesModel.findOne({
            _id: sizeId,
        });
        const color = await colorsModel.findOne({
            _id: colorId,
        });
        if (!storeId) {
            return res.status(401).json({
                data: null,
                statusCode: 200,
                message: 'Store id is missing.',
                ok: true,
            });
        }
        let listProduct;
        const query = { storeId };
        const arrayPriceQuery = {};

        if (value) query.name = { $regex: new RegExp(value, 'i') };
        if (categoryId) query['categoryId'] = categoryId;
        if (sizeId) arrayPriceQuery.size = size.value;
        if (colorId) arrayPriceQuery.colors = { $in: [color.value] };
        if (sortBy === 'feature') query.isFeature = true;
        if (isArchive) query.isArchive = false;

        query['arrayPrice'] = { $elemMatch: arrayPriceQuery };

        if (sortBy === 'newest') {
            listProduct = await productsModel
                .find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('categoryId');
        } else if (sortBy === 'asc' || sortBy === 'desc') {
            const sortOrder = sortBy === 'desc' ? -1 : 1;
            listProduct = await productsModel.aggregate([
                { $match: query },
                { $addFields: { firstPrice: { $arrayElemAt: ['$arrayPrice.price', 0] } } },
                { $sort: { firstPrice: sortOrder } },
                { $skip: skip },
                { $limit: limit },
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'categoryId',
                        foreignField: '_id',
                        as: 'category',
                    },
                },
                {
                    $unwind: '$category',
                },
                {
                    $addFields: { categoryId: '$category' },
                },
                {
                    $project: { category: 0, firstPrice: 0 },
                },
            ]);
        } else {
            listProduct = await productsModel.find(query).skip(skip).limit(limit).populate('categoryId');
        }

        const totalProduct = await productsModel.countDocuments(query);
        const listColor = await colorsModel
            .find({
                storeId,
            })
            .sort({ createdAt: -1 });
        const listSize = await sizesModel
            .find({
                storeId,
            })
            .sort({ createdAt: -1 });
        res.status(200).json({
            data: {
                listProduct,
                totalProduct,
                listColor,
                listSize,
            },
            statusCode: 200,
            message: 'Get list product success.',
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

export const getAllProductById = async (req, res) => {
    try {
        const listIdProduct = req.body.listIdProduct;
        const listProduct = await productsModel
            .find({
                _id: { $in: listIdProduct },
            })
            .populate('categoryId');
        res.status(200).json({
            data: { listProduct },
            message: 'Get all product by id success.',
            ok: true,
            statusCode: 200,
        });
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: 'Something went wrong. Get all product by id failed',
            ok: false,
            data: error,
        });
    }
};
