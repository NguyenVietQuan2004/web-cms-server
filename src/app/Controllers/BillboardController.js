import { billBoardsModel } from '../Models/BillBoardModel.js';
import { categoriesModel } from '../Models/CategoryModel.js';

//{
//   _id,
//  label,
//  image,
//  createAt,
//  updateAt,
//}

// [POST] /billboard
export const createBillboard = async (req, res) => {
    try {
        const newBillboardFromClient = req.body;
        if (!newBillboardFromClient.label || !newBillboardFromClient.image || !newBillboardFromClient.storeId) {
            return res.status(401).json({
                statusCode: 401,
                message: 'Missing information billboard.',
                ok: false,
                data: null,
            });
        }
        const billboard = await billBoardsModel(newBillboardFromClient);
        await billboard.save();
        res.status(200).json({
            data: billboard,
            message: 'Create billboard success.',
            ok: true,
            statusCode: 200,
        });
    } catch (error) {
        res.status(500).json({
            data: error,
            statusCode: 500,
            message: 'Something went wrong. Create billboard failed.',
            ok: false,
        });
    }
};

// [GET] /billboard
export const getBillboard = async (req, res) => {
    try {
        const billboard = await billBoardsModel.findOne({
            _id: req.query._id,
            storeId: req.query.storeId,
        });
        if (!billboard) {
            return res.status(400).json({
                data: null,
                statusCode: 400,
                message: 'Billboard id or storeId is wrong.',
                ok: false,
            });
        }
        res.status(200).json({
            data: billboard,
            statusCode: 200,
            message: 'Get billboard success.',
            ok: true,
        });
    } catch (error) {
        res.status(500).json({
            data: error,
            statusCode: 500,
            message: 'Something went wrong. Get billboard failed.',
            ok: false,
        });
    }
};

// [GET] /billboard/getall
export const getAllBillboard = async (req, res) => {
    try {
        if (!req.query.storeId) {
            res.status(200).json({
                data: null,
                statusCode: 200,
                message: 'Store id is missing.',
                ok: true,
            });
        }
        const listBillboard = await billBoardsModel
            .find({
                storeId: req.query.storeId,
            })
            .sort({ createdAt: -1 });
        res.status(200).json({
            data: listBillboard,
            statusCode: 200,
            message: 'Get list billboard success',
            ok: true,
        });
    } catch (error) {
        res.status(500).json({
            data: error,
            statusCode: 500,
            message: 'Something went wrong. Get billboards failed.',
            ok: false,
        });
    }
};
// [PUT] /billboard

export const updateBillboard = async (req, res) => {
    try {
        const billboardId = req.body._id;
        const newLabel = req.body.label;
        const storeId = req.body.storeId;
        const newImage = req.body.image;

        if (!newLabel || !newImage || !storeId) {
            return res.status(401).json({
                statusCode: 401,
                message: 'Missing information billboard .',
                ok: false,
                data: null,
            });
        }
        const existBillboard = await billBoardsModel.findOne({
            _id: billboardId,
            storeId,
        });
        if (!existBillboard) {
            return res.status(401).json({
                statusCode: 401,
                message: 'Billboard id or store id is wrong.',
                ok: false,
                data: null,
            });
        }
        const newBillboardUpdate = await billBoardsModel.findOneAndUpdate(
            {
                _id: billboardId,
                storeId,
            },
            {
                label: newLabel,
                image: newImage,
            },
            {
                new: true,
            },
        );

        res.status(200).json({
            data: newBillboardUpdate,
            statusCode: 200,
            message: 'Update billboard success.',
            ok: true,
        });
    } catch (error) {
        res.status(500).json({
            data: error,
            statusCode: 500,
            message: 'Something went wrong. Update billboard failed.',
            ok: false,
        });
    }
};

// [DELETE] /billboard
export const deleteBillboard = async (req, res) => {
    try {
        const billboardId = req.body._id;
        const storeId = req.body.storeId;
        if (!billboardId || !storeId) {
            return res.status(401).json({
                statusCode: 401,
                message: 'Billboard information is missing.',
                ok: false,
                data: null,
            });
        }
        const existCategories = await categoriesModel.findOne({
            billboardId,
        });
        if (existCategories) {
            return res.status(401).json({
                statusCode: 401,
                message: 'This billboard is connecting with another category.',
                ok: false,
                data: null,
            });
        }
        const billboardDeleted = await billBoardsModel.findOneAndDelete({
            _id: billboardId,
            storeId,
        });
        res.status(200).json({
            data: billboardDeleted,
            message: 'Delete billboard success.',
            ok: true,
            statusCode: 200,
        });
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: 'Something went wrong. Delete billboard failed',
            ok: false,
            data: error,
        });
    }
};
