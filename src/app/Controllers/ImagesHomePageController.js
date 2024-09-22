import { ImagesHomePageModel } from '../Models/ImagesHomePageModel.js';
import { productsModel } from '../Models/ProductModel.js';

//{
//  _id,
//  billboardFeature,
//  billboardBST,
//  backgroundInsurance,
//  storeId,
//}

// [POST] /imagesHomePage
export const CreateImagesHomePage = async (req, res) => {
    try {
        const newImagesHomePageClient = req.body;
        const existImagesHomePage = await ImagesHomePageModel.findOne({
            storeId: req.body.storeId,
        });
        if (existImagesHomePage) {
            return res.status(400).json({
                data: null,
                statusCode: 400,
                message: 'ImagesHomePage is already in store.',
                ok: false,
            });
        }
        if (
            !newImagesHomePageClient.billboardBST ||
            !newImagesHomePageClient.backgroundInsurance ||
            !newImagesHomePageClient.billboardFeature.length
        ) {
            return res.status(401).json({
                statusCode: 401,
                message: 'Missing information ImagesHomePage.',
                ok: false,
                data: null,
            });
        }

        const imagesHomePage = await ImagesHomePageModel(newImagesHomePageClient);
        await imagesHomePage.save();
        res.status(200).json({
            data: imagesHomePage,
            message: 'Create imagesHomePage success.',
            ok: true,
            statusCode: 200,
        });
    } catch (error) {
        res.status(500).json({
            data: error,
            statusCode: 500,
            message: 'Something went wrong. Create imagesHomePage failed.',
            ok: false,
        });
    }
};

// [GET] /imagesHomePage
export const getImagesHomePage = async (req, res) => {
    try {
        const imagesHomePage = await ImagesHomePageModel.findOne({
            storeId: req.query.storeId,
        });
        if (!imagesHomePage) {
            return res.status(400).json({
                data: null,
                statusCode: 400,
                message: 'StoreId is wrong.',
                ok: false,
            });
        }
        const listProduct = await productsModel
            .find({ storeId: req.query.storeId, isArchive: false })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('categoryId');

        const arrayProductBestSeller = await productsModel.aggregate([
            {
                $unwind: '$arrayPrice', // Tách mảng arrayPrice ra thành các document riêng
            },
            {
                $group: {
                    _id: '$_id', // Group theo product _id
                    totalAmountSold: { $sum: '$arrayPrice.amount_sold' }, // Tính tổng amount_sold
                },
            },
            {
                $sort: { totalAmountSold: -1 }, // Sắp xếp giảm dần theo tổng amount_sold
            },
            {
                $limit: 1, // Chỉ lấy 1 sản phẩm có tổng cao nhất
            },
        ]);
        const productBestSeller = await productsModel.findOne({
            _id: arrayProductBestSeller[0]._id,
        });
        const productHighestSale = await productsModel.findOne().sort({ sale: -1 });
        console.log(productHighestSale);
        res.status(200).json({
            data: {
                ImagesHomePage: imagesHomePage,
                listProductNewDiscover: listProduct,
                listProductMostPopular: listProduct, // còn cái này
                productBestSeller,
                productHighestSale,
            },
            statusCode: 200,
            message: 'Get imagesHomePage success.',
            ok: true,
        });
    } catch (error) {
        res.status(500).json({
            data: error,
            statusCode: 500,
            message: 'Something went wrong. Get imagesHomePage failed.',
            ok: false,
        });
    }
};

// [PUT] /imagesHomePage
export const updateImagesHomePage = async (req, res) => {
    try {
        const storeId = req.body.storeId;
        const newBillboardBST = req.body.billboardBST;
        const newBillboardFeature = req.body.billboardFeature;
        const newBackgroundInsurance = req.body.backgroundInsurance;
        if (!newBillboardBST || !newBackgroundInsurance || !storeId || !newBillboardFeature.length) {
            return res.status(401).json({
                statusCode: 401,
                message: 'Missing information imagesHomePage.',
                ok: false,
                data: null,
            });
        }

        const existImagesHomePage = await ImagesHomePageModel.findOne({
            storeId,
        });
        if (!existImagesHomePage) {
            return res.status(401).json({
                statusCode: 401,
                message: 'Store id is wrong.',
                ok: false,
                data: null,
            });
        }
        const newImagesHomePageModelUpdate = await ImagesHomePageModel.findOneAndUpdate(
            {
                storeId,
            },
            {
                billboardBST: newBillboardBST,
                billboardFeature: newBillboardFeature,
                backgroundInsurance: newBackgroundInsurance,
            },
            {
                new: true,
            },
        );

        res.status(200).json({
            data: newImagesHomePageModelUpdate,
            statusCode: 200,
            message: 'Update imagesHomePage success.',
            ok: true,
        });
    } catch (error) {
        res.status(500).json({
            data: error,
            statusCode: 500,
            message: 'Something went wrong. Update imagesHomePage failed.',
            ok: false,
        });
    }
};
