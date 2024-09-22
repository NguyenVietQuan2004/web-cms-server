import { productsModel } from '../Models/ProductModel.js';
import { categoriesModel } from '../Models/CategoryModel.js';
import { billBoardsModel } from '../Models/BillBoardModel.js';

//{
//   _id,
//  name,
//  storeId,
//  billBoardId,
//  createAt,
//  updateAt,
//}

// [POST] /category
export const createCategory = async (req, res) => {
    try {
        const newCategoryFromClient = req.body;
        if (!newCategoryFromClient.name || !newCategoryFromClient.storeId || !newCategoryFromClient.billboardId) {
            return res.status(401).json({
                statusCode: 401,
                message: 'Missing information category.',
                ok: false,
                data: null,
            });
        }

        const categoryExist = await categoriesModel.findOne({
            name: newCategoryFromClient.name,
            storeId: newCategoryFromClient.storeId,
        });
        if (categoryExist) {
            return res.status(401).json({
                statusCode: 401,
                message: 'Name category is already exist.',
                ok: false,
                data: null,
            });
        }
        const category = await categoriesModel(newCategoryFromClient);
        await category.save();
        res.status(200).json({
            data: category,
            message: 'Create category success.',
            ok: true,
            statusCode: 200,
        });
    } catch (error) {
        res.status(500).json({
            data: error,
            statusCode: 500,
            message: 'Something went wrong. Create category failed.',
            ok: false,
        });
    }
};

// [GET] /category
export const getCategory = async (req, res) => {
    try {
        const category = await categoriesModel.findOne({
            _id: req.query._id,
            storeId: req.query.storeId,
        });
        const listBillboard = await billBoardsModel
            .find({
                storeId: req.query.storeId,
            })
            .sort({ createdAt: -1 });
        if (!category) {
            return res.status(400).json({
                data: {
                    listBillboard,
                },
                statusCode: 400,
                message: 'Category id or storeId is wrong.',
                ok: false,
            });
        }
        res.status(200).json({
            data: {
                category,
                listBillboard,
            },
            statusCode: 200,
            message: 'Get category success.',
            ok: true,
        });
    } catch (error) {
        res.status(500).json({
            data: error,
            statusCode: 500,
            message: 'Something went wrong. Get category failed.',
            ok: false,
        });
    }
};

// [GET] /category/getall
export const getAllCategory = async (req, res) => {
    try {
        if (!req.query.storeId) {
            res.status(200).json({
                data: null,
                statusCode: 200,
                message: 'Store id is missing.',
                ok: true,
            });
        }
        const listCategory = await categoriesModel
            .find({
                storeId: req.query.storeId,
            })
            .sort({ createdAt: -1 })
            .populate('billboardId');
        res.status(200).json({
            data: listCategory,
            statusCode: 200,
            message: 'Get list listCategory success',
            ok: true,
        });
    } catch (error) {
        res.status(500).json({
            data: error,
            statusCode: 500,
            message: 'Something went wrong. Get listCategory failed.',
            ok: false,
        });
    }
};

// [PUT] /category
export const updateCategory = async (req, res) => {
    try {
        const billboardId = req.body.billboardId;
        const categoryId = req.body._id;
        const storeId = req.body.storeId;
        const name = req.body.name;

        if (!name || !categoryId || !storeId || !billboardId) {
            return res.status(401).json({
                statusCode: 401,
                message: 'Missing information category .',
                ok: false,
                data: null,
            });
        }
        const existCategory = await categoriesModel.findOne({
            _id: categoryId,
            storeId,
        });
        if (!existCategory) {
            return res.status(401).json({
                statusCode: 401,
                message: 'Category id or store id is wrong.',
                ok: false,
                data: null,
            });
        }
        const newCategory = await categoriesModel.findOneAndUpdate(
            {
                _id: categoryId,
                storeId,
            },
            {
                name,
                billboardId,
            },
            {
                new: true,
            },
        );

        res.status(200).json({
            data: newCategory,
            statusCode: 200,
            message: 'Update category success.',
            ok: true,
        });
    } catch (error) {
        res.status(500).json({
            data: error,
            statusCode: 500,
            message: 'Something went wrong. Update category failed.',
            ok: false,
        });
    }
};

// [DELETE] /category
export const deleteCategory = async (req, res) => {
    try {
        const categoryId = req.body._id;
        const storeId = req.body.storeId;
        if (!categoryId || !storeId) {
            return res.status(401).json({
                statusCode: 401,
                message: 'Category information is missing.',
                ok: false,
                data: null,
            });
        }

        const existProductConnectWithCategory = await productsModel.findOne({
            storeId,
            'categoryId.categoryId': categoryId,
        });
        if (existProductConnectWithCategory) {
            return res.status(401).json({
                statusCode: 401,
                message:
                    'This category is connecting with another products. Please emty product in this category before.',
                ok: false,
                data: null,
            });
        }
        const categoryDeleted = await categoriesModel.findOneAndDelete({
            _id: categoryId,
            storeId,
        });
        res.status(200).json({
            data: categoryDeleted,
            message: 'Delete category success.',
            ok: true,
            statusCode: 200,
        });
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: 'Something went wrong. Delete category failed',
            ok: false,
            data: error,
        });
    }
};
