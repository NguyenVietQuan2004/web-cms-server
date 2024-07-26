import { storesModel } from '../Models/StoreModel.js';
import { accountsModel } from '../Models/AccountModel.js';
import { productsModel } from '../Models/ProductModel.js';
import { categoriesModel } from '../Models/CategoryModel.js';
import { billBoardsModel } from '../Models/BillBoardModel.js';

// {
//     _id:
//     name:
//     userId:
//     createAt:
//     updateAt:
// }

//   [POST] /store
export const createStore = async (req, res) => {
    try {
        const newStoreFromClient = req.body;
        if (!newStoreFromClient.name) {
            return res.status(400).json({
                statusCode: 400,
                message: 'Missing name store.',
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
        const nameExist = await storesModel.findOne({
            name: newStoreFromClient.name,
            userId: req.user,
        });
        if (nameExist) {
            return res.status(400).json({
                statusCode: 400,
                message: 'Name store is already exist.',
                ok: false,
                data: null,
            });
        }
        newStoreFromClient.userId = req.user;
        const store = await storesModel(newStoreFromClient);
        await store.save();
        const { userId, ...orthers } = store._doc;
        res.status(200).json({
            data: orthers,
            message: 'Create store success.',
            ok: true,
            statusCode: 200,
        });
    } catch (error) {
        res.status(400).json({
            data: error,
            statusCode: 400,
            message: 'Something went wrong. Create store failed.',
            ok: false,
        });
    }
};

// [GET] /store/getall
export const getAllStore = async (req, res) => {
    try {
        const listStore = await storesModel
            .find({
                userId: req.user,
            })
            .select('-userId')
            .sort({ createdAt: -1 });
        res.status(200).json({
            data: listStore,
            statusCode: 200,
            message: 'Get list store success',
            ok: true,
        });
    } catch (error) {
        res.status(400).json({
            data: error,
            statusCode: 400,
            message: 'Something went wrong. Get stores failed.',
            ok: false,
        });
    }
};
// [GET] /store/:storeId

export const getStore = async (req, res) => {
    try {
        const store = await storesModel
            .findOne({
                userId: req.user,
                _id: req.query._id,
            })
            .select('-userId');
        if (!store) {
            return res.status(400).json({
                data: null,
                statusCode: 400,
                message: 'StoreId is wrong.',
                ok: false,
            });
        }
        res.status(200).json({
            data: store,
            statusCode: 200,
            message: 'Get store success.',
            ok: true,
        });
    } catch (error) {
        res.status(400).json({
            data: error,
            statusCode: 400,
            message: 'Something went wrong. Get store failed.',
            ok: false,
        });
    }
};
// [PUT] /store
export const updateStore = async (req, res) => {
    try {
        const storeId = req.body._id;
        const newName = req.body.name;
        if (!storeId || !newName) {
            return res.status(400).json({
                statusCode: 400,
                message: 'Missing name or storeId store.',
                ok: false,
                data: null,
            });
        }
        const newStoreName = await storesModel
            .findOneAndUpdate(
                {
                    _id: storeId,
                    userId: req.user,
                },
                {
                    name: newName,
                },
                {
                    new: true,
                },
            )
            .select('-userId');

        res.status(200).json({
            data: newStoreName,
            statusCode: 200,
            message: 'Update store success.',
            ok: true,
        });
    } catch (error) {
        res.status(400).json({
            data: error,
            statusCode: 400,
            message: 'Something went wrong. Update store failed.',
            ok: false,
        });
    }
};
// [delete] /store
export const deleteStore = async (req, res) => {
    try {
        const userId = req.user;
        const storeId = req.body._id;

        const existBillboard = await billBoardsModel.findOne({
            storeId,
        });
        const existCategories = await categoriesModel.findOne({
            storeId,
        });
        const existProduct = await productsModel.findOne({
            storeId,
        });
        if (existBillboard || existCategories || existProduct) {
            return res.status(400).json({
                statusCode: 400,
                message: 'You need to emty billboard, category and product to delete store.',
                ok: false,
                data: null,
            });
        }
        const storeDeleted = await storesModel
            .findOneAndDelete({
                userId,
                _id: storeId,
            })
            .select('-userId');
        res.status(200).json({
            data: storeDeleted,
            message: 'Delete store success.',
            ok: true,
            statusCode: 200,
        });
    } catch (error) {
        return res.status(400).json({
            statusCode: 400,
            message: 'Something went wrong.',
            ok: false,
            data: error,
        });
    }
};
