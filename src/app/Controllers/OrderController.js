import { ordersModel } from '../Models/OrderModel.js';
import { productsModel } from '../Models/ProductModel.js';
import { accountsModel } from '../Models/AccountModel.js';
import { v4 as uuidv4 } from 'uuid';
// {
//     _id:
//     storeId:
//      listProductOrder: [
//         {
//             _id: 'f465e34b-608b-4b1c-be55-0ae9603bbca5',
//             size: 'xxxxxl',
//             color: 'blue',
//         },
//      ]
//     phone:
//     address:
//     createAt:
//     updateAt:
//     isPaid:
// }

// [POST] /order
export const createOrder = async (req, res) => {
    try {
        const newOrderFromClient = req.body;
        if (!newOrderFromClient.storeId || !newOrderFromClient.listProductOrder.length) {
            return res.status(401).json({
                statusCode: 401,
                message: 'Missing information order.',
                ok: false,
                data: null,
            });
        }

        const order = await ordersModel(newOrderFromClient);
        await order.save();
        res.status(200).json({
            data: order,
            message: 'Create order success.',
            ok: true,
            statusCode: 200,
        });
    } catch (error) {
        res.status(500).json({
            data: error,
            statusCode: 500,
            message: 'Something went wrong. Create order failed.',
            ok: false,
        });
    }
};
// [GET] /order/getall

export const getAllOrder = async (req, res) => {
    // const order = await ordersModel({
    //     storeId: '203f904e-e8e5-434a-9f22-b339029556f6',
    //     listProductOrder: [
    //         {
    //             _id: '9621d2ce-5414-4e9b-a9e1-8716cb1ae19c',
    //             size: 'L',
    //             color: 'red',
    //         },
    //         {
    //             _id: '2a99907c-c0f4-493d-a548-b340145d48b5',
    //             size: 'L',
    //             color: 'black',
    //         },
    //     ],
    //     isPaid: true,
    //     phone: '0763948610',
    //     address: 'Thoi an o mon can tho',
    // });
    // await order.save();

    try {
        if (!req.query.storeId) {
            res.status(200).json({
                data: null,
                statusCode: 200,
                message: 'Store id is missing.',
                ok: true,
            });
        }
        const listModel = await ordersModel
            .find({
                storeId: req.query.storeId,
            })
            .sort({ createdAt: -1 })
            .populate({
                path: 'listProductOrder._id',
                match: { storeId: req.query.storeId },
            });
        // cho nay tra ve mang product
        res.status(200).json({
            data: listModel,
            statusCode: 200,
            message: 'Get list order success',
            ok: true,
        });
    } catch (error) {
        res.status(500).json({
            data: error,
            statusCode: 500,
            message: 'Something went wrong. Get listModel failed.',
            ok: false,
        });
    }
};
// [PUT] /order
export const updateOrder = async (req, res) => {
    try {
        const orderId = req.body._id;
        const phone = req.body.phone;
        const address = req.body.address;
        const isPaid = req.body.isPaid;

        if (!orderId) {
            return res.status(401).json({
                statusCode: 401,
                message: 'Missing information order .',
                ok: false,
                data: null,
            });
        }

        const existOrder = await ordersModel.findOne({
            _id: orderId,
        });
        if (!existOrder) {
            return res.status(401).json({
                statusCode: 401,
                message: 'Order id or store id is wrong.',
                ok: false,
                data: null,
            });
        }
        const newOrderUpdate = await ordersModel.findOneAndUpdate(
            {
                _id: orderId,
            },
            {
                isPaid,
                phone,
                address,
            },
            {
                new: true,
            },
        );
        // nếu đã thanh toán thì trừ số lượng của product
        if (isPaid) {
            console.log(newOrderUpdate);
            const listProductOrder = newOrderUpdate.listProductOrder;
            for (const i = 0; i < listProductOrder.length; i++) {
                const existProduct = await productsModel.findOne({
                    storeId: newOrderUpdate.storeId,
                    _id: listProductOrder[i]._id,
                });
                await productsModel.findOneAndUpdate(
                    {
                        storeId: newOrderUpdate.storeId,
                        _id: listProductOrder[i]._id,
                    },
                    {
                        // upadte lai so luong cua size do
                        $set: '',
                    },
                );
            }
        }
        res.status(200).json({
            data: newOrderUpdate,
            statusCode: 200,
            message: 'Update order success.',
            ok: true,
        });
    } catch (error) {
        res.status(401).json({
            data: error,
            statusCode: 401,
            message: 'Something went wrong. Update order failed.',
            ok: false,
        });
    }
};
// [DELETE] /order

export const deleteOrder = async (req, res) => {
    const orderId = req.body._id;
    const storeId = req.body.storeId;
    try {
        if (!orderId || !storeId) {
            return res.status(401).json({
                statusCode: 401,
                message: 'Order id or store id  is missing.',
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

        const orderDeleted = await ordersModel.findOneAndDelete({
            _id: orderId,
            storeId,
        });
        res.status(200).json({
            data: orderDeleted,
            message: 'Delete order success.',
            ok: true,
            statusCode: 200,
        });
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: 'Something went wrong. Delete order failed',
            ok: false,
            data: error,
        });
    }
};

export const overviewOrder = async (req, res) => {
    try {
        const storeId = req.query.storeId;
        if (!storeId) {
            return res.status(401).json({
                statusCode: 401,
                message: 'Store id  is missing.',
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

        const listOrderPaid = await ordersModel
            .find({
                storeId,
                isPaid: true,
            })
            .populate('listProductOrder._id');
        const countProductsInStock = await productsModel.countDocuments({
            storeId,
            isArchive: false,
        });

        res.status(200).json({
            data: {
                listOrderPaid,
                countProductsInStock,
            },
            statusCode: 200,
            message: 'Get overview order success',
            ok: true,
        });
    } catch (error) {
        res.status(500).json({
            data: error,
            statusCode: 500,
            message: 'Something went wrong. Get overview failed.',
            ok: false,
        });
    }
};
